CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"category" text NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
