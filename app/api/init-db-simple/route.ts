import { NextResponse } from "next/server"
import { createAdminUser } from "@/lib/auth-simple"

export async function GET() {
  try {
    const result = await createAdminUser("admin@dogbreeder.com", "Administrador", "dogbreeder2024")

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao inicializar banco de dados",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
