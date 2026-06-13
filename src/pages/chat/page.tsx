import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Brain, Sparkles } from "lucide-react";
import ChatPage from "./_components/chat-page.tsx";

function AuthenticatedChat() {
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const getOrCreateUser = useMutation(api.chat.getOrCreateUser);

  useEffect(() => {
    getOrCreateUser({}).then(setUserId).catch(console.error);
  }, [getOrCreateUser]);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Skeleton className="w-64 h-8" />
      </div>
    );
  }

  return <ChatPage userId={userId} />;
}

export default function Chat() {
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <span className="text-muted-foreground">Loading Nexo AI...</span>
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 p-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Sign in to chat with Nexo AI</h2>
            <p className="text-muted-foreground mb-6 max-w-xs">Create a free account to start chatting with Nexo AI.</p>
            <SignInButton />
          </div>
        </div>
      </Unauthenticated>
      <Authenticated>
        <AuthenticatedChat />
      </Authenticated>
    </>
  );
}
