"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminNav } from "@/components/admin-nav"
import { createClient } from "@supabase/supabase-js"

export default function ContactsPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchContacts() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          throw new Error("Variáveis de ambiente do Supabase não configuradas")
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false })

        if (error) throw error

        setContacts(data || [])
      } catch (err) {
        console.error("Erro ao buscar contatos:", err)
        setError("Não foi possível carregar os contatos. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [])

  return (
    <>
      <AdminNav />
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contatos Cadastrados</h1>
          <Link href="/admin/contacts/new">
            <Button className="bg-amber-700 hover:bg-amber-800">
              <PlusCircle className="h-4 w-4 mr-2" /> Novo Contato
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Contatos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-700 mx-auto"></div>
                <p className="mt-2 text-gray-500">Carregando contatos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhum contato cadastrado ainda.</div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border p-4 rounded-md">
                    <h3 className="font-medium">{contact.name}</h3>
                    <p className="text-gray-600">{contact.email}</p>
                    {contact.phone && <p className="text-gray-600">{contact.phone}</p>}
                    <div className="mt-2">
                      <Link href={`/admin/contacts/${contact.id}`}>
                        <Button variant="outline" size="sm">
                          Ver detalhes
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
