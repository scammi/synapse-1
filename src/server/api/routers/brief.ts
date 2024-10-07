import { z } from "zod";
import { eq, desc } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { briefs } from "@/server/db/schema";

export const briefRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(256),
      description: z.string().min(1),
      targetAudience: z.string().max(256).optional(),
      budget: z.number().int().positive().optional(),
      deadline: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db.insert(briefs).values({
        ...input,
        createdById: ctx.session.user.id,
        deadline: input.deadline ? input.deadline.toISOString() : null,
      }).returning();
      return result;
    }),

  getAll: publicProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(100).optional().default(50),
      cursor: z.number().int().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const query = ctx.db.select().from(briefs).orderBy(desc(briefs.createdAt)).limit(limit + 1);
      
      if (cursor) {
        query.where(eq(briefs.id, cursor));
      }

      const items = await query;
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db.select().from(briefs).where(eq(briefs.id, input.id));
      if (!result) throw new Error("Brief not found");
      return result;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number().int(),
      title: z.string().min(1).max(256).optional(),
      description: z.string().min(1).optional(),
      targetAudience: z.string().max(256).optional(),
      budget: z.number().int().positive().optional(),
      deadline: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const [result] = await ctx.db.update(briefs)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(briefs.id, id))
        .returning();
      if (!result) throw new Error("Brief not found");
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db.delete(briefs).where(eq(briefs.id, input.id)).returning();
      if (!result) throw new Error("Brief not found");
      return { success: true, deletedBrief: result };
    }),

  getByUser: protectedProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(100).optional().default(50),
      cursor: z.number().int().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const query = ctx.db.select()
        .from(briefs)
        .where(eq(briefs.createdById, ctx.session.user.id))
        .orderBy(desc(briefs.createdAt))
        .limit(limit + 1);
      
      if (cursor) {
        query.where(eq(briefs.id, cursor));
      }

      const items = await query;
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
});
