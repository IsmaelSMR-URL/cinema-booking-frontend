"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Check, Info } from "lucide-react"
import SeatSelection from "@/components/seat-selection"
import PaymentForm from "@/components/payment-form"

// Sample movie data
const movies = [
  {
    id: 1,
    title: "Interstellar",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Sci-Fi",
    duration: "2h 49m",
    price: 12.99,
    showtimes: [
      { id: 1, date: "2025-04-28", time: "14:30" },
      { id: 2, date: "2025-04-28", time: "18:00" },
      { id: 3, date: "2025-04-28", time: "21:30" },
      { id: 4, date: "2025-04-29", time: "15:00" },
      { id: 5, date: "2025-04-29", time: "19:30" },
    ],
  },
  {
    id: 2,
    title: "The Dark Knight",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Action",
    duration: "2h 32m",
    price: 12.99,
    showtimes: [
      { id: 6, date: "2025-04-28", time: "13:00" },
      { id: 7, date: "2025-04-28", time: "16:30" },
      { id: 8, date: "2025-04-28", time: "20:00" },
      { id: 9, date: "2025-04-29", time: "14:30" },
      { id: 10, date: "2025-04-29", time: "18:00" },
    ],
  },
]

// Booking steps
const STEPS = {
  SEATS: 0,
  PAYMENT: 1,
  CONFIRMATION: 2,
}

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showtimeId = searchParams.get("showtimeId")

  const [step, setStep] = useState(STEPS.SEATS)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [reservationId, setReservationId] = useState<string | null>(null)

  // Find movie and showtime
  const movieId = Number.parseInt(params.id)
  const movie = movies.find((m) => m.id === movieId)

  if (!movie) {
    return <div className="container py-12 text-center">Movie not found</div>
  }

  const showtime = movie.showtimes.find((s) => s.id === Number.parseInt(showtimeId || "0"))

  if (!showtime) {
    return <div className="container py-12 text-center">Showtime not found</div>
  }

  // Format date
  const formattedDate = new Date(showtime.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Calculate total price
  const totalPrice = selectedSeats.length * movie.price

  // Handle seat selection
  const handleSeatSelection = (seats: string[]) => {
    setSelectedSeats(seats)
  }

  // Handle payment submission
  const handlePaymentSubmit = () => {
    // In a real app, this would process the payment and create a reservation
    // For demo purposes, we'll just generate a random reservation ID
    const newReservationId = `RES-${Math.floor(Math.random() * 10000)}`
    setReservationId(newReservationId)
    setStep(STEPS.CONFIRMATION)
  }

  // Handle view reservation
  const handleViewReservation = () => {
    if (reservationId) {
      router.push(`/reservations/${reservationId}`)
    }
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-[2fr_1fr] gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-6">Book Tickets</h1>

          {step === STEPS.SEATS && (
            <div className="space-y-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Select your seats from the seating chart below</span>
              </div>

              <SeatSelection onSelectSeats={handleSeatSelection} />

              <div className="flex justify-end">
                <Button onClick={() => setStep(STEPS.PAYMENT)} disabled={selectedSeats.length === 0}>
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === STEPS.PAYMENT && (
            <div className="space-y-8">
              <PaymentForm onSubmit={handlePaymentSubmit} />

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(STEPS.SEATS)}>
                  Back to Seats
                </Button>
                <Button onClick={handlePaymentSubmit}>Complete Purchase</Button>
              </div>
            </div>
          )}

          {step === STEPS.CONFIRMATION && (
            <div className="space-y-6 text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
              <p className="text-muted-foreground">
                Your reservation has been confirmed. Your reservation ID is{" "}
                <span className="font-medium">{reservationId}</span>.
              </p>

              <Button onClick={handleViewReservation} className="mt-4">
                View Reservation
              </Button>
            </div>
          )}
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="relative w-24 h-36 flex-shrink-0">
                  <Image
                    src={movie.image || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{movie.title}</h2>
                  <div className="text-sm text-muted-foreground mt-1">
                    <p>
                      {movie.genre} • {movie.duration}
                    </p>
                    <p className="mt-2">{formattedDate}</p>
                    <p>{showtime.time}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Selected Seats</span>
                  <span>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per Ticket</span>
                  <span>${movie.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-4">
              <div className="text-sm text-muted-foreground">
                <p>Tickets are non-refundable after purchase.</p>
                <p>Please arrive 15 minutes before showtime.</p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
