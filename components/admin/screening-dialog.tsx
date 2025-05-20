"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Screening, Movie } from "@/lib/api-services"

interface ScreeningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  screening: Screening | null
  mode: "create" | "edit" | "view"
  movies: Movie[]
  onSave: (screening: Partial<Screening>) => void
}

export default function ScreeningDialog({ open, onOpenChange, screening, mode, movies, onSave }: ScreeningDialogProps) {
  const [formData, setFormData] = useState<Partial<Screening>>({
    movieId: 0,
    movieTitle: "",
    theater: "",
    date: "",
    time: "",
    capacity: 100,
    booked: 0,
  })

  // Reset form when screening changes
  useEffect(() => {
    if (screening) {
      setFormData({
        movieId: screening.movieId,
        movieTitle: screening.movieTitle,
        theater: screening.theater,
        date: screening.date,
        time: screening.time,
        capacity: screening.capacity,
        booked: screening.booked,
      })
    } else {
      setFormData({
        movieId: movies.length > 0 ? movies[0].id : 0,
        movieTitle: movies.length > 0 ? movies[0].title : "",
        theater: "Theater 1",
        date: "",
        time: "",
        capacity: 100,
        booked: 0,
      })
    }
  }, [screening, movies, open])

  const handleChange = (field: keyof Screening, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMovieChange = (movieId: number) => {
    const selectedMovie = movies.find((m) => m.id === movieId)
    if (selectedMovie) {
      setFormData((prev) => ({
        ...prev,
        movieId,
        movieTitle: selectedMovie.title,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const isViewMode = mode === "view"
  const title = mode === "create" ? "Add Screening" : mode === "edit" ? "Edit Screening" : "Screening Details"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="movie" className="mb-2 block">
                Movie
              </Label>
              <Select
                value={formData.movieId?.toString()}
                onValueChange={(value) => handleMovieChange(Number.parseInt(value))}
                disabled={isViewMode}
              >
                <SelectTrigger id="movie">
                  <SelectValue placeholder="Select movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id.toString()}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="theater" className="mb-2 block">
                Theater
              </Label>
              <Select
                value={formData.theater}
                onValueChange={(value) => handleChange("theater", value)}
                disabled={isViewMode}
              >
                <SelectTrigger id="theater">
                  <SelectValue placeholder="Select theater" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Theater 1">Theater 1</SelectItem>
                  <SelectItem value="Theater 2">Theater 2</SelectItem>
                  <SelectItem value="Theater 3">Theater 3</SelectItem>
                  <SelectItem value="Theater 4">Theater 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="mb-2 block">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) => handleChange("date", e.target.value)}
                  disabled={isViewMode}
                  required
                />
              </div>

              <div>
                <Label htmlFor="time" className="mb-2 block">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time || ""}
                  onChange={(e) => handleChange("time", e.target.value)}
                  disabled={isViewMode}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity" className="mb-2 block">
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity || ""}
                  onChange={(e) => handleChange("capacity", Number.parseInt(e.target.value))}
                  disabled={isViewMode}
                  required
                />
              </div>

              <div>
                <Label htmlFor="booked" className="mb-2 block">
                  Booked Seats
                </Label>
                <Input
                  id="booked"
                  type="number"
                  min="0"
                  max={formData.capacity}
                  value={formData.booked || ""}
                  onChange={(e) => handleChange("booked", Number.parseInt(e.target.value))}
                  disabled={isViewMode}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            {!isViewMode && <Button type="submit">{mode === "create" ? "Create" : "Save Changes"}</Button>}
            {isViewMode && (
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
