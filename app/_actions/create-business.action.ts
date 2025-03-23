"use server"

import "server-only"

import { authenticateUser } from "@/lib/authenticateUser"
import { BusinessFormValues, businessSchema } from "@/types/business";
import { db } from "@/db/drizzle";
import { business } from "@/db/schema";

export async function createBusiness(unsafeData: BusinessFormValues) {
    try {
        const { user } = await authenticateUser();

        if (!user) {
            return { error: "User not found" }
        }

        const { success, data } = businessSchema.safeParse(unsafeData)

        if (!success) {
            return { error: "Invalid data" }
        }

        await db.insert(business).values({
            ...data,
            ownerId: user.id,
            operatingHours: data.operatingDays,
        })

        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: "Failed to create business" }
    }
}