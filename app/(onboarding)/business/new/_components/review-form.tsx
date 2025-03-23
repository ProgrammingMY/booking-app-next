import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BusinessFormValues } from "@/types/business";
import { AlertTriangle } from "lucide-react";

export default function ReviewForm({
    formValues,
    daysList,
}: {
    formValues: BusinessFormValues,
    daysList: { id: string, label: string }[],
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Confirmation</CardTitle>
                <CardDescription>
                    Review your business information before creating your profile.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium mb-2">Basic Information</h3>
                        <Separator className="mb-4" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                            <p>{formValues.name}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm font-medium text-muted-foreground">URL</p>
                            <p>tempahdulu.my/{formValues.slug}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p className="whitespace-pre-line">{formValues.description}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium mb-2">Business Hours</h3>
                        <Separator className="mb-4" />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Timezone</p>
                        <p>{formValues.timezone}</p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Operating Hours</p>
                        <div className="space-y-2">
                            {daysList.map(day => {
                                const dayData = formValues.operatingDays[day.id];
                                return (
                                    <div key={day.id} className="flex justify-between py-1 border-b border-dashed last:border-b-0">
                                        <span className="font-medium">{day.label}</span>
                                        <span>
                                            {dayData.isOpen
                                                ? `${dayData.openTime} - ${dayData.closeTime}`
                                                : "Closed"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-muted">
                    <div className="flex items-start gap-3">
                        <div className="text-amber-500 mt-0.5">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">Please review your information</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                Verify all details are correct before submitting. You can go back to make changes if needed.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}