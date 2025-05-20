"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Define seat layout
const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
const seatsPerRow = 12

// Pre-booked seats (would come from a database in a real app)
const bookedSeats = ["A3", "A4", "B5", "B6", "C7", "C8", "D1", "D2", "E9", "E10", "F11", "F12", "G3", "G4", "H7", "H8"]

interface SeatSelectionProps {
  onSelectSeats: (seats: string[]) => void
}

export default function SeatSelection({ onSelectSeats }: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const toggleSeat = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      const newSelected = selectedSeats.filter((s) => s !== seat)
      setSelectedSeats(newSelected)
      onSelectSeats(newSelected)
    } else {
      const newSelected = [...selectedSeats, seat]
      setSelectedSeats(newSelected)
      onSelectSeats(newSelected)
    }
  }

  const isSeatBooked = (seat: string) => bookedSeats.includes(seat)
  const isSeatSelected = (seat: string) => selectedSeats.includes(seat)

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center">
        <div className="w-3/4 h-8 bg-gray-300 rounded-t-3xl mb-8 flex items-center justify-center text-sm text-gray-600 font-medium">
          Screen
        </div>

        <div className="grid gap-4">
          {rows.map((row) => (
            <div key={row} className="flex items-center gap-2">
              <div className="w-6 text-center font-medium">{row}</div>
              <div className="flex gap-2">
                {Array.from({ length: seatsPerRow }).map((_, index) => {
                  const seatNumber = index + 1
                  const seat = `${row}${seatNumber}`
                  const isBooked = isSeatBooked(seat)
                  const isSelected = isSeatSelected(seat)

                  return (
                    <Button
                      key={seat}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "w-8 h-8 p-0 flex items-center justify-center",
                        isBooked && "bg-muted text-muted-foreground cursor-not-allowed",
                        isSelected && "bg-primary text-primary-foreground",
                      )}
                      disabled={isBooked}
                      onClick={() => toggleSeat(seat)}
                    >
                      {seatNumber}
                    </Button>
                  )
                })}
              </div>
              <div className="w-6 text-center font-medium">{row}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border rounded-sm"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary border rounded-sm"></div>
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted border rounded-sm"></div>
          <span className="text-sm">Booked</span>
        </div>
      </div>
    </div>
  )
}
