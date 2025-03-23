"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { timeSlotFormSchema, TimeSlotFormValues } from "@/types/timeslot"



// Default values for the form
const defaultValues: Partial<TimeSlotFormValues> = {
    name: "",
    description: "",
    durationInMinutes: 60,
    capacity: 1,
    isActive: true,
}

export default function TimeSlotForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Initialize the form
    const form = useForm<TimeSlotFormValues>({
        resolver: zodResolver(timeSlotFormSchema),
        defaultValues,
    })

    // Handle form submission
    async function onSubmit(data: TimeSlotFormValues) {
        setIsSubmitting(true)
        try {
            // Here you would typically send the data to your API
            console.log(data)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast.success(`Successfully created "${data.name}" time slot.`)

            // Reset the form
            form.reset(defaultValues)
        } catch (error) {
            toast.error("Could not create time slot. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Morning Consultation" {...field} />
                            </FormControl>
                            <FormDescription>
                                A descriptive name for this time slot.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Early morning slot for quick consultations"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Optional details about this time slot.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="durationInMinutes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration (minutes)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormDescription>
                                    How long the time slot will last.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Capacity</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Maximum number of reservations allowed.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Visibility Status</FormLabel>
                                <FormDescription>
                                    When active, customers can view and book this time slot.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Time Slot"}
                </Button>
            </form>
        </Form>
    )
}