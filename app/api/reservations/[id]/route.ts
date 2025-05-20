import { NextResponse } from "next/server"
import type { Reservation } from "@/lib/api-services"

// Sample reservations data (in a real app, this would be in a database)
let reservations: Reservation[] = [
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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const reservation = reservations.find((r) => r.id === id)

  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
  }

  return NextResponse.json(reservation)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const updatedData = await request.json()

  const reservationIndex = reservations.findIndex((r) => r.id === id)

  if (reservationIndex === -1) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
  }

  // Update reservation data
  reservations[reservationIndex] = { ...reservations[reservationIndex], ...updatedData }

  return NextResponse.json(reservations[reservationIndex])
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  const reservationIndex = reservations.findIndex((r) => r.id === id)

  if (reservationIndex === -1) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
  }

  // Remove reservation
  reservations = reservations.filter((r) => r.id !== id)

  return NextResponse.json({ success: true })
}
