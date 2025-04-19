import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

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
  )

  return clientSingleton
}

// Cliente Supabase para o lado do servidor
export function createServerComponentClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase URL and Service Role Key must be defined")
  }

  return createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}
