import { z } from "zod";
import { addDays } from "date-fns";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { article, jobRuns, posts, articleComments } from "~/server/db/schema";
import { and, desc, gte, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  create_comment: protectedProcedure
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

  getLatest_articles: publicProcedure
    .input(
      z.object({
        subject: z.string(),
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.from && input.to) {
        const input_to = addDays(input.to, 1);
        console.log("getting latest articles");

        if (input.subject !== "All") {
          {
            const latestArticles2 = await ctx.db.query.article.findMany({
              where: and(
                gte(article.createdAt, input.from),
                lte(article.createdAt, input_to),
              ),
              orderBy: (articles, { desc }) => [desc(articles.createdAt)],
              limit: 50,
              with: {
                comments: {
                  orderBy: (comments, { desc }) => [desc(comments.createdAt)],
                },
              },
            });

            return latestArticles2;
          }
        } else if (input.subject === "All") {
          const latestArticles3 = await ctx.db.query.article.findMany({
            where: and(
              gte(article.createdAt, input.from),
              lte(article.createdAt, input_to),
            ),

            orderBy: (articles, { desc }) => [desc(articles.createdAt)],
            limit: 50,
            with: {
              comments: {
                orderBy: (comments, { desc }) => [desc(comments.createdAt)],
              },
            },
          });
          return latestArticles3;
        }
      }
      return [];
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
