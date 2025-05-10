"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, AlertTriangle, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { dogBreeds } from "@/lib/dog-breeds"
import { calculateMatch } from "@/lib/calculate-match"
import { saveContact } from "../actions/contact-actions"
import { getBreedersByBreedId } from "@/lib/breeders-service"

export default function Resultados() {
  const searchParams = useSearchParams()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState({ type: "", message: "" })

  useEffect(() => {
    // Extrair respostas dos parâmetros de URL
    const answers = {
      porte: searchParams.get("porte") || "",
      objetivo: searchParams.get("objetivo") || "",
      espaco: Number.parseInt(searchParams.get("espaco") || "50"),
      tempo: searchParams.get("tempo") || "",
      criancas: searchParams.get("criancas") || "",
      alergia: searchParams.get("alergia") || "",
      queda_pelos: searchParams.get("queda_pelos") || "",
      experiencia: searchParams.get("experiencia") || "",
      atividade: searchParams.get("atividade") || "",
      energia: searchParams.get("energia") || "",
      cuidados: searchParams.get("cuidados") || "",
    }

    // Calcular compatibilidade com todas as raças
    const results = calculateMatch(answers, dogBreeds)

    // Ordenar por porcentagem de compatibilidade (do maior para o menor)
    const sortedResults = results.sort((a, b) => b.matchPercentage - a.matchPercentage)

    // Pegar os 5 melhores resultados
    const topMatches = sortedResults.slice(0, 5)

    setMatches(topMatches)
    setLoading(false)
  }, [searchParams.toString()]) // Usar searchParams.toString() como dependência

  // Buscar criadores do banco de dados para cada raça
  useEffect(() => {
    async function fetchBreedersForMatches() {
      if (matches.length > 0) {
        const updatedMatches = [...matches]

        for (let i = 0; i < updatedMatches.length; i++) {
          const match = updatedMatches[i]
          try {
            const breeders = await getBreedersByBreedId(match.breed.id)
            if (breeders.length > 0) {
              // Atualizar os criadores da raça com os dados do banco
              updatedMatches[i] = {
                ...match,
                breed: {
                  ...match.breed,
                  breeders: breeders.map((b) => ({
                    id: b.id,
                    name: b.name,
                    location: b.location,
                    website: b.website,
                    instagram: b.instagram,
                    active: b.active,
                  })),
                },
              }
            }
          } catch (error) {
            console.error(`Erro ao buscar criadores para raça ${match.breed.id}:`, error)
          }
        }

        setMatches(updatedMatches)
      }
    }

    fetchBreedersForMatches()
  }, [matches])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFormMessage({ type: "", message: "" })

    // Preparar os dados do formulário
    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("phone", phone)

    // Adicionar as raças que deram match
    const matchedBreeds = matches.map((match) => match.breed.name)
    formData.append("matchedBreeds", JSON.stringify(matchedBreeds))

    try {
      // Enviar para o Server Action
      const result = await saveContact(formData)

      if (result.success) {
        setSubmitted(true)
        setFormMessage({ type: "success", message: result.message })
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

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Calculando as melhores raças para você...</h2>
        <Progress value={66} className="w-full max-w-md mx-auto bg-gray-200" indicatorClassName="bg-amber-600" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Suas Raças Ideais</h1>
        <p className="text-gray-500 text-center text-sm">Powered by My Little Chin</p>
        <p className="text-gray-600 text-center mt-2">
          Com base nas suas respostas, estas são as raças de cachorro mais compatíveis com sua família
        </p>
      </div>

      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" className="border-gray-300 text-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao início
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {matches.map((match, index) => (
          <Card key={match.breed.id} className="overflow-hidden border-gray-200">
            <Tabs defaultValue="info">
              <div className="md:grid md:grid-cols-3">
                <div className="relative h-64 md:h-full">
                  <div className="w-full h-full relative">
                    {/* Usar img padrão em vez do componente Image do Next.js */}
                    <img
                      src={match.breed.image || "/placeholder.svg"}
                      alt={match.breed.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h2 className="text-white text-xl font-bold">{match.breed.name}</h2>
                    <div className="flex items-center mt-2">
                      <div className="bg-white/20 rounded-full px-3 py-1 text-white text-sm">
                        {match.matchPercentage}% de compatibilidade
                      </div>
                      {match.breed.name === "Japanese Chin" && (
                        <div className="ml-2 bg-amber-500/70 rounded-full px-3 py-1 text-white text-xs">
                          Recomendado por My Little Chin
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="p-4 border-b border-gray-200">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger
                        value="info"
                        className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-900"
                      >
                        Informações
                      </TabsTrigger>
                      <TabsTrigger
                        value="characteristics"
                        className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-900"
                      >
                        Características
                      </TabsTrigger>
                      <TabsTrigger
                        value="breeders"
                        className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-900"
                      >
                        Criadores
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="info" className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-lg text-gray-800">Sobre a Raça</h3>
                        <p className="text-gray-600 mt-1">{match.breed.description}</p>
                      </div>

                      {match.warnings && match.warnings.length > 0 && (
                        <Alert className="bg-amber-50 border-amber-200">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-amber-700">
                            <strong className="font-medium">Pontos de atenção:</strong>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              {match.warnings.map((warning, idx) => (
                                <li key={idx}>{warning}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-800">Porte</h4>
                          <p className="text-gray-600">{match.breed.size}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Função Principal</h4>
                          <p className="text-gray-600">{match.breed.purpose}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Nível de Energia</h4>
                          <p className="text-gray-600">{match.breed.energyLevel}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Tipo de Pelagem</h4>
                          <p className="text-gray-600">{match.breed.coat}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="characteristics" className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Facilidade de Treinamento</span>
                          <span className="text-sm font-medium text-gray-700">{match.breed.trainability}/10</span>
                        </div>
                        <Progress
                          value={match.breed.trainability * 10}
                          className="h-2 bg-gray-200"
                          indicatorClassName="bg-amber-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Amigável com Crianças</span>
                          <span className="text-sm font-medium text-gray-700">{match.breed.childFriendly}/10</span>
                        </div>
                        <Progress
                          value={match.breed.childFriendly * 10}
                          className="h-2 bg-gray-200"
                          indicatorClassName="bg-amber-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Necessidade de Exercícios</span>
                          <span className="text-sm font-medium text-gray-700">{match.breed.exerciseNeeds}/10</span>
                        </div>
                        <Progress
                          value={match.breed.exerciseNeeds * 10}
                          className="h-2 bg-gray-200"
                          indicatorClassName="bg-amber-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Facilidade de Cuidados</span>
                          <span className="text-sm font-medium text-gray-700">{match.breed.groomingNeeds}/10</span>
                        </div>
                        <Progress
                          value={match.breed.groomingNeeds * 10}
                          className="h-2 bg-gray-200"
                          indicatorClassName="bg-amber-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Queda de Pelos</span>
                          <span className="text-sm font-medium text-gray-700">{match.breed.shedding}/10</span>
                        </div>
                        <Progress
                          value={match.breed.shedding * 10}
                          className="h-2 bg-gray-200"
                          indicatorClassName="bg-amber-600"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="breeders" className="p-6">
                    <div className="space-y-4">
                      {match.breed.breeders && match.breed.breeders.length > 0 ? (
                        match.breed.breeders
                          .filter((breeder) => breeder.active !== false) // Filtrar apenas criadores ativos
                          .map((breeder, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4">
                              <h3 className="font-medium text-gray-800">{breeder.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{breeder.location}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {breeder.website && (
                                  <Button variant="outline" size="sm" asChild className="border-gray-300 text-gray-700">
                                    <a href={breeder.website} target="_blank" rel="noopener noreferrer">
                                      Visitar Site <ExternalLink className="ml-2 h-3 w-3" />
                                    </a>
                                  </Button>
                                )}
                                {breeder.instagram && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="border-pink-200 text-pink-700 hover:bg-pink-50"
                                  >
                                    <a
                                      href={`https://instagram.com/${breeder.instagram.replace("@", "")}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Instagram{" "}
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
                                        className="ml-2 h-3 w-3"
                                      >
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                      </svg>
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          Não temos informações de criadores para esta raça no momento.
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Receba Novidades e Dicas</h2>
        <p className="text-gray-600 mb-6">
          Cadastre-se para receber informações sobre cuidados com seu cão, produtos recomendados e novidades do mundo
          pet.
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800">Cadastro realizado com sucesso!</h3>
              <p className="text-green-700 text-sm mt-1">
                Obrigado por se cadastrar. Em breve você receberá nossas novidades por email.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {formMessage.message && (
              <Alert
                className={formMessage.type === "error" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}
              >
                {formMessage.type === "error" ? (
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                ) : (
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                )}
                <AlertDescription className={formMessage.type === "error" ? "text-red-700" : "text-green-700"}>
                  {formMessage.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  placeholder="Digite seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
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
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={setAcceptTerms}
                className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 border-gray-300"
              />
              <Label htmlFor="terms" className="text-sm text-gray-600 leading-tight">
                Concordo em receber emails com novidades, dicas e ofertas relacionadas ao mundo pet. Poderei cancelar a
                qualquer momento.
              </Label>
            </div>
            <Button
              type="submit"
              disabled={!acceptTerms || submitting}
              className="bg-amber-700 hover:bg-amber-800 text-white"
            >
              {submitting ? "Enviando..." : "Cadastrar"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
