"use server"

import { revalidatePath } from "next/cache"
import { addBreeder, updateBreeder, deleteBreeder, toggleBreederStatus } from "@/lib/breeders-service"
import type { BreederInsert, BreederUpdate } from "@/lib/breeders-service"

// Ação para adicionar um novo criador
export async function createBreeder(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const location = formData.get("location") as string
    const website = (formData.get("website") as string) || null
    const instagram = (formData.get("instagram") as string) || null
    const breedId = Number.parseInt(formData.get("breedId") as string)
    const breedName = formData.get("breedName") as string

    // Validação básica
    if (!name || !location || !breedId || !breedName) {
      return {
        success: false,
        message: "Todos os campos obrigatórios devem ser preenchidos",
      }
    }

    const newBreeder: BreederInsert = {
      name,
      location,
      website,
      instagram,
      breed_id: breedId,
      breed_name: breedName,
      active: true,
    }

    const result = await addBreeder(newBreeder)

    if (!result) {
      return {
        success: false,
        message: "Erro ao adicionar criador",
      }
    }

    // Revalidar a página para atualizar os dados
    revalidatePath("/admin/breeders")

    return {
      success: true,
      message: "Criador adicionado com sucesso!",
      breeder: result,
    }
  } catch (error) {
    console.error("Erro ao adicionar criador:", error)
    return {
      success: false,
      message: "Ocorreu um erro ao adicionar o criador",
    }
  }
}

// Ação para atualizar um criador existente
export async function updateBreederAction(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const location = formData.get("location") as string
    const website = (formData.get("website") as string) || null
    const instagram = (formData.get("instagram") as string) || null
    const active = formData.get("active") === "true"

    // Validação básica
    if (!id || !name || !location) {
      return {
        success: false,
        message: "Todos os campos obrigatórios devem ser preenchidos",
      }
    }

    const updates: BreederUpdate = {
      name,
      location,
      website,
      instagram,
      active,
    }

    const result = await updateBreeder(id, updates)

    if (!result) {
      return {
        success: false,
        message: "Erro ao atualizar criador",
      }
    }

    // Revalidar a página para atualizar os dados
    revalidatePath("/admin/breeders")

    return {
      success: true,
      message: "Criador atualizado com sucesso!",
      breeder: result,
    }
  } catch (error) {
    console.error("Erro ao atualizar criador:", error)
    return {
      success: false,
      message: "Ocorreu um erro ao atualizar o criador",
    }
  }
}

// Ação para excluir um criador
export async function deleteBreederAction(formData: FormData) {
  try {
    const id = formData.get("id") as string

    if (!id) {
      return {
        success: false,
        message: "ID do criador não fornecido",
      }
    }

    const result = await deleteBreeder(id)

    if (!result) {
      return {
        success: false,
        message: "Erro ao excluir criador",
      }
    }

    // Revalidar a página para atualizar os dados
    revalidatePath("/admin/breeders")

    return {
      success: true,
      message: "Criador excluído com sucesso!",
    }
  } catch (error) {
    console.error("Erro ao excluir criador:", error)
    return {
      success: false,
      message: "Ocorreu um erro ao excluir o criador",
    }
  }
}

// Ação para alternar o status ativo de um criador
export async function toggleBreederStatusAction(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const active = formData.get("active") === "true"

    if (!id) {
      return {
        success: false,
        message: "ID do criador não fornecido",
      }
    }

    const result = await toggleBreederStatus(id, active)

    if (!result) {
      return {
        success: false,
        message: "Erro ao alternar status do criador",
      }
    }

    // Revalidar a página para atualizar os dados
    revalidatePath("/admin/breeders")

    return {
      success: true,
      message: `Criador ${active ? "ativado" : "desativado"} com sucesso!`,
      breeder: result,
    }
  } catch (error) {
    console.error("Erro ao alternar status do criador:", error)
    return {
      success: false,
      message: "Ocorreu um erro ao alternar o status do criador",
    }
  }
}
