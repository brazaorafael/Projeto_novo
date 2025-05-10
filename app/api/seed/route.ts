import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { hashPassword } from "@/lib/auth-utils"

export async function GET() {
  try {
    console.log("Iniciando processo de seed do banco de dados...")

    // Verificar conexão com o Supabase
    const { data: connectionTest, error: connectionError } = await supabase
      .from("admin_users")
      .select("count(*)")
      .limit(1)

    if (connectionError) {
      console.error("Erro de conexão com o Supabase:", connectionError)
      return NextResponse.json(
        {
          success: false,
          message: "Erro de conexão com o banco de dados",
          error: connectionError.message,
        },
        { status: 500 },
      )
    }

    console.log("Conexão com o Supabase estabelecida com sucesso")

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

    console.log("Verificação de usuários existentes:", existingUsers)

    // Se já existir pelo menos um usuário, não criar outro
    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Usuário administrador já existe",
        user: {
          email: existingUsers[0].email,
          name: existingUsers[0].name,
          created_at: existingUsers[0].created_at,
        },
      })
    }

    console.log("Nenhum usuário administrador encontrado. Criando usuário padrão...")

    // Criar hash da senha
    const passwordHash = await hashPassword("dogbreeder2024")
    console.log("Hash de senha gerado com sucesso")

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
          details: error.details,
        },
        { status: 500 },
      )
    }

    console.log("Usuário administrador criado com sucesso:", data)

    return NextResponse.json({
      success: true,
      message: "Usuário administrador criado com sucesso",
      user: {
        email: data[0].email,
        name: data[0].name,
        created_at: data[0].created_at,
      },
    })
  } catch (error) {
    console.error("Erro não tratado ao criar usuário administrador:", error)

    // Extrair mensagem de erro de forma segura
    let errorMessage = "Erro desconhecido"
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === "string") {
      errorMessage = error
    } else if (error && typeof error === "object") {
      errorMessage = JSON.stringify(error)
    }

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao criar usuário administrador",
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}
