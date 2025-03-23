import { pgTable, text, timestamp, boolean, integer, uuid, pgEnum, index, json } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";
import { BusinessOperatingHours } from "@/types/business";

// Business table - owned by users
export const business = pgTable("business", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  timezone: text("timezone").notNull(),
  operatingHours: json("operating_hours").$type<BusinessOperatingHours>().notNull(), // JSON structure for days and hours
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
  duration: integer("duration_minutes").notNull(), // Duration in minutes
  capacity: integer("capacity").notNull().default(1), // How many reservations can be made for this slot
  location: text("location"), // Physical location
  meetingLink: text("meeting_link"), // Online meeting link
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
}, (table) => ([
  index("timeslot_business_id_index").on(table.businessId)
]));

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
  timezoneId: uuid("timezone_id").notNull().references(() => timezone.id, { onDelete: "cascade" }),
  businessId: uuid("business_id").notNull().references(() => business.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 for Sunday-Saturday
  startTime: text("start_time").notNull(), // Format: "HH:MM" in 24h
  endTime: text("end_time").notNull(), // Format: "HH:MM" in 24h
  isRecurring: boolean("is_recurring").notNull().default(true),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
}, (table) => ([
  index("business_id_index").on(table.businessId),
  index("timezone_id_index").on(table.timezoneId)
]));

export const availabilityRelations = relations(availability, ({ one }) => ({
  timezone: one(timezone, {
    fields: [availability.timezoneId],
    references: [timezone.id]
  })
}));

export const timezone = pgTable("timezone", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id").notNull().references(() => business.id, { onDelete: "cascade" }),
  timezone: text("timezone").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const timezoneRelations = relations(timezone, ({ many }) => ({
  availabilities: many(availability)
}));