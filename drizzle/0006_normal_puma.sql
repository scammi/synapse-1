ALTER TABLE "synapse_briefs" ADD COLUMN "created_by" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "synapse_briefs" ADD CONSTRAINT "synapse_briefs_created_by_synapse_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."synapse_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
