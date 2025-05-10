import { supabase } from "./auth-simple"
import type { Database } from "./database.types"

export type Breeder = Database["public"]["Tables"]["breeders"]["Row"]
export type BreederInsert = Database["public"]["Tables"]["breeders"]["Insert"]
export type BreederUpdate = Database["public"]["Tables"]["breeders"]["Update"]

// Função para obter todos os criadores
export async function getBreeders(): Promise<Breeder[]> {
  try {
    const { data, error } = await supabase.from("breeders").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Erro ao buscar criadores:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar criadores:", error)
    return []
  }
}

// Função para obter criadores por ID de raça
export async function getBreedersByBreedId(breedId: number): Promise<Breeder[]> {
  try {
    const { data, error } = await supabase
      .from("breeders")
      .select("*")
      .eq("breed_id", breedId)
      .eq("active", true)
      .order("name", { ascending: true })

    if (error) {
      console.error(`Erro ao buscar criadores para raça ${breedId}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error(`Erro ao buscar criadores para raça ${breedId}:`, error)
    return []
  }
}

// Função para obter um criador por ID
export async function getBreederById(id: string): Promise<Breeder | null> {
  try {
    const { data, error } = await supabase.from("breeders").select("*").eq("id", id).single()

    if (error) {
      console.error(`Erro ao buscar criador com ID ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Erro ao buscar criador com ID ${id}:`, error)
    return null
  }
}

// Função para adicionar um novo criador
export async function addBreeder(breeder: BreederInsert): Promise<Breeder | null> {
  try {
    const { data, error } = await supabase
      .from("breeders")
      .insert({
        ...breeder,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao adicionar criador:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Erro ao adicionar criador:", error)
    return null
  }
}

// Função para atualizar um criador
export async function updateBreeder(id: string, updates: BreederUpdate): Promise<Breeder | null> {
  try {
    const { data, error } = await supabase
      .from("breeders")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error(`Erro ao atualizar criador com ID ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Erro ao atualizar criador com ID ${id}:`, error)
    return null
  }
}

// Função para excluir um criador
export async function deleteBreeder(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("breeders").delete().eq("id", id)

    if (error) {
      console.error(`Erro ao excluir criador com ID ${id}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Erro ao excluir criador com ID ${id}:`, error)
    return false
  }
}

// Função para alternar o status ativo de um criador
export async function toggleBreederStatus(id: string, active: boolean): Promise<Breeder | null> {
  try {
    const { data, error } = await supabase
      .from("breeders")
      .update({
        active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error(`Erro ao alternar status do criador com ID ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Erro ao alternar status do criador com ID ${id}:`, error)
    return null
  }
}
