import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Database } from "lucide-react"
import { supabase } from "@/lib/auth-simple"

export const dynamic = "force-dynamic"

export default async function SystemPage() {
  // Verificar conexão com o Supabase
  const { count, error } = await supabase.from("contacts").select("*", { count: "exact", head: true })

  const isSupabaseConnected = !error

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Status do Sistema</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sistema de Contatos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Conexão com o banco de dados:</span>
              {isSupabaseConnected ? (
                <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" /> Conectado
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center">
                  <span className="h-3 w-3 mr-1">✕</span> Desconectado
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium">Contatos cadastrados:</span>
              <Badge variant="outline">{count || 0}</Badge>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium">Modo de armazenamento:</span>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center">
                <Database className="h-3 w-3 mr-1" /> Supabase
              </Badge>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Informações do Sistema:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Os contatos são armazenados no banco de dados Supabase.</li>
              <li>A autenticação é gerenciada localmente com credenciais armazenadas no Supabase.</li>
              <li>Credenciais padrão: admin@dogbreeder.com / dogbreeder2024</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
