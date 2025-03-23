import { FormControl, FormField, FormLabel } from "@/components/ui/form";
import { FormDescription } from "@/components/ui/form";
import { FormMessage } from "@/components/ui/form";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";
import { FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BusinessFormValues } from "@/types/business";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .trim()
}

export default function BasicInfoForm({
    form,
    watchName,
    setIsSlugAvailable,
    isSlugAvailable
}: {
    form: UseFormReturn<BusinessFormValues>,
    watchName: string,
    setIsSlugAvailable: (isSlugAvailable: boolean | null) => void,
    isSlugAvailable: boolean | null
}) {
    const [isCheckingSlug, setIsCheckingSlug] = useState(false)
    const watchSlug = form.watch("slug")
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
    const DEBOUNCE_DELAY = 500 // 500ms debounce delay

    const checkSlugAvailability = async (slug: string) => {
        // Don't check empty slugs
        if (!slug || slug.trim() === '') {
            setIsSlugAvailable(null)
            return
        }

        setIsCheckingSlug(true)
        try {
            const response = await fetch(`/api/business/check-slug?slug=${slug}`)
            const data = await response.json()
            setIsSlugAvailable(data.isAvailable)
        } catch (error) {
            console.error("Error checking slug availability:", error)
            setIsSlugAvailable(null)
        } finally {
            setIsCheckingSlug(false)
        }
    }

    // Debounced slug check when user types
    useEffect(() => {
        if (watchSlug) {
            // Clear any existing timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }

            // Set checking state immediately to show loading indicator
            setIsCheckingSlug(true)

            // Create a new timer
            debounceTimerRef.current = setTimeout(() => {
                checkSlugAvailability(watchSlug)
            }, DEBOUNCE_DELAY)

            // Cleanup function
            return () => {
                if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current)
                }
            }
        } else {
            setIsSlugAvailable(null)
        }
    }, [watchSlug])

    // Update slug when business name changes
    useEffect(() => {
        if (watchName) {
            // Generate a slug from the name
            const generatedSlug = slugify(watchName)

            // Only update the slug if it's empty or if it was previously auto-generated
            // This prevents overwriting user's custom slugs
            const currentSlug = form.getValues("slug") || ""

            // Check if we should update the slug value
            // We update if:
            // 1. The slug is empty, OR
            // 2. The current slug appears to be auto-generated from a previous name
            if (!currentSlug || (currentSlug !== generatedSlug &&
                slugify(watchName.substring(0, watchName.length - 1)).includes(currentSlug))) {
                // Set the new slug value
                form.setValue("slug", generatedSlug, { shouldDirty: true })

                // Use debounced check for auto-generated slug
                if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current)
                }

                setIsCheckingSlug(true)
                debounceTimerRef.current = setTimeout(() => {
                    checkSlugAvailability(generatedSlug)
                }, DEBOUNCE_DELAY)
            }
        }
    }, [watchName, form])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                    Start with the essentials about your business.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Acme Consulting" {...field} />
                            </FormControl>
                            <FormDescription>
                                Your business name as it will appear to customers.
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
                                    placeholder="Professional consulting services for small businesses..."
                                    className="min-h-32"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Provide a brief description of your business and services.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL Slug</FormLabel>
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <div className="relative w-full">
                                        <Input placeholder="acme-consulting" {...field} />
                                        {isCheckingSlug && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                {!isCheckingSlug && isSlugAvailable !== null && (
                                    <div className={`text-sm ${isSlugAvailable ? 'text-green-500' : 'text-red-500'}`}>
                                        {isSlugAvailable ? '✓ Available' : '✗ Taken'}
                                    </div>
                                )}
                            </div>
                            <FormDescription>
                                This will be your unique URL: tempahdulu.my/{watchSlug || 'your-slug'}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}