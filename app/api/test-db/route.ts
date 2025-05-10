import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Testar conexão com o Supabase
    const { data, error } = await supabase.from("admin_users").select("count(*)", { count: "exact", head: true })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao conectar com o banco de dados",
          error: error.message,
          details: error.details,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Conexão com o banco de dados estabelecida com sucesso",
      count: data,
    })
  } catch (error) {
    console.error("Erro ao testar conexão com o banco de dados:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao testar conexão com o banco de dados",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
