import { postRouter } from "~/server/api/routers/post";
import { intelRouter } from "~/server/api/routers/intel";
import { AuthRouter } from "./routers/auth";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  intel: intelRouter,
  auth: AuthRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
