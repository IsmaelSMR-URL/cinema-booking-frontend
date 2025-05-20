"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Reservation } from "@/lib/api-services"

interface ReservationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reservation: Reservation | null
  mode: "create" | "edit" | "view"
  onSave: (reservation: Partial<Reservation>) => void
}

export default function ReservationDialog({ open, onOpenChange, reservation, mode, onSave }: ReservationDialogProps) {
  const [formData, setFormData] = useState<Partial<Reservation>>({
    status: "confirmed",
  })

  // Reset form when reservation changes
  useEffect(() => {
    if (reservation) {
      setFormData({
        userId: reservation.userId,
        userName: reservation.userName,
        movieId: reservation.movieId,
        movieTitle: reservation.movieTitle,
        date: reservation.date,
        time: reservation.time,
        seats: reservation.seats,
        totalPrice: reservation.totalPrice,
        status: reservation.status,
        createdAt: reservation.createdAt,
      })
    } else {
      setFormData({
        status: "confirmed",
      })
    }
  }, [reservation, open])

  const handleChange = (field: keyof Reservation, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const isViewMode = mode === "view"
  const title = "Reservation Details"

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id" className="text-right">
                Reservation ID
              </Label>
              <Input id="id" value={reservation?.id || ""} className="col-span-3" disabled />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userName" className="text-right">
                Customer
              </Label>
              <Input id="userName" value={formData.userName || ""} className="col-span-3" disabled />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="movieTitle" className="text-right">
                Movie
              </Label>
              <Input id="movieTitle" value={formData.movieTitle || ""} className="col-span-3" disabled />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input id="date" value={formatDate(formData.date)} className="col-span-3" disabled />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input id="time" value={formData.time || ""} className="col-span-3" disabled />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="seats" className="text-right">
                Seats
              </Label>
              <Input id="seats" value={formData.seats?.join(", ") || ""} className="col-span-3" disabled />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalPrice" className="text-right">
                Total Price
              </Label>
              <Input
                id="totalPrice"
                value={formData.totalPrice ? `$${formData.totalPrice.toFixed(2)}` : ""}
                className="col-span-3"
                disabled
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                {isViewMode ? (
                  <Input id="status" value={formData.status || ""} disabled />
                ) : (
                  <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="createdAt" className="text-right">
                Created At
              </Label>
              <Input
                id="createdAt"
                value={formData.createdAt ? new Date(formData.createdAt).toLocaleString() : ""}
                className="col-span-3"
                disabled
              />
            </div>
          </div>

          <DialogFooter>
            {!isViewMode && <Button type="submit">Save Changes</Button>}
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
