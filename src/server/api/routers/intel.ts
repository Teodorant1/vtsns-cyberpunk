import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { intelSubmissions, userProfiles } from "~/server/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const intelRouter = createTRPCRouter({
  submitIntel: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1),
        subject: z.string().min(1).max(100),
        examDate: z.date(),
        difficulty: z.number().min(1).max(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has enough reputation (>= 10) to submit intel
      const userProfile = await ctx.db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, ctx.session.user.id),
      });

      if (!userProfile || userProfile.reputation < 10) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Insufficient reputation to submit intel. Required: 10",
        });
      }

      return ctx.db.insert(intelSubmissions).values({
        ...input,
        createdById: ctx.session.user.id,
      });
    }),

  getLatestIntel: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        subject: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const query = input.subject
        ? and(eq(intelSubmissions.subject, input.subject))
        : undefined;

      return ctx.db.query.intelSubmissions.findMany({
        where: query,
        orderBy: [desc(intelSubmissions.createdAt)],
        limit: input.limit,
        with: {
          author: {
            columns: {
              username: true,
              image: true,
            },
          },
        },
      });
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        handle: z.string().min(2).max(50),
        specialization: z.string().max(100).optional(),
        bio: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, ctx.session.user.id),
      });

      if (existing) {
        return ctx.db
          .update(userProfiles)
          .set(input)
          .where(eq(userProfiles.userId, ctx.session.user.id));
      }

      return ctx.db.insert(userProfiles).values({
        ...input,
        userId: ctx.session.user.id,
      });
    }),

  getProfile: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, input.userId),
        with: {
          user: {
            columns: {
              name: true,
              image: true,
            },
          },
        },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }

      return profile;
    }),
});
