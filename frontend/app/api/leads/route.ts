import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, company, position, useCase, volumeRange, followUpPref, consentGiven } = body;

    if (!name || !email || !whatsapp || !company || !position) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, email, whatsapp, company, position" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Calculate lead score
    let leadScore = 50;
    if (volumeRange === "500k_plus") leadScore += 30;
    else if (volumeRange === "100k_500k") leadScore += 25;
    else if (volumeRange === "50k_100k") leadScore += 20;
    else if (volumeRange === "10k_50k") leadScore += 15;

    const posLower = position.toLowerCase();
    if (["ceo", "cfo", "cmo", "director", "head"].some(t => posLower.includes(t))) {
      leadScore += 20;
    } else if (["manager", "supervisor"].some(t => posLower.includes(t))) {
      leadScore += 10;
    }

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
      console.error("Supabase insert error:", JSON.stringify(error));
      return NextResponse.json(
        { success: false, message: `Database error: ${error.message}`, error: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      leadId: data?.id || "demo-id",
      score: leadScore,
      intent,
    });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
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
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      leads: leads || [],
      stats: {
        totalLeads: leads?.length || 0,
        newLeads: 0,
        qualifiedLeads: 0,
        avgLeadScore: 0,
      },
    });
  } catch (error) {
    console.error("Leads fetch error:", error);
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}
