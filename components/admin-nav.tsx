"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Users, ListChecks, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Verificar se está no navegador antes de acessar localStorage
    if (typeof window !== "undefined") {
      try {
        // Carregar usuário do localStorage
        const adminUser = localStorage.getItem("adminUser")
        if (adminUser) {
          setUser(JSON.parse(adminUser))
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error)
      }
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminUser")
      router.push("/admin/login-simple")
    }
  }

  // Se não estiver autenticado, não mostrar a barra de navegação
  if (!user) {
    return null
  }

  // Se estiver na página de login, não mostrar a barra de navegação
  if (pathname === "/admin/login-simple" || pathname === "/admin/init") {
    return null
  }

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="container py-2 flex justify-between items-center">
        <nav className="flex space-x-4">
          <Link
            href="/admin"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-amber-800 hover:bg-amber-50"
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/admin/contacts"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-amber-800 hover:bg-amber-50"
          >
            <Users className="mr-2 h-4 w-4" />
            Contatos
          </Link>

          <Link
            href="/admin/breeds"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-amber-800 hover:bg-amber-50"
          >
            <ListChecks className="mr-2 h-4 w-4" />
            Raças
          </Link>

          <Link
            href="/admin/breeders"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-amber-800 hover:bg-amber-50"
          >
            <Users className="mr-2 h-4 w-4" />
            Criadores
          </Link>

          <Link
            href="/admin/system"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-amber-800 hover:bg-amber-50"
          >
            <Settings className="mr-2 h-4 w-4" />
            Sistema
          </Link>
        </nav>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}
