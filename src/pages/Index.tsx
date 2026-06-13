import { motion } from "motion/react";
import { ArrowRight, Brain, MessageSquare, Zap, Shield, Sparkles, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Brain,
    title: "Nexo Mind AI",
    description: "Built by the Nexo Mind team — a powerful AI model crafted for speed and intelligence.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Nexo Mind's infrastructure delivers blazing-fast responses in milliseconds.",
  },
  {
    icon: MessageSquare,
    title: "Multi-turn Chat",
    description: "Full conversation history with context-aware responses across sessions.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your conversations are protected with enterprise-grade security.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full bg-accent/8 blur-[100px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="https://hercules-cdn.com/file_Z4Ya99RuUvJSIZhRAsTCC12n" alt="Nexo AI" className="w-9 h-9 rounded-xl" />
          <span className="text-xl font-bold tracking-tight">Nexo <span className="text-primary">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer transition-colors">Features</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">About</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">Nexo Mind</span>
        </div>
        <Link to="/chat"><Button size="sm" className="gap-2 font-medium">Start Chatting <ArrowRight className="w-4 h-4" /></Button></Link>
      </nav>

      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-24 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5" /> Nexo AI by Nexo Mind
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-[1.05] mb-6">
          Think faster with{" "}<span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">Nexo AI</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
          Nexo AI is built by the Nexo Mind team — a powerful intelligent assistant designed and developed entirely by Nexo Mind.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="flex flex-col sm:flex-row gap-4">
          <Link to="/chat"><Button size="lg" className="gap-2 text-base px-8 font-semibold">Chat with Nexo AI <ArrowRight className="w-4 h-4" /></Button></Link>
          <Button size="lg" variant="secondary" className="gap-2 text-base px-8">Learn More <ChevronRight className="w-4 h-4" /></Button>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-16 w-full max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 h-6 rounded bg-muted mx-4" />
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-xs text-left">AI ගැන සිංහලෙන් කියන්නකො</div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center"><Brain className="w-4 h-4 text-primary-foreground" /></div>
                <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm max-w-sm text-left text-secondary-foreground">AI (Artificial Intelligence) කියන්නේ computer systems වලට human intelligence simulate කිරීමේ හැකියාව ලබා දෙන technology එකක්. Nexo AI ඔබේ සෑම ප්‍රශ්නයකටම ultra-fast ලෙස answers දෙනවා!{" "}<span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5 align-middle" /></div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
          <motion.h2 custom={0} variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Built for speed & intelligence</motion.h2>
          <motion.p custom={1} variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto">Nexo Mind team built this AI with one goal — give you the fastest, smartest AI experience possible.</motion.p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, i) => (
            <motion.div key={feature.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="group rounded-2xl border border-border bg-card/50 p-6 hover:border-primary/40 hover:bg-card transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors"><feature.icon className="w-5 h-5 text-primary" /></div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto text-center rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent p-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6"><img src="https://hercules-cdn.com/file_Z4Ya99RuUvJSIZhRAsTCC12n" alt="Nexo AI" className="w-12 h-12 rounded-xl" /></div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ready to experience Nexo AI?</h2>
          <p className="text-muted-foreground mb-8">Join the Nexo Mind community and chat with one of the world's fastest AI models.</p>
          <Link to="/chat"><Button size="lg" className="gap-2 px-10 font-semibold text-base">Start Chatting Now <ArrowRight className="w-4 h-4" /></Button></Link>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="https://hercules-cdn.com/file_Z4Ya99RuUvJSIZhRAsTCC12n" alt="Nexo AI" className="w-5 h-5 rounded" />
          <span className="font-semibold text-foreground">Nexo AI</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Nexo Mind Team. All rights reserved.</p>
      </footer>
    </div>
  );
}
