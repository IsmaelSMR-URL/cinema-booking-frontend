"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { usersApi } from "@/lib/api-services"
import type { User, Reservation } from "@/lib/api-services"
import { getCurrentUser } from "@/app/api/users/authService"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userReservations, setUserReservations] = useState<Reservation[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push("/signin");
          return;
        }

        setUser(user);
        setFormData({
          name: user.name,
          email: user.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Fetch user reservations
        const fetchReservations = async () => {
          try {
            const response = await fetch("/api/reservations");
            const allReservations = await response.json();
            // Filter reservations for current user
            const userReservations = allReservations.filter(
              (reservation: Reservation) => reservation.userId === user.id,
            );
            setUserReservations(userReservations);
          } catch (error) {
            console.error("Error fetching reservations:", error);
          } finally {
            setIsLoading(false);
          }
        };

        fetchReservations();
      } catch (error) {
        console.error("Error checking auth:", error);
        router.push("/signin");
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })

    if (!user) return

    try {
      // Update user profile
      const updatedUser = await usersApi.update(user.id, {
        name: formData.name,
        email: formData.email,
      })

      // Update local storage
      localStorage.setItem("userData", JSON.stringify(updatedUser))
      setUser(updatedUser)

      setMessage({ type: "success", text: "Profile updated successfully" })
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage({ type: "error", text: "Failed to update profile" })
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    if (!user) return

    try {
      // In a real app, you would validate the current password
      // and update the password on the server

      // For demo purposes, just show success message
      setMessage({ type: "success", text: "Password changed successfully" })

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (error) {
      console.error("Error changing password:", error)
      setMessage({ type: "error", text: "Failed to change password" })
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-4"></div>
            <div className="h-64 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="reservations">My Reservations</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileUpdate}>
                  <CardContent className="space-y-4">
                    {message.type && (
                      <div
                        className={`p-3 rounded-md ${
                          message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        }`}
                      >
                        {message.text}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <span className="capitalize">{user?.role}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        {user?.registeredDate ? formatDate(user.registeredDate) : "N/A"}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Save Changes</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordChange}>
                  <CardContent className="space-y-4">
                    {message.type && (
                      <div
                        className={`p-3 rounded-md ${
                          message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        }`}
                      >
                        {message.text}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Change Password</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="reservations">
              <Card>
                <CardHeader>
                  <CardTitle>My Reservations</CardTitle>
                  <CardDescription>View your recent movie reservations</CardDescription>
                </CardHeader>
                <CardContent>
                  {userReservations.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">You don't have any reservations yet.</p>
                      <Button className="mt-4" onClick={() => router.push("/movies")}>
                        Browse Movies
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userReservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="flex flex-col md:flex-row justify-between p-4 border rounded-lg"
                        >
                          <div className="space-y-1">
                            <h3 className="font-medium">{reservation.movieTitle}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(reservation.date)} at {reservation.time}
                            </p>
                            <p className="text-sm">Seats: {reservation.seats.join(", ")}</p>
                          </div>
                          <div className="mt-4 md:mt-0 flex flex-col items-end justify-between">
                            <span className="font-medium">${reservation.totalPrice.toFixed(2)}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/reservations/${reservation.id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
