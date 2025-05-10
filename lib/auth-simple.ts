import { createClient } from "@supabase/supabase-js"
import * as bcrypt from "bcryptjs"

// Criar cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseKey)

// Função para criar hash de senha
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

// Função para verificar senha
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Função para criar usuário admin
export async function createAdminUser(email: string, name: string, password: string) {
  try {
    // Verificar se já existe um usuário admin
    const { data: existingUsers, error: checkError } = await supabase.from("admin_users").select("*").limit(1)

    if (checkError) {
      throw new Error(`Erro ao verificar usuários existentes: ${checkError.message}`)
    }

    // Se já existir pelo menos um usuário, não criar outro
    if (existingUsers && existingUsers.length > 0) {
      return {
        success: true,
        message: "Usuário administrador já existe",
        user: existingUsers[0],
      }
    }

    // Criar hash da senha
    const passwordHash = await hashPassword(password)

    // Inserir usuário admin
    const { data, error } = await supabase
      .from("admin_users")
      .insert({
        email,
        password_hash: passwordHash,
        name,
      })
      .select()

    if (error) {
      throw new Error(`Erro ao criar usuário administrador: ${error.message}`)
    }

    return {
      success: true,
      message: "Usuário administrador criado com sucesso",
      user: data[0],
    }
  } catch (error) {
    console.error("Erro ao criar usuário admin:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

// Função para verificar credenciais
export async function verifyCredentials(email: string, password: string) {
  try {
    // Buscar usuário pelo email
    const { data: user, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

    if (error || !user) {
      return {
        success: false,
        message: "Credenciais inválidas",
      }
    }

    // Verificar senha
    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Credenciais inválidas",
      }
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }
  } catch (error) {
    console.error("Erro ao verificar credenciais:", error)
    return {
      success: false,
      message: "Erro ao verificar credenciais",
    }
  }
}
