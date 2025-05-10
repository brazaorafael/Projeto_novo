import { supabase } from "./supabase"

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string | null
  matched_breeds?: string[] | null
  created_at: string
  updated_at: string
}

// Função para obter todos os contatos
export async function getContacts(): Promise<Contact[]> {
  try {
    const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar contatos:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar contatos:", error)
    return []
  }
}

// Função para obter um contato por ID
export async function getContactById(id: string): Promise<Contact | null> {
  try {
    const { data, error } = await supabase.from("contacts").select("*").eq("id", id).single()

    if (error) {
      console.error(`Erro ao buscar contato com ID ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Erro ao buscar contato com ID ${id}:`, error)
    return null
  }
}

// Função para verificar se um email já está cadastrado
export async function getContactByEmail(email: string): Promise<Contact | null> {
  try {
    const { data, error } = await supabase.from("contacts").select("*").eq("email", email).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 é o código para "nenhum resultado encontrado"
      console.error(`Erro ao buscar contato com email ${email}:`, error)
    }

    return data || null
  } catch (error) {
    console.error(`Erro ao buscar contato com email ${email}:`, error)
    return null
  }
}

// Função para adicionar um novo contato
export async function addContact(contact: {
  name: string
  email: string
  phone?: string
  matched_breeds?: string[]
}): Promise<Contact | null> {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .insert({
        name: contact.name,
        email: contact.email,
        phone: contact.phone || null,
        matched_breeds: contact.matched_breeds || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao adicionar contato:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Erro ao adicionar contato:", error)
    return null
  }
}

// Função para excluir um contato
export async function deleteContact(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("contacts").delete().eq("id", id)

    if (error) {
      console.error(`Erro ao excluir contato com ID ${id}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Erro ao excluir contato com ID ${id}:`, error)
    return false
  }
}

// Função para atualizar um contato
export async function updateContact(
  id: string,
  updates: Partial<Omit<Contact, "id" | "created_at" | "updated_at">>,
): Promise<Contact | null> {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error(`Erro ao atualizar contato com ID ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Erro ao atualizar contato com ID ${id}:`, error)
    return null
  }
}

// Função para contar o número de contatos
export async function countContacts(): Promise<number> {
  try {
    const { count, error } = await supabase.from("contacts").select("*", { count: "exact", head: true })

    if (error) {
      console.error("Erro ao contar contatos:", error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error("Erro ao contar contatos:", error)
    return 0
  }
}
