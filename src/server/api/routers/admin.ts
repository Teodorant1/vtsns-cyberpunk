import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { posts, users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const adminRouter = createTRPCRouter({
  listUsers: protectedProcedure.query(async ({ ctx }) => {
    // Only admins can call this
    if (ctx.session.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    const users = await ctx.db.query.users.findMany({
      with: undefined,
      limit: 200,
    });

    return users;
  }),

  updateUserRole: protectedProcedure
    .input(z.object({ userId: z.string(), role: z.enum(["user", "admin"]) }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.userId));

      return { ok: true };
    }),

  listPendingIntel: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    const pending_intel = await ctx.db.query.posts.findMany({
      where: eq(posts.verifiedByModerator, false),
      with: {
        comments: {
          orderBy: (comments, { desc }) => [desc(comments.createdAt)],
        },
      },
    });

    return pending_intel ?? [];
  }),

  verifyIntel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.db
        .update(posts)
        .set({ verifiedByModerator: true })
        .where(eq(posts.id, input.id));

      return { ok: true };
    }),
});
