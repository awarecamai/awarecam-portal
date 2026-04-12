import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Bot, Send, Plus, Loader2, User, Zap, Camera, Calculator, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";

const quickPrompts = [
  { icon: Camera, label: "Camera Compatibility", labelHe: "תאימות מצלמות", prompt: "What camera brands does AwareCam support? Can you give me the RTSP URL format for Hikvision cameras?" },
  { icon: Calculator, label: "Get a Quote", labelHe: "קבל הצעת מחיר", prompt: "I need a quote for 20 cameras on the Pro plan with LPR add-on." },
  { icon: Zap, label: "Plan Comparison", labelHe: "השוואת תוכניות", prompt: "What's the difference between the Essential and Pro plans? Can you compare them side by side?" },
  { icon: BookOpen, label: "Setup Help", labelHe: "עזרה בהתקנה", prompt: "How do I set up the Raspberry Pi Kiosk device? What do I need to get started?" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

export default function Assistant() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [sessionId, setSessionId] = useState(() => nanoid(12));
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMutation = trpc.chat.send.useMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text, id: nanoid() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await sendMutation.mutateAsync({
        sessionId,
        message: text,
        language: language as "en" | "he",
      });
      const assistantMsg: Message = { role: "assistant", content: result.content, id: nanoid() };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errMsg: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
        id: nanoid(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setSessionId(nanoid(12));
    setMessages([]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <PortalLayout>
      <div className="flex h-screen flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t("ai.title")}
              </h1>
              <p className="text-xs text-muted-foreground">{t("ai.subtitle")}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleNewChat}>
            <Plus className="w-3.5 h-3.5" />
            {t("ai.newChat")}
          </Button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Welcome screen */
            <div className="flex flex-col items-center justify-center h-full px-4 md:px-8 py-8 md:py-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mb-6">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {language === "he" ? "שלום! אני עוזר ה-AI של AwareCam" : "Hello! I'm the AwareCam AI Assistant"}
              </h2>
              <p className="text-muted-foreground text-center max-w-md mb-10 text-sm">
                {language === "he"
                  ? "שאל אותי על תאימות מצלמות, תמחור, התקנה, או בקש הצעת מחיר מותאמת."
                  : "Ask me about camera compatibility, pricing, installation, or generate a custom quote for your client."}
              </p>

              {/* Quick prompts */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
                {quickPrompts.map((qp) => {
                  const Icon = qp.icon;
                  return (
                    <button
                      key={qp.label}
                      onClick={() => handleSend(qp.prompt)}
                      className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {language === "he" ? qp.labelHe : qp.label}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="px-4 md:px-8 py-4 md:py-6 space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-2xl rounded-2xl px-4 py-3 text-sm",
                      msg.role === "user"
                        ? "bg-primary/20 border border-primary/30 rounded-tr-sm text-foreground"
                        : "bg-card border border-border rounded-tl-sm"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <Streamdown>{msg.content}</Streamdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {t("ai.thinking")}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-4 md:px-8 py-4 border-t border-border flex-shrink-0">
          <div className="flex gap-3 items-end max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("ai.placeholder")}
                className="resize-none bg-card border-border min-h-[52px] max-h-[200px] pr-4 text-sm"
                rows={1}
              />
            </div>
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="h-[52px] w-[52px] p-0 flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            {language === "he"
              ? "לחץ Enter לשליחה · Shift+Enter לשורה חדשה"
              : "Press Enter to send · Shift+Enter for new line"}
          </p>
        </div>
      </div>
    </PortalLayout>
  );
}
