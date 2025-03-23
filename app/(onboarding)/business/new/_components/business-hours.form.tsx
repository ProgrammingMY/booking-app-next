import { FormControl, FormField, FormLabel } from "@/components/ui/form";
import { FormDescription } from "@/components/ui/form";
import { FormMessage } from "@/components/ui/form";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { BusinessFormValues } from "@/types/business";
import { UseFormReturn } from "react-hook-form";

// List of common timezones
const timezones = [
    "America/New_York", // Eastern Time
    "America/Chicago", // Central Time
    "America/Denver", // Mountain Time
    "America/Los_Angeles", // Pacific Time
    "America/Anchorage", // Alaska Time
    "America/Honolulu", // Hawaii Time
    "America/Toronto", // Eastern Time - Toronto
    "Europe/London", // Greenwich Mean Time
    "Europe/Paris", // Central European Time
    "Europe/Berlin", // Central European Time
    "Asia/Tokyo", // Japan Time
    "Asia/Shanghai", // China Time
    "Asia/Singapore", // Singapore Time
    "Australia/Sydney", // Australian Eastern Time
    "Pacific/Auckland", // New Zealand Time
]


export default function BusinessHoursForm({
    daysList,
    setDaysList,
    form
}: {
    daysList: { id: string, label: string }[],
    setDaysList: (daysList: { id: string, label: string }[]) => void,
    form: UseFormReturn<BusinessFormValues>
}) {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>
                    Set your operating hours and timezone.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Timezone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a timezone" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {timezones.map((timezone) => (
                                        <SelectItem key={timezone} value={timezone}>
                                            {timezone.replace('_', ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                All scheduled appointments will be shown in this timezone.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium mb-2">Operating Hours</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Set your regular business hours for each day of the week.
                        </p>
                    </div>

                    {daysList.map((day) => (
                        <div key={day.id} className="rounded-lg border p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{day.label}</h4>
                                <FormField
                                    control={form.control}
                                    name={`operatingDays.${day.id}.isOpen`}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm font-normal">
                                                {field.value ? "Open" : "Closed"}
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {form.watch(`operatingDays.${day.id}.isOpen`) && (
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <FormField
                                        control={form.control}
                                        name={`operatingDays.${day.id}.openTime`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Open Time</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`operatingDays.${day.id}.closeTime`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Close Time</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}