CREATE TYPE "public"."import_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "product_imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_path" varchar(500) NOT NULL,
	"status" "import_status" DEFAULT 'pending' NOT NULL,
	"total_records" integer,
	"processed_records" integer DEFAULT 0,
	"error_message" varchar(1000),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
