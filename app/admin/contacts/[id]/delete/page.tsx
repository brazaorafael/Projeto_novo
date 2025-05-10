import { supabase } from "@/lib/auth-simple"
import { redirect } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DeleteContactPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  // Buscar contato do Supabase
  const { data: contact, error } = await supabase.from("contacts").select("*").eq("id", id).single()

  if (error || !contact) {
    console.error("Erro ao buscar contato:", error)
    redirect("/admin/contacts")
  }

  // Handle form submission
  async function handleDelete() {
    "use server"

    const { error } = await supabase.from("contacts").delete().eq("id", id)

    if (error) {
      console.error("Erro ao excluir contato:", error)
      return { success: false, error: error.message }
    }

    redirect("/admin/contacts?deleted=true")
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

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Confirmar exclusão</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Tem certeza que deseja excluir o contato de <strong>{contact.name}</strong>?
          </p>
          <p className="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/admin/contacts">
            <Button variant="outline">Cancelar</Button>
          </Link>
          <form action={handleDelete}>
            <Button type="submit" variant="destructive">
              Excluir
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
