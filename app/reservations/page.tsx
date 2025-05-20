"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Film, MapPin, Ticket } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Sample reservations data
const reservations = [
  {
    id: "RES-1234",
    movieId: 1,
    movieTitle: "Interstellar",
    movieImage: "/placeholder.svg?height=500&width=300",
    date: "2025-04-28",
    time: "18:00",
    seats: ["C4", "C5"],
    theater: "Theater 3",
    totalPrice: 25.98,
    status: "upcoming",
  },
  {
    id: "RES-5678",
    movieId: 2,
    movieTitle: "The Dark Knight",
    movieImage: "/placeholder.svg?height=500&width=300",
    date: "2025-04-30",
    time: "20:00",
    seats: ["D7", "D8", "D9"],
    theater: "Theater 1",
    totalPrice: 38.97,
    status: "upcoming",
  },
  {
    id: "RES-9012",
    movieId: 3,
    movieTitle: "Inception",
    movieImage: "/placeholder.svg?height=500&width=300",
    date: "2025-03-15",
    time: "19:00",
    seats: ["F3", "F4"],
    theater: "Theater 2",
    totalPrice: 25.98,
    status: "past",
  },
]

// Format date
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const filteredReservations = reservations.filter((res) => res.status === activeTab)

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">My Reservations</h1>

      <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <div className="text-center py-12">
              <Ticket className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No upcoming reservations</h3>
              <p className="text-muted-foreground mt-2">You don't have any upcoming movie reservations.</p>
              <Link href="/movies">
                <Button className="mt-6">Browse Movies</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <div className="text-center py-12">
              <Ticket className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No past reservations</h3>
              <p className="text-muted-foreground mt-2">You don't have any past movie reservations.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ReservationCardProps {
  reservation: (typeof reservations)[0]
}

function ReservationCard({ reservation }: ReservationCardProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid md:grid-cols-[200px_1fr] gap-6">
          <div className="relative aspect-[2/3] md:aspect-auto">
            <Image
              src={reservation.movieImage || "/placeholder.svg"}
              alt={reservation.movieTitle}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{reservation.movieTitle}</h2>
                <p className="text-sm text-muted-foreground">Reservation ID: {reservation.id}</p>
              </div>
              <Link href={`/reservations/${reservation.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(reservation.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{reservation.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{reservation.theater}</span>
              </div>
              <div className="flex items-center gap-2">
                <Film className="h-4 w-4 text-muted-foreground" />
                <span>Seats: {reservation.seats.join(", ")}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between">
                <span className="font-medium">Total Paid</span>
                <span className="font-bold">${reservation.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
