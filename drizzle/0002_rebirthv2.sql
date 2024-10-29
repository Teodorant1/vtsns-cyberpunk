ALTER TABLE "vtsns-cyberpunk_article" ADD COLUMN "href_links" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "vtsns-cyberpunk_article" DROP COLUMN IF EXISTS "hrefs";