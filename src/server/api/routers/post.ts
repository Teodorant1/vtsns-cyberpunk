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
  articleComments,
  postComments,
} from "~/server/db/schema";
import { and, desc, eq, gte, lte, lt, gt, asc } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  list_comments_By_Post: publicProcedure
    .input(
      z.object({
        postID: z.string(),
        limit: z.number().default(50),
        cursor: z.string().nullish(), // forward
        reverseCursor: z.string().nullish(), // backward
      }),
    )
    .query(async ({ ctx, input }) => {
      const { postID, limit, cursor, reverseCursor } = input;
      console.log("list_comments_By_Post postID", input.postID);

      // ============================================================
      // FORWARD PAGINATION (cursor)
      // ============================================================
      if (cursor && !reverseCursor) {
        const items = await ctx.db.query.postComments.findMany({
          where: and(
            eq(postComments.postId, postID),
            lt(postComments.createdAt, new Date(cursor)),
          ),
          orderBy: [desc(postComments.createdAt)],
          limit: limit + 1,
        });

        if (items.length === 0) {
          return { items: [], nextCursor: null, prevCursor: cursor };
        }

        let nextCursor: string | null = null;
        let prevCursor: string | null = null;

        // determine forward cursor
        if (items.length > limit) {
          const extra = items.pop()!;
          nextCursor = extra.createdAt.toISOString();
        }

        // determine backward cursor only if NOT the first page
        if (items.length > 0) {
          prevCursor = items[0]!.createdAt.toISOString();
        }

        return { items, nextCursor, prevCursor };
      }

      // ============================================================
      // BACKWARD PAGINATION (reverseCursor)
      // ============================================================
      if (reverseCursor && !cursor) {
        const raw = await ctx.db.query.postComments.findMany({
          where: and(
            eq(postComments.postId, postID),
            gt(postComments.createdAt, new Date(reverseCursor)),
          ),
          orderBy: [asc(postComments.createdAt)],
          limit: limit + 1,
        });

        if (raw.length === 0) {
          return { items: [], nextCursor: reverseCursor, prevCursor: null };
        }

        let nextCursor: string | null = null;
        let prevCursor: string | null = null;

        // remove boundary overflow
        if (raw.length > limit) {
          const extra = raw.pop()!;
          prevCursor = extra.createdAt.toISOString();
        }

        // newest → oldest
        raw.reverse();

        // next cursor (forward)
        nextCursor = raw[raw.length - 1]!.createdAt.toISOString();

        return { items: raw, nextCursor, prevCursor };
      }

      // ============================================================
      // FIRST PAGE (no cursors)
      // ============================================================
      const items = await ctx.db.query.postComments.findMany({
        where: eq(postComments.postId, postID),
        orderBy: [desc(postComments.createdAt)],
        limit: limit + 1,
      });

      let nextCursor: string | null = null;

      if (items.length > limit) {
        const extra = items.pop()!;
        nextCursor = extra.createdAt.toISOString();
      }

      // VERY IMPORTANT:
      // First page should NEVER have a prevCursor
      const prevCursor: string | null = null;

      return { items, nextCursor, prevCursor };
    }),
  list_comments_By_Article: publicProcedure
    .input(
      z.object({
        articleId: z.string(),
        limit: z.number().default(50),
        cursor: z.string().nullish(), // forward
        reverseCursor: z.string().nullish(), // backward
      }),
    )
    .query(async ({ ctx, input }) => {
      const { articleId, limit, cursor, reverseCursor } = input;

      // ============================================================
      // FORWARD PAGINATION (cursor)
      // ============================================================
      if (cursor && !reverseCursor) {
        const items = await ctx.db.query.articleComments.findMany({
          where: and(
            eq(articleComments.articleId, articleId),
            lt(articleComments.createdAt, new Date(cursor)),
          ),
          orderBy: [desc(articleComments.createdAt)],
          limit: limit + 1,
        });

        if (items.length === 0) {
          return { items: [], nextCursor: null, prevCursor: cursor };
        }

        let nextCursor: string | null = null;
        let prevCursor: string | null = null;

        // determine forward cursor
        if (items.length > limit) {
          const extra = items.pop()!;
          nextCursor = extra.createdAt.toISOString();
        }

        // determine backward cursor only if NOT the first page
        if (items.length > 0) {
          prevCursor = items[0]!.createdAt.toISOString();
        }

        return { items, nextCursor, prevCursor };
      }

      // ============================================================
      // BACKWARD PAGINATION (reverseCursor)
      // ============================================================
      if (reverseCursor && !cursor) {
        const raw = await ctx.db.query.articleComments.findMany({
          where: and(
            eq(articleComments.articleId, articleId),
            gt(articleComments.createdAt, new Date(reverseCursor)),
          ),
          orderBy: [asc(articleComments.createdAt)],
          limit: limit + 1,
        });

        if (raw.length === 0) {
          return { items: [], nextCursor: reverseCursor, prevCursor: null };
        }

        let nextCursor: string | null = null;
        let prevCursor: string | null = null;

        // remove boundary overflow
        if (raw.length > limit) {
          const extra = raw.pop()!;
          prevCursor = extra.createdAt.toISOString();
        }

        // newest → oldest
        raw.reverse();

        // next cursor (forward)
        nextCursor = raw[raw.length - 1]!.createdAt.toISOString();

        return { items: raw, nextCursor, prevCursor };
      }

      // ============================================================
      // FIRST PAGE (no cursors)
      // ============================================================
      const items = await ctx.db.query.articleComments.findMany({
        where: eq(articleComments.articleId, articleId),
        orderBy: [desc(articleComments.createdAt)],
        limit: limit + 1,
      });

      let nextCursor: string | null = null;

      if (items.length > limit) {
        const extra = items.pop()!;
        nextCursor = extra.createdAt.toISOString();
      }

      // VERY IMPORTANT:
      // First page should NEVER have a prevCursor
      const prevCursor: string | null = null;

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
        const username = ctx.session.user.username;
        if (!username) throw new Error("Username not found");

        // // Backend: add 1ms per comment during test insertion
        // const comments = Array.from({ length: 500 }).map((_, i) => ({
        //   articleId: input.articleID,
        //   content: `${input.commentContent} #${i}`,
        //   poster: username,
        //   createdAt: new Date(Date.now() - i * 500), // ensures unique timestamp
        // }));

        // // Bulk insert
        // const inserted_comments = await ctx.db
        //   .insert(articleComments)
        //   .values(comments);
        // await ctx.db
        //   .insert(articleComments)
        //   .values({
        //     articleId: input.articleID,
        //     content: input.commentContent,
        //     poster: ctx.session.user.username,
        //   })
        //   .returning();

        // console.log("Inserted comments length:", inserted_comments.length);
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

        const username = ctx.session.user.username;
        if (!username) throw new Error("Username not found");

        // // Backend: add 1ms per comment during test insertion
        // const comments = Array.from({ length: 500 }).map((_, i) => ({
        //   postId: input.postId,
        //   content: `${input.commentContent} #${i}`,
        //   poster: username,
        //   createdAt: new Date(Date.now() - i * 500), //ensures unique timestamp
        // }));

        // //  Bulk insert
        // const cormac_comments = await ctx.db
        //   .insert(postComments)
        //   .values(comments)
        //   .returning();

        // console.log("Inserted comments length:", cormac_comments.length);

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
