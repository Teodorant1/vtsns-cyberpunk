ALTER TABLE "vtsns-cyberpunk_article" DROP CONSTRAINT "vtsns-cyberpunk_article_created_by_vtsns-cyberpunk_user_id_fk";
--> statement-breakpoint
ALTER TABLE "vtsns-cyberpunk_article" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "vtsns-cyberpunk_article" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "vtsns-cyberpunk_article" ADD COLUMN "hrefs" jsonb DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "vtsns-cyberpunk_article" DROP COLUMN IF EXISTS "created_by";