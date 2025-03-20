import { pgTable, text, timestamp, boolean, integer, jsonb, uuid, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { business, reservationStatusEnum } from "./schema";
export const vehicleTypeEnum = pgEnum("vehicle_type", [
    "car",
    "motorcycle",
    "bicycle",
    "scooter",
    "van",
    "truck",
    "other"
  ]);
  
  // Vehicle table - owned by businesses
  export const vehicle = pgTable("vehicle", {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id").notNull().references(() => business.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    vehicleType: vehicleTypeEnum("vehicle_type").notNull(),
    model: text("model"),
    year: integer("year"),
    licensePlate: text("license_plate"),
    color: text("color"),
    features: jsonb("features"), // JSON array of features
    hourlyRate: integer("hourly_rate"), // Rate in cents/pence
    dailyRate: integer("daily_rate"), // Rate in cents/pence
    weeklyRate: integer("weekly_rate"), // Rate in cents/pence
    securityDeposit: integer("security_deposit"), // Amount in cents/pence
    images: jsonb("images"), // JSON array of image URLs
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  });
  
  // VehicleReservation table - for vehicle rentals
  export const vehicleReservation = pgTable("vehicle_reservation", {
    id: uuid("id").defaultRandom().primaryKey(),
    vehicleId: uuid("vehicle_id").notNull().references(() => vehicle.id, { onDelete: "cascade" }),
    businessId: uuid("business_id").notNull().references(() => business.id),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: text("customer_phone"),
    driverLicense: text("driver_license"),
    pickupLocation: text("pickup_location"),
    returnLocation: text("return_location"),
    totalAmount: integer("total_amount").notNull(), // Amount in cents/pence
    notes: text("notes"),
    status: reservationStatusEnum("status").notNull().default("pending"),
    confirmationCode: text("confirmation_code").notNull().unique(),
    userId: text("user_id").references(() => user.id), // Optional: if customer has an account
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  });
  
  // Vehicle maintenance records
  export const vehicleMaintenance = pgTable("vehicle_maintenance", {
    id: uuid("id").defaultRandom().primaryKey(),
    vehicleId: uuid("vehicle_id").notNull().references(() => vehicle.id, { onDelete: "cascade" }),
    maintenanceType: text("maintenance_type").notNull(),
    description: text("description").notNull(),
    performedAt: timestamp("performed_at").notNull(),
    cost: integer("cost"), // Amount in cents/pence
    notes: text("notes"),
    nextMaintenanceDue: timestamp("next_maintenance_due"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  });