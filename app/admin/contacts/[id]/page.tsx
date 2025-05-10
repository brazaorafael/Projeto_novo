import { supabase } from "@/lib/auth-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  // Buscar contato do Supabase
  const { data: contact, error } = await supabase.from("contacts").select("*").eq("id", params.id).single()

  if (error || !contact) {
    console.error("Erro ao buscar contato:", error)
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
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

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detalhes do Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{contact.name}</h2>
                <div className="flex items-center mt-2 text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{contact.email}</span>
                </div>
                {contact.phone && (
                  <div className="flex items-center mt-1 text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                <div className="flex items-center mt-1 text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Cadastrado em {formatDate(contact.created_at)}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Raças de Interesse</h3>
                {contact.matched_breeds && contact.matched_breeds.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {contact.matched_breeds.map((breed, index) => (
                      <Badge key={index} className="bg-amber-100 text-amber-800 border-amber-200">
                        {breed}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhuma raça de interesse registrada.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href={`/admin/contacts/${contact.id}/edit`} className="w-full">
              <Button className="w-full bg-amber-700 hover:bg-amber-800">Editar Contato</Button>
            </Link>
            <Link href={`/admin/contacts/${contact.id}/delete`} className="w-full">
              <Button variant="destructive" className="w-full">
                Excluir Contato
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
