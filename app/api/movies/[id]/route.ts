import { NextResponse } from "next/server"
import type { Movie } from "@/lib/api-services"

// Sample movies data (in a real app, this would be in a database)
let movies: Movie[] = [
  {
    id: 1,
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Sci-Fi",
    duration: "2h 49m",
    releaseDate: "2025-01-10",
    status: "showing",
  },
  {
    id: 2,
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Action",
    duration: "2h 32m",
    releaseDate: "2025-02-15",
    status: "showing",
  },
  {
    id: 3,
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Sci-Fi",
    duration: "2h 28m",
    releaseDate: "2025-03-01",
    status: "showing",
  },
  {
    id: 4,
    title: "Pulp Fiction",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Crime",
    duration: "2h 34m",
    releaseDate: "2025-03-20",
    status: "upcoming",
  },
  {
    id: 5,
    title: "The Godfather",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Crime",
    duration: "2h 55m",
    releaseDate: "2025-04-05",
    status: "upcoming",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const movie = movies.find((m) => m.id === id)

  if (!movie) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 })
  }

  return NextResponse.json(movie)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const updatedData = await request.json()

  const movieIndex = movies.findIndex((m) => m.id === id)

  if (movieIndex === -1) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 })
  }

  // Update movie data
  movies[movieIndex] = { ...movies[movieIndex], ...updatedData }

  return NextResponse.json(movies[movieIndex])
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  const movieIndex = movies.findIndex((m) => m.id === id)

  if (movieIndex === -1) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 })
  }

  // Remove movie
  movies = movies.filter((m) => m.id !== id)

  return NextResponse.json({ success: true })
}
