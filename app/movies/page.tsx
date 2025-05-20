import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

// Sample movies data with showtimes
const movies = [
  {
    id: 1,
    title: "Interstellar",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Sci-Fi",
    duration: "2h 49m",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
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
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    showtimes: [
      { id: 6, date: "2025-04-28", time: "13:00" },
      { id: 7, date: "2025-04-28", time: "16:30" },
      { id: 8, date: "2025-04-28", time: "20:00" },
      { id: 9, date: "2025-04-29", time: "14:30" },
      { id: 10, date: "2025-04-29", time: "18:00" },
    ],
  },
  {
    id: 3,
    title: "Inception",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Sci-Fi",
    duration: "2h 28m",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    showtimes: [
      { id: 11, date: "2025-04-28", time: "15:00" },
      { id: 12, date: "2025-04-28", time: "19:00" },
      { id: 13, date: "2025-04-29", time: "16:30" },
      { id: 14, date: "2025-04-29", time: "20:30" },
    ],
  },
  {
    id: 4,
    title: "Pulp Fiction",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Crime",
    duration: "2h 34m",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    showtimes: [
      { id: 15, date: "2025-04-28", time: "14:00" },
      { id: 16, date: "2025-04-28", time: "17:30" },
      { id: 17, date: "2025-04-29", time: "15:30" },
      { id: 18, date: "2025-04-29", time: "19:00" },
    ],
  },
  {
    id: 5,
    title: "The Godfather",
    image: "/placeholder.svg?height=500&width=300",
    genre: "Crime",
    duration: "2h 55m",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    showtimes: [
      { id: 19, date: "2025-04-28", time: "16:00" },
      { id: 20, date: "2025-04-28", time: "20:30" },
      { id: 21, date: "2025-04-29", time: "17:00" },
      { id: 22, date: "2025-04-29", time: "21:00" },
    ],
  },
]

// Format date to display as "Mon, Apr 28"
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

export default function MoviesPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Now Showing</h1>

      <div className="grid gap-8">
        {movies.map((movie) => (
          <Card key={movie.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-[300px_1fr] gap-6">
                <div className="relative aspect-[2/3] md:aspect-auto">
                  <Image src={movie.image || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold">{movie.title}</h2>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-1 mb-4">
                    <span>{movie.genre}</span>
                    <span>{movie.duration}</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{movie.description}</p>

                  <h3 className="font-semibold mb-3">Showtimes</h3>
                  <div className="grid gap-4">
                    {/* Group showtimes by date */}
                    {Array.from(new Set(movie.showtimes.map((st) => st.date))).map((date) => (
                      <div key={date} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(date)}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {movie.showtimes
                            .filter((st) => st.date === date)
                            .map((showtime) => (
                              <Link key={showtime.id} href={`/movies/${movie.id}/book?showtimeId=${showtime.id}`}>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {showtime.time}
                                </Button>
                              </Link>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
