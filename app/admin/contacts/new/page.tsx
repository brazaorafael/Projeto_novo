"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { saveContact } from "@/app/actions/contact-actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewContactPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState({ type: "", message: "" })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFormMessage({ type: "", message: "" })

    // Preparar os dados do formulário
    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("phone", phone)
    formData.append("matchedBreeds", JSON.stringify([]))

    try {
      // Enviar para o Server Action
      const result = await saveContact(formData)

      if (result.success) {
        setFormMessage({ type: "success", message: result.message })
        // Redirecionar para a lista de contatos após 1 segundo
        setTimeout(() => {
          router.push("/admin/contacts")
        }, 1000)
      } else {
        setFormMessage({ type: "error", message: result.message })
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      setFormMessage({ type: "error", message: "Ocorreu um erro ao processar seu cadastro." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/admin/contacts">
          <Button variant="outline" className="border-gray-300 text-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a lista
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Adicionar Novo Contato</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formMessage.message && (
              <Alert
                className={formMessage.type === "error" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}
              >
                <AlertDescription className={formMessage.type === "error" ? "text-red-700" : "text-green-700"}>
                  {formMessage.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Nome completo *
              </Label>
              <Input
                id="name"
                placeholder="Digite o nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite o email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">
                Telefone (opcional)
              </Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white mt-4"
            >
              {submitting ? "Salvando..." : "Salvar Contato"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
