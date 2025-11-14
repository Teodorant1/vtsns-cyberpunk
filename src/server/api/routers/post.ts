import { z } from "zod";
import { addDays } from "date-fns";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  article,
  jobRuns,
  posts,
  articleComments,
  postComments,
} from "~/server/db/schema";
import { and, desc, eq, gte, lte, lt, gt, asc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  listByArticle: publicProcedure
    .input(
      z.object({
        articleId: z.string(),
        limit: z.number().default(50),
        cursor: z.string().nullish(), // forward pagination
        reverseCursor: z.string().nullish(), // backward pagination
      }),
    )
    .query(async ({ ctx, input }) => {
      const { articleId, limit, cursor, reverseCursor } = input;

      // ----------------------------
      // FORWARD PAGINATION (next page)
      // ----------------------------
      if (cursor && !reverseCursor) {
        const items = await ctx.db.query.articleComments.findMany({
          where: and(
            eq(articleComments.articleId, articleId),
            lt(articleComments.createdAt, new Date(cursor)),
          ),
          orderBy: [desc(articleComments.createdAt)],
          limit: limit + 1,
        });

        let nextCursor: string | null = null;
        let prevCursor: string | null = null;

        // determine forward cursor
        if (items.length > limit) {
          const nextItem = items.pop()!;
          nextCursor = nextItem.createdAt.toISOString();
        }

        // determine backward cursor (previous page)
        if (items.length > 0) {
          const prevItem = items[0];
          if (!prevItem) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Previous item not found",
            });
          }
          prevCursor = prevItem.createdAt.toISOString();
        }

        return { items, nextCursor, prevCursor };
      }

      // ----------------------------
      // BACKWARD PAGINATION (previous page)
      // ----------------------------
      if (reverseCursor && !cursor) {
        const items = await ctx.db.query.articleComments.findMany({
          where: and(
            eq(articleComments.articleId, articleId),
            gt(articleComments.createdAt, new Date(reverseCursor)),
          ),
          orderBy: [asc(articleComments.createdAt)], // reverse order first
          limit: limit + 1,
        });

        let nextCursor: string | null = null;
        let prevCursor: string | null = null;

        if (items.length > limit) {
          const lastExtra = items.pop()!;
          prevCursor = lastExtra.createdAt.toISOString();
        }

        // flip list back to newest → oldest order
        items.reverse();

        // forward cursor from newest item
        if (items.length > 0) {
          if (!items?.[items.length - 1]) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Last item not found",
            });
          }
          const lastItem = items[items.length - 1]!;
          nextCursor = lastItem.createdAt.toISOString();
        }

        return { items, nextCursor, prevCursor };
      }

      // ----------------------------
      // FIRST PAGE (no cursors)
      // ----------------------------
      const items = await ctx.db.query.articleComments.findMany({
        where: eq(articleComments.articleId, articleId),
        orderBy: [desc(articleComments.createdAt)],
        limit: limit + 1,
      });

      let nextCursor: string | null = null;
      let prevCursor: string | null = null;

      if (items.length > limit) {
        const nextItem = items.pop()!;
        nextCursor = nextItem.createdAt.toISOString();
      }

      if (items.length > 0) {
        const prevItem = items[0];
        if (!prevItem) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Previous item not found",
          });
        }
        prevCursor = prevItem.createdAt.toISOString();
      }

      return { items, nextCursor, prevCursor };
    }),

  create_comment_article: protectedProcedure
    .input(
      z.object({
        articleID: z.string().min(1),
        commentContent: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // if (1 > 0) {
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "Simulated TRPCerror for testing purposes",
      //   });
      // }
      // if (1 > 0) {
      //   throw new Error("Simulated regular error for testing purposes");
      // }

      try {
        if (
          !ctx.session.user.username ||
          typeof ctx.session.user.username !== "string"
        ) {
          throw new Error("Username not a string");
        }
        // const username = ctx.session.user.username;
        // if (!username) throw new Error("Username not found");

        // // Backend: add 1ms per comment during test insertion
        // const comments = Array.from({ length: 500 }).map((_, i) => ({
        //   articleId: input.articleID,
        //   content: `${input.commentContent} #${i}`,
        //   poster: username,
        //   createdAt: new Date(Date.now() - i * 500), // ensures unique timestamp
        // }));

        // // Bulk insert
        // await ctx.db.insert(articleComments).values(comments);
        await ctx.db.insert(articleComments).values({
          articleId: input.articleID,
          content: input.commentContent,
          poster: ctx.session.user.username,
        });
        return { error: false, errorText: null };
      } catch (error) {
        if (error instanceof Error) {
          return { error: true, errorText: error.message };
        }
      }
      return { error: false, errorText: null };
    }),
  create_comment_post: protectedProcedure
    .input(
      z.object({
        postId: z.string().min(1),
        commentContent: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // if (1 > 0) {
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "Simulated TRPCerror for testing purposes",
      //   });
      // }
      // if (1 > 0) {
      //   throw new Error("Simulated regular error for testing purposes");
      // }

      try {
        if (
          !ctx.session.user.username ||
          typeof ctx.session.user.username !== "string"
        ) {
          throw new Error("Username not a string");
        }
        await ctx.db.insert(postComments).values({
          postId: input.postId,
          content: input.commentContent,
          poster: ctx.session.user.username,
        });
        return { error: false, errorText: null };
      } catch (error) {
        if (error instanceof Error) {
          return { error: true, errorText: error.message };
        }
      }
      return { error: false, errorText: null };
    }),

  getLatest_articles: publicProcedure
    .input(
      z.object({
        subject: z.string(),
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const input_to = input.to ? addDays(input.to, 1) : undefined;

      const latestArticles = await ctx.db.query.article.findMany({
        where: and(
          input.subject && input.subject !== "All"
            ? eq(article.subject, input.subject)
            : undefined,
          input.from ? gte(article.createdAt, input.from) : undefined,
          input_to ? lte(article.createdAt, input_to) : undefined,
        ),
        orderBy: [desc(article.createdAt)],
        limit: 50,
        with: {
          comments: {
            orderBy: [desc(articleComments.createdAt)],
            limit: 50,
          },
        },
      });

      return latestArticles;
    }),
  getSubjects: publicProcedure.query(async ({ ctx }) => {
    console.log("getting subjects");

    const subjects = await ctx.db.query.subject.findMany({});

    const subjects_with_all = [{ name: "All", id: -1 }, ...subjects];

    return subjects_with_all ?? [];
  }),

  get_latest_date_of_Cronjob: publicProcedure.query(async ({ ctx }) => {
    console.log("getting dates");

    const currentDate = new Date();

    const latestRun = await ctx.db.query.jobRuns.findFirst({
      orderBy: [desc(jobRuns.runDate)],
    });

    return {
      currentDate: currentDate,
      latestRun: latestRun,
    };
  }),

  // test_web_scraper: protectedProcedure.mutation(async ({ ctx, input }) => {
  //   const value0 = await scrape_vtsns_CRONJOB();
  //   return value0;
  // }),

  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // await ctx.db.insert(posts).values({
      //   name: input.name,
      //   createdById: ctx.session.user.id,
      // });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
