"use client"

import { useState } from "react"
import { useSession } from "@/lib/auth-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Clock, 
  Settings, 
  Building, 
  Users, 
  PlusCircle 
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Sidebar from "@/components/app-sidebar"

export default function OwnerDashboard() {
  const { data, error, isPending } = useSession()
  const [date, setDate] = useState<Date | undefined>(new Date())

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (isPending) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>Not authenticated</div>
  }

  return (
    <div className="min-h-screen">

      {/* Main content */}
      <div className=" p-6 overflow-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Business
            </Button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reservations">Reservations</TabsTrigger>
              <TabsTrigger value="timeslots">Time Slots</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Total Reservations</CardTitle>
                    <CardDescription>This week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground mt-1">+12% from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Upcoming Today</CardTitle>
                    <CardDescription>Reservations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground mt-1">2 pending confirmation</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Available Slots</CardTitle>
                    <CardDescription>Next 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">42</div>
                    <p className="text-xs text-muted-foreground mt-1">75% capacity</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Upcoming Reservations</CardTitle>
                    <CardDescription>Today's schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center justify-between border-b pb-3">
                            <div className="flex flex-col">
                              <span className="font-medium">John Doe</span>
                              <span className="text-sm text-muted-foreground">10:00 AM - 11:00 AM</span>
                            </div>
                            <Badge variant={i % 3 === 0 ? "outline" : "default"}>
                              {i % 3 === 0 ? "Pending" : "Confirmed"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                    <CardDescription>Select a date to view reservations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Reservations Tab */}
            <TabsContent value="reservations">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Reservations</CardTitle>
                      <CardDescription>Manage your customer reservations</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Filter</Button>
                      <Button size="sm">New Reservation</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 bg-muted p-3 font-medium">
                      <div>Customer</div>
                      <div>Date & Time</div>
                      <div>Service</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>
                    <ScrollArea className="h-[400px]">
                      {Array.from({length: 10}).map((_, i) => (
                        <div key={i} className="grid grid-cols-5 p-3 border-t items-center">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{String.fromCharCode(65 + i % 26)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Customer {i + 1}</div>
                              <div className="text-xs text-muted-foreground">customer{i+1}@example.com</div>
                            </div>
                          </div>
                          <div>
                            <div>May {10 + i}, 2024</div>
                            <div className="text-xs text-muted-foreground">{10 + i}:00 AM - {11 + i}:00 AM</div>
                          </div>
                          <div>Consultation</div>
                          <div>
                            <Badge variant={i % 3 === 0 ? "outline" : i % 3 === 1 ? "default" : "secondary"}>
                              {i % 3 === 0 ? "Pending" : i % 3 === 1 ? "Confirmed" : "Completed"}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Time Slots Tab */}
            <TabsContent value="timeslots">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Time Slots</CardTitle>
                      <CardDescription>Manage your available time slots</CardDescription>
                    </div>
                    <Button>Create Time Slot</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="list" className="w-full">
                    <TabsList>
                      <TabsTrigger value="list">List View</TabsTrigger>
                      <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                    </TabsList>
                    <TabsContent value="list" className="mt-4">
                      <div className="rounded-md border">
                        <div className="grid grid-cols-5 bg-muted p-3 font-medium">
                          <div>Name</div>
                          <div>Date & Time</div>
                          <div>Duration</div>
                          <div>Status</div>
                          <div>Actions</div>
                        </div>
                        <ScrollArea className="h-[400px]">
                          {Array.from({length: 10}).map((_, i) => (
                            <div key={i} className="grid grid-cols-5 p-3 border-t items-center">
                              <div>
                                <div className="font-medium">Morning Slot {i + 1}</div>
                                <div className="text-xs text-muted-foreground">Location: Office {i % 3 + 1}</div>
                              </div>
                              <div>
                                <div>May {10 + i}, 2024</div>
                                <div className="text-xs text-muted-foreground">{9 + i}:00 AM - {10 + i}:00 AM</div>
                              </div>
                              <div>60 minutes</div>
                              <div>
                                <Badge variant={i % 2 === 0 ? "default" : "secondary"}>
                                  {i % 2 === 0 ? "Available" : "Booked"}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">Edit</Button>
                                <Button variant="outline" size="sm">Delete</Button>
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    </TabsContent>
                    <TabsContent value="calendar" className="mt-4">
                      <div className="flex h-[500px] border rounded-md">
                        <div className="w-full p-4 text-center flex items-center justify-center">
                          <div className="text-muted-foreground">
                            Calendar view will be implemented here
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Business Settings</CardTitle>
                    <CardDescription>Manage your business details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Business Name</h3>
                        <p className="text-sm text-muted-foreground">Acme Consulting</p>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium mb-2">Business Type</h3>
                        <p className="text-sm text-muted-foreground">Consultation</p>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium mb-2">Description</h3>
                        <p className="text-sm text-muted-foreground">Professional consulting services for small businesses</p>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium mb-2">Slug</h3>
                        <p className="text-sm text-muted-foreground">acme-consulting</p>
                      </div>
                      <div className="pt-4">
                        <Button>Edit Business</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Operating Hours</CardTitle>
                    <CardDescription>Set your business hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <div key={day} className="flex items-center justify-between">
                          <span className="font-medium">{day}</span>
                          <span className="text-sm">
                            {day === "Saturday" || day === "Sunday" 
                              ? "Closed" 
                              : "9:00 AM - 5:00 PM"}
                          </span>
                        </div>
                      ))}
                      <div className="pt-4">
                        <Button>Edit Hours</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Name</h3>
                          <p className="text-sm text-muted-foreground">{data.user.name}</p>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="text-sm font-medium mb-2">Email</h3>
                          <p className="text-sm text-muted-foreground">{data.user.email}</p>
                        </div>
                        <div className="pt-4">
                          <Button>Edit Profile</Button>
                        </div>
                      </div>
                      <Separator orientation="vertical" className="hidden md:block" />
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Notification Preferences</h3>
                          <p className="text-sm text-muted-foreground">Email notifications enabled</p>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="text-sm font-medium mb-2">Security</h3>
                          <p className="text-sm text-muted-foreground">Last password change: Never</p>
                        </div>
                        <div className="pt-4">
                          <Button variant="outline">Change Password</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}