import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session || !["admin", "sales_manager"].includes(session.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");
    const intent = searchParams.get("intent");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;
    if (intent && intent !== "all") where.intent = intent;
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
        include: { events: { orderBy: { createdAt: "desc" }, take: 10 } },
      }),
      prisma.lead.count({ where }),
    ]);

    const stats = await prisma.lead.aggregate({
      _count: { id: true },
      _avg: { leadScore: true },
    });

    const newToday = await prisma.lead.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    });

    const qualified = await prisma.lead.count({ where: { status: "qualified" } });

    const verified = await prisma.lead.count({ where: { otpVerified: true } });

    const useCaseAgg = await prisma.lead.groupBy({
      by: ["useCase"],
      _count: { id: true },
    });

    const topUseCases = useCaseAgg
      .map((u) => ({ useCase: u.useCase, count: u._count.id }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      leads: leads.map((l) => ({
        ...l,
        demoHistory: JSON.parse(l.demoHistory || "[]"),
        scoreBreakdown: JSON.parse(l.scoreBreakdown || "{}"),
        utmParams: JSON.parse(l.utmParams || "{}"),
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      stats: {
        totalLeads: stats._count.id,
        newLeads: newToday,
        qualifiedLeads: qualified,
        avgLeadScore: Math.round(stats._avg.leadScore || 0),
        demoCompletions: leads.filter((l) => JSON.parse(l.demoHistory || "[]").length > 0).length,
        otpVerificationRate: total > 0 ? (verified / total) * 100 : 0,
        topUseCases,
      },
    });
  } catch (error) {
    console.error("Admin leads fetch error:", error);
    return NextResponse.json({ success: false, message: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session || !["admin", "sales_manager"].includes(session.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { leadId, disposition, dispositionNote, assigneeId, status, intent } = await request.json();

    const updateData: Record<string, unknown> = {};
    if (disposition) updateData.disposition = disposition;
    if (dispositionNote !== undefined) updateData.dispositionNote = dispositionNote;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId;
    if (status) updateData.status = status;
    if (intent) updateData.intent = intent;

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: updateData,
    });

    await prisma.adminActivity.create({
      data: {
        userId: session.userId,
        action: "update_lead",
        targetId: leadId,
        meta: JSON.stringify({ updates: updateData }),
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Admin lead update error:", error);
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}
