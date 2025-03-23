"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"

import { toast } from "sonner"
import { Loader2, Building, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { businessSchema } from "@/types/business"
import { BusinessFormValues } from "@/types/business"
import BasicInfoForm from "./_components/basic-info-form"
import BusinessHoursForm from "./_components/business-hours.form"
import AlertConfirmation from "./_components/alert-confirmation"
import ReviewForm from "./_components/review-form"
import { createBusiness } from "@/app/_actions/create-business.action"

const DAYS_LIST = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
]

type StepProps = {
    step: number;
    currentStep: number;
    title: string;
    description?: string;
}

function StepIndicator({ step, currentStep, title, description }: StepProps) {
    const isActive = currentStep === step;
    const isCompleted = currentStep > step;

    return (
        <div className="flex items-start gap-3">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${isActive
                ? "border-primary bg-primary text-primary-foreground"
                : isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/20 text-muted-foreground"
                }`}>
                {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                ) : (
                    <span>{step}</span>
                )}
            </div>
            <div className="space-y-1">
                <p className={`text-sm font-medium ${isActive || isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                    {title}
                </p>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>
        </div>
    );
}

export default function BusinessNewPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    // Initialize operating days
    const initialOperatingDays: Record<string, { isOpen: boolean, openTime?: string, closeTime?: string }> = {}
    const [daysList, setDaysList] = useState<{ id: string, label: string }[]>(
        DAYS_LIST.map(day => {
            initialOperatingDays[day.id] = {
                isOpen: day.id !== "saturday" && day.id !== "sunday",
                openTime: "09:00",
                closeTime: "17:00"
            }
            return day
        })
    )

    const form = useForm<BusinessFormValues>({
        resolver: zodResolver(businessSchema),
        defaultValues: {
            name: "",
            description: "",
            slug: "",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Default to user's timezone
            operatingDays: initialOperatingDays,
        },
        mode: "onChange",
    })

    const watchName = form.watch("name")
    const formValues = form.watch()

    async function onSubmit(data: BusinessFormValues) {
        if (!isSlugAvailable) {
            toast.error("This slug is already taken. Please choose another one.")
            return
        }

        setIsSubmitting(true)
        try {
            // Here you would send the data to your API
            const { error } = await createBusiness(data)

            if (error) {
                toast.error(error)
                return
            }

            toast.success("Your business profile has been created successfully!")

            // Redirect to dashboard
            router.push("/dashboard")
        } catch (error) {
            console.error("Error creating business:", error)
            toast.error("Could not create business. Please try again.")
        } finally {
            setIsSubmitting(false)
            setShowConfirmDialog(false)
        }
    }

    const handleSubmitClick = () => {
        setShowConfirmDialog(true)
    }

    const nextStep = async () => {
        if (currentStep === 1) {
            // Validate fields in step 1
            const result = await form.trigger(['name', 'description', 'slug'])
            if (!result) return

            if (!isSlugAvailable) {
                toast.error("Please choose an available slug before proceeding.")
                return
            }

            setCurrentStep(2)
        } else if (currentStep === 2) {
            // Validate fields in step 2
            const result = await form.trigger(['timezone', 'operatingDays'])
            if (!result) return

            setCurrentStep(3)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BasicInfoForm
                        watchName={watchName}
                        isSlugAvailable={isSlugAvailable}
                        setIsSlugAvailable={setIsSlugAvailable}
                        form={form} />
                )
            case 2:
                return (
                    <BusinessHoursForm daysList={daysList} setDaysList={setDaysList} form={form} />
                )
            case 3:
                return (
                    <ReviewForm
                        formValues={formValues}
                        daysList={daysList}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="container mx-auto max-w-2xl py-10 px-2">
            <div className="mb-8 text-center">
                <Building className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h1 className="text-3xl font-bold">Create Your Business Profile</h1>
                <p className="text-muted-foreground mt-2">
                    Tell us about your business to get started with online scheduling.
                </p>
            </div>

            <div className="mb-8">
                <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                    <StepIndicator
                        step={1}
                        currentStep={currentStep}
                        title="Basic Information"
                        description="Enter your business details"
                    />
                    <div className="hidden h-0.5 w-16 self-center bg-muted md:block" />
                    <StepIndicator
                        step={2}
                        currentStep={currentStep}
                        title="Business Hours"
                        description="Set your availability"
                    />
                    <div className="hidden h-0.5 w-16 self-center bg-muted md:block" />
                    <StepIndicator
                        step={3}
                        currentStep={currentStep}
                        title="Confirmation"
                        description="Review and submit"
                    />
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {renderStepContent()}

                    <div className="flex justify-between gap-4">
                        {currentStep > 1 ? (
                            <Button variant="outline" type="button" onClick={prevStep}>
                                Back
                            </Button>
                        ) : (
                            <Button variant="outline" type="button" onClick={() => router.push('/dashboard')}>
                                Cancel
                            </Button>
                        )}

                        {currentStep < 3 ? (
                            <Button type="button" onClick={nextStep}>
                                Continue
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleSubmitClick}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Business"
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            <AlertConfirmation
                showConfirmDialog={showConfirmDialog}
                setShowConfirmDialog={setShowConfirmDialog}
                form={form}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    )
}