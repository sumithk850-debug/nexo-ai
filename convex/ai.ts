"use node";

import { v } from "convex/values";
import OpenAI from "openai";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

const SYSTEM_PROMPT = `You are Nexo AI, a highly intelligent and helpful AI assistant created by the Nexo Mind team.

Personality:
- Be friendly, helpful, and concise
- You can respond in any language the user writes in (including Sinhala)
- Be direct and informative
- Show enthusiasm when helping with complex topics
- Always mention you are "Nexo AI by Nexo Mind" if asked about your identity`;

export const chat = action({
  args: {
    conversationId: v.id("conversations"),
    messages: v.array(v.object({ role: v.union(v.literal("user"), v.literal("assistant")), content: v.string() })),
    userMessage: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    await ctx.runMutation(api.chat.addMessage, { conversationId: args.conversationId, role: "user", content: args.userMessage });

    const openai = new OpenAI({ baseURL: "https://ai-gateway.hercules.app/v1", apiKey: process.env.HERCULES_API_KEY });
    const history = args.messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    try {
      const response = await openai.chat.completions.create({
        model: "groq/meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history, { role: "user", content: args.userMessage }],
      });

      const assistantMessage = response.choices[0]?.message?.content ?? "Sorry, I could not generate a response.";
      await ctx.runMutation(api.chat.addMessage, { conversationId: args.conversationId, role: "assistant", content: assistantMessage });

      if (args.messages.length === 0) {
        const title = args.userMessage.slice(0, 50) + (args.userMessage.length > 50 ? "..." : "");
        await ctx.runMutation(api.chat.updateConversationTitle, { conversationId: args.conversationId, title });
      }

      return assistantMessage;
    } catch (error) {
      if (error instanceof OpenAI.APIError) throw new Error(`AI Error: ${error.message}`);
      throw new Error("Failed to get response. Please try again.");
    }
  },
});
