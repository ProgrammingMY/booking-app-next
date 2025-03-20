import { pgTable, text, timestamp, boolean, integer, jsonb, uuid, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// Enum for business types
export const businessTypeEnum = pgEnum("business_type", [
  "restaurant",
  "salon",
  "clinic",
  "fitness",
  "consultation",
  "other"
]);

// Business table - owned by users
export const business = pgTable("business", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  businessType: businessTypeEnum("business_type").notNull(),
  operatingHours: jsonb("operating_hours").notNull(), // JSON structure for days and hours
  ownerId: text("owner_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// TimeSlot table - created by business owners
export const timeSlot = pgTable("time_slot", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id").notNull().references(() => business.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  duration: integer("duration_minutes").notNull(), // Duration in minutes
  capacity: integer("capacity").notNull().default(1), // How many reservations can be made for this slot
  location: text("location"), // Physical location
  meetingLink: text("meeting_link"), // Online meeting link
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// Reservation status enum
export const reservationStatusEnum = pgEnum("reservation_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed"
]);

// Reservation table - created by customers
export const reservation = pgTable("reservation", {
  id: uuid("id").defaultRandom().primaryKey(),
  timeSlotId: uuid("time_slot_id").notNull().references(() => timeSlot.id, { onDelete: "cascade" }),
  businessId: uuid("business_id").notNull().references(() => business.id), // Direct reference for easier queries
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  notes: text("notes"),
  status: reservationStatusEnum("status").notNull().default("pending"),
  confirmationCode: text("confirmation_code").notNull().unique(),
  userId: text("user_id").references(() => user.id), // Optional: if customer has an account
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// For tracking availability and managing recurring time slots
export const availability = pgTable("availability", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id").notNull().references(() => business.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 for Sunday-Saturday
  startTime: text("start_time").notNull(), // Format: "HH:MM" in 24h
  endTime: text("end_time").notNull(), // Format: "HH:MM" in 24h
  isRecurring: boolean("is_recurring").notNull().default(true),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// For special dates (holidays, special events)
export const specialDate = pgTable("special_date", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id").notNull().references(() => business.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  name: text("name").notNull(),
  isAvailable: boolean("is_available").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});