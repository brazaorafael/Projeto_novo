"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function InitPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const initializeDatabase = async () => {
    try {
      setStatus("loading")
      setMessage("Inicializando banco de dados...")

      const response = await fetch("/api/init-db-simple")
      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message)
      } else {
        setStatus("error")
        setMessage(data.message || "Erro ao inicializar banco de dados")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Erro ao inicializar banco de dados")
      console.error("Erro:", error)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Inicialização do Sistema</CardTitle>
          <CardDescription>Inicialize o banco de dados e crie o usuário administrador.</CardDescription>
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
          {status === "success" ? (
            <Link href="/admin/login-simple" className="w-full">
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
