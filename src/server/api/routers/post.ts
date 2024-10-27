import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
import {
  scrape_vtsns_article,
  scrape_Predmeti_info,
  scrape_vtsns_CRONJOB,
} from "~/utilities/random-functions";

export const postRouter = createTRPCRouter({
  test_web_scraper: publicProcedure.mutation(async ({ ctx, input }) => {
    const value0 = await scrape_vtsns_CRONJOB();
    // const value1 = await scrape_Predmeti_info();
    // const value2 = await scrape_vtsns_article(
    //   "https://vtsns.edu.rs/predmeti-info/prof-petra-balaban-otkazivanje-nastave/",
    // );

    // await ctx.db.insert(posts).values({
    //   name: input.name,
    //   createdById: ctx.session.user.id,
    // });
    return value0;
    // return { value1, value2 };
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
