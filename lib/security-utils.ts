import DOMPurify from "dompurify"

// Sanitiza strings para prevenir XSS
export function sanitizeInput(input: string): string {
  if (typeof window === "undefined") return input
  return DOMPurify.sanitize(input)
}

// Valida endereços de carteira Ethereum
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Valida emails
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Valida números de telefone brasileiros
export function isValidBrazilianPhone(phone: string): boolean {
  // Remove caracteres não numéricos
  const numericPhone = phone.replace(/\D/g, "")
  // Verifica se tem entre 10 e 11 dígitos (com ou sem DDD)
  return /^(?:\d{10,11})$/.test(numericPhone)
}

// Gera um nonce aleatório para proteção CSRF
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Limita a taxa de requisições (rate limiting)
const requestCounts: Record<string, { count: number; timestamp: number }> = {}

export function checkRateLimit(identifier: string, limit = 5, timeWindowMs = 60000): boolean {
  const now = Date.now()

  if (!requestCounts[identifier]) {
    requestCounts[identifier] = { count: 1, timestamp: now }
    return true
  }

  const record = requestCounts[identifier]

  // Resetar contador se estiver fora da janela de tempo
  if (now - record.timestamp > timeWindowMs) {
    record.count = 1
    record.timestamp = now
    return true
  }

  // Verificar se excedeu o limite
  if (record.count >= limit) {
    return false
  }

  // Incrementar contador
  record.count++
  return true
}

// Função para validar tokens JWT
export function validateJWT(token: string): boolean {
  try {
    // Verificação básica de formato
    const parts = token.split(".")
    if (parts.length !== 3) return false

    // Em produção, aqui seria feita a verificação completa da assinatura
    return true
  } catch (error) {
    return false
  }
}

// Função para sanitizar objetos recursivamente
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result = {} as T

  for (const key in obj) {
    if (typeof obj[key] === "string") {
      result[key] = sanitizeInput(obj[key]) as any
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      result[key] = sanitizeObject(obj[key])
    } else {
      result[key] = obj[key]
    }
  }

  return result
}
