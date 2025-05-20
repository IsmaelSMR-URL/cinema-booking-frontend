"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import type { User } from "@/lib/api-services"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  mode: "create" | "edit" | "view"
  onSave: (user: Partial<User>) => void
}

export default function UserDialog({
  open,
  onOpenChange,
  user,
  mode,
  onSave
}: UserDialogProps) {
  const [formData, setFormData] = useState<Partial<User & { password?: string }>>({
    name: "",
    email: "",
    role: "client",
    password: ""
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        registeredDate: user.registeredDate
      })
    } else {
      setFormData({
        name: "",
        email: "",
        role: "client",
        password: ""
      })
    }
  }, [user, open])

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const isViewMode = mode === "view"
  const isCreateMode = mode === "create"
  const title =
    isCreateMode
      ? "Add User"
      : mode === "edit"
      ? "Edit User"
      : "User Details"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="col-span-3"
              disabled={isViewMode}
              required
            />
          </div>

          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="col-span-3"
              disabled={isViewMode}
              required
            />
          </div>

          {/* Password (solo en create) */}
          {isCreateMode && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ""}
                onChange={(e) => handleChange("password", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          )}

          {/* Role */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange("role", value)}
              disabled={isViewMode}
            >
              <SelectTrigger id="role" className="col-span-3">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Registered Date (solo si existe) */}
          {formData.registeredDate && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="registeredDate" className="text-right">
                Registered
              </Label>
              <Input
                id="registeredDate"
                value={formData.registeredDate}
                className="col-span-3"
                disabled
              />
            </div>
          )}

          {/* Footer */}
          <DialogFooter>
            {!isViewMode && (
              <Button type="submit">
                {isCreateMode ? "Create" : "Save Changes"}
              </Button>
            )}
            {isViewMode && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
