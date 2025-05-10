import fs from "fs"
import path from "path"
import { cookies } from "next/headers"
import {
  getServerStore,
  addContactToServerStore,
  removeContactFromServerStore,
  getContactFromServerStoreById,
  getContactFromServerStoreByEmail,
} from "./server-store"

// Definir a interface para os contatos
export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: string
  matchedBreeds?: string[]
}

// Caminho para o arquivo JSON que armazenará os contatos
const DATA_DIR = path.join(process.cwd(), "data")
const contactsFilePath = path.join(DATA_DIR, "contacts.json")

// Verificar se estamos em ambiente de produção
const isProduction = process.env.NODE_ENV === "production"

// Cookie name for storing contacts
const CONTACTS_COOKIE_NAME = "dog_breeder_contacts"

// Garantir que o diretório data existe
export const ensureDirectoryExists = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      console.log(`Criando diretório: ${DATA_DIR}`)
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    // Criar o arquivo se não existir
    if (!fs.existsSync(contactsFilePath)) {
      console.log(`Criando arquivo de contatos: ${contactsFilePath}`)
      fs.writeFileSync(contactsFilePath, JSON.stringify([]), "utf8")
    }

    return true
  } catch (error) {
    console.error("Erro ao criar diretório ou arquivo:", error)
    return false
  }
}

// Função para obter todos os contatos
export const getContacts = (): Contact[] => {
  // In production, try to use cookies
  if (isProduction) {
    try {
      // Try to get contacts from cookies
      const cookieStore = cookies()
      const contactsCookie = cookieStore.get(CONTACTS_COOKIE_NAME)

      if (contactsCookie) {
        return JSON.parse(decodeURIComponent(contactsCookie.value))
      }

      // If no cookies, use server store as fallback
      return getServerStore().contacts
    } catch (error) {
      console.warn("Error reading contacts from cookies:", error)
      // Use server store as fallback
      return getServerStore().contacts
    }
  }

  // In development, use filesystem
  const directoryExists = ensureDirectoryExists()
  if (!directoryExists) {
    console.error("Não foi possível garantir que o diretório existe")
    return []
  }

  try {
    const data = fs.readFileSync(contactsFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Erro ao ler contatos:", error)
    return []
  }
}

// Função para adicionar um novo contato
export const addContact = (contact: Omit<Contact, "id" | "createdAt">): Contact => {
  // Create the new contact object
  const newContact: Contact = {
    ...contact,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  // In production, use cookies
  if (isProduction) {
    try {
      // Get existing contacts from cookies
      const cookieStore = cookies()
      const contactsCookie = cookieStore.get(CONTACTS_COOKIE_NAME)

      let existingContacts: Contact[] = []
      if (contactsCookie) {
        existingContacts = JSON.parse(decodeURIComponent(contactsCookie.value))
      }

      // Add new contact
      existingContacts.push(newContact)

      // Save back to cookies
      cookieStore.set({
        name: CONTACTS_COOKIE_NAME,
        value: encodeURIComponent(JSON.stringify(existingContacts)),
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })

      // Also save to server store as fallback
      addContactToServerStore(newContact)

      return newContact
    } catch (error) {
      console.warn("Error saving contact to cookies:", error)

      // Use server store as fallback
      addContactToServerStore(newContact)

      return newContact
    }
  }

  // In development, use filesystem
  const directoryExists = ensureDirectoryExists()
  if (!directoryExists) {
    throw new Error("Não foi possível garantir que o diretório existe")
  }

  const contacts = getContacts()
  contacts.push(newContact)

  try {
    fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2), "utf8")
    console.log(`Contato salvo com sucesso: ${newContact.name} (${newContact.email})`)
    return newContact
  } catch (error) {
    console.error("Erro ao salvar contato:", error)
    throw new Error("Falha ao salvar o contato")
  }
}

// Função para buscar um contato por ID
export const getContactById = (id: string): Contact | undefined => {
  if (isProduction) {
    try {
      const contacts = getContacts()
      const contact = contacts.find((c) => c.id === id)
      if (contact) return contact

      // If not found in cookies, try server store
      return getContactFromServerStoreById(id)
    } catch (error) {
      console.warn("Error getting contact by ID:", error)
      return getContactFromServerStoreById(id)
    }
  }

  const contacts = getContacts()
  return contacts.find((contact) => contact.id === id)
}

// Função para buscar contatos por email
export const getContactByEmail = (email: string): Contact | undefined => {
  if (isProduction) {
    try {
      const contacts = getContacts()
      const contact = contacts.find((c) => c.email === email)
      if (contact) return contact

      // If not found in cookies, try server store
      return getContactFromServerStoreByEmail(email)
    } catch (error) {
      console.warn("Error getting contact by email:", error)
      return getContactFromServerStoreByEmail(email)
    }
  }

  const contacts = getContacts()
  return contacts.find((contact) => contact.email === email)
}

// Função para excluir um contato
export const deleteContact = (id: string): boolean => {
  const contacts = getContacts()
  const filteredContacts = contacts.filter((contact) => contact.id !== id)

  if (filteredContacts.length === contacts.length) {
    return false // Nenhum contato foi removido
  }

  // In production, use cookies
  if (isProduction) {
    try {
      // Save filtered contacts back to cookies
      const cookieStore = cookies()

      cookieStore.set({
        name: CONTACTS_COOKIE_NAME,
        value: encodeURIComponent(JSON.stringify(filteredContacts)),
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })

      // Also update server store
      removeContactFromServerStore(id)

      return true
    } catch (error) {
      console.warn("Error deleting contact from cookies:", error)

      // Use server store as fallback
      removeContactFromServerStore(id)

      return true
    }
  }

  // In development, use filesystem
  try {
    fs.writeFileSync(contactsFilePath, JSON.stringify(filteredContacts, null, 2), "utf8")
    console.log(`Contato excluído com sucesso: ${id}`)
    return true
  } catch (error) {
    console.error("Erro ao excluir contato:", error)
    return false
  }
}

// Função para verificar o status do sistema de contatos
export const checkContactsSystem = () => {
  const directoryExists = fs.existsSync(DATA_DIR)
  const fileExists = fs.existsSync(contactsFilePath)
  let fileContent = null
  let contactsCount = 0
  let serverStoreCount = 0

  if (isProduction) {
    try {
      // Try to get contacts from cookies
      const cookieStore = cookies()
      const contactsCookie = cookieStore.get(CONTACTS_COOKIE_NAME)

      if (contactsCookie) {
        const contacts = JSON.parse(decodeURIComponent(contactsCookie.value))
        contactsCount = contacts.length
      }

      // Also check server store
      serverStoreCount = getServerStore().contacts.length
    } catch (error) {
      console.error("Erro ao ler contatos do cookie:", error)
      serverStoreCount = getServerStore().contacts.length
    }
  } else if (fileExists) {
    try {
      const data = fs.readFileSync(contactsFilePath, "utf8")
      fileContent = JSON.parse(data)
      contactsCount = fileContent.length
    } catch (error) {
      console.error("Erro ao ler arquivo de contatos:", error)
    }
  }

  return {
    directoryExists,
    fileExists,
    contactsCount,
    serverStoreCount,
    directoryPath: DATA_DIR,
    filePath: contactsFilePath,
    storageMode: isProduction ? "cookies_with_server_fallback" : "filesystem",
  }
}
