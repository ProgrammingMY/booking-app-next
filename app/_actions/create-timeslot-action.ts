"use server"

import { db } from "@/db/drizzle"
import { TimeSlotFormValues, timeSlotFormSchema } from "@/types/timeslot"
import { business, timeSlot } from "@/db/schema"
import { authenticateUser } from "@/lib/authenticateUser"

import "server-only"
import { eq } from "drizzle-orm"

export async function createTimeSlot(unsafeData: TimeSlotFormValues) {
    const { user } = await authenticateUser();

    // check if the user owns the business
    const businessOwned = await db.query.business.findFirst({
        where: eq(business.ownerId, user.id)
    })

    if (!businessOwned) {
        return { error: "You do not own any business" }
    }

    const { success, data } = timeSlotFormSchema.safeParse(unsafeData)

    if (!success) {
        return { error: "Invalid data" }
    }



    // create the time slot
    const newTimeSlot = await db.insert(timeSlot).values({
        name: data.name,
        businessId: businessOwned.id,
        description: data.description,
        duration: data.durationInMinutes,
        capacity: data.capacity,
        isActive: data.isActive,
    })
}
