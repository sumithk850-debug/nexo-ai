import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { toast } from "sonner";
import { Brain, Send, Plus, Trash2, MessageSquare, Menu, X, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import { motion, AnimatePresence } from "motion/react";

type Message = { _id: Id<"messages">; role: "user" | "assistant"; content: string; };
type Conversation = { _id: Id<"conversations">; title: string; updatedAt: string; };

function ChatSidebar({ userId, activeConversationId, onSelectConversation, onNewConversation, isOpen, onClose }: { userId: Id<"users">; activeConversationId: Id<"conversations"> | null; onSelectConversation: (id: Id<"conversations">) => void; onNewConversation: () => void; isOpen: boolean; onClose: () => void; }) {
  const conversations = useQuery(api.chat.listConversations, { userId }) as Conversation[] | undefined;
  const deleteConversation = useMutation(api.chat.deleteConversation);

  const handleDelete = async (e: React.MouseEvent, id: Id<"conversations">) => {
    e.stopPropagation();
    await deleteConversation({ conversationId: id });
    if (activeConversationId === id) onNewConversation();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={onClose} />)}
      </AnimatePresence>
      <aside className={cn("fixed md:relative z-30 md:z-auto h-full md:h-auto flex flex-col", "w-72 bg-sidebar border-r border-sidebar-border", "transition-transform duration-300 md:translate-x-0", isOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <img src="https://hercules-cdn.com/file_Z4Ya99RuUvJSIZhRAsTCC12n" alt="Nexo AI" className="w-7 h-7 rounded-lg" />
            <span className="font-bold text-sm">Nexo AI</span>
          </div>
          <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-3">
          <Button onClick={onNewConversation} variant="secondary" className="w-full gap-2 justify-start"><Plus className="w-4 h-4" /> New chat</Button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
          {conversations === undefined ? Array.from({ length: 4 }).map((_, i) => (<Skeleton key={i} className="h-10 w-full rounded-lg" />))
            : conversations.length === 0 ? (<div className="text-center text-muted-foreground text-xs py-8 px-4">No conversations yet. Start chatting!</div>)
            : conversations.map((conv) => (
              <div key={conv._id} onClick={() => { onSelectConversation(conv._id); onClose(); }} className={cn("group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all", "hover:bg-sidebar-accent text-sm", activeConversationId === conv._id ? "bg-sidebar-accent text-sidebar-foreground" : "text-muted-foreground")}>
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="flex-1 truncate">{conv.title}</span>
                <button onClick={(e: React.MouseEvent) => handleDelete(e, conv._id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
        </div>
      </aside>
    </>
  );
}

function ChatMessages({ conversationId, isThinking }: { conversationId: Id<"conversations">; isThinking: boolean; }) {
  const messages = useQuery(api.chat.getMessages, { conversationId }) as Message[] | undefined;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isThinking]);

  if (messages === undefined) return (<div className="flex-1 overflow-y-auto p-4 space-y-4">{Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-16 w-3/4" />))}</div>);

  if (messages.length === 0 && !isThinking) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center"><Sparkles className="w-7 h-7 text-primary" /></div>
      <div><h3 className="font-semibold text-xl mb-2">How can I help you today?</h3><p className="text-muted-foreground text-sm max-w-xs">I'm Nexo AI by Nexo Mind. Ask me anything!</p></div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5">
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <motion.div key={msg._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.role === "assistant" && (<div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center mt-1"><Brain className="w-4 h-4 text-primary-foreground" /></div>)}
            <div className={cn("rounded-2xl px-4 py-3 text-sm max-w-[80%] leading-relaxed", msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border rounded-tl-sm")}>
              {msg.role === "assistant" ? (<div className="whitespace-pre-wrap">{msg.content}</div>) : msg.content}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {isThinking && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center mt-1"><Brain className="w-4 h-4 text-primary-foreground" /></div>
          <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2"><Spinner /><span className="text-sm text-muted-foreground">Nexo AI is thinking...</span></div>
        </motion.div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default function ChatPage({ userId }: { userId: Id<"users">; }) {
  const [activeConversationId, setActiveConversationId] = useState<Id<"conversations"> | null>(null);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const createConversation = useMutation(api.chat.createConversation);
  const messages = useQuery(api.chat.getMessages, activeConversationId ? { conversationId: activeConversationId } : "skip") as Message[] | undefined;
  const sendMessage = useAction(api.ai.chat);

  const handleNewConversation = () => setActiveConversationId(null);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isThinking) return;
    setInput("");
    let convId = activeConversationId;
    if (!convId) { convId = await createConversation({ userId }); setActiveConversationId(convId); }
    setIsThinking(true);
    try {
      const history = (messages ?? []).map((m) => ({ role: m.role, content: m.content }));
      await sendMessage({ conversationId: convId, messages: history, userMessage: text });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsThinking(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ChatSidebar userId={userId} activeConversationId={activeConversationId} onSelectConversation={setActiveConversationId} onNewConversation={handleNewConversation} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-muted-foreground hover:text-foreground p-1"><Menu className="w-5 h-5" /></button>
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"><Brain className="w-3.5 h-3.5 text-primary-foreground" /></div>
            <div><div className="font-semibold text-sm leading-none">Nexo AI</div><div className="text-xs text-muted-foreground leading-none mt-0.5">Nexo Mind</div></div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Online</span>
          </div>
        </header>
        {activeConversationId ? (<ChatMessages conversationId={activeConversationId} isThinking={isThinking} />) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center"><Sparkles className="w-7 h-7 text-primary" /></div>
            <div><h3 className="font-semibold text-xl mb-2">How can I help you today?</h3><p className="text-muted-foreground text-sm max-w-xs">I'm Nexo AI by Nexo Mind. Ask me anything!</p></div>
          </div>
        )}
        <div className="p-4 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end bg-card border border-border rounded-2xl px-4 py-3 focus-within:border-primary/50 transition-colors">
              <Textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Message Nexo AI..." rows={1} className="flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 text-sm p-0 min-h-[24px] max-h-[200px]" />
              <Button onClick={handleSend} disabled={!input.trim() || isThinking} size="sm" className="rounded-xl h-8 w-8 p-0 flex-shrink-0">{isThinking ? <Spinner /> : <Send className="w-3.5 h-3.5" />}</Button>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">Powered by Nexo Mind</p>
          </div>
        </div>
      </div>
    </div>
  );
}
