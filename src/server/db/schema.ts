import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `vtsns-cyberpunk_${name}`);

export const jobRuns = createTable("job_runs", {
  runDate: timestamp("runDate", { withTimezone: true }).primaryKey().notNull(),
});

export const article = createTable("article", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 1000 }).notNull(),
  subject: varchar("subject", { length: 1000 }).notNull(),
  href: varchar("href", { length: 1500 }).notNull().unique(),
  href_title_date: varchar("href_title_date", { length: 1500 })
    .notNull()
    .unique(),
  text: text("content").notNull(),
  href_links: varchar("href_links", { length: 1000 })
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  isSpecial_announcement: boolean("isSpecial_announcement").notNull(),
  has_been_announced_in_discord: boolean(
    "has_been_announced_in_discord",
  ).default(false),
});
export type article_type = typeof article.$inferSelect;

export const subject = createTable("subject", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 1000 }).notNull().unique(),
});

export const error_tester = createTable("error_tester", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 1000 }).notNull().unique(),
});

export const posts = createTable("post", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  createdById: varchar("created_by", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable("account", {
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  type: varchar("type", { length: 255 })
    .$type<AdapterAccount["type"]>()
    .notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", {
    length: 255,
  }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
});

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable("session", {
  sessionToken: varchar("session_token", { length: 255 })
    .notNull()
    .primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  expires: timestamp("expires", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
