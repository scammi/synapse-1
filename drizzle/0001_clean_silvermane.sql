CREATE TABLE IF NOT EXISTS "synapse_brief" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"skills" text NOT NULL,
	"project_size" varchar(50) NOT NULL,
	"project_duration" varchar(50) NOT NULL,
	"skill_level" varchar(50) NOT NULL,
	"pricing_model" varchar(50) NOT NULL,
	"budget_from" numeric(10, 2) NOT NULL,
	"budget_to" numeric(10, 2) NOT NULL,
	"screening_questions" text NOT NULL,
	"deliverables" text NOT NULL,
	"work_samples" text NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "synapse_brief" ADD CONSTRAINT "synapse_brief_created_by_synapse_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."synapse_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "brief_created_by_idx" ON "synapse_brief" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "brief_title_idx" ON "synapse_brief" USING btree ("title");