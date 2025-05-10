"use server"

import { supabase } from "@/lib/auth-simple"
import { revalidatePath } from "next/cache"

export async function saveContact(formData: FormData) {
  try {
    // Extrair dados do formulário
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const matchedBreeds = formData.get("matchedBreeds") as string

    console.log("Dados do formulário:", { name, email, phone, matchedBreeds })

    // Validação básica
    if (!name || !email) {
      return {
        success: false,
        message: "Nome e email são obrigatórios",
      }
    }

    // Verificar se o email já existe
    const { data: existingContact, error: checkError } = await supabase
      .from("contacts")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (checkError) {
      console.error("Erro ao verificar email existente:", checkError)
      return {
        success: false,
        message: "Erro ao verificar email existente",
      }
    }

    if (existingContact) {
      return {
        success: false,
        message: "Este email já está cadastrado",
      }
    }

    // Salvar o contato
    const parsedBreeds = matchedBreeds ? JSON.parse(matchedBreeds) : []
    const { data: newContact, error } = await supabase
      .from("contacts")
      .insert({
        name,
        email,
        phone: phone || null,
        matched_breeds: parsedBreeds,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao salvar contato:", error)
      return {
        success: false,
        message: "Erro ao salvar contato. Por favor, tente novamente.",
      }
    }

    // Revalidar a página para atualizar os dados
    revalidatePath("/admin/contacts")
    revalidatePath("/resultados")

    return {
      success: true,
      message: "Contato salvo com sucesso!",
      contact: newContact,
    }
  } catch (error) {
    console.error("Erro ao salvar contato:", error)

    // Provide a more user-friendly error message
    let errorMessage = "Ocorreu um erro ao salvar o contato."

    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      message: errorMessage,
    }
  }
}
