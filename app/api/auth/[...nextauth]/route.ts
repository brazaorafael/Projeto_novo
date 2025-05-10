import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyPassword } from "@/lib/auth-utils"
import { supabase } from "@/lib/supabase"

// Verificar se estamos em ambiente de produção
const isProduction = process.env.NODE_ENV === "production"

// Definir configurações padrão para desenvolvimento
const defaultSecret = "dogbreeder_secret_key_2024"
const defaultUrl = "http://localhost:3000"

// Usar variáveis de ambiente ou valores padrão
const secret = process.env.NEXTAUTH_SECRET || defaultSecret
const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : defaultUrl

// Configuração do NextAuth
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Buscar usuário pelo email
          const { data: user, error } = await supabase
            .from("admin_users")
            .select("*")
            .eq("email", credentials.email)
            .single()

          if (error || !user) {
            return null
          }

          // Verificar senha
          const isPasswordValid = await verifyPassword(credentials.password, user.password_hash)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        } catch (error) {
          console.error("Erro na autenticação:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: "/admin/login-simple", // Usar login simplificado como fallback
    error: "/admin/login-simple",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: secret,
})

export { handler as GET, handler as POST }
