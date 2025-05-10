"use client"

import { useState } from "react"
import type { Contact } from "@/lib/contacts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Mail, Phone, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface ContactsListProps {
  initialContacts: Contact[]
}

export function ContactsList({ initialContacts }: ContactsListProps) {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState<{ type: string; message: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Instead of directly calling the server action, we'll navigate to a delete page
  const handleDeleteClick = (contact: Contact) => {
    setSelectedContact(contact)
  }

  const handleConfirmDelete = () => {
    if (!selectedContact) return

    setIsDeleting(true)
    // Navigate to a dedicated delete page that will handle the server action
    router.push(`/admin/contacts/${selectedContact.id}/delete?redirect=true`)
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

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.phone && contact.phone.includes(searchTerm)),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Lista de Contatos</span>
          <Badge>{contacts.length} contatos</Badge>
        </CardTitle>
        <div className="mt-2">
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Nenhum contato cadastrado ainda.</div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Nenhum contato encontrado para "{searchTerm}".</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead>Raças de Interesse</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(contact.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contact.matchedBreeds && contact.matchedBreeds.length > 0 ? (
                        contact.matchedBreeds.map((breed, index) => (
                          <Badge key={index} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                            {breed}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">Nenhuma raça registrada</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/contacts/${contact.id}`}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver detalhes</span>
                        </Button>
                      </Link>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(contact)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmar exclusão</DialogTitle>
                            <DialogDescription>
                              Tem certeza que deseja excluir o contato de {selectedContact?.name}? Esta ação não pode
                              ser desfeita.
                            </DialogDescription>
                          </DialogHeader>

                          {deleteMessage && (
                            <div
                              className={`p-3 rounded-md ${
                                deleteMessage.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                              }`}
                            >
                              {deleteMessage.message}
                            </div>
                          )}

                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
                              {isDeleting ? "Excluindo..." : "Excluir"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
