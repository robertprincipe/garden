ALTER TABLE "chapters" ADD COLUMN "active" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "units" ADD COLUMN "active" boolean DEFAULT false NOT NULL;