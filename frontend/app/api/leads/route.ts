import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, company, position, useCase, volumeRange, followUpPref, consentGiven } = body;

    if (!name || !email || !whatsapp || !company || !position) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Calculate lead score (simplified)
    let leadScore = 50;
    if (volumeRange === "500k_plus") leadScore += 30;
    else if (volumeRange === "100k_500k") leadScore += 25;
    else if (volumeRange === "50k_100k") leadScore += 20;
    else if (volumeRange === "10k_50k") leadScore += 15;

    if (["ceo", "cfo", "cmo", "director", "head"].some(t => position.toLowerCase().includes(t))) {
      leadScore += 20;
    } else if (["manager", "supervisor"].some(t => position.toLowerCase().includes(t))) {
      leadScore += 10;
    }

    // Determine intent
    let intent = "medium";
    if (leadScore >= 70) intent = "high";
    else if (leadScore < 40) intent = "low";

    const { data, error } = await supabase
      .from("leads")
      .insert({
        name,
        email,
        whatsapp,
        position,
        company,
        use_case: useCase || "other",
        volume_range: volumeRange || "not_sure",
        follow_up_pref: followUpPref || "schedule_demo",
        lead_score: leadScore,
        intent,
        status: "new",
        disposition: "pending",
        consent_given: consentGiven || false,
        otp_verified: false,
        traffic_source: "direct",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to save lead" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      leadId: data.id,
      score: leadScore,
      intent,
    });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const { data: leads, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

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

    return NextResponse.json({
      leads: leads || [],
      stats: {
        totalLeads: totalCount || 0,
        newLeads: todayLeads?.length || 0,
        qualifiedLeads: leads?.filter((l: { status: string }) => l.status === "qualified").length || 0,
        avgLeadScore: leads?.length 
          ? Math.round(leads.reduce((acc: number, l: { lead_score: number }) => acc + l.lead_score, 0) / leads.length)
          : 0,
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
