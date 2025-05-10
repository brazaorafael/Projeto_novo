"use client"

import { SessionProvider } from "next-auth/react"
import type React from "react"
import { useState, useEffect } from "react"

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [hasNextAuthConfig, setHasNextAuthConfig] = useState(false)

  // Verificar se as variáveis de ambiente necessárias estão disponíveis
  useEffect(() => {
    setMounted(true)

    // Verificar se temos as variáveis necessárias para o NextAuth
    const hasConfig =
      typeof window !== "undefined" && (!!process.env.NEXT_PUBLIC_NEXTAUTH_URL || !!process.env.NEXT_PUBLIC_VERCEL_URL)

    setHasNextAuthConfig(hasConfig)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  // Se não temos configuração do NextAuth, apenas renderizar os filhos
  if (!hasNextAuthConfig) {
    return <>{children}</>
  }

  // Se temos configuração, usar o SessionProvider
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  )
}
