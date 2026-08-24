"use client";

import React, { createContext, useContext, useCallback, useEffect, useRef } from "react";
import { nanoid } from "nanoid";

interface AnalyticsEvent {
  event: string;
  category: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

interface AnalyticsContextValue {
  track: (event: string, properties?: Record<string, unknown>) => void;
  trackPageView: (path: string, referrer?: string) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
  sessionId: string;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const sessionIdRef = useRef<string>("");
  const userIdRef = useRef<string | null>(null);
  const queueRef = useRef<AnalyticsEvent[]>([]);
  const isFlushing = useRef(false);

  useEffect(() => {
    let sid = sessionStorage.getItem("growthai_sid");
    if (!sid) {
      sid = nanoid(21);
      sessionStorage.setItem("growthai_sid", sid);
    }
    sessionIdRef.current = sid;
    
    userIdRef.current = localStorage.getItem("growthai_uid");
    
    const stored = sessionStorage.getItem("growthai_events");
    if (stored) {
      try {
        queueRef.current = JSON.parse(stored);
      } catch {
        queueRef.current = [];
      }
    }
    
    const flushEvents = () => {
      if (queueRef.current.length === 0 || isFlushing.current) return;
      isFlushing.current = true;
      
      const events = [...queueRef.current];
      queueRef.current = [];
      sessionStorage.setItem("growthai_events", JSON.stringify(queueRef.current));
      
      if (process.env.NEXT_PUBLIC_APP_URL) {
        fetch("/api/analytics/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            events,
            sessionId: sessionIdRef.current,
            userId: userIdRef.current,
          }),
          keepalive: true,
        }).catch(() => {});
      }
      
      isFlushing.current = false;
    };
    
    const interval = setInterval(flushEvents, 5000);
    window.addEventListener("beforeunload", flushEvents);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", flushEvents);
    };
  }, []);

  const track = useCallback((event: string, properties?: Record<string, unknown>) => {
    const e: AnalyticsEvent = {
      event,
      category: event.split("_")[0] || "general",
      properties: {
        ...properties,
        url: typeof window !== "undefined" ? window.location.href : undefined,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      },
      timestamp: Date.now(),
    };
    
    queueRef.current.push(e);
    sessionStorage.setItem("growthai_events", JSON.stringify(queueRef.current));
  }, []);

  const trackPageView = useCallback((path: string, referrer?: string) => {
    track("page_view", { path, referrer });
  }, [track]);

  const identify = useCallback((userId: string, traits?: Record<string, unknown>) => {
    userIdRef.current = userId;
    localStorage.setItem("growthai_uid", userId);
    track("user_identified", { userId, ...traits });
  }, [track]);

  return (
    <AnalyticsContext.Provider
      value={{
        track,
        trackPageView,
        identify,
        sessionId: sessionIdRef.current,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error("useAnalytics must be used within AnalyticsProvider");
  return ctx;
}

export function usePageTracking() {
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    trackPageView(window.location.pathname, document.referrer);
  }, [trackPageView]);
}
