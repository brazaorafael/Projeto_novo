// Credenciais de administrador
// Em um sistema real, isso estaria em um banco de dados seguro
// e a senha seria armazenada com hash
export const ADMIN_CREDENTIALS = {
  username: "admin",
  // Senha padrão: dogbreeder2024
  // Esta é apenas uma implementação básica, em produção use um sistema de autenticação adequado
  password: "dogbreeder2024",
}

// Função para verificar as credenciais
export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}
