"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import type { Movie } from "@/lib/api-services"

interface MovieDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movie: Movie | null
  mode: "create" | "edit" | "view"
  onSave: (movie: Partial<Movie>) => void
}

export default function MovieDialog({ open, onOpenChange, movie, mode, onSave }: MovieDialogProps) {
  const [formData, setFormData] = useState<Partial<Movie>>({
    title: "",
    description: "",
    image: "/placeholder.svg?height=500&width=300",
    genre: "",
    duration: "",
    releaseDate: "",
    status: "upcoming",
  })

  // Reset form when movie changes
  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        description: movie.description,
        image: movie.image,
        genre: movie.genre,
        duration: movie.duration,
        releaseDate: movie.releaseDate,
        status: movie.status,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        image: "/placeholder.svg?height=500&width=300",
        genre: "",
        duration: "",
        releaseDate: "",
        status: "upcoming",
      })
    }
  }, [movie, open])

  const handleChange = (field: keyof Movie, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const isViewMode = mode === "view"
  const title = mode === "create" ? "Add Movie" : mode === "edit" ? "Edit Movie" : "Movie Details"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-[1fr_2fr] gap-6">
            <div className="space-y-4">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md border">
                <Image
                  src={formData.image || "/placeholder.svg"}
                  alt={formData.title || "Movie poster"}
                  fill
                  className="object-cover"
                />
              </div>

              {!isViewMode && (
                <div>
                  <Label htmlFor="image" className="mb-2 block">
                    Image URL
                  </Label>
                  <Input
                    id="image"
                    value={formData.image || ""}
                    onChange={(e) => handleChange("image", e.target.value)}
                    disabled={isViewMode}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="mb-2 block">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleChange("title", e.target.value)}
                  disabled={isViewMode}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="min-h-[100px]"
                  disabled={isViewMode}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genre" className="mb-2 block">
                    Genre
                  </Label>
                  <Input
                    id="genre"
                    value={formData.genre || ""}
                    onChange={(e) => handleChange("genre", e.target.value)}
                    disabled={isViewMode}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="duration" className="mb-2 block">
                    Duration
                  </Label>
                  <Input
                    id="duration"
                    value={formData.duration || ""}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    placeholder="e.g. 2h 30m"
                    disabled={isViewMode}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="releaseDate" className="mb-2 block">
                    Release Date
                  </Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={formData.releaseDate || ""}
                    onChange={(e) => handleChange("releaseDate", e.target.value)}
                    disabled={isViewMode}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="status" className="mb-2 block">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                    disabled={isViewMode}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="showing">Showing</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
