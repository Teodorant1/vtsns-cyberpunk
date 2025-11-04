import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { userProfiles, users } from "~/server/db/schema";
import bcrypt from "bcryptjs";

export const AuthRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const hashedPassword = await bcrypt.hash(input.password, 10);

        await ctx.db.transaction(async (tx) => {
          const user = await tx
            .insert(users)
            .values({
              username: input.username,
              password: hashedPassword,
              email: input.email,
            })
            .returning();
          if (!user[0]) {
            throw new Error("User registration failed");
          }
          const profile = await tx
            .insert(userProfiles)
            .values({
              userId: user[0].id,
              reputation: 0,
              handle: user[0].username,
              rank: "Net Runner",
            })
            .returning();
          if (!profile[0]) {
            throw new Error("Profile creation failed");
          }
        });

        return { error: false, errorText: null };
      } catch (error) {
        if (error instanceof Error) {
          return { error: true, errorText: error.message };
        }
      }
      return { error: false, errorText: null };
    }),
});
