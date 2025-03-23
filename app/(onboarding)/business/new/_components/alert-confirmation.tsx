import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BusinessFormValues } from "@/types/business"
import { UseFormReturn } from "react-hook-form"
import { Loader2 } from "lucide-react"


export default function AlertConfirmation({
    showConfirmDialog,
    setShowConfirmDialog,
    form,
    onSubmit,
    isSubmitting,
}: {
    showConfirmDialog: boolean,
    setShowConfirmDialog: (showConfirmDialog: boolean) => void,
    form: UseFormReturn<BusinessFormValues>,
    onSubmit: (data: BusinessFormValues) => void,
    isSubmitting: boolean,
}) {
    return (
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Business Creation</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to create your business profile with the information provided?
                        This will make your business available for customers to book appointments.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => form.handleSubmit(onSubmit)()}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Business"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}