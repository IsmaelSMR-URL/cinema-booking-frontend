"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

// Sample movie data
const movies = [
  {
    id: 1,
    title: "Interstellar",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Sci-Fi",
    duration: "2h 49m",
  },
  {
    id: 2,
    title: "The Dark Knight",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Action",
    duration: "2h 32m",
  },
  {
    id: 3,
    title: "Inception",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Sci-Fi",
    duration: "2h 28m",
  },
  {
    id: 4,
    title: "Pulp Fiction",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Crime",
    duration: "2h 34m",
  },
  {
    id: 5,
    title: "The Godfather",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Crime",
    duration: "2h 55m",
  },
]

export default function MovieCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)

  const updateVisibleCount = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        setVisibleCount(1)
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2)
      } else {
        setVisibleCount(3)
      }
    }
  }, [])

  useEffect(() => {
    updateVisibleCount()
    window.addEventListener("resize", updateVisibleCount)
    return () => window.removeEventListener("resize", updateVisibleCount)
  }, [updateVisibleCount])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + visibleCount >= movies.length ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? Math.max(0, movies.length - visibleCount) : prevIndex - 1))
  }

  const visibleMovies = movies.slice(currentIndex, currentIndex + visibleCount)

  // If we don't have enough movies to fill the carousel, add from the beginning
  if (visibleMovies.length < visibleCount) {
    visibleMovies.push(...movies.slice(0, visibleCount - visibleMovies.length))
  }

  return (
    <div className="relative">
      <div className="flex justify-between absolute top-1/2 -translate-y-1/2 w-full px-4 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      <div className="flex gap-4 overflow-hidden py-4">
        {visibleMovies.map((movie) => (
          <Card
            key={movie.id}
            className="min-w-[calc(100%/3-1rem)] sm:min-w-[calc(100%/2-1rem)] flex-1 transition-all duration-300 hover:shadow-lg"
          >
            <CardContent className="p-0 relative group">
              <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                <Image
                  src={movie.image || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{movie.title}</h3>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{movie.genre}</span>
                  <span>{movie.duration}</span>
                </div>
                <div className="mt-4">
                  <Link href={`/movies/${movie.id}`}>
                    <Button className="w-full">Book Now</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
