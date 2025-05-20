"use client"

import Link from "next/link"
import { Film, Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { User as UserType } from "@/lib/api-services"
import { logout, getCurrentUser } from "@/app/api/users/authService"

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Primero verificar si hay un token
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoggedIn(false);
          setCurrentUser(null);
          return;
        }

        // Si hay token, intentar obtener el usuario
        const user = await getCurrentUser();
        console.log("Usuario obtenido:", user);
        
        if (user) {
          console.log("Usuario autenticado, actualizando estado...");
          setIsLoggedIn(true);
          setCurrentUser(user);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userData", JSON.stringify(user));
        } else {
          console.log("No hay usuario, limpiando estado...");
          setIsLoggedIn(false);
          setCurrentUser(null);
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("userData");
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
      }
    };

    // Verificar el estado inicial
    checkLoginStatus();

    // Crear un evento personalizado para el login
    const handleLoginEvent = () => {
      console.log("Evento de login detectado");
      checkLoginStatus();
    };

    // Escuchar el evento de login
    window.addEventListener("login", handleLoginEvent);
    // Escuchar cambios en el almacenamiento
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("login", handleLoginEvent);
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // Log para depuración cuando cambia el estado
  useEffect(() => {
    console.log("Estado actual:", { isLoggedIn, currentUser });
  }, [isLoggedIn, currentUser]);

  const isActive = (path: string) => {
    return pathname === path ? "font-bold" : ""
  }

  const handleSignOut = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setCurrentUser(null);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setIsLoggedIn(false);
      setCurrentUser(null);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      router.push("/");
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser?.name) return "U";

    const nameParts = currentUser.name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Film className="h-6 w-6" />
          <span className="hidden md:inline-block">CinemaPlus</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={`text-sm ${isActive("/")}`}>
            Home
          </Link>
          <Link href="/movies" className={`text-sm ${isActive("/movies")}`}>
            Movies
          </Link>
          <Link href="/reservations" className={`text-sm ${isActive("/reservations")}`}>
            Reservations
          </Link>
          {isLoggedIn && currentUser?.role === "admin" && (
            <Link href="/admin" className={`text-sm ${isActive("/admin")}`}>
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{currentUser?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                {currentUser?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2">
                      <Film className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px]">
            <div className="flex flex-col gap-6 pt-6">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 font-bold">
                <Film className="h-6 w-6" />
                <span>CinemaPlus</span>
              </Link>
              <nav className="flex flex-col gap-4">
                <SheetClose asChild>
                  <Link href="/" className="text-sm">
                    Home
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/movies" className="text-sm">
                    Movies
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/reservations" className="text-sm">
                    Reservations
                  </Link>
                </SheetClose>
                {isLoggedIn && currentUser?.role === "admin" && (
                  <SheetClose asChild>
                    <Link href="/admin" className="text-sm">
                      Dashboard
                    </Link>
                  </SheetClose>
                )}
              </nav>
              <div className="flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-2 px-2 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{currentUser?.name}</span>
                    </div>
                    <SheetClose asChild>
                      <Link href="/profile">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <User className="mr-2 h-4 w-4" />
                          My Profile
                        </Button>
                      </Link>
                    </SheetClose>
                    {currentUser?.role === "admin" && (
                      <SheetClose asChild>
                        <Link href="/admin">
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            <Film className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Button>
                        </Link>
                      </SheetClose>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-600"
                      onClick={() => {
                        handleSignOut()
                        setIsOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link href="/signin">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Sign In
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/register">
                        <Button size="sm" className="w-full justify-start">
                          Register
                        </Button>
                      </Link>
                    </SheetClose>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
