CREATE TABLE IF NOT EXISTS "vtsns-cyberpunk_article" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vtsns-cyberpunk_article" ADD CONSTRAINT "vtsns-cyberpunk_article_created_by_vtsns-cyberpunk_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."vtsns-cyberpunk_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
