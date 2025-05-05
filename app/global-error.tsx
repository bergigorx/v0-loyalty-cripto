"use client"

import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="container flex flex-col items-center justify-center min-h-screen py-12">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Algo deu errado!</h1>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => reset()}>Tentar novamente</Button>
              <Button asChild variant="outline">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Página Inicial
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
