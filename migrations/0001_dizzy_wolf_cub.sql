DO $$ BEGIN
 CREATE TYPE "interaction_type" AS ENUM('comment', 'question', 'contribution');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "notification_type" AS ENUM('interaction', 'purchase', 'mention');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"handle" text NOT NULL,
	"image" text,
	"description" text,
	CONSTRAINT "categories_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories_courses" (
	"category_id" text NOT NULL,
	"course_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chapters" (
	"id" text PRIMARY KEY NOT NULL,
	"unit_id" text NOT NULL,
	"name" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"summary" text,
	"video_url" text,
	"length" numeric(10, 2) DEFAULT '0' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "chapters_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"chapter_id" text NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	CONSTRAINT "course_progress_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"handle" text NOT NULL,
	"excerpt" text,
	"thumbnail" text,
	"description" text,
	"keywords" text,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"compare_at_price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"prerequisites" json DEFAULT 'null'::json,
	"goals" json DEFAULT 'null'::json,
	"sold" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	CONSTRAINT "courses_id_unique" UNIQUE("id"),
	CONSTRAINT "courses_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interactions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"chapter_id" text NOT NULL,
	"parent_id" text NOT NULL,
	"interaction_type" "interaction_type" DEFAULT 'comment' NOT NULL,
	"content" text,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "interactions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"notification_type" "notification_type" DEFAULT 'interaction' NOT NULL,
	"content" text,
	"read" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "notifications_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "purchases" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"course_id" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	CONSTRAINT "purchases_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"course_id" text NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"content" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	CONSTRAINT "reviews_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "units" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"title" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "units_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "handle_idx" ON "categories" ("handle");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_idx" ON "courses" ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "handle_idx" ON "courses" ("handle");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stores" ADD CONSTRAINT "stores_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo" ADD CONSTRAINT "todo_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courses" ADD CONSTRAINT "courses_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interactions" ADD CONSTRAINT "interactions_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchases" ADD CONSTRAINT "purchases_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
