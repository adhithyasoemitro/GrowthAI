import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP, hashPhone, generateCorrelationId } from "@/lib/utils";

const OTP_VALID_MINUTES = parseInt(process.env.WHATSAPP_OTP_VALID_MINUTES || "5");
const MAX_RETRIES = parseInt(process.env.WHATSAPP_OTP_MAX_RETRIES || "3");

export async function POST(request: NextRequest) {
  try {
    const { phone, correlationId } = await request.json();

    if (!phone || phone.length < 10) {
      return NextResponse.json(
        { success: false, message: "Nomor telepon tidak valid" },
        { status: 400 }
      );
    }

    const phoneHash = hashPhone(phone);
    const existingAttempts = await prisma.oTPAttempt.count({
      where: {
        phoneHash,
        status: "verified",
        createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
      },
    });

    if (existingAttempts > 0) {
      return NextResponse.json({
        success: true,
        message: "Nomor sudah terverifikasi",
        alreadyVerified: true,
      });
    }

    const recentAttempts = await prisma.oTPAttempt.count({
      where: {
        phoneHash,
        status: "pending",
        createdAt: { gte: new Date(Date.now() - 60 * 1000 * 10) },
      },
    });

    if (recentAttempts >= MAX_RETRIES) {
      return NextResponse.json(
        { success: false, message: "Terlalu banyak percobaan. Coba lagi dalam 10 menit." },
        { status: 429 }
      );
    }

    await prisma.oTPAttempt.updateMany({
      where: { phoneHash, status: "pending" },
      data: { status: "expired" },
    });

    const otpCode = generateOTP();
    const newCorrelationId = correlationId || generateCorrelationId();
    const expiresAt = new Date(Date.now() + OTP_VALID_MINUTES * 60 * 1000);

    await prisma.oTPAttempt.create({
      data: {
        phoneHash,
        correlationId: newCorrelationId,
        otpCode,
        expiresAt,
        status: "pending",
      },
    });

    console.log(`[OTP] Code: ${otpCode} for ${phone} (correlation: ${newCorrelationId})`);

    const res = await fetch("https://llvuzbfehapbicrlkivt.supabase.co/functions/v1/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        otp: otpCode,
        correlationId: newCorrelationId,
      }),
    });

    if (!res.ok) {
      console.error("Failed to send OTP via Supabase function");
    }

    return NextResponse.json({
      success: true,
      correlationId: newCorrelationId,
      message: "OTP dikirim ke WhatsApp",
      expiresIn: OTP_VALID_MINUTES * 60,
    });
  } catch (error) {
    console.error("OTP request error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengirim OTP" },
      { status: 500 }
    );
  }
}
