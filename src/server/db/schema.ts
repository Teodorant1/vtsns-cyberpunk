import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `vtsns-cyberpunk_${name}`);

export const jobRuns = createTable("job_runs", {
  runDate: timestamp("runDate", { withTimezone: true }).primaryKey().notNull(),
});

export const error = createTable("error", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  has_been_announced_in_discord: boolean(
    "has_been_announced_in_discord",
  ).default(false),
});

export const article = createTable("article", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 1000 }).notNull(),
  subject: varchar("subject", { length: 1000 }).notNull(),
  href: varchar("href", { length: 1500 }).notNull(),
  href_title_date: varchar("href_title_date", { length: 1500 })
    .notNull()
    .unique(),
  text: text("text").notNull(),
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

// ─────────────────────────────
// POSTS
// ─────────────────────────────
export const posts = createTable("post", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  text: varchar("text", { length: 25600 }).notNull(),

  // createdById: varchar("created_by", { length: 255 })
  //   .notNull()
  //   .references(() => users.id),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  poster: varchar("poster", { length: 255 })
    .notNull()
    .references(() => users.username),
});

// ─────────────────────────────
// POST COMMENTS
// ─────────────────────────────
export const postComments = createTable("post_comment", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),

  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),

  poster: varchar("poster", { length: 255 })
    .notNull()
    .references(() => users.username),
  // createdById: varchar("created_by", { length: 255 })
  //   .notNull()
  //   .references(() => users.id),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

// ─────────────────────────────
// ARTICLE COMMENTS
// ─────────────────────────────
export const articleComments = createTable("article_comment", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  content: text("content").notNull(),

  articleId: uuid("article_id")
    .notNull()
    .references(() => article.id, { onDelete: "cascade" }),
  poster: varchar("poster", { length: 255 })
    .notNull()
    .references(() => users.username),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date())
    .default(sql`CURRENT_TIMESTAMP`),
});

export const subject = createTable("subject", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 1000 }).notNull().unique(),
});

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: varchar("username", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  intelSubmissions: many(intelSubmissions),
}));

export const intelSubmissions = createTable("intel_submission", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  poster: varchar("poster", { length: 255 })
    .notNull()
    .references(() => users.username),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  examDate: timestamp("exam_date", { withTimezone: true }).notNull(),
  difficulty: integer("difficulty").notNull(), // 1-5 scale
  createdById: varchar("created_by", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  verifiedByModerator: boolean("verified_by_moderator").default(false),
});

export const intelSubmissionsRelations = relations(
  intelSubmissions,
  ({ one }) => ({
    author: one(users, {
      fields: [intelSubmissions.poster],
      references: [users.username],
    }),
  }),
);

export const userProfiles = createTable("user_profile", {
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id)
    .primaryKey(),
  handle: varchar("handle", { length: 50 }).notNull().unique(), // Cyberpunk hacker handle
  rank: varchar("rank", { length: 50 }).notNull().default("Rookie"),
  reputation: integer("reputation").notNull().default(0),
  specialization: varchar("specialization", { length: 100 }),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});
export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));
// POSTS RELATIONS
export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.poster],
    references: [users.username],
  }),
  comments: many(postComments),
}));

// ARTICLES RELATIONS
export const articlesRelations = relations(article, ({ many }) => ({
  comments: many(articleComments),
}));

// POST COMMENTS RELATIONS
export const postCommentsRelations = relations(postComments, ({ one }) => ({
  post: one(posts, {
    fields: [postComments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [postComments.poster],
    references: [users.username],
  }),
}));

// ARTICLE COMMENTS RELATIONS
export const articleCommentsRelations = relations(
  articleComments,
  ({ one }) => ({
    article: one(article, {
      fields: [articleComments.articleId],
      references: [article.id],
    }),
    author: one(users, {
      fields: [articleComments.poster],
      references: [users.username],
    }),
  }),
);

export type postComments_type = typeof postComments.$inferSelect;
export type articleComments_type = typeof articleComments.$inferSelect;
