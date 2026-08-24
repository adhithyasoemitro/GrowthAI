"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  SkipForward,
  MessageSquare,
  Bot,
  Phone,
  CheckCircle,
  Clock,
  Zap,
  ChevronRight,
  Lock,
  RefreshCw,
  Send,
} from "lucide-react";
import { Button, Badge, ProgressBar } from "@/components/ui/Button";
import { DEMO_SCENARIOS, getDemoByType } from "@/lib/demo-scenarios";
import { cn, delay, sanitizeInput } from "@/lib/utils";
import { useAnalytics } from "@/lib/analytics-context";
import { DemoType, ChatMessage } from "@/types";
import { nanoid } from "nanoid";

interface ChatBubbleProps {
  message: ChatMessage;
  typing?: boolean;
}

function ChatBubble({ message, typing }: ChatBubbleProps) {
  if (typing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="chat-bubble-bot">
          <div className="typing-indicator">
            <span /><span /><span />
          </div>
        </div>
      </motion.div>
    );
  }

  const isUser = message.type === "user";
  const isSystem = message.type === "system";
  const isIntegration = message.type === "integration";

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center gap-2 py-3"
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-500/30" />
        <span className="text-xs text-white/30 px-3 py-1 bg-dark-700/50 rounded-full">
          {message.content}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-500/30" />
      </motion.div>
    );
  }

  if (isIntegration) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-2"
      >
        <div className="bg-dark-800/80 border border-brand-500/20 rounded-xl p-4 font-mono text-xs">
          <div className="flex items-center gap-2 mb-2 text-brand-400">
            <Zap className="w-3 h-3" />
            <span className="font-semibold">Integration Flow</span>
          </div>
          <pre className="text-white/60 whitespace-pre-wrap">{message.content}</pre>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fmcg-orange to-amber-500 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={isUser ? "chat-bubble-user" : "chat-bubble-bot"}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  );
}

function WhatsAppChatDemo({ scenario, onComplete }: { scenario: typeof DEMO_SCENARIOS[0]; onComplete: () => void }) {
  const { track } = useAnalytics();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const processStep = async (stepIndex: number) => {
    if (stepIndex >= scenario.steps.length) {
      setIsComplete(true);
      return;
    }

    const step = scenario.steps[stepIndex];
    
    if (step.type === "system") {
      setMessages((prev) => [
        ...prev,
        { id: nanoid(), type: "system", content: step.content, timestamp: Date.now() },
      ]);
      setIsTyping(false);
      await delay(800);
      processStep(stepIndex + 1);
    } else if (step.type === "bot_response") {
      setIsTyping(true);
      await delay(1500 + Math.random() * 1000);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nanoid(), type: "bot", content: step.content, timestamp: Date.now() },
      ]);
      await delay(500);
      processStep(stepIndex + 1);
    } else if (step.type === "user_input") {
      setMessages((prev) => [
        ...prev,
        { id: nanoid(), type: "user", content: step.content, timestamp: Date.now() },
      ]);
      await delay(800);
      processStep(stepIndex + 1);
    } else if (step.type === "integration") {
      setIsTyping(true);
      await delay(1000);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nanoid(), type: "integration", content: step.content, timestamp: Date.now() },
      ]);
      await delay(600);
      processStep(stepIndex + 1);
    } else if (step.type === "outcome") {
      setIsTyping(true);
      await delay(800);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nanoid(), type: "bot", content: step.content, timestamp: Date.now() },
      ]);
      setIsComplete(true);
    }
  };

  const handleStart = async () => {
    track("demo_started", { demo_type: scenario.type, demo_id: scenario.id });
    setMessages([]);
    setCurrentStep(0);
    await delay(500);
    processStep(1);
  };

  const handleRestart = () => {
    setMessages([]);
    setCurrentStep(0);
    setIsComplete(false);
    setInputEnabled(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <span className="text-lg">{scenario.icon}</span>
            </div>
            <div>
              <p className="font-semibold text-white">{scenario.title}</p>
              <p className="text-xs text-white/40">{scenario.subtitle}</p>
            </div>
          </div>
          <Badge variant="simulation">SIMULASI</Badge>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-dark">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Chat Commerce Demo</h3>
            <p className="text-sm text-white/40 max-w-xs mb-6">
              Simulasi percakapan lengkap antara customer dan WhatsApp Business bot — 
              mulai dari katalog produk hingga checkout.
            </p>
            <Button onClick={handleStart} icon={<Play className="w-4 h-4" />}>
              Mulai Demo
            </Button>
          </div>
        )}
        
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <ChatBubble message={{ id: "", type: "bot", content: "", timestamp: 0 }} typing />}

        <div ref={messagesEndRef} />
      </div>

      {/* Outcome */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-5 mb-4 border-emerald-500/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <h4 className="font-bold text-white">Demo Complete!</h4>
            </div>
            <p className="text-sm text-white/60 mb-4">
              Anda telah menyelesaikan simulasi Chat Commerce. 
              Lihat hasil dan layanan Jatis Mobile yang bekerja di balik layar.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={handleRestart} icon={<RotateCcw className="w-3 h-3" />}>
                Restart
              </Button>
              <Link href="/leads" className="flex-1">
                <Button size="sm" className="w-full" icon={<ChevronRight className="w-4 h-4" />} iconPosition="right" onClick={() => {
                  track("demo_completed", { demo_type: scenario.type, demo_id: scenario.id });
                  onComplete();
                }}>
                  Lanjutkan ke Registrasi
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input (disabled in simulation) */}
      <div className="glass-card p-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Demo ini berjalan otomatis..."
            className="input-field flex-1"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled
          />
          <Button disabled>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-white/30 mt-2 text-center">
          Demo ini berjalan otomatis untuk menunjukkan workflow lengkap
        </p>
      </div>
    </div>
  );
}

function AIChatbotDemo({ scenario, onComplete }: { scenario: typeof DEMO_SCENARIOS[0]; onComplete: () => void }) {
  const { track } = useAnalytics();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const processStep = async (stepIndex: number) => {
    if (stepIndex >= scenario.steps.length) {
      setIsComplete(true);
      return;
    }

    const step = scenario.steps[stepIndex];

    if (step.type === "system") {
      setMessages((prev) => [
        ...prev,
        { id: nanoid(), type: "system", content: step.content, timestamp: Date.now() },
      ]);
      await delay(800);
      processStep(stepIndex + 1);
    } else if (step.type === "bot_response") {
      setIsTyping(true);
      await delay(1800 + Math.random() * 1000);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nanoid(), type: "bot", content: step.content, timestamp: Date.now() },
      ]);
      await delay(500);
      processStep(stepIndex + 1);
    } else if (step.type === "user_input") {
      setMessages((prev) => [
        ...prev,
        { id: nanoid(), type: "user", content: step.content, timestamp: Date.now() },
      ]);
      await delay(600);
      processStep(stepIndex + 1);
    } else if (step.type === "integration") {
      setIsTyping(true);
      await delay(800);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nanoid(), type: "integration", content: step.content, timestamp: Date.now() },
      ]);
      await delay(400);
      processStep(stepIndex + 1);
    } else if (step.type === "outcome") {
      setIsTyping(true);
      await delay(800);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nanoid(), type: "bot", content: step.content, timestamp: Date.now() },
      ]);
      setIsComplete(true);
    }
  };

  const handleStart = async () => {
    track("demo_started", { demo_type: scenario.type, demo_id: scenario.id });
    setMessages([]);
    await delay(300);
    processStep(1);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-lg">{scenario.icon}</span>
            </div>
            <div>
              <p className="font-semibold text-white">{scenario.title}</p>
              <p className="text-xs text-white/40">{scenario.subtitle}</p>
            </div>
          </div>
          <Badge variant="simulation">SIMULASI</Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-dark">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-violet-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Ngobrol.ai Demo</h3>
            <p className="text-sm text-white/40 max-w-xs mb-6">
              AI chatbot menangani pertanyaan distributor — shipping status, kebijakan retur, 
              hingga inisiasi ticket support — tanpa campur tangan manusia.
            </p>
            <Button onClick={handleStart} icon={<Play className="w-4 h-4" />}>
              Mulai Demo
            </Button>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <ChatBubble message={{ id: "", type: "bot", content: "", timestamp: 0 }} typing />}
        <div ref={messagesEndRef} />
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 mb-4 border-violet-500/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-violet-400" />
              <h4 className="font-bold text-white">Demo Complete!</h4>
            </div>
            <p className="text-sm text-white/60 mb-4">
              Ngobrol.ai successfully handled distributor FAQ dengan 87% resolution rate.
              Pertanyaan kompleks di-escalate secara otomatis ke human agent.
            </p>
            <div className="flex gap-2">
              <Link href="/leads" className="flex-1" onClick={() => {
                track("demo_completed", { demo_type: scenario.type, demo_id: scenario.id });
                onComplete();
              }}>
                <Button size="sm" className="w-full" icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">
                  Lanjutkan ke Registrasi
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card p-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your question..."
            className="input-field flex-1"
            disabled
          />
          <Button disabled><Send className="w-4 h-4" /></Button>
        </div>
        <p className="text-xs text-white/30 mt-2 text-center">
          Demo AI chatbot berjalan otomatis — tidak ada live AI di MVP sandbox
        </p>
      </div>
    </div>
  );
}

function RoboCallDemo({ scenario, onComplete }: { scenario: typeof DEMO_SCENARIOS[0]; onComplete: () => void }) {
  const { track } = useAnalytics();
  const [callState, setCallState] = useState<"idle" | "dialing" | "ringing" | "connected" | "speaking" | "completed">("idle");
  const [transcript, setTranscript] = useState<{ speaker: string; text: string }[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (callState === "speaking") {
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  const callSteps = [
    { state: "dialing", text: "📞 RoboCall Agent initiating outbound call...", delay: 1500 },
    { state: "dialing", text: "📱 Dialing: +6281-XXXX-7890", delay: 1000 },
    { state: "dialing", text: "🏢 Target: Finance Manager, PT Salim Group", delay: 1000 },
    { state: "ringing", text: "🔔 Ringing... (4x)", delay: 2000 },
    { state: "connected", text: "✅ Call connected — human answered", delay: 800 },
    { state: "speaking", text: "🤖 (IVR): 'Selamat pagi. Ini panggilan dari [Brand]...'", delay: 1500 },
    { state: "speaking", text: "🤖 Tekan 1 untuk connected, 2 untuk callback...", delay: 1500 },
    { state: "speaking", text: "👤 [DTMF: 1]", delay: 1200 },
    { state: "speaking", text: "🤖 Invoice INV-2026-0724 — Rp 127.500.000 — Overdue 4 hari", delay: 2000 },
    { state: "speaking", text: "👤 'Wah bisa, tapi bisakah kirim nominal via WhatsApp?'", delay: 1500 },
    { state: "speaking", text: "🤖 Baiknya, saya kirim detail via WhatsApp ke 0819-XXXX-1234", delay: 1500 },
    { state: "speaking", text: "⚙️ WhatsApp sent — Invoice detail + payment link", delay: 1000 },
    { state: "speaking", text: "🤖 Terima kasih. Have a great day.", delay: 1000 },
    { state: "completed", text: "📞 Call Ended", delay: 500 },
  ];

  const handleStart = async () => {
    track("demo_started", { demo_type: scenario.type, demo_id: scenario.id });
    setCallState("dialing");
    setTranscript([]);
    setCurrentLine(0);
    setDuration(0);

    for (let i = 0; i < callSteps.length; i++) {
      await delay(callSteps[i].delay);
      setCallState(callSteps[i].state as typeof callState);
      setTranscript((prev) => [...prev, { speaker: callSteps[i].text.includes("👤") ? "user" : "agent", text: callSteps[i].text }]);
      setCurrentLine(i + 1);
    }
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const stateColors = {
    idle: "bg-dark-600",
    dialing: "bg-amber-500/20 text-amber-400",
    ringing: "bg-amber-500/20 text-amber-400",
    connected: "bg-emerald-500/20 text-emerald-400",
    speaking: "bg-emerald-500/20 text-emerald-400",
    completed: "bg-brand-500/20 text-brand-400",
  };

  const stateLabels = {
    idle: "Idle",
    dialing: "Dialing",
    ringing: "Ringing",
    connected: "Connected",
    speaking: "Speaking",
    completed: "Completed",
  };

  return (
    <div className="flex flex-col h-full">
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <span className="text-lg">{scenario.icon}</span>
            </div>
            <div>
              <p className="font-semibold text-white">{scenario.title}</p>
              <p className="text-xs text-white/40">{scenario.subtitle}</p>
            </div>
          </div>
          <Badge variant="simulation">SIMULASI</Badge>
        </div>
      </div>

      {/* Call UI */}
      <div className="glass-card p-6 mb-4 text-center">
        <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4", stateColors[callState])}>
          <span className="relative flex h-2 w-2">
            {callState !== "idle" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
          </span>
          {stateLabels[callState]}
          {callState === "speaking" && (
            <span className="ml-2 font-mono text-xs">{formatDuration(duration)}</span>
          )}
        </div>

        <div className="w-20 h-20 rounded-full bg-dark-700 border-2 border-white/10 flex items-center justify-center mx-auto mb-4">
          <Phone className={cn("w-8 h-8 text-white/50", callState === "speaking" && "animate-pulse")} />
        </div>

        <p className="text-sm text-white/60 mb-4">PT Salim Group — Finance Manager</p>

        {callState === "idle" && (
          <Button onClick={handleStart} icon={<Phone className="w-4 h-4" />}>
            Start RoboCall
          </Button>
        )}
      </div>

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-dark">
        {transcript.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "text-sm p-2 rounded-lg",
              t.speaker === "agent" ? "bg-dark-700/50 text-white/80" : "bg-fmcg-orange/10 text-white/80"
            )}
          >
            {t.text}
          </motion.div>
        ))}
      </div>

      {/* Outcome */}
      {callState === "completed" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 mb-4 border-orange-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <h4 className="font-bold text-white">Call Completed</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-dark-700/50 rounded-lg p-3">
              <p className="text-xs text-white/40">Duration</p>
              <p className="text-lg font-bold text-white">{formatDuration(duration)}</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-3">
              <p className="text-xs text-white/40">Cost</p>
              <p className="text-lg font-bold text-white">Rp 850</p>
            </div>
          </div>
          <p className="text-sm text-emerald-400 mb-4">
            ✅ Outcome: Payment detail sent via WhatsApp — Callback Scheduled
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => { setCallState("idle"); setTranscript([]); }} icon={<RotateCcw className="w-3 h-3" />}>
              Restart
            </Button>
            <Link href="/leads" className="flex-1" onClick={() => {
              track("demo_completed", { demo_type: scenario.type, demo_id: scenario.id });
              onComplete();
            }}>
              <Button size="sm" className="w-full" icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">
                Lanjutkan ke Registrasi
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function DemoEngine({ demoType }: { demoType: DemoType }) {
  const scenario = getDemoByType(demoType);
  
  if (!scenario) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <p className="text-white/40">Demo tidak ditemukan</p>
        <Link href="/demos" className="mt-4">
          <Button variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
            Kembali ke Demos
          </Button>
        </Link>
      </div>
    );
  }

  const handleComplete = () => {
    const demos = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("growthai_demo_history") || "[]") : [];
    if (!demos.includes(demoType)) {
      demos.push(demoType);
      sessionStorage.setItem("growthai_demo_history", JSON.stringify(demos));
    }
  };

  if (demoType === "whatsapp_chat") {
    return <WhatsAppChatDemo scenario={scenario} onComplete={handleComplete} />;
  }
  if (demoType === "ai_chatbot") {
    return <AIChatbotDemo scenario={scenario} onComplete={handleComplete} />;
  }
  if (demoType === "robocall") {
    return <RoboCallDemo scenario={scenario} onComplete={handleComplete} />;
  }

  return <WhatsAppChatDemo scenario={scenario} onComplete={handleComplete} />;
}

export { WhatsAppChatDemo, AIChatbotDemo, RoboCallDemo };
