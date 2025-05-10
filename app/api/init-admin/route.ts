import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import * as bcrypt from "bcryptjs"

export async function GET() {
  try {
    console.log("Iniciando criação do usuário admin sem dependência do NextAuth...")

    // Verificar se já existe um usuário admin
    const { data: existingUsers, error: checkError } = await supabase.from("admin_users").select("*").limit(1)

    if (checkError) {
      console.error("Erro ao verificar usuários existentes:", checkError)
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao verificar usuários existentes",
          error: checkError.message,
        },
        { status: 500 },
      )
    }

    // Se já existir pelo menos um usuário, não criar outro
    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Usuário administrador já existe",
        user: {
          email: existingUsers[0].email,
          name: existingUsers[0].name,
        },
      })
    }

    // Criar hash da senha diretamente
    const passwordHash = await bcrypt.hash("dogbreeder2024", 10)

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
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao criar usuário administrador",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Usuário administrador criado com sucesso",
      user: {
        email: data[0].email,
        name: data[0].name,
      },
    })
  } catch (error) {
    console.error("Erro ao criar usuário administrador:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao criar usuário administrador",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
