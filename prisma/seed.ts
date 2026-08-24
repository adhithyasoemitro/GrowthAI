import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("JatisFMCG2026!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@jatis-mobile.com" },
    update: {},
    create: {
      email: "admin@jatis-mobile.com",
      password: hashedPassword,
      name: "Admin Jatis",
      role: "admin",
    },
  });

  console.log(`✅ Admin user created/updated: ${admin.email}`);

  // Create sample leads for testing
  const sampleLeads = [
    { name: "Budi Santoso", position: "Head of Digital Marketing", company: "PT Unilever Indonesia", email: "budi.s@unilever.com", whatsapp: "6281234567890", useCase: "consumer_engagement", volumeRange: "100k_500k", leadScore: 78, intent: "high" },
    { name: "Siti Rahayu", position: "Finance Manager", company: "PT Astra International", email: "siti.r@astra.co.id", whatsapp: "6289876543210", useCase: "payment_collection", volumeRange: "500k_plus", leadScore: 92, intent: "high" },
    { name: "Ahmad Wijaya", position: "Supply Chain Director", company: "PT Indofood CBP", email: "ahmad.w@indofood.com", whatsapp: "6281122334455", useCase: "distributor_operations", volumeRange: "100k_500k", leadScore: 65, intent: "medium" },
    { name: "Dewi Kusuma", position: "CRM Manager", company: "PT Telekomunikasi Indonesia", email: "dewi.k@telkom.co.id", whatsapp: "6285566778899", useCase: "customer_service", volumeRange: "50k_100k", leadScore: 55, intent: "medium" },
    { name: "Rudi Hermawan", position: "Trade Marketing Head", company: "PT Salim Group", email: "rudi.h@salim.co.id", whatsapp: "6289988776655", useCase: "trade_promotion", volumeRange: "500k_plus", leadScore: 88, intent: "high" },
  ];

  for (const leadData of sampleLeads) {
    const lead = await prisma.lead.upsert({
      where: { email: leadData.email },
      update: leadData,
      create: {
        ...leadData,
        followUpPref: "schedule_demo",
        demoHistory: JSON.stringify(["whatsapp_chat", "ai_chatbot"]),
        scoreBreakdown: JSON.stringify({ companySize: 20, useCase: 25, volume: 30, position: 15, demoCompletion: 15, total: leadData.leadScore }),
        consentGiven: true,
        otpVerified: true,
        status: leadData.intent === "high" ? "qualified" : "new",
        disposition: leadData.intent === "high" ? "meeting_booked" : "pending",
      },
    });
    console.log(`✅ Lead created/updated: ${lead.email}`);
  }

  console.log("\n🎉 Database seeded successfully!");
  console.log("\nAdmin Login Credentials:");
  console.log("  Email: admin@jatis-mobile.com");
  console.log("  Password: JatisFMCG2026!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
