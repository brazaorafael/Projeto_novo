// Armazenamento global no servidor
// Isso será reiniciado quando o servidor for reiniciado, mas é uma solução de fallback

// Tipo para o armazenamento global
type ServerStore = {
  contacts: any[]
}

// Inicializar o armazenamento global
let serverStore: ServerStore = {
  contacts: [],
}

// Função para obter o armazenamento global
export const getServerStore = (): ServerStore => {
  return serverStore
}

// Função para atualizar o armazenamento global
export const updateServerStore = (newStore: Partial<ServerStore>) => {
  serverStore = { ...serverStore, ...newStore }
}

// Função para adicionar um contato ao armazenamento global
export const addContactToServerStore = (contact: any) => {
  serverStore.contacts.push(contact)
}

// Função para remover um contato do armazenamento global
export const removeContactFromServerStore = (id: string) => {
  serverStore.contacts = serverStore.contacts.filter((contact) => contact.id !== id)
}

// Função para obter um contato do armazenamento global por ID
export const getContactFromServerStoreById = (id: string) => {
  return serverStore.contacts.find((contact) => contact.id === id)
}

// Função para obter um contato do armazenamento global por email
export const getContactFromServerStoreByEmail = (email: string) => {
  return serverStore.contacts.find((contact) => contact.email === email)
}
