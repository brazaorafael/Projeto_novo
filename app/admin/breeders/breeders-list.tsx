"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { dogBreeds } from "@/lib/dog-breeds"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, ExternalLink, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  createBreeder,
  updateBreederAction,
  deleteBreederAction,
  toggleBreederStatusAction,
} from "@/app/actions/breeder-actions"
import { getBreeders } from "@/lib/breeders-service"
import type { Breeder } from "@/lib/breeders-service"

export default function BreedersList() {
  // Estado para armazenar todos os criadores
  const [breeders, setBreeders] = useState<Breeder[]>([])
  // Estado para o criador que está sendo editado
  const [editingBreeder, setEditingBreeder] = useState<Breeder | null>(null)
  // Estado para o novo criador
  const [newBreeder, setNewBreeder] = useState({
    name: "",
    location: "",
    website: "",
    instagram: "",
    breedId: 0,
    breedName: "",
  })
  // Estado para controlar o diálogo de adição/edição
  const [dialogOpen, setDialogOpen] = useState(false)
  // Estado para o modo do diálogo (adicionar ou editar)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  // Estado para filtrar criadores
  const [searchTerm, setSearchTerm] = useState("")
  // Estado para a aba ativa
  const [activeTab, setActiveTab] = useState("all")
  // Estado para mensagens de feedback
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  // Estado para indicar carregamento
  const [loading, setLoading] = useState(true)
  // Estado para indicar operações em andamento
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Estado para controlar o diálogo de confirmação de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  // Estado para o criador que está sendo excluído
  const [deletingBreeder, setDeletingBreeder] = useState<Breeder | null>(null)

  // Carregar todos os criadores ao iniciar
  useEffect(() => {
    async function loadBreeders() {
      setLoading(true)
      try {
        const data = await getBreeders()
        setBreeders(data)
      } catch (error) {
        console.error("Erro ao carregar criadores:", error)
        setFeedback({
          type: "error",
          message: "Erro ao carregar criadores. Por favor, tente novamente.",
        })
      } finally {
        setLoading(false)
      }
    }

    loadBreeders()
  }, [])

  // Filtrar criadores com base no termo de busca e aba ativa
  const filteredBreeders = breeders.filter((breeder) => {
    const matchesSearch =
      breeder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breeder.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breeder.breed_name.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && breeder.active
    if (activeTab === "inactive") return matchesSearch && !breeder.active

    return matchesSearch
  })

  // Função para abrir o diálogo de adição
  const handleAddBreeder = () => {
    setDialogMode("add")
    setNewBreeder({
      name: "",
      location: "",
      website: "",
      instagram: "",
      breedId: 0,
      breedName: "",
    })
    setFeedback(null)
    setDialogOpen(true)
  }

  // Função para abrir o diálogo de edição
  const handleEditBreeder = (breeder: Breeder) => {
    setDialogMode("edit")
    setEditingBreeder(breeder)
    setFeedback(null)
    setDialogOpen(true)
  }

  // Função para abrir o diálogo de confirmação de exclusão
  const handleDeleteClick = (breeder: Breeder) => {
    setDeletingBreeder(breeder)
    setDeleteDialogOpen(true)
  }

  // Função para salvar um novo criador
  const handleSaveNewBreeder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFeedback(null)

    try {
      const formData = new FormData()
      formData.append("name", newBreeder.name)
      formData.append("location", newBreeder.location)
      formData.append("website", newBreeder.website || "")
      formData.append("instagram", newBreeder.instagram || "")
      formData.append("breedId", newBreeder.breedId.toString())

      // Obter o nome da raça a partir do ID
      const breed = dogBreeds.find((b) => b.id === newBreeder.breedId)
      formData.append("breedName", breed ? breed.name : "")

      const result = await createBreeder(formData)

      if (result.success) {
        // Atualizar a lista de criadores
        const updatedBreeders = await getBreeders()
        setBreeders(updatedBreeders)

        setFeedback({
          type: "success",
          message: result.message,
        })

        // Fechar o diálogo após um breve atraso
        setTimeout(() => {
          setDialogOpen(false)
        }, 1500)
      } else {
        setFeedback({
          type: "error",
          message: result.message,
        })
      }
    } catch (error) {
      console.error("Erro ao salvar criador:", error)
      setFeedback({
        type: "error",
        message: "Ocorreu um erro ao salvar o criador. Por favor, tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para atualizar um criador existente
  const handleUpdateBreeder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBreeder) return

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const formData = new FormData()
      formData.append("id", editingBreeder.id)
      formData.append("name", editingBreeder.name)
      formData.append("location", editingBreeder.location)
      formData.append("website", editingBreeder.website || "")
      formData.append("instagram", editingBreeder.instagram || "")
      formData.append("active", editingBreeder.active.toString())

      const result = await updateBreederAction(formData)

      if (result.success) {
        // Atualizar a lista de criadores
        const updatedBreeders = await getBreeders()
        setBreeders(updatedBreeders)

        setFeedback({
          type: "success",
          message: result.message,
        })

        // Fechar o diálogo após um breve atraso
        setTimeout(() => {
          setDialogOpen(false)
        }, 1500)
      } else {
        setFeedback({
          type: "error",
          message: result.message,
        })
      }
    } catch (error) {
      console.error("Erro ao atualizar criador:", error)
      setFeedback({
        type: "error",
        message: "Ocorreu um erro ao atualizar o criador. Por favor, tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para excluir um criador
  const handleDeleteBreeder = async () => {
    if (!deletingBreeder) return

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("id", deletingBreeder.id)

      const result = await deleteBreederAction(formData)

      if (result.success) {
        // Atualizar a lista de criadores
        const updatedBreeders = await getBreeders()
        setBreeders(updatedBreeders)

        setDeleteDialogOpen(false)

        // Mostrar feedback temporário
        setFeedback({
          type: "success",
          message: result.message,
        })

        // Limpar feedback após alguns segundos
        setTimeout(() => {
          setFeedback(null)
        }, 3000)
      } else {
        setFeedback({
          type: "error",
          message: result.message,
        })
      }
    } catch (error) {
      console.error("Erro ao excluir criador:", error)
      setFeedback({
        type: "error",
        message: "Ocorreu um erro ao excluir o criador. Por favor, tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para alternar o status ativo/inativo de um criador
  const toggleBreederStatus = async (id: string, active: boolean) => {
    try {
      const formData = new FormData()
      formData.append("id", id)
      formData.append("active", (!active).toString())

      const result = await toggleBreederStatusAction(formData)

      if (result.success) {
        // Atualizar a lista de criadores
        const updatedBreeders = await getBreeders()
        setBreeders(updatedBreeders)
      } else {
        // Mostrar mensagem de erro
        setFeedback({
          type: "error",
          message: result.message,
        })

        // Limpar feedback após alguns segundos
        setTimeout(() => {
          setFeedback(null)
        }, 3000)
      }
    } catch (error) {
      console.error("Erro ao alternar status do criador:", error)
      setFeedback({
        type: "error",
        message: "Ocorreu um erro ao alternar o status do criador. Por favor, tente novamente.",
      })

      // Limpar feedback após alguns segundos
      setTimeout(() => {
        setFeedback(null)
      }, 3000)
    }
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <Alert className={feedback.type === "error" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}>
          {feedback.type === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={feedback.type === "error" ? "text-red-700" : "text-green-700"}>
            {feedback.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div className="w-1/3">
          <Input
            placeholder="Buscar por nome, localização ou raça..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddBreeder} className="bg-amber-700 hover:bg-amber-800">
          <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Criador
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Lista de Criadores</span>
            <Badge>{breeders.length} criadores</Badge>
          </CardTitle>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="active">Ativos</TabsTrigger>
              <TabsTrigger value="inactive">Inativos</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-700"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Raça</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBreeders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      Nenhum criador encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBreeders.map((breeder) => (
                    <TableRow key={breeder.id}>
                      <TableCell className="font-medium">{breeder.name}</TableCell>
                      <TableCell>{breeder.breed_name}</TableCell>
                      <TableCell>{breeder.location}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {breeder.website && (
                            <a
                              href={breeder.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          {breeder.instagram && (
                            <a
                              href={`https://instagram.com/${breeder.instagram.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-600 hover:text-pink-800"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                              </svg>
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={breeder.active}
                          onCheckedChange={() => toggleBreederStatus(breeder.id, breeder.active)}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditBreeder(breeder)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(breeder)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para adicionar/editar criador */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "Adicionar Novo Criador" : "Editar Criador"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "add"
                ? "Preencha os detalhes para adicionar um novo criador."
                : "Atualize os detalhes do criador."}
            </DialogDescription>
          </DialogHeader>

          {feedback && (
            <Alert className={feedback.type === "error" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}>
              {feedback.type === "error" ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              <AlertDescription className={feedback.type === "error" ? "text-red-700" : "text-green-700"}>
                {feedback.message}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={dialogMode === "add" ? handleSaveNewBreeder : handleUpdateBreeder}>
            <div className="space-y-4 py-4">
              {dialogMode === "add" && (
                <div className="space-y-2">
                  <Label htmlFor="breed">Raça</Label>
                  <select
                    id="breed"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newBreeder.breedId}
                    onChange={(e) => setNewBreeder({ ...newBreeder, breedId: Number.parseInt(e.target.value) })}
                    required
                  >
                    <option value={0}>Selecione uma raça</option>
                    {dogBreeds.map((breed) => (
                      <option key={breed.id} value={breed.id}>
                        {breed.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nome do Criador</Label>
                <Input
                  id="name"
                  value={dialogMode === "add" ? newBreeder.name : editingBreeder?.name || ""}
                  onChange={(e) => {
                    if (dialogMode === "add") {
                      setNewBreeder({ ...newBreeder, name: e.target.value })
                    } else if (editingBreeder) {
                      setEditingBreeder({
                        ...editingBreeder,
                        name: e.target.value,
                      })
                    }
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={dialogMode === "add" ? newBreeder.location : editingBreeder?.location || ""}
                  onChange={(e) => {
                    if (dialogMode === "add") {
                      setNewBreeder({ ...newBreeder, location: e.target.value })
                    } else if (editingBreeder) {
                      setEditingBreeder({
                        ...editingBreeder,
                        location: e.target.value,
                      })
                    }
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (opcional)</Label>
                <Input
                  id="website"
                  value={dialogMode === "add" ? newBreeder.website : editingBreeder?.website || ""}
                  onChange={(e) => {
                    if (dialogMode === "add") {
                      setNewBreeder({ ...newBreeder, website: e.target.value })
                    } else if (editingBreeder) {
                      setEditingBreeder({
                        ...editingBreeder,
                        website: e.target.value,
                      })
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram (opcional)</Label>
                <Input
                  id="instagram"
                  value={dialogMode === "add" ? newBreeder.instagram : editingBreeder?.instagram || ""}
                  placeholder="@nome_do_criador"
                  onChange={(e) => {
                    if (dialogMode === "add") {
                      setNewBreeder({ ...newBreeder, instagram: e.target.value })
                    } else if (editingBreeder) {
                      setEditingBreeder({
                        ...editingBreeder,
                        instagram: e.target.value,
                      })
                    }
                  }}
                />
              </div>

              {dialogMode === "edit" && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={editingBreeder?.active}
                    onCheckedChange={(checked) => {
                      if (editingBreeder) {
                        setEditingBreeder({
                          ...editingBreeder,
                          active: checked,
                        })
                      }
                    }}
                    className="data-[state=checked]:bg-green-500"
                  />
                  <Label htmlFor="active">Criador ativo</Label>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-amber-700 hover:bg-amber-800"
                disabled={
                  isSubmitting ||
                  (dialogMode === "add" && (newBreeder.breedId === 0 || !newBreeder.name || !newBreeder.location))
                }
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    {dialogMode === "add" ? "Adicionando..." : "Atualizando..."}
                  </>
                ) : dialogMode === "add" ? (
                  "Adicionar"
                ) : (
                  "Atualizar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o criador "{deletingBreeder?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteBreeder} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
