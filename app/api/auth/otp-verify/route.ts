import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPhone } from "@/lib/utils";

const MAX_RETRIES = parseInt(process.env.WHATSAPP_OTP_MAX_RETRIES || "3");

export async function POST(request: NextRequest) {
  try {
    const { phone, otpCode, correlationId } = await request.json();

    if (!phone || !otpCode) {
      return NextResponse.json(
        { success: false, message: "Phone dan OTP code diperlukan" },
        { status: 400 }
      );
    }

    const phoneHash = hashPhone(phone);

    const attempt = await prisma.oTPAttempt.findFirst({
      where: {
        phoneHash,
        status: "pending",
        correlationId: correlationId || undefined,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!attempt) {
      const retryCount = await prisma.oTPAttempt.count({
        where: {
          phoneHash,
          status: { in: ["failed", "pending"] },
          createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Kode OTP tidak valid atau sudah expired",
          attempts: Math.max(0, MAX_RETRIES - retryCount),
        },
        { status: 400 }
      );
    }

    if (attempt.otpCode !== otpCode) {
      await prisma.oTPAttempt.update({
        where: { id: attempt.id },
        data: { retryCount: { increment: 1 }, status: "failed" },
      });

      const retryCount = await prisma.oTPAttempt.count({
        where: {
          phoneHash,
          status: { in: ["failed", "pending"] },
          createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Kode OTP tidak cocok",
          attempts: Math.max(0, MAX_RETRIES - retryCount),
        },
        { status: 400 }
      );
    }

    await prisma.oTPAttempt.update({
      where: { id: attempt.id },
      data: { status: "verified", verifiedAt: new Date() },
    });

    await prisma.lead.updateMany({
      where: { whatsapp: phone, otpVerified: false },
      data: { otpVerified: true },
    });

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      verified: true,
    });
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}
