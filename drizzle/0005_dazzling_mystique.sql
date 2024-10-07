CREATE TABLE IF NOT EXISTS "synapse_briefs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"target_audience" varchar(256),
	"budget" integer,
	"deadline" date,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DROP TABLE "synapse_brief";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_title_idx" ON "synapse_briefs" USING btree ("title");