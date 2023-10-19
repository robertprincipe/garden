ALTER TABLE "chapters" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "chapters" RENAME COLUMN "video_url" TO "video";--> statement-breakpoint
ALTER TABLE "course_progress" DROP CONSTRAINT "course_progress_id_unique";--> statement-breakpoint
ALTER TABLE "courses" DROP CONSTRAINT "courses_id_unique";--> statement-breakpoint
ALTER TABLE "interactions" DROP CONSTRAINT "interactions_id_unique";--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_id_unique";--> statement-breakpoint
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_id_unique";--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_id_unique";--> statement-breakpoint
ALTER TABLE "units" DROP CONSTRAINT "units_id_unique";--> statement-breakpoint
ALTER TABLE "categories_courses" ALTER COLUMN "category_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "categories_courses" ALTER COLUMN "course_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "unit_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "video" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "video" SET DEFAULT 'null'::json;--> statement-breakpoint
ALTER TABLE "course_progress" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "course_progress" ALTER COLUMN "chapter_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "interactions" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "interactions" ALTER COLUMN "chapter_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "interactions" ALTER COLUMN "parent_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "purchases" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "purchases" ALTER COLUMN "course_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "course_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "course_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "handle" text NOT NULL;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_handle_unique" UNIQUE("handle");