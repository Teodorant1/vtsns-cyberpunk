import { postRouter } from "~/server/api/routers/post";
import { intelRouter } from "~/server/api/routers/intel";
import { adminRouter } from "~/server/api/routers/admin";
import { AuthRouter } from "./routers/auth";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  intel: intelRouter,
  admin: adminRouter,
  auth: AuthRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
