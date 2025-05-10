import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createInitialAdmin } from "@/lib/auth-utils"

export async function GET() {
  try {
    // Criar usuário admin inicial
    await createInitialAdmin(supabase)

    return NextResponse.json({ success: true, message: "Banco de dados inicializado com sucesso" })
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error)
    return NextResponse.json({ success: false, message: "Erro ao inicializar banco de dados", error }, { status: 500 })
  }
}
