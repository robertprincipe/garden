ALTER TABLE "categories" DROP CONSTRAINT "categories_id_unique";--> statement-breakpoint
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_id_unique";--> statement-breakpoint
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_handle_unique";--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "unit_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "course_progress" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "course_progress" ALTER COLUMN "chapter_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "interactions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "interactions" ALTER COLUMN "chapter_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "interactions" ALTER COLUMN "parent_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "purchases" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "purchases" ALTER COLUMN "course_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "course_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "course_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "provider" SET DEFAULT 'credentials';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "provider" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password" text DEFAULT ':)';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chapters" ADD CONSTRAINT "chapters_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interactions" ADD CONSTRAINT "interactions_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interactions" ADD CONSTRAINT "interactions_parent_id_interactions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "interactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchases" ADD CONSTRAINT "purchases_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "units" ADD CONSTRAINT "units_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
