import { DemoEngine } from "@/components/demos/DemoComponents";
import { getDemoByType } from "@/lib/demo-scenarios";
import { DemoType } from "@/types";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return [
    { type: "whatsapp_chat" },
    { type: "ai_chatbot" },
    { type: "robocall" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const demo = getDemoByType(type as DemoType);
  return {
    title: demo ? `${demo.title} Demo | Jatis FMCG DemoHub` : "Demo | Jatis FMCG DemoHub",
    description: demo?.description || "Interactive demo",
  };
}

export default async function DemoPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const demo = getDemoByType(type as DemoType);
  
  if (!demo) {
    notFound();
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="container-width max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <a href="/demos" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-4 transition-colors text-sm">
            ← Kembali ke Demo List
          </a>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${demo.color}15`, border: `1px solid ${demo.color}30` }}>
              {demo.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{demo.title}</h1>
              <p className="text-white/50 text-sm">{demo.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Demo Engine */}
        <div className="glass-card p-6 min-h-[600px]">
          <DemoEngine demoType={type as DemoType} />
        </div>

        {/* Services Behind */}
        <div className="mt-6 glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4">Layanan Jatis Mobile di Balik Simulasi</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {demo.services.map((service) => (
              <div key={service.id} className="bg-dark-700/50 rounded-xl p-4">
                <h4 className="font-semibold text-white text-sm mb-1">{service.name}</h4>
                <p className="text-xs text-white/40">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
