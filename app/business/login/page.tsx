"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Coffee, AlertCircle, Loader2 } from "lucide-react"
import { connectWallet, checkIsOwner } from "@/lib/blockchain-service"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function BusinessLoginPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isCheckingOwner, setIsCheckingOwner] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const router = useRouter()

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    try {
      const address = await connectWallet()
      setWalletAddress(address)

      if (address) {
        setIsCheckingOwner(true)
        const ownerStatus = await checkIsOwner(address)
        setIsOwner(ownerStatus)
        setIsCheckingOwner(false)

        if (ownerStatus) {
          toast({
            title: "Carteira conectada com sucesso!",
            description: "Você foi identificado como dono de uma cafeteria.",
          })

          // Salvar o endereço no localStorage para persistir a sessão
          localStorage.setItem("businessWalletAddress", address)

          // Redirecionar para o dashboard
          router.push("/business/dashboard")
        } else {
          toast({
            title: "Acesso negado",
            description: "Esta carteira não está autorizada como dono de uma cafeteria.",
            variant: "destructive",
          })
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro ao conectar carteira",
        description: error.message || "Ocorreu um erro ao conectar sua carteira.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // Para fins de demonstração, vamos permitir o acesso mesmo sem ser dono
  const handleDemoAccess = () => {
    const demoAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    setWalletAddress(demoAddress)
    setIsOwner(true)

    // Salvar o endereço no localStorage para persistir a sessão
    localStorage.setItem("businessWalletAddress", demoAddress)

    toast({
      title: "Modo demonstração ativado",
      description: "Você está acessando como dono de uma cafeteria no modo demonstração.",
    })

    // Redirecionar para o dashboard
    router.push("/business/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Coffee className="h-6 w-6 text-purple-600" />
              <span className="inline-block font-bold">Loyalty Cripto</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Início
              </Link>
              <Link
                href="/marketplace"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Marketplace
              </Link>
              <Link href="/business/login" className="flex items-center text-sm font-medium text-foreground">
                Para Empresas
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-12">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Área de Empresas</CardTitle>
              <CardDescription>Conecte sua carteira para acessar o painel de controle da sua cafeteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Como funciona
                </h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>Conecte sua carteira MetaMask</li>
                  <li>Verifique se você é um dono autorizado</li>
                  <li>Acesse o dashboard para mintar NFTs para seus clientes</li>
                </ol>
              </div>

              {walletAddress && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Carteira conectada</h3>
                  <p className="text-sm font-mono break-all">{walletAddress}</p>
                  {isCheckingOwner ? (
                    <div className="flex items-center justify-center mt-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Verificando permissões...</span>
                    </div>
                  ) : isOwner ? (
                    <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 p-2 rounded mt-2 text-sm">
                      Você é um dono autorizado
                    </div>
                  ) : (
                    <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-2 rounded mt-2 text-sm">
                      Você não é um dono autorizado
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                onClick={handleConnectWallet}
                disabled={isConnecting || isCheckingOwner}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Conectar Carteira
                  </>
                )}
              </Button>

              <Button variant="outline" className="w-full" onClick={handleDemoAccess}>
                Acessar Demonstração
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="w-full border-t bg-background">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <Coffee className="h-5 w-5 text-purple-600" />
              <span className="font-bold">Loyalty Cripto</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
              &copy; {new Date().getFullYear()} Loyalty Cripto. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
