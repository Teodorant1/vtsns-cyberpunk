CREATE TABLE IF NOT EXISTS "vtsns-cyberpunk_error_tester" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(1000) NOT NULL,
	CONSTRAINT "vtsns-cyberpunk_error_tester_name_unique" UNIQUE("name")
);
