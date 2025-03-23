ALTER TABLE "special_date" RENAME TO "timezone";--> statement-breakpoint
ALTER TABLE "timezone" DROP CONSTRAINT "special_date_business_id_business_id_fk";
--> statement-breakpoint
ALTER TABLE "availability" ADD COLUMN "timezone_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "timezone" ADD COLUMN "timezone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_timezone_id_timezone_id_fk" FOREIGN KEY ("timezone_id") REFERENCES "public"."timezone"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timezone" ADD CONSTRAINT "timezone_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "business_id_index" ON "availability" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "timezone_id_index" ON "availability" USING btree ("timezone_id");--> statement-breakpoint
CREATE INDEX "timeslot_business_id_index" ON "time_slot" USING btree ("business_id");--> statement-breakpoint
ALTER TABLE "timezone" DROP COLUMN "date";--> statement-breakpoint
ALTER TABLE "timezone" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "timezone" DROP COLUMN "is_available";