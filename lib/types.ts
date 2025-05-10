// Tipos para o sistema de raças e criadores

export interface Breeder {
  id: string
  name: string
  location: string
  website?: string
  instagram?: string
  active: boolean
}

export interface DogBreed {
  id: number
  name: string
  size: string
  purpose: string
  description: string
  image: string
  energyLevel: string
  coat: string
  trainability: number
  childFriendly: number
  exerciseNeeds: number
  groomingNeeds: number
  shedding: number
  breeders: Breeder[]
}
