import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username?: string | null;
      can_create_AI_decks?: boolean | null;
      role?: "user" | "admin" | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string | null;
    can_create_AI_decks?: boolean | null;
    role?: "user" | "admin" | null;
  }
}

type UserRole = "user" | "admin";

type AuthUser = {
  id: string;
  email: string;
  username?: string | null;
  image?: string | null;
  can_create_AI_decks?: boolean | null;
  role?: UserRole;
};

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  callbacks: {
    // Persist custom fields to the token on sign in
    jwt: async ({ token, user: maybeUser }) => {
      const user = maybeUser as unknown as AuthUser | undefined;
      console.log("JWT callback invoked. Token:", token, "User:", user);
      if (user) {
        // user comes from authorize result
        token.id = user.id;
        token.username = user.username ?? null;
        token.can_create_AI_decks = user.can_create_AI_decks ?? null;
        token.role = user.role ?? "user";
      }
      return token;
    },
    // Make the fields available in the session on the client
    session: async ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id!,
        username: token.username ?? undefined,
        can_create_AI_decks: token.can_create_AI_decks ?? undefined,
        role: token.role ?? "user",
      },
    }),
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Find user in actual_users table
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (!user) return null;

        // Compare password using bcrypt
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        // Return a minimal user object. Fields returned here will be available
        // on `user` during sign in and can be persisted to the JWT.
        const role = user.role as UserRole;
        const result: AuthUser = {
          id: user.id,
          email: user.email,
          username: user.username,
          image: user.image,
          role: role ?? "user", // Default to "user" if no role is set
        };

        console.log("Successful authorization RESULT for user:", result);
        return result;
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
