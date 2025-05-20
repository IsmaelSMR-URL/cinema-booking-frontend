import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

// Sample featured movies
const featuredMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    genre: "Sci-Fi",
    duration: "2h 46m",
  },
  {
    id: 2,
    title: "Oppenheimer",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    genre: "Drama",
    duration: "3h 0m",
  },
  {
    id: 3,
    title: "Gladiator II",
    image: "/placeholder.svg?height=400&width=600",
    description: "The sequel to the Academy Award-winning 'Gladiator' continues the story in ancient Rome.",
    genre: "Action",
    duration: "2h 30m",
  },
]

export default function FeaturedMovies() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featuredMovies.map((movie) => (
        <Card key={movie.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video">
              <Image src={movie.image || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold">{movie.title}</h3>
              <div className="flex justify-between text-sm text-muted-foreground mt-1 mb-2">
                <span>{movie.genre}</span>
                <span>{movie.duration}</span>
              </div>
              <p className="text-muted-foreground line-clamp-3 mb-4">{movie.description}</p>
              <Link href={`/movies/${movie.id}`}>
                <Button className="w-full">Book Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
