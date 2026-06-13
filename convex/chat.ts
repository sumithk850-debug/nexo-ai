import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const getOrCreateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ message: "Not authenticated", code: "UNAUTHENTICATED" });
    const existing = await ctx.db.query("users").withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
    if (existing) return existing._id;
    return await ctx.db.insert("users", { tokenIdentifier: identity.tokenIdentifier, name: identity.name, email: identity.email });
  },
});

export const listConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.query("conversations").withIndex("by_user", (q) => q.eq("userId", args.userId)).order("desc").take(50);
  },
});

export const createConversation = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.insert("conversations", { userId: args.userId, title: "New conversation", updatedAt: new Date().toISOString() });
  },
});

export const updateConversationTitle = mutation({
  args: { conversationId: v.id("conversations"), title: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, { title: args.title, updatedAt: new Date().toISOString() });
  },
});

export const deleteConversation = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db.query("messages").withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId)).collect();
    for (const msg of messages) await ctx.db.delete(msg._id);
    await ctx.db.delete(args.conversationId);
  },
});

export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.query("messages").withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId)).order("asc").collect();
  },
});

export const addMessage = mutation({
  args: { conversationId: v.id("conversations"), role: v.union(v.literal("user"), v.literal("assistant")), content: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", { conversationId: args.conversationId, role: args.role, content: args.content });
    await ctx.db.patch(args.conversationId, { updatedAt: new Date().toISOString() });
  },
});
