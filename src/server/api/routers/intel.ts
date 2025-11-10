import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { posts, userProfiles } from "~/server/db/schema";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const intelRouter = createTRPCRouter({
  submitIntel: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        content: z.string().min(1),
        subject: z.string().min(1),
        link: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.username) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const subjects = await ctx.db.query.subject.findMany({});

      const subjectExists = subjects.some((s) => s.name === input.subject);

      if (subjectExists !== true) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Subject does not exist",
        });
      }

      await ctx.db.insert(posts).values({
        name: input.name,
        text: input.content,
        subject: input.subject,
        poster: ctx.session.user.username,
        link: input.link,
      });
    }),

  getLatestIntel: publicProcedure
    .input(
      z.object({
        subject: z.string(),
        from: z.date().optional(),
        to: z.date().optional(),
        limit: z.number().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const intel_posts = await ctx.db.query.posts.findMany({
        where: and(
          input.subject && input.subject !== "All"
            ? eq(posts.subject, input.subject)
            : undefined,
          input.from ? gte(posts.createdAt, input.from) : undefined,
          input.to ? lte(posts.createdAt, input.to) : undefined,
        ),
        orderBy: [desc(posts.createdAt)],
        limit: input.limit,
      });

      return intel_posts;
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
              username: true,
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
