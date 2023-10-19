ALTER TABLE "courses" ALTER COLUMN "thumbnail" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "thumbnail" SET DEFAULT 'null'::json;