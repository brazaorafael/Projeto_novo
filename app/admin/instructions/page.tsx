import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function InstructionsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Instruções de Configuração</h1>

      <Alert className="mb-6 bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-700">
          Você precisa configurar algumas variáveis de ambiente para que o sistema funcione corretamente.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuração do NextAuth</CardTitle>
            <CardDescription>
              Configure a variável de ambiente NEXTAUTH_SECRET para habilitar a autenticação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              O NextAuth.js requer uma variável de ambiente chamada{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded">NEXTAUTH_SECRET</code> para funcionar corretamente. Esta
              variável é usada para assinar tokens JWT e cookies de sessão.
            </p>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Como configurar:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Crie um arquivo <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> na raiz do projeto
                </li>
                <li>
                  Adicione a seguinte linha ao arquivo:
                  <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                    NEXTAUTH_SECRET=sua_chave_secreta_aqui
                  </pre>
                </li>
                <li>
                  Você pode gerar uma chave secreta aleatória usando o seguinte comando:
                  <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">openssl rand -base64 32</pre>
                  ou usar um valor como{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">dogbreeder_secret_key_2024</code> para testes
                </li>
                <li>Reinicie o servidor após adicionar a variável de ambiente</li>
              </ol>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Enquanto a variável NEXTAUTH_SECRET não estiver configurada, você pode usar a página de configuração
                simplificada para inicializar o banco de dados e a página de login simplificada para acessar o sistema.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-4">
          <Link href="/admin/setup">
            <Button className="bg-amber-700 hover:bg-amber-800">Ir para Configuração</Button>
          </Link>
          <Link href="/admin/login-simple">
            <Button variant="outline">Login Simplificado</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
