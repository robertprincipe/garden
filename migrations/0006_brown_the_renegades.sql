ALTER TABLE "interactions" ALTER COLUMN "parent_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "interactions" ALTER COLUMN "content" SET NOT NULL;