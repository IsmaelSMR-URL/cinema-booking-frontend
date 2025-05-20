import { NextResponse } from "next/server"
import type { Reservation } from "@/lib/api-services"

// Sample reservations data (in a real app, this would be in a database)
const reservations: Reservation[] = [
  {
    id: "RES-1234",
    userId: 1,
    userName: "John Doe",
    movieId: 1,
    movieTitle: "Interstellar",
    date: "2025-04-28",
    time: "18:00",
    seats: ["C4", "C5"],
    totalPrice: 25.98,
    status: "confirmed",
    createdAt: "2025-04-20T10:30:00Z",
  },
  {
    id: "RES-5678",
    userId: 2,
    userName: "Jane Smith",
    movieId: 2,
    movieTitle: "The Dark Knight",
    date: "2025-04-28",
    time: "19:30",
    seats: ["D7", "D8", "D9"],
    totalPrice: 38.97,
    status: "confirmed",
    createdAt: "2025-04-21T14:45:00Z",
  },
  {
    id: "RES-9012",
    userId: 3,
    userName: "Robert Johnson",
    movieId: 1,
    movieTitle: "Interstellar",
    date: "2025-04-28",
    time: "14:30",
    seats: ["F3", "F4"],
    totalPrice: 25.98,
    status: "confirmed",
    createdAt: "2025-04-22T09:15:00Z",
  },
  {
    id: "RES-3456",
    userId: 4,
    userName: "Emily Davis",
    movieId: 2,
    movieTitle: "The Dark Knight",
    date: "2025-04-28",
    time: "15:00",
    seats: ["B5", "B6"],
    totalPrice: 25.98,
    status: "confirmed",
    createdAt: "2025-04-23T16:20:00Z",
  },
  {
    id: "RES-7890",
    userId: 5,
    userName: "Michael Wilson",
    movieId: 1,
    movieTitle: "Interstellar",
    date: "2025-04-28",
    time: "21:30",
    seats: ["G8", "G9", "G10"],
    totalPrice: 38.97,
    status: "confirmed",
    createdAt: "2025-04-24T11:10:00Z",
  },
]

export async function GET() {
  return NextResponse.json(reservations)
}

export async function POST(request: Request) {
  const newReservation = await request.json()

  // Generate a reservation ID
  const reservationId = `RES-${Math.floor(Math.random() * 10000)}`
  const createdAt = new Date().toISOString()

  const reservationWithId = {
    ...newReservation,
    id: reservationId,
    createdAt,
    status: "confirmed",
  }

  // Add to our "database"
  reservations.push(reservationWithId)

  return NextResponse.json(reservationWithId, { status: 201 })
}
