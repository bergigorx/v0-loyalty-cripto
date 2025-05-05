import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

// Componente cliente que usa useSearchParams
function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404 - Página não encontrada</h1>
        <p className="text-muted-foreground max-w-[600px] mx-auto">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Página Inicial
          </Link>
        </Button>
        <Button asChild>
          <Link href="javascript:history.back()">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12">
      <Suspense fallback={<div>Carregando...</div>}>
        <NotFoundContent />
      </Suspense>
    </div>
  )
}
