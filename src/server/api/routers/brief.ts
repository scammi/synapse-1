import { z } from "zod";

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
        budget: z.number().optional(),
        deadline: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
        const now = new Date();
        await ctx.db.insert(briefs).values({
            title: input.title,
            description: input.description,
            createdById: ctx.session.user.id,
            createdAt: now,
            updatedAt: now,
            deadline: input.deadline || null,
        });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const brief = await ctx.db.query.briefs.findFirst({
      orderBy: (briefs, { desc }) => [desc(briefs.createdAt)],
    });

    return brief ?? null;
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const briefs = await ctx.db.query.briefs.findMany({
      orderBy: (briefs, { desc }) => [desc(briefs.createdAt)],
    });

    return briefs;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const brief = await ctx.db.query.briefs.findFirst({
        where: (briefs, { eq }) => eq(briefs.id, input.id),
      });

      return brief ?? null;
    }),
});
