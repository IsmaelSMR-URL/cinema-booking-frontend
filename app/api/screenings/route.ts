import { NextResponse } from "next/server"
import type { Screening } from "@/lib/api-services"

// Sample screenings data (in a real app, this would be in a database)
const screenings: Screening[] = [
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

export async function GET() {
  return NextResponse.json(screenings)
}

export async function POST(request: Request) {
  const newScreening = await request.json()

  // Generate a new ID (in a real app, the database would handle this)
  const maxId = screenings.reduce((max, screening) => (screening.id > max ? screening.id : max), 0)
  const screeningWithId = { ...newScreening, id: maxId + 1 }

  // Add to our "database"
  screenings.push(screeningWithId)

  return NextResponse.json(screeningWithId, { status: 201 })
}
