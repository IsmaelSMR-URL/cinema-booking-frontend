"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "user" | "movie" | "screening" | "reservation"
  onConfirm: () => void
}

export default function DeleteConfirmDialog({ open, onOpenChange, type, onConfirm }: DeleteConfirmDialogProps) {
  const getTitle = () => {
    switch (type) {
      case "user":
        return "Delete User"
      case "movie":
        return "Delete Movie"
      case "screening":
        return "Delete Screening"
      case "reservation":
        return "Cancel Reservation"
    }
  }

  const getDescription = () => {
    switch (type) {
      case "user":
        return "Are you sure you want to delete this user? This action cannot be undone."
      case "movie":
        return "Are you sure you want to delete this movie? This will also remove all associated screenings and reservations."
      case "screening":
        return "Are you sure you want to delete this screening? This will also cancel all associated reservations."
      case "reservation":
        return "Are you sure you want to cancel this reservation? This action cannot be undone."
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{getTitle()}</AlertDialogTitle>
          <AlertDialogDescription>{getDescription()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            {type === "reservation" ? "Cancel Reservation" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
