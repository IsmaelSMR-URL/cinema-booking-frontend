// API service functions for all entities

// Types
export interface User {
  id: number
  name: string
  email: string
  password?: string
  role: "admin" | "client"
  registeredDate: string
  status: "active" | "inactive"
}

export interface Movie {
  id: number
  title: string
  description: string
  image: string
  genre: string
  duration: string
  releaseDate: string
  status: "showing" | "upcoming" | "ended"
}

export interface Screening {
  id: number
  movieId: number
  movieTitle: string
  theater: string
  date: string
  time: string
  capacity: number
  booked: number
}

export interface Reservation {
  id: string
  userId: number
  userName: string
  movieId: number
  movieTitle: string
  date: string
  time: string
  seats: string[]
  totalPrice: number
  status: "confirmed" | "cancelled"
  createdAt: string
}

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await fetch("/api/users")
    if (!response.ok) throw new Error("Failed to fetch users")
    return response.json()
  },

  getById: async (id: number): Promise<User> => {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) throw new Error("Failed to fetch user")
    return response.json()
  },

  create: async (user: Omit<User, "id">): Promise<User> => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    if (!response.ok) throw new Error("Failed to create user")
    return response.json()
  },

  update: async (id: number, user: Partial<User>): Promise<User> => {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    if (!response.ok) throw new Error("Failed to update user")
    return response.json()
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete user")
  },
}

// Movies API
export const moviesApi = {
  getAll: async (): Promise<Movie[]> => {
    const response = await fetch("/api/movies")
    if (!response.ok) throw new Error("Failed to fetch movies")
    return response.json()
  },

  getById: async (id: number): Promise<Movie> => {
    const response = await fetch(`/api/movies/${id}`)
    if (!response.ok) throw new Error("Failed to fetch movie")
    return response.json()
  },

  create: async (movie: Omit<Movie, "id">): Promise<Movie> => {
    const response = await fetch("/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie),
    })
    if (!response.ok) throw new Error("Failed to create movie")
    return response.json()
  },

  update: async (id: number, movie: Partial<Movie>): Promise<Movie> => {
    const response = await fetch(`/api/movies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie),
    })
    if (!response.ok) throw new Error("Failed to update movie")
    return response.json()
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`/api/movies/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete movie")
  },
}

// Screenings API
export const screeningsApi = {
  getAll: async (): Promise<Screening[]> => {
    const response = await fetch("/api/screenings")
    if (!response.ok) throw new Error("Failed to fetch screenings")
    return response.json()
  },

  getById: async (id: number): Promise<Screening> => {
    const response = await fetch(`/api/screenings/${id}`)
    if (!response.ok) throw new Error("Failed to fetch screening")
    return response.json()
  },

  create: async (screening: Omit<Screening, "id">): Promise<Screening> => {
    const response = await fetch("/api/screenings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(screening),
    })
    if (!response.ok) throw new Error("Failed to create screening")
    return response.json()
  },

  update: async (id: number, screening: Partial<Screening>): Promise<Screening> => {
    const response = await fetch(`/api/screenings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(screening),
    })
    if (!response.ok) throw new Error("Failed to update screening")
    return response.json()
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`/api/screenings/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete screening")
  },
}

// Reservations API
export const reservationsApi = {
  getAll: async (): Promise<Reservation[]> => {
    const response = await fetch("/api/reservations")
    if (!response.ok) throw new Error("Failed to fetch reservations")
    return response.json()
  },

  getById: async (id: string): Promise<Reservation> => {
    const response = await fetch(`/api/reservations/${id}`)
    if (!response.ok) throw new Error("Failed to fetch reservation")
    return response.json()
  },

  create: async (reservation: Omit<Reservation, "id" | "createdAt">): Promise<Reservation> => {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    })
    if (!response.ok) throw new Error("Failed to create reservation")
    return response.json()
  },

  update: async (id: string, reservation: Partial<Reservation>): Promise<Reservation> => {
    const response = await fetch(`/api/reservations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    })
    if (!response.ok) throw new Error("Failed to update reservation")
    return response.json()
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/reservations/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete reservation")
  },
}
