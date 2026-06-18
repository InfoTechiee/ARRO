"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "How do taxes work for international students?",
  "Can I work off-campus on a study permit?",
  "How do I build credit in Canada?",
  "What is PGWP and when should I apply?",
  "How do I find affordable housing in Toronto?",
  "What health insurance do I have as a student?",
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<{
    first_name?: string;
    school?: string;
    stage?: string;
    goals?: string[];
    immigration_status?: string;
  } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: p }, { data: goals }, { data: stage }] = await Promise.all([
        supabase.from("user_profiles").select("first_name, immigration_status, school:schools(name), arrival_stage:journey_stages(name)").eq("user_id", user.id).single(),
        supabase.from("user_goals").select("goal").eq("user_id", user.id),
        supabase.from("user_profiles").select("arrival_stage:journey_stages(name)").eq("user_id", user.id).single(),
      ]);

      if (p) {
        setProfile({
          first_name: p.first_name,
          school: (p.school as unknown as { name: string } | null)?.name,
          stage: (p.arrival_stage as unknown as { name: string } | null)?.name,
          goals: (goals || []).map((g: { goal: string }) => g.goal),
          immigration_status: p.immigration_status,
        });
      }
    }
    loadProfile();

    // Check for pre-filled question from URL
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get("q");
    if (q) setInput(q);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(messageText?: string) {
    const text = messageText || input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, profile }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.content }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "I'm sorry, I had trouble connecting. Please try again in a moment. For urgent questions about your immigration status, please contact your school's international student office.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] md:h-screen max-w-lg mx-auto md:max-w-2xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-light bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-emerald flex items-center justify-center shadow-float">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h1 className="font-bold text-text-primary">AI Settlement Guide</h1>
            <p className="text-xs text-text-muted">
              Powered by Claude · Personalized to your profile
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-xs text-text-muted font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-2">
        {messages.length === 0 && (
          <div className="animate-fade-in">
            {/* Welcome message */}
            <div className="flex gap-3 mb-6">
              <div className="w-8 h-8 rounded-full gradient-emerald flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🤖</span>
              </div>
              <div className="flex-1 bg-white rounded-2xl rounded-tl-sm p-4 shadow-card border border-border-light">
                <p className="text-text-primary text-sm leading-relaxed">
                  {profile?.first_name ? `Hi ${profile.first_name}! ` : "Hi! "}
                  I&apos;m your Arro AI guide. I can answer questions about:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-text-secondary">
                  {["Banking, credit building, and finances", "Taxes and CRA accounts", "Immigration, study permits, and PGWP", "Healthcare and insurance", "Housing and tenant rights", "Employment and workplace rights"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-emerald-500 text-xs">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-text-muted mt-3 leading-relaxed">
                  My answers are based on your profile
                  {profile?.school ? ` (${profile.school}` : ""}
                  {profile?.stage ? `, ${profile.stage}` : ""}
                  {profile?.school || profile?.stage ? ")" : ""}.
                  Always verify important decisions with official sources.
                </p>
              </div>
            </div>

            {/* Suggested questions */}
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-1">
                Suggested questions
              </p>
              <div className="space-y-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="w-full text-left text-sm text-text-primary bg-white border border-border-light rounded-xl px-4 py-3 hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3 animate-slide-up",
              msg.role === "user" && "flex-row-reverse"
            )}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full gradient-emerald flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🤖</span>
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-emerald-600 text-white rounded-tr-sm ml-auto"
                  : "bg-white border border-border-light shadow-card rounded-tl-sm text-text-primary whitespace-pre-wrap"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full gradient-emerald flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🤖</span>
            </div>
            <div className="bg-white border border-border-light shadow-card rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-5 py-4 border-t border-border-light bg-white">
        <div className="flex gap-3 items-end">
          <div className="flex-1 bg-offwhite border border-border-medium rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-emerald-600 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about banking, taxes, immigration…"
              rows={1}
              className="w-full px-4 py-3 bg-transparent text-text-primary placeholder:text-text-muted text-sm focus:outline-none resize-none max-h-32"
              style={{ minHeight: "48px" }}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className={cn(
              "w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all",
              input.trim() && !loading
                ? "gradient-emerald text-white shadow-float hover:shadow-lg active:scale-95"
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
            )}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-text-muted text-center mt-2">
          Not legal or immigration advice. Always verify with official sources.
        </p>
      </div>
    </div>
  );
}
