ALTER TABLE "vtsns-cyberpunk_article_href" RENAME TO "vtsns-cyberpunk_subject";--> statement-breakpoint
ALTER TABLE "vtsns-cyberpunk_subject" DROP CONSTRAINT "vtsns-cyberpunk_article_href_name_unique";--> statement-breakpoint
ALTER TABLE "vtsns-cyberpunk_subject" ADD CONSTRAINT "vtsns-cyberpunk_subject_name_unique" UNIQUE("name");