"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/supabase-js"
import * as bcrypt from "bcryptjs"

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [adminExists, setAdminExists] = useState(false)

  const initializeDatabase = async () => {
    try {
      setStatus("loading")
      setMessage("Verificando conexão com o banco de dados...")

      // Criar cliente Supabase
      const supabase = createClientComponentClient()

      // Verificar se já existe um usuário admin
      const { data: existingUsers, error: checkError } = await supabase.from("admin_users").select("*").limit(1)

      if (checkError) {
        throw new Error(`Erro ao verificar usuários existentes: ${checkError.message}`)
      }

      // Se já existir pelo menos um usuário, não criar outro
      if (existingUsers && existingUsers.length > 0) {
        setAdminExists(true)
        setStatus("success")
        setMessage("Um usuário administrador já existe no sistema.")
        return
      }

      setMessage("Criando usuário administrador...")

      // Criar hash da senha
      const passwordHash = await bcrypt.hash("dogbreeder2024", 10)

      // Inserir usuário admin
      const { error } = await supabase.from("admin_users").insert({
        email: "admin@dogbreeder.com",
        password_hash: passwordHash,
        name: "Administrador",
      })

      if (error) {
        throw new Error(`Erro ao criar usuário administrador: ${error.message}`)
      }

      setStatus("success")
      setMessage("Usuário administrador criado com sucesso!")
    } catch (error) {
      console.error("Erro durante a inicialização:", error)
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Erro desconhecido durante a inicialização")
    }
  }

  // Verificar se o admin já existe ao carregar a página
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase.from("admin_users").select("*").limit(1)

        if (error) {
          console.error("Erro ao verificar usuários:", error)
          return
        }

        if (data && data.length > 0) {
          setAdminExists(true)
        }
      } catch (error) {
        console.error("Erro ao verificar usuários:", error)
      }
    }

    checkAdminExists()
  }, [])

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configuração Inicial</CardTitle>
          <CardDescription>Configure o banco de dados e crie o usuário administrador para o sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "error" && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{message}</AlertDescription>
            </Alert>
          )}

          {status === "success" && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-2">Informações do Usuário Admin:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Email: admin@dogbreeder.com</li>
                <li>Senha: dogbreeder2024</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {adminExists ? (
            <Link href="/admin/login" className="w-full">
              <Button className="w-full bg-amber-700 hover:bg-amber-800">Ir para Login</Button>
            </Link>
          ) : (
            <Button
              onClick={initializeDatabase}
              disabled={status === "loading"}
              className="w-full bg-amber-700 hover:bg-amber-800"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Inicializando...
                </>
              ) : (
                "Inicializar Banco de Dados"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
