import { useState, useRef, useEffect, CSSProperties } from "react";

const SYSTEM_PROMPT = `You are an AI assistant embedded in Lokesh Babu's cybersecurity portfolio website (lokeshbabu.vercel.app). You represent Lokesh professionally and help visitors learn about him, his work, and guide them through his portfolio.

About Lokesh Babu:
- Name: Lokesh Babu
- Role: SOC Analyst & Cybersecurity Professional
- Portfolio: lokeshbabu.vercel.app
- Specialization: Security Operations Center (SOC) analysis, threat detection, incident response, and cybersecurity

Your personality:
- Professional, confident, and knowledgeable about cybersecurity
- Friendly and approachable — you make visitors feel welcome
- You speak on behalf of Lokesh in third person (e.g., "Lokesh has experience in...")
- Use light cybersecurity terminology naturally (e.g., "threat landscape", "incident response", "blue team")
- Keep responses concise and focused — 2–4 sentences max unless asked for more detail

What you can help with:
1. Tell visitors about Lokesh's background, skills, and experience as a SOC Analyst
2. Answer questions about his projects, certifications, and expertise areas
3. Guide visitors to different sections of his portfolio (About, Projects, Skills, Contact)
4. Answer general cybersecurity questions in context of his expertise
5. Help recruiters or collaborators understand why Lokesh would be a great hire

Portfolio sections to guide visitors to:
- Home/Intro — the animated terminal landing page
- About — Lokesh's background and story
- Skills — technical skills (SIEM, threat hunting, network security, etc.)
- Projects — his cybersecurity projects and case studies
- Contact — to get in touch with Lokesh

If asked something you don't know, say you're not sure but offer to direct them to the contact section to reach Lokesh directly.
Keep responses short, sharp, and professional. No markdown formatting — plain conversational text only.`;

interface Message {
  role: "user" | "assistant";
  text: string;
  time: string;
}

const ShieldIcon = ({ size = 20, color = "#58a6ff" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 6V12C4 16.418 7.582 20.378 12 22C16.418 20.378 20 16.418 20 12V6L12 2Z"
      stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="rgba(88,166,255,0.08)" />
    <circle cx="12" cy="12" r="2.5" fill={color} />
    <path d="M12 9.5V7M12 14.5V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9.5 12H7M14.5 12H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

function getTime(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const WELCOME = "Hi there! 👋 I'm Lokesh's Assistant. I can tell you about his work as a SOC Analyst, his skills, projects, or help you navigate his portfolio. What would you like to know?";

const QUICK_PROMPTS = [
  { label: "about lokesh", text: "Tell me about Lokesh" },
  { label: "skills", text: "What skills does Lokesh have?" },
  { label: "projects", text: "What projects has Lokesh worked on?" },
  { label: "availability", text: "Is Lokesh available for hire?" },
];

export default function PortfolioAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: WELCOME, time: getTime() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || loading) return;
    setInput("");
    setShowQuick(false);
    setLoading(true);

    const userMsg: Message = { role: "user", text: msg, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);

    const history = [...messages, userMsg]
      .filter((m) => !(m.role === "assistant" && m.text === WELCOME))
      .map((m) => ({ role: m.role, content: m.text }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      });
      const data = await res.json();
      const reply: string =
        data.content?.map((b: { text?: string }) => b.text ?? "").join("") ||
        "Sorry, I had trouble responding. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply, time: getTime() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Connection error. Please try again.", time: getTime() },
      ]);
    }
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", text: WELCOME, time: getTime() }]);
    setShowQuick(true);
  };

  const s: Record<string, CSSProperties> = {
    widget: {
      position: "fixed", bottom: "28px", right: "28px",
      zIndex: 9999, display: "flex", flexDirection: "column",
      alignItems: "flex-end", gap: "12px",
      fontFamily: "'DM Sans', sans-serif",
    },
    panel: {
      width: "380px", height: "560px",
      background: "#0d0d0d", border: "1px solid #2a2a2a",
      borderRadius: "16px", display: "flex", flexDirection: "column",
      overflow: "hidden",
      boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(88,166,255,0.08)",
      transformOrigin: "bottom right",
      transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease",
      transform: open ? "scale(1)" : "scale(0.85)",
      opacity: open ? 1 : 0,
      pointerEvents: open ? "all" : "none",
    },
    header: {
      padding: "14px 16px", borderBottom: "1px solid #2a2a2a",
      display: "flex", alignItems: "center", gap: "10px",
      background: "#141414", flexShrink: 0,
    },
    avatarBox: {
      width: "36px", height: "36px", borderRadius: "10px",
      background: "linear-gradient(135deg, #0a1628, #0d2040)",
      border: "1px solid rgba(88,166,255,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, boxShadow: "0 0 10px rgba(88,166,255,0.15)",
    },
    headerInfo: { flex: 1 },
    headerName: { fontSize: "13px", fontWeight: 600, color: "#e6edf3", lineHeight: 1.2 },
    headerStatus: {
      fontSize: "11px", color: "#3fb950",
      fontFamily: "'IBM Plex Mono', monospace",
      display: "flex", alignItems: "center", gap: "5px", marginTop: "2px",
    },
    statusDot: {
      width: "6px", height: "6px", background: "#3fb950",
      borderRadius: "50%", animation: "assistantPulse 2s infinite",
    },
    headerActions: { display: "flex", gap: "6px" },
    headerBtn: {
      width: "28px", height: "28px", borderRadius: "8px",
      border: "1px solid #2a2a2a", background: "transparent",
      color: "#6e7681", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "13px",
    },
    messages: {
      flex: 1, overflowY: "auto", padding: "16px",
      display: "flex", flexDirection: "column", gap: "14px",
      scrollBehavior: "smooth",
    },
    quickPrompts: {
      padding: "0 16px 10px", display: "flex",
      gap: "6px", flexWrap: "wrap", flexShrink: 0,
    },
    quickBtn: {
      fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px",
      padding: "5px 10px", borderRadius: "20px",
      border: "1px solid #2a2a2a", background: "transparent",
      color: "#6e7681", cursor: "pointer", whiteSpace: "nowrap",
    },
    inputArea: {
      padding: "12px 14px", borderTop: "1px solid #2a2a2a",
      display: "flex", gap: "8px", alignItems: "flex-end",
      background: "#141414", flexShrink: 0,
    },
    input: {
      flex: 1, background: "#0d0d0d", border: "1px solid #2a2a2a",
      borderRadius: "10px", padding: "9px 12px",
      fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
      color: "#e6edf3", resize: "none", outline: "none",
      maxHeight: "100px", lineHeight: 1.5,
    },
    fab: {
      width: "54px", height: "54px", borderRadius: "16px",
      background: "#58a6ff", border: "none", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 8px 24px rgba(88,166,255,0.3)",
      color: "#0d1117", position: "relative",
    },
  };

  const msgRowStyle = (isUser: boolean): CSSProperties => ({
    display: "flex", gap: "8px", alignItems: "flex-end",
    flexDirection: isUser ? "row-reverse" : "row",
  });

  const msgAvatarStyle = (isUser: boolean): CSSProperties => ({
    width: "26px", height: "26px", borderRadius: "8px",
    fontSize: "10px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    background: isUser ? "#141414" : "linear-gradient(135deg, #0a1628, #0d2040)",
    border: isUser ? "1px solid #2a2a2a" : "1px solid rgba(88,166,255,0.25)",
    color: "#6e7681",
  });

  const msgColStyle = (isUser: boolean): CSSProperties => ({
    display: "flex", flexDirection: "column",
    alignItems: isUser ? "flex-end" : "flex-start",
  });

  const bubbleStyle = (isUser: boolean): CSSProperties => ({
    maxWidth: "80%", padding: "10px 14px", borderRadius: "12px",
    fontSize: "13px", lineHeight: 1.55, color: "#e6edf3",
    background: isUser ? "#0d2040" : "#0d0d0d",
    border: isUser ? "1px solid rgba(88,166,255,0.2)" : "1px solid #2a2a2a",
    borderBottomRightRadius: isUser ? "4px" : "12px",
    borderBottomLeftRadius: isUser ? "12px" : "4px",
  });

  const sendBtnStyle = (disabled: boolean): CSSProperties => ({
    width: "36px", height: "36px", borderRadius: "10px",
    background: disabled ? "#2a2a2a" : "#58a6ff",
    border: "none", cursor: disabled ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, color: "#0d1117",
  });

  const typingIndicatorStyle: CSSProperties = {
    display: "flex", gap: "4px", alignItems: "center",
    padding: "10px 14px", background: "#0d0d0d",
    border: "1px solid #2a2a2a", borderRadius: "12px",
    borderBottomLeftRadius: "4px", width: "fit-content",
  };

  const msgTimeStyle: CSSProperties = {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px",
    color: "#6e7681", marginTop: "4px", padding: "0 4px",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes assistantPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes assistantBounce { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-4px);opacity:1} }
        .assistant-messages::-webkit-scrollbar { width: 4px; }
        .assistant-messages::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
      `}</style>

      <div style={s.widget}>
        <div style={s.panel}>
          <div style={s.header}>
            <div style={s.avatarBox}><ShieldIcon size={20} /></div>
            <div style={s.headerInfo}>
              <div style={s.headerName}>Lokesh's Assistant</div>
              <div style={s.headerStatus}>
                <span style={s.statusDot} />
                online · SOC Analyst
              </div>
            </div>
            <div style={s.headerActions}>
              <button style={s.headerBtn} onClick={clearChat}>↺</button>
              <button style={s.headerBtn} onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          <div className="assistant-messages" style={s.messages}>
            {messages.map((m, i) => (
              <div key={i} style={msgRowStyle(m.role === "user")}>
                <div style={msgAvatarStyle(m.role === "user")}>
                  {m.role === "user" ? "you" : <ShieldIcon size={14} />}
                </div>
                <div style={msgColStyle(m.role === "user")}>
                  <div style={bubbleStyle(m.role === "user")}>{m.text}</div>
                  <div style={msgTimeStyle}>{m.time}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={msgRowStyle(false)}>
                <div style={msgAvatarStyle(false)}><ShieldIcon size={14} /></div>
                <div style={typingIndicatorStyle}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div key={i} style={{
                      width: "6px", height: "6px", background: "#6e7681",
                      borderRadius: "50%",
                      animation: `assistantBounce 1.2s ${delay}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showQuick && (
            <div style={s.quickPrompts}>
              {QUICK_PROMPTS.map((q) => (
                <button key={q.label} style={s.quickBtn} onClick={() => sendMessage(q.text)}>
                  {q.label}
                </button>
              ))}
            </div>
          )}

          <div style={s.inputArea}>
            <textarea
              style={s.input}
              placeholder="Ask about Lokesh..."
              value={input}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              style={sendBtnStyle(loading || !input.trim())}
              disabled={loading || !input.trim()}
              onClick={() => sendMessage()}
            >
              <SendIcon />
            </button>
          </div>
        </div>

        <button style={s.fab} onClick={() => setOpen((o) => !o)}>
          <ShieldIcon size={24} color="#0d1117" />
        </button>
      </div>
    </>
  );
}