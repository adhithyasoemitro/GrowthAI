import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadRegistrationSchema } from "@/lib/validations";
import { calculateLeadScore, determineIntent } from "@/lib/lead-scoring";
import { nanoid } from "nanoid";
import { hashPhone } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = leadRegistrationSchema.parse(body);

    const demoHistory = validated.demoHistory || [];
    const scoreBreakdown = calculateLeadScore({ ...validated, demoHistory });
    const intent = determineIntent(scoreBreakdown);

    const maskedPhone = hashPhone(validated.whatsapp);

    const lead = await prisma.lead.create({
      data: {
        name: validated.name,
        position: validated.position,
        company: validated.company,
        email: validated.email,
        whatsapp: validated.whatsapp,
        useCase: validated.useCase,
        volumeRange: validated.volumeRange,
        followUpPref: validated.followUpPref,
        demoHistory: JSON.stringify(demoHistory),
        leadScore: scoreBreakdown.total,
        scoreBreakdown: JSON.stringify(scoreBreakdown),
        intent,
        trafficSource: validated.trafficSource,
        utmParams: JSON.stringify(validated.utmParams),
        consentGiven: validated.consentGiven,
        otpMasked: maskedPhone,
        ipHash: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    await prisma.event.create({
      data: {
        leadId: lead.id,
        event: "lead_created",
        category: "conversion",
        meta: JSON.stringify({
          useCase: validated.useCase,
          volumeRange: validated.volumeRange,
          demoCount: demoHistory.length,
          score: scoreBreakdown.total,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      score: scoreBreakdown.total,
      intent,
    });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal membuat lead" },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");
    const intent = searchParams.get("intent");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (intent) where.intent = intent;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { company: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { events: { orderBy: { createdAt: "desc" }, take: 5 } },
      }),
      prisma.lead.count({ where }),
    ]);

    const stats = await prisma.lead.aggregate({
      _count: { id: true },
      _avg: { leadScore: true },
    });

    const newToday = await prisma.lead.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const qualified = await prisma.lead.count({
      where: { status: "qualified" },
    });

    const verified = await prisma.lead.count({
      where: { otpVerified: true },
    });

    return NextResponse.json({
      leads: leads.map((l) => ({
        ...l,
        demoHistory: JSON.parse(l.demoHistory || "[]"),
        scoreBreakdown: JSON.parse(l.scoreBreakdown || "{}"),
        utmParams: JSON.parse(l.utmParams || "{}"),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        totalLeads: stats._count.id,
        newLeads: newToday,
        qualifiedLeads: qualified,
        avgLeadScore: Math.round(stats._avg.leadScore || 0),
        demoCompletions: leads.filter((l) => JSON.parse(l.demoHistory || "[]").length > 0).length,
        otpVerificationRate: total > 0 ? (verified / total) * 100 : 0,
      },
    });
  } catch (error) {
    console.error("Leads fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
