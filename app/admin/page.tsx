"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Film, Search, Ticket, User, Calendar, Plus, MoreHorizontal, Edit, Trash, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { usersApi, moviesApi, screeningsApi, reservationsApi } from "@/lib/api-services"
import type { User as UserType, Movie, Screening, Reservation } from "@/lib/api-services"
import UserDialog from "@/components/admin/user-dialog"
import MovieDialog from "@/components/admin/movie-dialog"
import ScreeningDialog from "@/components/admin/screening-dialog"
import ReservationDialog from "@/components/admin/reservation-dialog"
import DeleteConfirmDialog from "@/components/admin/delete-confirm-dialog"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState<UserType[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [movieDialogOpen, setMovieDialogOpen] = useState(false)
  const [screeningDialogOpen, setScreeningDialogOpen] = useState(false)
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Selected item for edit/view/delete
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [selectedScreening, setSelectedScreening] = useState<Screening | null>(null)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  // Dialog mode (create, edit, view)
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create")

  // Delete type
  const [deleteType, setDeleteType] = useState<"user" | "movie" | "screening" | "reservation">("user")

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [usersData, moviesData, screeningsData, reservationsData] = await Promise.all([
          usersApi.getAll(),
          moviesApi.getAll(),
          screeningsApi.getAll(),
          reservationsApi.getAll(),
        ])

        setUsers(usersData)
        setMovies(moviesData)
        setScreenings(screeningsData)
        setReservations(reservationsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle user operations
  const handleCreateUser = async (user: Omit<UserType, "id">) => {
    try {
      const newUser = await usersApi.create(user)
      setUsers([...users, newUser])
      setUserDialogOpen(false)
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  const handleUpdateUser = async (id: number, user: Partial<UserType>) => {
    try {
      const updatedUser = await usersApi.update(id, user)
      setUsers(users.map((u) => (u.id === id ? updatedUser : u)))
      setUserDialogOpen(false)
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleDeleteUser = async (id: number) => {
    try {
      await usersApi.delete(id)
      setUsers(users.filter((u) => u.id !== id))
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  // Handle movie operations
  const handleCreateMovie = async (movie: Omit<Movie, "id">) => {
    try {
      const newMovie = await moviesApi.create(movie)
      setMovies([...movies, newMovie])
      setMovieDialogOpen(false)
    } catch (error) {
      console.error("Error creating movie:", error)
    }
  }

  const handleUpdateMovie = async (id: number, movie: Partial<Movie>) => {
    try {
      const updatedMovie = await moviesApi.update(id, movie)
      setMovies(movies.map((m) => (m.id === id ? updatedMovie : m)))
      setMovieDialogOpen(false)
    } catch (error) {
      console.error("Error updating movie:", error)
    }
  }

  const handleDeleteMovie = async (id: number) => {
    try {
      await moviesApi.delete(id)
      setMovies(movies.filter((m) => m.id !== id))
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting movie:", error)
    }
  }

  // Handle screening operations
  const handleCreateScreening = async (screening: Omit<Screening, "id">) => {
    try {
      const newScreening = await screeningsApi.create(screening)
      setScreenings([...screenings, newScreening])
      setScreeningDialogOpen(false)
    } catch (error) {
      console.error("Error creating screening:", error)
    }
  }

  const handleUpdateScreening = async (id: number, screening: Partial<Screening>) => {
    try {
      const updatedScreening = await screeningsApi.update(id, screening)
      setScreenings(screenings.map((s) => (s.id === id ? updatedScreening : s)))
      setScreeningDialogOpen(false)
    } catch (error) {
      console.error("Error updating screening:", error)
    }
  }

  const handleDeleteScreening = async (id: number) => {
    try {
      await screeningsApi.delete(id)
      setScreenings(screenings.filter((s) => s.id !== id))
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting screening:", error)
    }
  }

  // Handle reservation operations
  const handleUpdateReservation = async (id: string, reservation: Partial<Reservation>) => {
    try {
      const updatedReservation = await reservationsApi.update(id, reservation)
      setReservations(reservations.map((r) => (r.id === id ? updatedReservation : r)))
      setReservationDialogOpen(false)
    } catch (error) {
      console.error("Error updating reservation:", error)
    }
  }

  const handleDeleteReservation = async (id: string) => {
    try {
      await reservationsApi.delete(id)
      setReservations(reservations.filter((r) => r.id !== id))
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting reservation:", error)
    }
  }

  // Format date
  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 overflow-auto">
          <div className="container py-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Users</span>
                </TabsTrigger>
                <TabsTrigger value="movies" className="flex items-center gap-2">
                  <Film className="h-4 w-4" />
                  <span>Movies</span>
                </TabsTrigger>
                <TabsTrigger value="screenings" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Screenings</span>
                </TabsTrigger>
                <TabsTrigger value="reservations" className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  <span>Reservations</span>
                </TabsTrigger>
              </TabsList>

                <TabsContent value="users">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Users</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search users..." className="w-64 pl-8" />
                    </div>
                    <Button
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                      setSelectedUser(null)
                      setDialogMode("create")
                      setUserDialogOpen(true)
                    }}
                    >
                    <Plus className="h-4 w-4" />
                    <span>Add User</span>
                    </Button>
                  </div>
                  </CardHeader>
                  <CardContent>
                  <Table>
                    <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.user_id}>
                      <TableCell>{user.user_id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`capitalize ${user.role === "admin" ? "font-semibold" : ""}`}>
                        {user.role}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>{formatDate(user.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => {
                            setSelectedUser(user)
                            setDialogMode("view")
                            setUserDialogOpen(true)
                          }}
                          >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => {
                            setSelectedUser(user)
                            setDialogMode("edit")
                            setUserDialogOpen(true)
                          }}
                          >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                          className="flex items-center gap-2 text-red-600"
                          onClick={() => {
                            setSelectedUser(user)
                            setDeleteType("user")
                            setDeleteDialogOpen(true)
                          }}
                          >
                          <Trash className="h-4 w-4" />
                          <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                  </CardContent>
                </Card>
                </TabsContent>

                <TabsContent value="movies">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Movies</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search movies..." className="w-64 pl-8" />
                    </div>
                    <Button
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                      setSelectedMovie(null)
                      setDialogMode("create")
                      setMovieDialogOpen(true)
                    }}
                    >
                    <Plus className="h-4 w-4" />
                    <span>Add Movie</span>
                    </Button>
                  </div>
                  </CardHeader>
                  <CardContent>
                  <Table>
                    <TableHeader>
                    <TableRow>
                      <TableHead>movie_id</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Poster</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {movies.map((movie) => (
                      <TableRow key={movie.movie_id}>
                      <TableCell>{movie.movie_id}</TableCell>
                      <TableCell>{movie.title}</TableCell>
                      <TableCell>
                        {movie.poster_image_url ? (
                        <img
                          src={movie.poster_image_url}
                          alt={movie.title}
                          className="h-12 w-auto rounded"
                        />
                        ) : (
                        <span className="text-muted-foreground">No image</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(movie.created_at)}</TableCell>
                      <TableCell>{formatDate(movie.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => {
                            setSelectedMovie(movie)
                            setDialogMode("view")
                            setMovieDialogOpen(true)
                          }}
                          >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => {
                            setSelectedMovie(movie)
                            setDialogMode("edit")
                            setMovieDialogOpen(true)
                          }}
                          >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                          className="flex items-center gap-2 text-red-600"
                          onClick={() => {
                            setSelectedMovie(movie)
                            setDeleteType("movie")
                            setDeleteDialogOpen(true)
                          }}
                          >
                          <Trash className="h-4 w-4" />
                          <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                  </CardContent>
                </Card>
                </TabsContent>

                <TabsContent value="screenings">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Screenings</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search screenings..." className="w-64 pl-8" />
                    </div>
                    <Button
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                      setSelectedScreening(null)
                      setDialogMode("create")
                      setScreeningDialogOpen(true)
                    }}
                    >
                    <Plus className="h-4 w-4" />
                    <span>Add Screening</span>
                    </Button>
                  </div>
                  </CardHeader>
                  <CardContent>
                  <Table>
                    <TableHeader>
                    <TableRow>
                      <TableHead>screening_id</TableHead>
                      <TableHead>movie_id</TableHead>
                      <TableHead>room_name</TableHead>
                      <TableHead>total_rows</TableHead>
                      <TableHead>total_columns</TableHead>
                      <TableHead>screening_time</TableHead>
                      <TableHead>created_at</TableHead>
                      <TableHead>updated_at</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {screenings.map((screening) => (
                      <TableRow key={screening.screening_id}>
                      <TableCell>{screening.screening_id}</TableCell>
                      <TableCell>{screening.movie_id}</TableCell>
                      <TableCell>{screening.room_name}</TableCell>
                      <TableCell>{screening.total_rows}</TableCell>
                      <TableCell>{screening.total_columns}</TableCell>
                      <TableCell>{screening.screening_time}</TableCell>
                      <TableCell>{formatDate(screening.created_at)}</TableCell>
                      <TableCell>{formatDate(screening.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => {
                            setSelectedScreening(screening)
                            setDialogMode("view")
                            setScreeningDialogOpen(true)
                          }}
                          >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => {
                            setSelectedScreening(screening)
                            setDialogMode("edit")
                            setScreeningDialogOpen(true)
                          }}
                          >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                          className="flex items-center gap-2 text-red-600"
                          onClick={() => {
                            setSelectedScreening(screening)
                            setDeleteType("screening")
                            setDeleteDialogOpen(true)
                          }}
                          >
                          <Trash className="h-4 w-4" />
                          <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                  </CardContent>
                </Card>
                </TabsContent>

                <TabsContent value="reservations">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Reservations</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search reservations..." className="w-64 pl-8" />
                    </div>
                  </div>
                  </CardHeader>
                  <CardContent>
                  <Table>
                    <TableHeader>
                    <TableRow>
                      <TableHead>reservation_id</TableHead>
                      <TableHead>user_id</TableHead>
                      <TableHead>screening_id</TableHead>
                      <TableHead>reservation_time</TableHead>
                      <TableHead>reserved_seats</TableHead>
                      <TableHead>created_at</TableHead>
                      <TableHead>updated_at</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.reservation_id}>
                      <TableCell>{reservation.reservation_id}</TableCell>
                      <TableCell>{reservation.user_id}</TableCell>
                      <TableCell>{reservation.screening_id}</TableCell>
                      <TableCell>{reservation.reservation_time}</TableCell>
                      <TableCell>
                        {Array.isArray(reservation.reserved_seats)
                        ? reservation.reserved_seats.join(", ")
                        : reservation.reserved_seats}
                      </TableCell>
                      <TableCell>{formatDate(reservation.created_at)}</TableCell>
                      <TableCell>{formatDate(reservation.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => {
                            setSelectedReservation(reservation)
                            setDialogMode("view")
                            setReservationDialogOpen(true)
                          }}
                          >
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => {
                            setSelectedReservation(reservation)
                            setDialogMode("edit")
                            setReservationDialogOpen(true)
                          }}
                          >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                          className="flex items-center gap-2 text-red-600"
                          onClick={() => {
                            setSelectedReservation(reservation)
                            setDeleteType("reservation")
                            setDeleteDialogOpen(true)
                          }}
                          >
                          <Trash className="h-4 w-4" />
                          <span>Cancel</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                  </CardContent>
                </Card>
                </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* User Dialog */}
      <UserDialog
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
        user={selectedUser}
        mode={dialogMode}
        onSave={(user) => {
          if (dialogMode === "create") {
            handleCreateUser(user as Omit<UserType, "id">)
          } else if (dialogMode === "edit" && selectedUser) {
            handleUpdateUser(selectedUser.id, user)
          }
        }}
      />

      {/* Movie Dialog */}
      <MovieDialog
        open={movieDialogOpen}
        onOpenChange={setMovieDialogOpen}
        movie={selectedMovie}
        mode={dialogMode}
        onSave={(movie) => {
          if (dialogMode === "create") {
            handleCreateMovie(movie as Omit<Movie, "id">)
          } else if (dialogMode === "edit" && selectedMovie) {
            handleUpdateMovie(selectedMovie.id, movie)
          }
        }}
      />

      {/* Screening Dialog */}
      <ScreeningDialog
        open={screeningDialogOpen}
        onOpenChange={setScreeningDialogOpen}
        screening={selectedScreening}
        mode={dialogMode}
        movies={movies}
        onSave={(screening) => {
          if (dialogMode === "create") {
            handleCreateScreening(screening as Omit<Screening, "id">)
          } else if (dialogMode === "edit" && selectedScreening) {
            handleUpdateScreening(selectedScreening.id, screening)
          }
        }}
      />

      {/* Reservation Dialog */}
      <ReservationDialog
        open={reservationDialogOpen}
        onOpenChange={setReservationDialogOpen}
        reservation={selectedReservation}
        mode={dialogMode}
        onSave={(reservation) => {
          if (dialogMode === "edit" && selectedReservation) {
            handleUpdateReservation(selectedReservation.id, reservation)
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        type={deleteType}
        onConfirm={() => {
          switch (deleteType) {
            case "user":
              if (selectedUser) handleDeleteUser(selectedUser.id)
              break
            case "movie":
              if (selectedMovie) handleDeleteMovie(selectedMovie.id)
              break
            case "screening":
              if (selectedScreening) handleDeleteScreening(selectedScreening.id)
              break
            case "reservation":
              if (selectedReservation) handleDeleteReservation(selectedReservation.id)
              break
          }
        }}
      />
    </SidebarProvider>
  )
}

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-4">
          <Film className="h-6 w-6" />
          <span className="font-bold">CinemaPlus Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeTab === "users"} onClick={() => setActiveTab("users")}>
              <User className="h-4 w-4" />
              <span>Users</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeTab === "movies"} onClick={() => setActiveTab("movies")}>
              <Film className="h-4 w-4" />
              <span>Movies</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeTab === "screenings"} onClick={() => setActiveTab("screenings")}>
              <Calendar className="h-4 w-4" />
              <span>Screenings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeTab === "reservations"} onClick={() => setActiveTab("reservations")}>
              <Ticket className="h-4 w-4" />
              <span>Reservations</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
