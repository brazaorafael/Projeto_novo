"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBox({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(defaultValue)
  const [isPending, startTransition] = useTransition()

  const handleSearch = (term: string) => {
    setSearchTerm(term)

    startTransition(() => {
      // Create new URLSearchParams
      const params = new URLSearchParams(searchParams)

      // Update or remove the search param
      if (term) {
        params.set("search", term)
      } else {
        params.delete("search")
      }

      // Update the URL
      router.replace(`/admin/contacts?${params.toString()}`)
    })
  }

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder="Buscar por nome, email ou telefone..."
        className="pl-9"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isPending && (
        <div className="absolute right-2.5 top-2.5">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
        </div>
      )}
    </div>
  )
}
