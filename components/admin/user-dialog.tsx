"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription, // Importa DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Importa los tipos desde tu api-services.ts centralizado
import type { UserType, NewUserPayload, UpdateUserPayload } from "@/lib/api-services";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null; // El usuario que se está viendo/editando
  mode: "create" | "edit" | "view";
  onSave: (data: NewUserPayload | UpdateUserPayload) => void; // Función para guardar/crear
}

// Define un tipo para el estado del formulario interno del diálogo
type UserDialogFormData = {
  name: string;
  email: string;
  role: 'admin' | 'user'; // Asegúrate que coincida con UserType['role']
  password?: string;
  dni?: string;
  telefono?: string;
  // No incluyas user_id aquí, se maneja a través de props.user
  // registeredDate y status son más para visualización si vienen del backend
  registeredDate?: string;
  status?: string;
};

export default function UserDialog({
  open,
  onOpenChange,
  user, // Este es UserType | null
  mode,
  onSave,
}: UserDialogProps) {
  const [formData, setFormData] = useState<UserDialogFormData>({
    name: "",
    email: "",
    role: "user", // Rol por defecto para creación
    password: "",
    dni: "",
    telefono: "",
  });

  const isCreateMode = mode === "create";
  const isViewMode = mode === "view";

  useEffect(() => {
    if (user && (mode === "edit" || mode === "view")) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user", // Rol por defecto si no está definido
        dni: user.dni || "",
        telefono: user.telefono || "",
        password: "", // La contraseña no se pre-rellena para editar
        registeredDate: user.registeredDate, // Para visualización
        status: user.status, // Para visualización
      });
    } else if (mode === "create") {
      // Resetear el formulario para el modo creación
      setFormData({
        name: "",
        email: "",
        role: "user",
        password: "",
        dni: "",
        telefono: "",
      });
    }
  }, [user, mode, open]); // 'open' para resetear si se reabre en modo 'create'

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: 'admin' | 'user') => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isViewMode) {
      onOpenChange(false); // Simplemente cierra el diálogo en modo vista
      return;
    }

    // Validaciones básicas (puedes mejorarlas con react-hook-form)
    if (!formData.name || !formData.email) {
      alert("Name and email are required."); // Reemplaza con toasts
      return;
    }
    if (isCreateMode && !formData.password) {
      alert("Password is required for new users."); // Reemplaza con toasts
      return;
    }

    // Prepara los datos para enviar a onSave
    // NewUserPayload y UpdateUserPayload ya definen qué campos son opcionales
    const payload: NewUserPayload | UpdateUserPayload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        dni: formData.dni || undefined, // Enviar undefined si está vacío para que no se envíe la clave
        telefono: formData.telefono || undefined,
    };

    if (formData.password) { // Solo incluye la contraseña si se proporcionó
        payload.password = formData.password;
    }

    onSave(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCreateMode && "Create New User"}
            {mode === "edit" && "Edit User"}
            {isViewMode && "View User Details"}
          </DialogTitle>
          {!isViewMode && (
            <DialogDescription>
              {isCreateMode
                ? "Fill in the details to create a new user."
                : "Make changes to the user's profile."}
            </DialogDescription>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isViewMode}
              required={!isViewMode}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isViewMode}
              required={!isViewMode}
            />
          </div>

          {!isViewMode && ( // Contraseña solo para crear/editar
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password || ""}
                onChange={handleChange}
                placeholder={isCreateMode ? "Required" : "Leave blank to keep current"}
                required={isCreateMode}
              />
            </div>
          )}

          <div>
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              name="dni"
              value={formData.dni || ""}
              onChange={handleChange}
              disabled={isViewMode}
            />
          </div>
          <div>
            <Label htmlFor="telefono">Phone</Label>
            <Input
              id="telefono"
              name="telefono"
              value={formData.telefono || ""}
              onChange={handleChange}
              disabled={isViewMode}
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={handleRoleChange}
              disabled={isViewMode}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isViewMode && user?.registeredDate && (
            <div>
              <Label>Registered Date</Label>
              <Input value={new Date(user.registeredDate).toLocaleDateString()} disabled />
            </div>
          )}
           {isViewMode && user?.status && (
            <div>
              <Label>Status</Label>
              <Input value={user.status} disabled />
            </div>
          )}

          <DialogFooter>
            {isViewMode ? (
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            ) : (
              <Button type="submit">
                {isCreateMode ? "Create User" : "Save Changes"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
