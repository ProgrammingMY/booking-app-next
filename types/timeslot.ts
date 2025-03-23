import { z } from "zod"

// Define the form schema with Zod
export const timeSlotFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    durationInMinutes: z.coerce.number().min(5, {
        message: "Duration must be at least 5 minutes.",
    }).max(480, {
        message: "Duration must be at most 8 hours (480 minutes)."
    }),
    capacity: z.coerce.number().min(1, {
        message: "Capacity must be at least 1.",
    }),
    isActive: z.boolean().default(true),
})

// Infer TypeScript type from the schema
export type TimeSlotFormValues = z.infer<typeof timeSlotFormSchema>