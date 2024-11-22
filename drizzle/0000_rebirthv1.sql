CREATE TABLE IF NOT EXISTS "vtsns-cyberpunk_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vtsns-cyberpunk_article" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(1000) NOT NULL,
	"subject" varchar(1000) NOT NULL,
	"href" varchar(1500) NOT NULL,
	"href_title_date" varchar(1500) NOT NULL,
	"content" text NOT NULL,
	"href_links" varchar(1000)[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	"isSpecial_announcement" boolean NOT NULL,
	"has_been_announced_in_discord" boolean DEFAULT false,
	CONSTRAINT "vtsns-cyberpunk_article_href_unique" UNIQUE("href"),
	CONSTRAINT "vtsns-cyberpunk_article_href_title_date_unique" UNIQUE("href_title_date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vtsns-cyberpunk_error_tester" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(1000) NOT NULL,
	CONSTRAINT "vtsns-cyberpunk_error_tester_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vtsns-cyberpunk_job_runs" (
	"runDate" timestamp with time zone PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vtsns-cyberpunk_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vtsns-cyberpunk_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vtsns-cyberpunk_subject" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(1000) NOT NULL,
	CONSTRAINT "vtsns-cyberpunk_subject_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vtsns-cyberpunk_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vtsns-cyberpunk_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "vtsns-cyberpunk_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vtsns-cyberpunk_account" ADD CONSTRAINT "vtsns-cyberpunk_account_user_id_vtsns-cyberpunk_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."vtsns-cyberpunk_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vtsns-cyberpunk_post" ADD CONSTRAINT "vtsns-cyberpunk_post_created_by_vtsns-cyberpunk_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."vtsns-cyberpunk_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vtsns-cyberpunk_session" ADD CONSTRAINT "vtsns-cyberpunk_session_user_id_vtsns-cyberpunk_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."vtsns-cyberpunk_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
