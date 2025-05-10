"use client"

import { useState, useEffect } from "react"
import { dogBreeds } from "@/lib/dog-breeds"
import { additionalDogBreeds } from "@/lib/dog-breeds-additions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function BreedsList() {
  const [missingPhotos, setMissingPhotos] = useState<string[]>([])
  const [allBreeds, setAllBreeds] = useState<any[]>([])

  useEffect(() => {
    // Combine all breeds
    const combined = [...dogBreeds, ...additionalDogBreeds]
    setAllBreeds(combined)

    // Check for missing or placeholder photos
    const missing = combined
      .filter(
        (breed) =>
          !breed.image ||
          breed.image.includes("placeholder") ||
          (breed.image.startsWith("/images/breeds/") && breed.image.includes("placeholder")),
      )
      .map((breed) => breed.name)

    setMissingPhotos(missing)
  }, [])

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Raças de Cachorro</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Lista de Raças</span>
            <Badge>{allBreeds.length} raças</Badge>
          </CardTitle>
          {missingPhotos.length > 0 && (
            <div className="mt-2">
              <Badge variant="destructive" className="mb-2">
                {missingPhotos.length} raças sem fotos
              </Badge>
              <p className="text-sm text-gray-500">As seguintes raças estão sem fotos ou usando placeholders:</p>
              <ul className="list-disc pl-5 mt-1 text-sm text-red-500">
                {missingPhotos.map((breed) => (
                  <li key={breed}>{breed}</li>
                ))}
              </ul>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Porte</TableHead>
                <TableHead>Propósito</TableHead>
                <TableHead>Status da Foto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allBreeds.map((breed) => (
                <TableRow key={breed.id}>
                  <TableCell>{breed.id}</TableCell>
                  <TableCell className="font-medium">{breed.name}</TableCell>
                  <TableCell>{breed.size}</TableCell>
                  <TableCell>{breed.purpose}</TableCell>
                  <TableCell>
                    {!breed.image || breed.image.includes("placeholder") ? (
                      <Badge variant="destructive">Sem foto</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Com foto
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
