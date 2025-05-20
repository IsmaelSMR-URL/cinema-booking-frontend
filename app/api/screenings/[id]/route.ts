import { NextResponse } from "next/server"
import type { Screening } from "@/lib/api-services"

// Sample screenings data (in a real app, this would be in a database)
let screenings: Screening[] = [
  {
    id: 1,
    movieId: 1,
    movieTitle: "Interstellar",
    theater: "Theater 1",
    date: "2025-04-28",
    time: "14:30",
    capacity: 120,
    booked: 45,
  },
  {
    id: 2,
    movieId: 1,
    movieTitle: "Interstellar",
    theater: "Theater 1",
    date: "2025-04-28",
    time: "18:00",
    capacity: 120,
    booked: 78,
  },
  {
    id: 3,
    movieId: 1,
    movieTitle: "Interstellar",
    theater: "Theater 1",
    date: "2025-04-28",
    time: "21:30",
    capacity: 120,
    booked: 32,
  },
  {
    id: 4,
    movieId: 2,
    movieTitle: "The Dark Knight",
    theater: "Theater 2",
    date: "2025-04-28",
    time: "15:00",
    capacity: 100,
    booked: 67,
  },
  {
    id: 5,
    movieId: 2,
    movieTitle: "The Dark Knight",
    theater: "Theater 2",
    date: "2025-04-28",
    time: "19:30",
    capacity: 100,
    booked: 89,
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const screening = screenings.find((s) => s.id === id)

  if (!screening) {
    return NextResponse.json({ error: "Screening not found" }, { status: 404 })
  }

  return NextResponse.json(screening)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const updatedData = await request.json()

  const screeningIndex = screenings.findIndex((s) => s.id === id)

  if (screeningIndex === -1) {
    return NextResponse.json({ error: "Screening not found" }, { status: 404 })
  }

  // Update screening data
  screenings[screeningIndex] = { ...screenings[screeningIndex], ...updatedData }

  return NextResponse.json(screenings[screeningIndex])
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  const screeningIndex = screenings.findIndex((s) => s.id === id)

  if (screeningIndex === -1) {
    return NextResponse.json({ error: "Screening not found" }, { status: 404 })
  }

  // Remove screening
  screenings = screenings.filter((s) => s.id !== id)

  return NextResponse.json({ success: true })
}
