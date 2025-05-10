import * as bcrypt from "bcryptjs"
import type { SupabaseClient } from "@supabase/supabase-js"

// Função para criar hash de senha
export async function hashPassword(password: string): Promise<string> {
  try {
    console.log("Gerando hash para senha...")
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("Hash gerado com sucesso")
    return hashedPassword
  } catch (error) {
    console.error("Erro ao gerar hash de senha:", error)
    throw new Error(`Erro ao gerar hash de senha: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
  }
}

// Função para verificar senha
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error("Erro ao verificar senha:", error)
    return false
  }
}

// Função para criar o usuário admin inicial
export async function createInitialAdmin(supabase: SupabaseClient) {
  try {
    console.log("Verificando se já existe um usuário admin...")

    // Verificar se já existe um usuário admin
    const { data: existingUsers, error: checkError } = await supabase.from("admin_users").select("*").limit(1)

    if (checkError) {
      console.error("Erro ao verificar usuários existentes:", checkError)
      throw new Error(`Erro ao verificar usuários existentes: ${checkError.message}`)
    }

    // Se já existir pelo menos um usuário, não criar outro
    if (existingUsers && existingUsers.length > 0) {
      console.log("Usuário administrador já existe")
      return {
        success: true,
        message: "Usuário administrador já existe",
        user: existingUsers[0],
      }
    }

    console.log("Criando usuário administrador...")

    // Criar hash da senha
    const passwordHash = await hashPassword("dogbreeder2024")

    // Inserir usuário admin
    const { data, error } = await supabase
      .from("admin_users")
      .insert({
        email: "admin@dogbreeder.com",
        password_hash: passwordHash,
        name: "Administrador",
      })
      .select()

    if (error) {
      console.error("Erro ao criar usuário administrador:", error)
      throw new Error(`Erro ao criar usuário administrador: ${error.message}`)
    }

    console.log("Usuário administrador criado com sucesso")
    return {
      success: true,
      message: "Usuário administrador criado com sucesso",
      user: data[0],
    }
  } catch (error) {
    console.error("Erro ao criar usuário administrador:", error)
    throw error
  }
}
