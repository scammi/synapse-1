ALTER TABLE "synapse_brief" DROP CONSTRAINT "synapse_brief_created_by_synapse_user_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "brief_created_by_idx";--> statement-breakpoint
ALTER TABLE "synapse_brief" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "synapse_brief" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "synapse_brief" ADD COLUMN "created_by_id" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "synapse_brief" ADD CONSTRAINT "synapse_brief_created_by_id_synapse_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."synapse_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "brief_created_by_id_idx" ON "synapse_brief" USING btree ("created_by_id");--> statement-breakpoint
ALTER TABLE "synapse_brief" DROP COLUMN IF EXISTS "created_by";