import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");
    const intent = searchParams.get("intent");
    const search = searchParams.get("search");

    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (intent && intent !== "all") {
      query = query.eq("intent", intent);
    }

    const { data: leads, error } = await query;

    if (error) {
      console.error("Fetch leads error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch leads" },
        { status: 500 }
      );
    }

    // Get stats
    const { count: totalCount } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });

    const { data: todayLeads } = await supabase
      .from("leads")
      .select("*")
      .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

    const { data: qualifiedLeads } = await supabase
      .from("leads")
      .select("*")
      .eq("status", "qualified");

    const avgScore = leads?.length
      ? Math.round(leads.reduce((acc: number, l: { lead_score: number }) => acc + l.lead_score, 0) / leads.length)
      : 0;

    return NextResponse.json({
      leads: leads || [],
      stats: {
        totalLeads: totalCount || 0,
        newLeads: todayLeads?.length || 0,
        qualifiedLeads: qualifiedLeads?.length || 0,
        avgLeadScore: avgScore,
      },
    });
  } catch (error) {
    console.error("Leads fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
