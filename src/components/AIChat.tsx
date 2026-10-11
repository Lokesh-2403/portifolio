
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

function AegisLogo({ size = 42 }: { size?: number }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: "22%",
        background: "#0b1320",
        boxSizing: "border-box",
      }}
    >
      {imageFailed ? (
        <Bot size={size * 0.58} color="#c7b8a6" aria-label="AEGIS" />
      ) : (
        <img
          src="/aegis-logo.jpeg"
          alt="AEGIS logo"
          onError={() => setImageFailed(true)}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "22%",
          }}
        />
      )}
    </div>
  );
}

function FormattedMessage({ content }: { content: string }) {
  const parts = content.split(/(\*\*[\s\S]+?\*\*)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (
          part.startsWith("**") &&
          part.endsWith("**") &&
          part.length >= 4
        ) {
          return (
            <span
              key={index}
              style={{
                color: "#fff7ef",
                fontWeight: 400,
                background: "rgba(180, 106, 85, 0.28)",
                borderRadius: 4,
                padding: "2px 4px",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
              }}
            >
              {part.slice(2, -2)}
            </span>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

const QUICK_QUESTIONS = [
  "Who is Lokesh?",
  "Tell me about his projects",
  "Why cybersecurity?",
];

const WELCOME_MESSAGE: Message = {
  id: 1,
  role: "assistant",
  content:
    "Hey! I'm **AEGIS**, Lokesh's AI portfolio assistant. Ask me about his background, cybersecurity journey, skills, projects, or career goals. What would you like to know?",
};

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFailedMessage, setLastFailedMessage] = useState("");

  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(2);

  useEffect(() => {
    if (isOpen) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  async function sendMessage(
    text: string,
    options?: { retry?: boolean }
  ) {
    const message = text.trim();

    if (!message || isLoading) return;

    setError("");
    setLastFailedMessage("");

    if (!options?.retry) {
      setMessages((previous) => [
        ...previous,
        {
          id: nextIdRef.current++,
          role: "user",
          content: message,
        },
      ]);
    }

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof data?.reply === "string"
            ? data.reply
            : "AEGIS couldn't respond right now. Please try again."
        );
      }

      if (typeof data?.reply !== "string" || !data.reply.trim()) {
        throw new Error("AEGIS received an empty response. Please try again.");
      }

      setMessages((previous) => [
        ...previous,
        {
          id: nextIdRef.current++,
          role: "assistant",
          content: data.reply.trim(),
        },
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(errorMessage);
      setLastFailedMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleRetry() {
    if (lastFailedMessage && !isLoading) {
      setError("");
      void sendMessage(lastFailedMessage, { retry: true });
    }
  }

  return (
    <>
      <style>{`
        @keyframes aegisSoftBounce {
          0%, 100% { transform: translateY(0); }
          35% { transform: translateY(-7px); }
          65% { transform: translateY(0); }
          82% { transform: translateY(-2px); }
        }

        .aegis-floating-logo {
          display: inline-flex;
          animation: aegisSoftBounce 2.8s ease-in-out infinite;
          transition: transform 180ms ease;
        }

        .aegis-launcher:hover .aegis-floating-logo {
          animation-duration: 0.65s;
        }

        .aegis-chat-scroll {
          scrollbar-width: thin;
          scrollbar-color: #46516a transparent;
        }

        .aegis-chat-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .aegis-chat-scroll::-webkit-scrollbar-thumb {
          background: #46516a;
          border-radius: 8px;
        }

        .aegis-chat-input::placeholder {
          color: #9ca6b8;
        }

        .aegis-chat-input:focus {
          outline: none;
          border-color: #c7b8a6 !important;
        }

        .aegis-quick-question:hover {
          border-color: #c7b8a6 !important;
          background: rgba(199, 184, 166, 0.12) !important;
        }

        .aegis-send-button:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        @media (prefers-reduced-motion: reduce) {
          .aegis-floating-logo {
            animation: none;
          }
        }
      `}</style>

      {/* Floating launcher */}
      <button
        type="button"
        className="aegis-launcher"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close AEGIS chat" : "Open AEGIS chat"}
        aria-expanded={isOpen}
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 1000,
          width: 62,
          height: 62,
          padding: 0,
          border: "none",
          outlineOffset: 4,
          borderRadius: "22%",
          background: "transparent",
          boxShadow: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isOpen ? (
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f2efe8",
              background: "#1f2a44",
              border: "1px solid rgba(199,184,166,0.3)",
            }}
          >
            <X size={23} />
          </span>
        ) : (
          <span className="aegis-floating-logo">
            <AegisLogo size={62} />
          </span>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <section
          aria-label="AEGIS AI chat"
          style={{
            position: "fixed",
            right: 24,
            bottom: 100,
            zIndex: 999,
            width: "min(460px, calc(100vw - 28px))",
            height: "min(650px, calc(100dvh - 125px))",
            minHeight: 340,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            color: "#f2efe8",
            background: "#0b1320",
            border: "1px solid rgba(199,184,166,0.25)",
            borderRadius: 20,
            boxShadow: "0 20px 65px rgba(0,0,0,0.42)",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <header
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 18px",
              background: "#1f2a44",
              borderBottom: "1px solid rgba(199,184,166,0.18)",
            }}
          >
            <AegisLogo size={44} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: "#f2efe8",
                }}
              >
                AEGIS
              </div>

              <div
                style={{
                  marginTop: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "#d0d4dc",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#9ac7a5",
                  }}
                />
                AI portfolio assistant
              </div>
            </div>

            <Sparkles size={19} color="#c7b8a6" />
          </header>

          {/* Conversation */}
          <div
            className="aegis-chat-scroll"
            aria-live="polite"
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {messages.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent:
                    item.role === "user" ? "flex-end" : "flex-start",
                  gap: 9,
                }}
              >
                {item.role === "assistant" && <AegisLogo size={30} />}

                <div
                  style={{
                    maxWidth: item.role === "user" ? "85%" : "calc(100% - 40px)",
                    padding: "12px 14px",
                    borderRadius:
                      item.role === "user"
                        ? "15px 15px 4px 15px"
                        : "4px 15px 15px 15px",
                    background:
                      item.role === "user" ? "#1f2a44" : "#172235",
                    border:
                      item.role === "user"
                        ? "1px solid rgba(199,184,166,0.18)"
                        : "1px solid rgba(199,184,166,0.12)",
                    color: "#f2efe8",
                    fontSize: 14,
                    lineHeight: 1.75,
                    overflowWrap: "anywhere",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <FormattedMessage content={item.content} />
                </div>
              </div>
            ))}

            {messages.length === 1 && !isLoading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 8,
                  paddingLeft: 39,
                  marginTop: 2,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#aeb7c6",
                    marginBottom: 2,
                  }}
                >
                  TRY ASKING
                </div>

                {QUICK_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    className="aegis-quick-question"
                    onClick={() => void sendMessage(question)}
                    style={{
                      textAlign: "left",
                      maxWidth: "100%",
                      padding: "8px 11px",
                      borderRadius: 9,
                      border: "1px solid rgba(199,184,166,0.25)",
                      background: "rgba(31,42,68,0.65)",
                      color: "#f2efe8",
                      fontSize: 12,
                      lineHeight: 1.5,
                      cursor: "pointer",
                      transition: "background 160ms ease, border-color 160ms ease",
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                }}
              >
                <AegisLogo size={30} />
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "4px 15px 15px 15px",
                    background: "#172235",
                    color: "#c7b8a6",
                    fontSize: 13,
                  }}
                >
                  AEGIS is thinking...
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                style={{
                  marginLeft: 39,
                  padding: "11px 12px",
                  border: "1px solid rgba(180,106,85,0.5)",
                  borderRadius: 10,
                  background: "rgba(180,106,85,0.1)",
                  color: "#f2c5b8",
                  fontSize: 12,
                  lineHeight: 1.6,
                }}
              >
                <div>{error}</div>

                {lastFailedMessage && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    style={{
                      marginTop: 7,
                      padding: 0,
                      border: "none",
                      background: "transparent",
                      color: "#e8b6a5",
                      textDecoration: "underline",
                      cursor: "pointer",
                      font: "inherit",
                    }}
                  >
                    Try again
                  </button>
                )}
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              flexShrink: 0,
              padding: "13px 14px 14px",
              background: "#101a2b",
              borderTop: "1px solid rgba(199,184,166,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              <input
                ref={inputRef}
                className="aegis-chat-input"
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask AEGIS anything..."
                aria-label="Message AEGIS"
                maxLength={2000}
                disabled={isLoading}
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: 45,
                  boxSizing: "border-box",
                  padding: "0 13px",
                  borderRadius: 11,
                  border: "1px solid rgba(199,184,166,0.27)",
                  background: "#0b1320",
                  color: "#f2efe8",
                  fontSize: 14,
                }}
              />

              <button
                type="submit"
                className="aegis-send-button"
                aria-label="Send message"
                disabled={!input.trim() || isLoading}
                style={{
                  width: 45,
                  height: 45,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 11,
                  border: "1px solid rgba(199,184,166,0.2)",
                  background: "#b46a55",
                  color: "#fff7ef",
                  cursor: "pointer",
                  transition: "opacity 160ms ease",
                }}
              >
                <Send size={17} />
              </button>
            </div>

            <div
              style={{
                marginTop: 8,
                textAlign: "center",
                color: "#8e9aaf",
                fontSize: 10,
                lineHeight: 1.5,
              }}
            >
              AEGIS · Lokesh's portfolio assistant
            </div>
          </form>
        </section>
      )}

      {/* Keep the chat within the viewport on small screens */}
      <style>{`
        @media (max-width: 520px) {
          .aegis-launcher {
            right: 16px !important;
            bottom: 16px !important;
          }
        }
      `}</style>
    </>
  );
}
