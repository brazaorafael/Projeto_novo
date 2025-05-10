import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-800">
                  Encontre o Cachorro Perfeito para sua Família
                </h1>
                <p className="text-gray-500 text-sm">Powered by My Little Chin</p>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl mt-4">
                  Responda algumas perguntas simples e descubra quais raças de cachorro combinam melhor com o estilo de
                  vida da sua família.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-center">
                  <Link href="/questionario">
                    <Button className="bg-amber-700 hover:bg-amber-800 text-white">
                      Começar Questionário <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-start">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-gray-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-amber-600"
                  >
                    <path d="M9.06 11.9c-1.06 0-1.97.74-2.19 1.79-.32 1.53.63 2.9 2.16 3.2 1.53.32 2.9-.63 3.2-2.16l1.04-4.89" />
                    <path d="M14.94 11.9c1.06 0 1.97.74 2.19 1.79.32 1.53-.63 2.9-2.16 3.2-1.53.32-2.9-.63-3.2-2.16l-1.04-4.89" />
                    <path d="M17.29 6.7c.57-.6.56-1.55-.03-2.12a1.5 1.5 0 0 0-2.12.03l-2.54 2.67c-.39.4-.38 1.05.03 1.43l.07.06c.39.37 1 .37 1.39 0l3.2-2.07Z" />
                    <path d="M6.71 6.7c-.57-.6-.56-1.55.03-2.12a1.5 1.5 0 0 1 2.12.03l2.54 2.67c.39.4.38 1.05-.03 1.43l-.07.06c-.39.37-1 .37-1.39 0L6.71 6.7Z" />
                    <path d="M12 18v4" />
                    <path d="M8 22h8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Responda o Questionário</h3>
                <p className="text-gray-600">
                  Compartilhe informações sobre o estilo de vida da sua família, espaço disponível e preferências.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-gray-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-amber-600"
                  >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Algoritmo de Compatibilidade</h3>
                <p className="text-gray-600">
                  Nossa tecnologia analisa suas respostas e encontra as raças que melhor se adequam às suas
                  necessidades.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-gray-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-amber-600"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Descubra as Melhores Raças</h3>
                <p className="text-gray-600">
                  Receba recomendações personalizadas com fotos, descrições e informações sobre criadores no Brasil.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2025 Encontre Seu Cachorro Ideal. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
