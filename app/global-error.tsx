"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GlobalError() {
  // Função simples para recarregar a página
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <html>
      <body>
        <div className="container flex flex-col items-center justify-center min-h-screen py-12">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Erro Crítico</h1>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                Ocorreu um erro crítico na aplicação. Por favor, tente novamente.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleRefresh}>Tentar novamente</Button>
              <Button asChild variant="outline">
                <Link href="/">Página Inicial</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
