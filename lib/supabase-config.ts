import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Configurações de segurança para o cliente Supabase
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: "loyalty-crypto-auth",
  },
  global: {
    headers: {
      "X-Client-Info": "loyalty-crypto-web",
    },
  },
  // Configurações para limitar requisições e prevenir abusos
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
}

// Singleton pattern para o cliente Supabase no lado do cliente
let clientSingleton: ReturnType<typeof createClient> | null = null

export function createClientComponentClient() {
  if (clientSingleton) return clientSingleton

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase URL and Anon Key must be defined")
  }

  clientSingleton = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseOptions,
  )

  return clientSingleton
}

// Cliente Supabase para o lado do servidor com chave de serviço
export function createServerComponentClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase URL and Service Role Key must be defined")
  }

  return createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    ...supabaseOptions,
    auth: {
      ...supabaseOptions.auth,
      persistSession: false,
    },
  })
}

// Função para sanitizar dados antes de enviar para o Supabase
export function sanitizeSupabaseData<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data }

  // Remover propriedades potencialmente perigosas
  const dangerousProps = ["__proto__", "constructor", "prototype"]
  dangerousProps.forEach((prop) => {
    if (prop in sanitized) {
      delete sanitized[prop]
    }
  })

  // Sanitizar strings para prevenir SQL injection
  Object.keys(sanitized).forEach((key) => {
    if (typeof sanitized[key] === "string") {
      // Remover caracteres potencialmente perigosos para SQL
      sanitized[key] = sanitized[key]
        .replace(/'/g, "''") // Escapar aspas simples
        .replace(/;/g, "") // Remover ponto e vírgula
        .replace(/--/g, "") // Remover comentários SQL
        .replace(/\/\*/g, "")
        .replace(/\*\//g, "") as any
    }
  })

  return sanitized
}
