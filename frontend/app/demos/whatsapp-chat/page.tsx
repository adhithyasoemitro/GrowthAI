"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Bot, User, MapPin, Package, MessageSquare, Check, Clock, Phone, ChevronDown, X, ShoppingCart, Receipt, CreditCard, Truck, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  type: "bot" | "user";
  message: string;
  time: string;
  status?: "sent" | "delivered" | "read";
}

const CATALOG = [
  { id: "p1", name: "Indomie Goreng", price: 3500, emoji: "🍜", stock: 150 },
  { id: "p2", name: "Mie Sedaap Goreng", price: 3200, emoji: "🍜", stock: 120 },
  { id: "p3", name: "Kecap ABC 135ml", price: 5800, emoji: "🍯", stock: 85 },
  { id: "p4", name: "Saus Sambal Indofood 200ml", price: 4500, emoji: "🌶️", stock: 200 },
  { id: "p5", name: "Beras Premium 5kg", price: 75000, emoji: "🍚", stock: 45 },
];

const FLOW_MESSAGES = {
  greeting: "Halo Budi! 👋 Selamat datang di *Chat Commerce PT Indomaret*. Saya asisten pesan otomatis untuk pemesanan barang. Silakan pilih menu di bawah:",
  catalog: "📦 *KATALOG PRODUK*:\n\nBerikut daftar produk yang tersedia untuk dipesan:",
  orderConfirm: "✅ *PESANAN DITERIMA*\n\nTerima kasih atas pesanan Anda. Mohon konfirmasi detail berikut:",
  payment: "💳 *PEMBAYARAN*\n\nTotal: *Rp 113.500*\n\nPilih metode pembayaran:",
  shipping: "📍 *PENGIRIMAN*\n\nMasukkan alamat lengkap untuk pengiriman:",
  confirmation: "🎉 *PESANAN BERHASIL*\n\nTerima kasih! Pesanan Anda akan diproses. Nomor pesanan: *#ORD-2024-0831*",
};

export default function WhatsAppChatDemo() {
  const [step, setStep] = useState<"menu" | "catalog" | "cart" | "address" | "payment" | "done">("menu");
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", type: "bot", message: FLOW_MESSAGES.greeting, time: "09:30", status: "read" },
  ]);
  const [input, setInput] = useState("");
  const [showCatalog, setShowCatalog] = useState(false);
  const [address, setAddress] = useState({ street: "", city: "" });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [typing, setTyping] = useState(false);
  const [orderNumber] = useState(`#ORD-2024-${Math.floor(Math.random() * 9000 + 1000)}`);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === productId);
      if (existing) return prev.map(i => i.id === productId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: productId, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => {
    const product = CATALOG.find(p => p.id === item.id);
    return sum + (product?.price || 0) * item.qty;
  }, 0);

  const sendBotMessage = (msg: string) => {
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        message: msg,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        status: "delivered",
      }]);
      setTyping(false);
    }, 1200);
  };

  const handleMenuClick = (menu: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: "user",
      message: menu,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    }]);

    if (menu === "📦 Lihat Katalog") {
      setShowCatalog(true);
      setTimeout(() => {
        setShowCatalog(false);
        sendBotMessage(`${FLOW_MESSAGES.catalog}\n\n${CATALOG.map((p, i) => `${i + 1}. ${p.emoji} *${p.name}*\n   Rp ${p.price.toLocaleString("id-ID")} | Stok: ${p.stock}`).join("\n\n")}\n\nKetik *PESAN* untuk mulai order atau klik produk untuk menambahkan ke keranjang.`);
        setStep("catalog");
      }, 500);
    } else if (menu === "🛒 Lihat Keranjang") {
      if (cart.length === 0) {
        sendBotMessage("Keranjang Anda kosong. Ketik *KATALOG* untuk melihat produk.");
      } else {
        const cartItems = cart.map((item, i) => {
          const p = CATALOG.find(x => x.id === item.id);
          return `${i + 1}. ${p?.emoji} ${p?.name} x${item.qty} = Rp ${((p?.price || 0) * item.qty).toLocaleString("id-ID")}`;
        }).join("\n");
        sendBotMessage(`🛒 *KERANJANG ANDA*\n\n${cartItems}\n\n*Total: Rp ${cartTotal.toLocaleString("id-ID")}*\n\nKetik *CHECKOUT* untuk lanjut ke pembayaran.`);
      }
    } else if (menu === "📍 Lacak Pesanan") {
      sendBotMessage("📦 *STATUS PESANAN*\n\nPesanan #ORD-2024-0831:\n\n✅ 09:30 - Pesanan diterima\n📦 09:45 - Sedang dikemas\n🚚 10:15 - Dalam perjalanan\n📍 Est. sampai: 11:00\n\nApakah ada yang bisa saya bantu lagi?");
    } else if (menu === "❓ FAQ") {
      sendBotMessage("❓ *FAQ*\n\n1. *Cara pesan?* → Ketik KATALOG, pilih produk, ketik CHECKOUT\n2. *Metode pembayaran?* → Transfer BCA, Mandiri, GoPay, OVO\n3. *Ongkir?* → Gratis untuk pembelian Rp 100rb+\n4. *Komplain?* → Hubungi 1500-123\n\nAda yang ingin ditanyakan?");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    sendBotMessage(`${FLOW_MESSAGES.orderConfirm}\n\n${cart.map((item, i) => {
      const p = CATALOG.find(x => x.id === item.id);
      return `${i + 1}. ${p?.emoji} ${p?.name} x${item.qty} = *Rp ${((p?.price || 0) * item.qty).toLocaleString("id-ID")}*`;
    }).join("\n")}\n\n*Total: Rp ${cartTotal.toLocaleString("id-ID")}*\n\nKetik *BAYAR* untuk lanjut ke pembayaran.`);
    setStep("payment");
  };

  const handlePayment = () => {
    sendBotMessage(`${FLOW_MESSAGES.payment}\n\n1. 💳 Transfer BCA\n2. 🏦 Transfer Mandiri  \n3. 📱 GoPay / OVO\n\nKetik *BCA* atau *GOPAY* untuk memilih.`);
  };

  const handlePaymentSelect = (method: string) => {
    setPaymentMethod(method);
    sendBotMessage(`✅ Pembayaran via *${method}* dipilih.\n\nTotal yang harus dibayar: *Rp ${cartTotal.toLocaleString("id-ID")}*\n\nSilakan transfer ke rekening berikut:\n\n*BCA 123-456-789 a.n. PT Indomaret*\n\nKonfirmasi dengan ketik *SUDAH TRANSFER*`);
  };

  const handleDone = () => {
    sendBotMessage(`${FLOW_MESSAGES.confirmation}\n\n📦 *Detail Pesanan*\n• No. Pesanan: ${orderNumber}\n• Total: Rp ${cartTotal.toLocaleString("id-ID")}\n• Pembayaran: ${paymentMethod}\n\n📍 Estimasi pengiriman: 45 menit\n\nTerima kasih! 🙏`);
    setStep("done");
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-800 border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-lg">🏪</div>
              <div>
                <p className="font-semibold text-sm">Indomaret Chat Commerce</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
                  Online • Demo Chat Commerce
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat */}
      <main className="max-w-lg mx-auto pb-32">
        <div className="p-4 space-y-3">
          {/* Menu Buttons */}
          {step === "menu" && (
            <div className="flex flex-wrap gap-2 mb-4">
              {["📦 Lihat Katalog", "🛒 Lihat Keranjang", "📍 Lacak Pesanan", "❓ FAQ"].map(m => (
                <button key={m} onClick={() => handleMenuClick(m)}
                  className="px-3 py-2 rounded-lg bg-dark-700 text-sm font-medium text-white/80 hover:bg-dark-600 border border-white/5 transition-all">
                  {m}
                </button>
              ))}
            </div>
          )}

          {/* Order Flow */}
          {step === "catalog" && (
            <div className="mb-4">
              <div className="p-3 rounded-xl bg-dark-700 border border-white/5 mb-3">
                <p className="text-xs text-white/40 mb-2">📦 Katalog Produk</p>
                <div className="space-y-2">
                  {CATALOG.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-dark-800">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.emoji}</span>
                        <div>
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-emerald-400">Rp {p.price.toLocaleString("id-ID")}</p>
                        </div>
                      </div>
                      <button onClick={() => addToCart(p.id)} className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 border border-emerald-500/20">
                        + Tambah
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleMenuClick("🛒 Lihat Keranjang")} className="flex-1 py-2 rounded-lg bg-emerald-500 text-white font-semibold text-sm">
                  🛒 Lihat Keranjang ({cart.length})
                </button>
                {cart.length > 0 && (
                  <button onClick={handleCheckout} className="flex-1 py-2 rounded-lg bg-brand-500 text-white font-semibold text-sm">
                    CHECKOUT →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Cart Summary */}
          {cart.length > 0 && step !== "menu" && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <p className="text-xs text-emerald-400 mb-1">🛒 Keranjang ({cart.length} item)</p>
              <p className="text-sm text-white font-semibold">Total: Rp {cartTotal.toLocaleString("id-ID")}</p>
            </div>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <div className="mb-4">
              <div className="p-3 rounded-xl bg-dark-700 border border-white/5 mb-3">
                <p className="text-xs text-white/40 mb-2">💳 Metode Pembayaran</p>
                <div className="space-y-2">
                  {[{ id: "BCA", label: "💳 Transfer BCA", sub: "a.n. PT Indomaret" }, { id: "Mandiri", label: "🏦 Transfer Mandiri", sub: "a.n. PT Indomaret" }, { id: "GoPay", label: "📱 GoPay / OVO", sub: "Bayar instan" }].map(m => (
                    <button key={m.id} onClick={() => handlePaymentSelect(m.id)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-dark-800 hover:bg-dark-600 border border-white/5 transition-all">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-brand-400" />
                        <div className="text-left">
                          <p className="text-sm font-medium">{m.label}</p>
                          <p className="text-xs text-white/40">{m.sub}</p>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-white/30 rotate-[-90deg]" />
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleDone} className="w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold text-sm">
                ✅ Konfirmasi & Bayar Sekarang
              </button>
            </div>
          )}

          {/* Done */}
          {step === "done" && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center mb-4">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <p className="font-bold text-emerald-400">Pesanan Berhasil!</p>
              <p className="text-sm text-white/60">Pesanan Anda sedang diproses</p>
            </div>
          )}

          {/* Messages */}
          {messages.map(msg => (
            <div key={msg.id} className={cn("flex gap-2", msg.type === "user" && "flex-row-reverse")}>
              {msg.type === "bot" && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 text-sm">🏪</div>}
              {msg.type === "user" && <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">B</div>}
              <div className={cn("max-w-[75%]", msg.type === "user" && "items-end")}>
                <div className={cn("p-3 rounded-2xl text-sm whitespace-pre-line", msg.type === "bot" ? "bg-dark-700 rounded-tl-sm" : "bg-brand-500 rounded-tr-sm")}>
                  {msg.message}
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-white/30">
                  <span>{msg.time}</span>
                  {msg.type === "user" && <span>{msg.status === "read" ? "✓✓" : msg.status === "delivered" ? "✓✓" : "✓"}</span>}
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 text-sm">🏪</div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-dark-700">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-dark-700 border border-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
            <button className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center hover:bg-brand-400 transition-colors">
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-xs text-white/30 mt-2 text-center">Demo Chat Commerce • Tidak ada data nyata</p>
        </div>
      </div>
    </div>
  );
}
