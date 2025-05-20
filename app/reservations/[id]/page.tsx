import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Film, MapPin, Ticket, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
    qrCode: "/placeholder.svg?height=200&width=200",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
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
    qrCode: "/placeholder.svg?height=200&width=200",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
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
    qrCode: "/placeholder.svg?height=200&width=200",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
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

export default function ReservationDetailsPage({ params }: { params: { id: string } }) {
  const reservation = reservations.find((res) => res.id === params.id)

  if (!reservation) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Reservation Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The reservation you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/reservations">
          <Button>Back to Reservations</Button>
        </Link>
      </div>
    )
  }

  const isPast = reservation.status === "past"

  return (
    <div className="container py-8 md:py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Reservation Details</h1>
        <Link href="/reservations">
          <Button variant="outline">Back to Reservations</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-[2fr_1fr] gap-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-40 aspect-[2/3]">
                <Image
                  src={reservation.movieImage || "/placeholder.svg"}
                  alt={reservation.movieTitle}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold">{reservation.movieTitle}</h2>
                <p className="text-sm text-muted-foreground mt-1">Reservation ID: {reservation.id}</p>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{reservation.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{reservation.customerEmail}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between">
                  <span className="font-medium">Total Paid</span>
                  <span className="font-bold">${reservation.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-4">Ticket QR Code</h3>
            <div className="mx-auto w-48 h-48 relative mb-4">
              <Image
                src={reservation.qrCode || "/placeholder.svg"}
                alt="Ticket QR Code"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Present this QR code at the cinema entrance for admission.
            </p>

            {!isPast && (
              <div className="space-y-3">
                <Button className="w-full">Download Ticket</Button>
                <Button variant="outline" className="w-full">
                  Email Ticket
                </Button>
              </div>
            )}

            {isPast && (
              <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
                <Ticket className="h-5 w-5 mx-auto mb-2" />
                <p>This reservation has expired.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
