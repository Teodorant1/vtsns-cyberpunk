import { z } from "zod";
import { addDays } from "date-fns";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
import { scrape_vtsns_CRONJOB } from "~/utilities/random-functions";

export const postRouter = createTRPCRouter({
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
        const input_to = addDays(input.to, 2);
        console.log("getting latest articles");

        if (input.subject !== "All") {
          {
            const latestArticles2 = await ctx.db.query.article.findMany({
              where: (articles, { eq, gte, lte }) =>
                eq(articles.subject, input.subject) &&
                gte(articles.createdAt, input.from!) &&
                lte(articles.createdAt, input_to),
              orderBy: (articles, { desc }) => [desc(articles.createdAt)],
              limit: 50,
            });

            return latestArticles2;
          }
        } else if (input.subject === "All") {
          const latestArticles3 = await ctx.db.query.article.findMany({
            where: (articles, { eq, gte, lte }) =>
              eq(articles.subject, input.subject) &&
              gte(articles.createdAt, input.from!) &&
              lte(articles.createdAt, input_to),
            orderBy: (articles, { desc }) => [desc(articles.createdAt)],
            limit: 50,
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

  test_web_scraper: protectedProcedure.mutation(async ({ ctx, input }) => {
    const value0 = await scrape_vtsns_CRONJOB();
    return value0;
  }),

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
      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
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
