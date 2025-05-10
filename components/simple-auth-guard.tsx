"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function SimpleAuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verificar se o usuário está autenticado via localStorage
    const checkAuth = () => {
      try {
        const adminUser = localStorage.getItem("adminUser")
        const isAuth = !!adminUser
        setIsAuthenticated(isAuth)

        // Se não estiver autenticado e não estiver em uma página de login/init
        if (
          !isAuth &&
          !pathname.includes("/admin/login") &&
          !pathname.includes("/admin/login-simple") &&
          !pathname.includes("/admin/init") &&
          !pathname.includes("/admin/setup") &&
          !pathname.includes("/admin/instructions")
        ) {
          router.push("/admin/login-simple")
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  // Mostrar loading enquanto verifica autenticação
  if (isLoading && !pathname.includes("/admin/login") && !pathname.includes("/admin/login-simple")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    )
  }

  // Se estiver em uma página de login ou estiver autenticado, renderizar o conteúdo
  if (
    pathname.includes("/admin/login") ||
    pathname.includes("/admin/login-simple") ||
    pathname.includes("/admin/init") ||
    pathname.includes("/admin/setup") ||
    pathname.includes("/admin/instructions") ||
    isAuthenticated
  ) {
    return <>{children}</>
  }

  // Caso contrário, não renderizar nada
  return null
}
