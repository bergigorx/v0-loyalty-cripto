"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, ExternalLink } from "lucide-react"
import { loadMintedNFTs } from "@/lib/blockchain-service"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import type { MintedNFT } from "@/types/business"
import { Logo } from "@/components/logo"

export default function BusinessDashboardPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [mintedNFTs, setMintedNFTs] = useState<MintedNFT[]>([])
  const router = useRouter()

  useEffect(() => {
    // Verificar se o usuário está logado
    const storedAddress = localStorage.getItem("businessWalletAddress")
    if (!storedAddress) {
      router.push("/business/login")
      return
    }

    setWalletAddress(storedAddress)

    // Carregar NFTs mintados
    const nfts = loadMintedNFTs()
    setMintedNFTs(nfts.filter((nft) => nft.businessAddress === storedAddress))
  }, [router])

  const handleLogout = () => {
    try {
      localStorage.removeItem("businessWalletAddress")
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta de empresa",
      })
      router.push("/business/login")
    } catch (error) {
      console.error("Error during business logout:", error)
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar sair da sua conta",
        variant: "destructive",
      })
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Logo />
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
              <Link href="/business/dashboard" className="flex items-center text-sm font-medium text-foreground">
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            {walletAddress && (
              <div className="hidden md:flex items-center mr-4 bg-purple-100 dark:bg-purple-900/20 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">{truncateAddress(walletAddress)}</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard da Empresa</h1>
            <p className="text-muted-foreground">Gerencie seus NFTs de fidelidade e acompanhe métricas</p>
          </div>

          <Tabs defaultValue="history" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="history">Histórico</TabsTrigger>
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de NFTs</CardTitle>
                  <CardDescription>Veja todos os NFTs que você já mintou para seus clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  {mintedNFTs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Você ainda não mintou nenhum NFT</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 p-4 font-medium border-b">
                        <div>Cliente</div>
                        <div>Data</div>
                        <div>Hash</div>
                        <div>Ações</div>
                      </div>
                      {mintedNFTs.map((nft) => (
                        <div key={nft.id} className="grid grid-cols-4 p-4 border-b last:border-0 items-center">
                          <div className="font-mono text-sm">{truncateAddress(nft.customerAddress)}</div>
                          <div className="text-sm text-muted-foreground">{formatDate(nft.mintedAt)}</div>
                          <div className="font-mono text-sm">{truncateAddress(nft.transactionHash || "")}</div>
                          <div>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Desempenho</CardTitle>
                  <CardDescription>Acompanhe o desempenho dos seus NFTs de fidelidade</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total de NFTs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{mintedNFTs.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Clientes Únicos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {new Set(mintedNFTs.map((nft) => nft.customerAddress)).size}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Resgate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">78%</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="w-full border-t bg-background">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <Logo size="sm" />
            <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
              &copy; {new Date().getFullYear()} Loyalty Cripto. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
