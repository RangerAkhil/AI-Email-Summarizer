CREATE TABLE "emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"content_hash" text NOT NULL,
	"summary" text,
	"category" text DEFAULT 'General' NOT NULL,
	"keywords" text[] DEFAULT '{}' NOT NULL,
	"summary_count" integer DEFAULT 0 NOT NULL,
	"last_summarized_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "emails_content_hash_unique" UNIQUE("content_hash")
);
