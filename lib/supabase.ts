import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error("Variável de ambiente SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL não definida")
}

if (!supabaseAnonKey) {
  console.error("Variável de ambiente SUPABASE_ANON_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY não definida")
}

// Criar cliente Supabase para o lado do servidor
export const supabase = createClient<Database>(supabaseUrl || "", supabaseAnonKey || "")

// Criar cliente Supabase para o lado do cliente
export function createClientComponentClient() {
  const clientUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const clientAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!clientUrl || !clientAnonKey) {
    console.error("Variáveis de ambiente para cliente Supabase não definidas")
    return null
  }

  return createClient<Database>(clientUrl, clientAnonKey)
}
