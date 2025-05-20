import { Button } from "@/components/ui/button"
import Link from "next/link"
import MovieCarousel from "@/components/movie-carousel"
import FeaturedMovies from "@/components/featured-movies"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Experience Movies Like Never Before
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Book your tickets online and enjoy the latest blockbusters in comfort.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/movies">
                <Button size="lg">Browse Movies</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Now Showing</h2>
          <MovieCarousel />
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Featured Movies</h2>
          <FeaturedMovies />
        </div>
      </section>
    </div>
  )
}
