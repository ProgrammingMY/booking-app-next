import { z } from "zod"

export const BusinessDay = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const

export const businessSchema = z.object({
    name: z.string().min(2, {
      message: "Business name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters.",
    }).max(500, {
      message: "Description must not exceed 500 characters."
    }),
    slug: z.string().min(2, {
      message: "Slug must be at least 2 characters."
    }).regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens."
    }),
    timezone: z.string({
      required_error: "Please select a timezone.",
    }),
    operatingDays: z.record(z.string(), z.object({
      isOpen: z.boolean(),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
    })),
  })
  
  export type BusinessFormValues = z.infer<typeof businessSchema>