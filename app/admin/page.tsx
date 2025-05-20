"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Film,
  Ticket,
  User as UserIconLucide, // Renombrado para evitar colisión con el tipo User
  Calendar,
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  // Sidebar, // Eliminado porque no se usa
  // SidebarProvider, // No parece usarse directamente aquí
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"; // Asumiendo que este es tu componente de sidebar

// Importar desde tu api-services.ts actualizado en lib/
import {
  usersApi,
  logout, // Cambia 'authApi' por 'logout' si tu api-services exporta logout directamente
  // moviesApi, // Descomentar cuando implementes
  // screeningsApi, // Descomentar cuando implementes
  // reservationsApi, // Descomentar cuando implementes
  User, // Usa el tipo User directamente
  NewUser, // Usa el tipo NewUser directamente
  UpdateUser, // Usa el tipo UpdateUser directamente
} from "@/lib/api-services";

// Importar diálogos
import UserDialog from "@/components/admin/user-dialog";
import DeleteConfirmDialog from "@/components/admin/delete-confirm-dialog";

// Componente Placeholder para Sidebar si no lo tienes definido globalmente
const AdminSidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 p-4 border-r dark:border-gray-700 flex flex-col">
      <SidebarHeader className="border-b mb-4">
        <div className="flex items-center gap-2 px-2 py-4">
          <Film className="h-6 w-6" />
          <span className="font-bold text-lg">CinemaPlus Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeTab === "users"} onClick={() => setActiveTab("users")}>
              <UserIconLucide className="h-4 w-4 mr-2" />
              <span>Users</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeTab === "movies"} onClick={() => setActiveTab("movies")}>
              <Film className="h-4 w-4 mr-2" />
              <span>Movies</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeTab === "screenings"} onClick={() => setActiveTab("screenings")}>
              <Calendar className="h-4 w-4 mr-2" />
              <span>Screenings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeTab === "reservations"} onClick={() => setActiveTab("reservations")}>
              <Ticket className="h-4 w-4 mr-2" />
              <span>Reservations</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <Button onClick={() => authApi.logout().then(() => window.location.href = '/signin')} className="mt-auto">Logout</Button>
    </div>
  );
};


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
      <Button onClick={() => logout().then(() => window.location.href = '/signin')} className="mt-auto">Logout</Button>

  // Estados para el diálogo de usuarios
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [currentUserDialogMode, setCurrentUserDialogMode] = useState<"create" | "edit" | "view">("create");
  const [editingUser, setEditingUser] = useState<UserType | null>(null); // Usuario para editar/ver

  // Estado para el diálogo de confirmación de eliminación
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  // Estados para el diálogo de usuarios
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [currentUserDialogMode, setCurrentUserDialogMode] = useState<"create" | "edit" | "view">("create");
  const [editingUser, setEditingUser] = useState<User | null>(null); // Usuario para editar/ver

  // Estado para el diálogo de confirmación de eliminación
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // ... y así para screenings, reservations

  // Función para obtener usuarios
  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setErrorUsers(null);
    try {
      const data = await usersApi.list();
      setUsers(data);
    } catch (error: any) {
      setErrorUsers(error.message || "Error fetching users");
      // Aquí podrías verificar si es un error de autenticación (ej. 401) y redirigir al login
      if (error.message?.includes("token") || error.message?.includes("Unauthorized")) {
        // logout(); // Opcional: limpiar token
        // window.location.href = '/signin'; // Redirigir al login
      }
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    // Verificar autenticación al cargar el dashboard
    usersApi.getCurrentUser?.().catch(() => {
      // Si falla obtener el usuario actual (ej. token inválido), redirigir
      // window.location.href = '/signin';
      console.warn("User not authenticated or token expired. Consider redirecting to login.");
    });
    if (activeTab === "users") {
      fetchUsers();
    }
    // Aquí irían las llamadas a fetch para otras pestañas
    // else if (activeTab === "movies") { fetchMovies(); }
  }, [activeTab, fetchUsers]);

  const handleOpenUserDialog = (
    mode: "create" | "edit" | "view",
    user?: User
  ) => {
    setCurrentUserDialogMode(mode);
    setEditingUser(user || null);
    setIsUserDialogOpen(true);
  };

  const handleSaveUser = async (formData: NewUserPayload | UpdateUserPayload) => {
    try {
      if (currentUserDialogMode === "create") {
  const handleOpenUserDialog = (
    mode: "create" | "edit" | "view",
    user?: User
  ) => {
    setCurrentUserDialogMode(mode);
    setEditingUser(user || null);
    setIsUserDialogOpen(true);
  };

  const handleSaveUser = async (formData: NewUser | UpdateUser) => {
    try {
      if (currentUserDialogMode === "create") {
        // Asegúrate que NewUser tenga todos los campos requeridos por authRegister
        if (!('password' in formData) || !formData.password) {
            alert("Password is required for new users."); // Considera usar un toast
            return;
        }
        await usersApi.create(formData as NewUser);
      } else if (currentUserDialogMode === "edit" && editingUser) {
        // Para actualizar, no envíes la contraseña si no se cambió.
        const dataToUpdate: UpdateUser = { ...formData };
        if ('password' in dataToUpdate && !dataToUpdate.password) {
          delete dataToUpdate.password; // No enviar contraseña vacía
        }
        await usersApi.update(editingUser.user_id, dataToUpdate);
      }
      fetchUsers(); // Re-fetch para actualizar la lista
      setIsUserDialogOpen(false);
      alert("User saved successfully!"); // Reemplaza con un toast
    } catch (error: any) {
      console.error("Error saving user:", error);
      alert(`Error saving user: ${error.message}`); // Reemplaza con un toast
    }
  };
      } catch (error: any) {
        console.error("Error deleting user:", error);
        alert(`Error deleting user: ${error.message}`); // Reemplaza con un toast
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-6 overflow-auto">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="screenings">Screenings</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
          </TabsList>

          {/* Pestaña de Usuarios */}
          <TabsContent value="users" className="flex-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Users</CardTitle>
                <Button onClick={() => handleOpenUserDialog("create")}>
                  <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                {isLoadingUsers && <p>Loading users...</p>}
                {errorUsers && (
                  <p className="text-red-500">Error: {errorUsers}</p>
                )}
                {!isLoadingUsers && !errorUsers && users.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>DNI</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.user_id}>
                          <TableCell>{user.user_id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{user.dni || "-"}</TableCell>
                          <TableCell>{user.telefono || "-"}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleOpenUserDialog("view", user)}
                                >
                                  <Eye className="mr-2 h-4 w-4" /> View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleOpenUserDialog("edit", user)}
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUserRequest(user)}
                                  className="text-red-600 focus:text-red-700 focus:bg-red-100"
                                >
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {!isLoadingUsers && !errorUsers && users.length === 0 && (
                  <p>No users found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Películas (Plantilla) */}
          <TabsContent value="movies" className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Manage Movies</CardTitle>
                {/* Botón para añadir película */}
              </CardHeader>
              <CardContent>
                <p>Movie management UI will go here.</p>
                {/* Tabla de películas */}
              </CardContent>
            </Card>
          </TabsContent>
          {/* ... Implementa las otras pestañas (Screenings, Reservations) de forma similar ... */}

        </Tabs>
      </main>

      {/* Diálogos */}
      {isUserDialogOpen && (
        <UserDialog
          open={isUserDialogOpen}
          onOpenChange={setIsUserDialogOpen}
          // Pasa el tipo UserType (que es el alias de User de api-services)
          // El diálogo internamente puede manejar un tipo de formulario diferente si es necesario
          user={editingUser}
          mode={currentUserDialogMode}
          onSave={handleSaveUser}
        />
      )}

      {deletingUser && (
        <DeleteConfirmDialog
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={confirmDeleteUser}
          itemName={deletingUser.name || `User ID ${deletingUser.user_id}`}
          itemType="user"
        />
      )}

      {/* Aquí irían los otros diálogos (MovieDialog, ScreeningDialog, etc.) */}
    </div>
  );
}
      {deletingUser && (
        <DeleteConfirmDialog
          open={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={confirmDeleteUser}
          itemName={deletingUser.name || `User ID ${deletingUser.user_id}`}
          itemType="user"
        />
      )}
