"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Questionario() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    porte: "",
    objetivo: "",
    espaco: 50,
    tempo: "",
    criancas: "",
    alergia: "",
    queda_pelos: "",
    experiencia: "",
    atividade: "",
    energia: "",
    cuidados: "",
  })

  const [showWarning, setShowWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState("")

  const questions = [
    {
      title: "Qual o porte do cachorro que vocês buscam?",
      description: "Escolha o tamanho que melhor se adapta à sua família",
      field: "porte",
      options: [
        { value: "pequeno", label: "Pequeno (até 10kg)" },
        { value: "medio", label: "Médio (10-25kg)" },
        { value: "grande", label: "Grande (25-50kg)" },
        { value: "gigante", label: "Gigante (acima de 50kg)" },
      ],
    },
    {
      title: "Qual o principal objetivo para ter um cachorro?",
      description: "Escolha a função principal que o cão terá na sua família",
      field: "objetivo",
      options: [
        { value: "companhia", label: "Companhia" },
        { value: "guarda", label: "Guarda e Proteção" },
        { value: "esporte", label: "Esportes e Hobby" },
      ],
    },
    {
      title: "Quanto espaço vocês têm disponível?",
      description: "Arraste o controle deslizante para indicar o espaço disponível",
      field: "espaco",
      type: "slider",
      labels: ["Apartamento pequeno", "Casa com quintal grande"],
    },
    {
      title: "Quanto tempo disponível para o cão diariamente?",
      description: "Escolha a opção que melhor descreve sua disponibilidade",
      field: "tempo",
      options: [
        { value: "pouco", label: "Pouco tempo (algumas horas por dia)" },
        { value: "medio", label: "Algum tempo (meio período em casa)" },
        { value: "muito", label: "Muito tempo (passo o dia todo em casa com o cão)" },
      ],
    },
    {
      title: "Qual nível de energia você prefere em um cão?",
      description: "Escolha o nível de energia que melhor se adapta ao seu estilo de vida",
      field: "energia",
      options: [
        { value: "baixo", label: "Baixo (cão calmo, que gosta de ficar deitado)" },
        { value: "medio", label: "Médio (cão equilibrado, com momentos de atividade e descanso)" },
        { value: "alto", label: "Alto (cão muito ativo, sempre disposto a brincar e se exercitar)" },
      ],
    },
    {
      title: "Há crianças pequenas na família?",
      description: "Escolha a opção que melhor descreve sua situação",
      field: "criancas",
      options: [
        { value: "sim", label: "Sim, temos crianças pequenas" },
        { value: "nao", label: "Não temos crianças ou são mais velhas" },
      ],
    },
    {
      title: "Alguém na família tem alergia a pelos de cachorro?",
      description: "Escolha a opção que melhor descreve sua situação",
      field: "alergia",
      options: [
        { value: "sim", label: "Sim, temos pessoas com alergia" },
        { value: "leve", label: "Alergia leve ou ocasional" },
        { value: "nao", label: "Não temos problemas com alergia" },
      ],
    },
    {
      title: "Vocês se incomodam com queda de pelos?",
      description: "Escolha a opção que melhor descreve sua tolerância",
      field: "queda_pelos",
      options: [
        { value: "muito", label: "Sim, muito (prefiro cães que não soltam pelos)" },
        { value: "pouco", label: "Um pouco (tolero alguma queda de pelos)" },
        { value: "nao", label: "Não me incomodo com queda de pelos" },
      ],
    },
    {
      title: "Qual sua experiência com cães?",
      description: "Escolha o nível de experiência da família",
      field: "experiencia",
      options: [
        { value: "nenhuma", label: "Primeira vez (nenhuma experiência)" },
        { value: "alguma", label: "Alguma experiência" },
        { value: "muita", label: "Muita experiência" },
      ],
    },
    {
      title: "Qual o nível de atividade física da família?",
      description: "Escolha o nível que melhor representa sua família",
      field: "atividade",
      options: [
        { value: "baixo", label: "Baixo (passeios curtos)" },
        { value: "medio", label: "Médio (passeios regulares)" },
        { value: "alto", label: "Alto (corridas, trilhas, esportes)" },
      ],
    },
    {
      title: "Quanto tempo você dedica aos cuidados com a pelagem do cão?",
      description:
        "Escolha a opção que melhor descreve sua disponibilidade para escovação, banhos e cuidados específicos",
      field: "cuidados",
      options: [
        { value: "baixa", label: "Mínimo possível (prefiro cães de pelagem curta e fácil manutenção)" },
        { value: "media", label: "Moderado (disponível para escovação semanal e cuidados básicos)" },
        { value: "alta", label: "Dedicado (disponível para escovação diária e cuidados especializados)" },
      ],
    },
  ]

  const handleNext = () => {
    // Verificar combinações inadequadas
    if (currentStep === 2 && answers.porte === "gigante" && answers.espaco < 40) {
      setWarningMessage(
        "Cães de porte gigante precisam de bastante espaço. Recomendamos uma rotina bem estruturada de passeios diários e adestramento adequado se você planeja ter um cão gigante em um espaço pequeno.",
      )
      setShowWarning(true)
    } else if (currentStep === 9 && answers.energia === "alto" && answers.atividade === "baixo") {
      setWarningMessage(
        "Cães com alto nível de energia precisam de bastante atividade física. Considere aumentar seu nível de atividade ou escolher um cão com menor nível de energia.",
      )
      setShowWarning(true)
    } else {
      setShowWarning(false)
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        // Enviar respostas e navegar para a página de resultados
        router.push(`/resultados?${new URLSearchParams(answers).toString()}`)
      }
    }
  }

  const handlePrevious = () => {
    setShowWarning(false)
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAnswerChange = (field, value) => {
    setAnswers({ ...answers, [field]: value })
  }

  const handleContinueAnyway = () => {
    setShowWarning(false)
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Enviar respostas e navegar para a página de resultados
      router.push(`/resultados?${new URLSearchParams(answers).toString()}`)
    }
  }

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  const isCurrentQuestionAnswered = () => {
    const field = currentQuestion.field
    return answers[field] !== undefined && answers[field] !== ""
  }

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Questionário de Compatibilidade</h1>
        <p className="text-gray-500 text-center text-sm">Powered by My Little Chin</p>
        <p className="text-gray-600 text-center mb-4 mt-2">
          Responda às perguntas para encontrarmos as raças ideais para sua família
        </p>
        <Progress value={progress} className="h-2 w-full bg-gray-200" indicatorClassName="bg-amber-600" />
        <p className="text-sm text-gray-500 mt-2 text-right">
          Pergunta {currentStep + 1} de {questions.length}
        </p>
      </div>

      <Card className="w-full border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-gray-800">{currentQuestion.title}</CardTitle>
          <CardDescription>{currentQuestion.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {showWarning && (
            <Alert className="mb-4 bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Atenção</AlertTitle>
              <AlertDescription className="text-amber-700">{warningMessage}</AlertDescription>
            </Alert>
          )}

          {currentQuestion.type === "slider" ? (
            <div className="space-y-4">
              <Slider
                defaultValue={[answers[currentQuestion.field] || 50]}
                max={100}
                step={1}
                onValueChange={(value) => handleAnswerChange(currentQuestion.field, value[0])}
                className="[&>span]:bg-amber-600"
              />
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{currentQuestion.labels[0]}</span>
                <span className="text-sm text-gray-500">{currentQuestion.labels[1]}</span>
              </div>
            </div>
          ) : (
            <RadioGroup
              value={answers[currentQuestion.field]}
              onValueChange={(value) => handleAnswerChange(currentQuestion.field, value)}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} className="text-amber-600 border-gray-400" />
                  <Label htmlFor={option.value} className="cursor-pointer text-gray-700">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="border-gray-300 text-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
          <div className="flex gap-2">
            {showWarning && (
              <Button onClick={handleContinueAnyway} variant="outline" className="border-amber-300 text-amber-700">
                Continuar mesmo assim
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered()}
              className="bg-amber-700 hover:bg-amber-800 text-white"
            >
              {currentStep < questions.length - 1 ? (
                <>
                  Próximo <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Finalizar <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
