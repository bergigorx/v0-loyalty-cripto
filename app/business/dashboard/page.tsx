"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coffee, LogOut, Loader2, Check, Copy, ExternalLink } from "lucide-react"
import { cafeNFTContract, loadMintedNFTs } from "@/lib/blockchain-service"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import type { MintedNFT } from "@/types/business"

export default function BusinessDashboardPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [customerAddress, setCustomerAddress] = useState("")
  const [isMinting, setIsMinting] = useState(false)
  const [mintedNFTs, setMintedNFTs] = useState<MintedNFT[]>([])
  const [lastMintedNFT, setLastMintedNFT] = useState<MintedNFT | null>(null)
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
    localStorage.removeItem("businessWalletAddress")
    router.push("/business/login")
  }

  const handleMintNFT = async () => {
    if (!customerAddress) {
      toast({
        title: "Endereço inválido",
        description: "Por favor, insira um endereço de carteira válido.",
        variant: "destructive",
      })
      return
    }

    if (!customerAddress.startsWith("0x") || customerAddress.length !== 42) {
      toast({
        title: "Endereço inválido",
        description: "O endereço da carteira deve começar com '0x' e ter 42 caracteres.",
        variant: "destructive",
      })
      return
    }

    setIsMinting(true)
    try {
      const result = await cafeNFTContract.cafeMint(customerAddress)

      toast({
        title: "NFT mintado com sucesso!",
        description: "O NFT foi enviado para o cliente.",
      })

      // Atualizar a lista de NFTs
      const nfts = loadMintedNFTs()
      const updatedNFTs = nfts.filter((nft) => nft.businessAddress === walletAddress)
      setMintedNFTs(updatedNFTs)

      // Definir o último NFT mintado
      const lastNFT = updatedNFTs.find((nft) => nft.transactionHash === result.transactionHash)
      if (lastNFT) {
        setLastMintedNFT(lastNFT)
      }

      // Limpar o campo de endereço
      setCustomerAddress("")
    } catch (error: any) {
      toast({
        title: "Erro ao mintar NFT",
        description: error.message || "Ocorreu um erro ao mintar o NFT.",
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: "O texto foi copiado para a área de transferência.",
    })
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
            <h1 className="text-3xl font-bold tracking-tight">Dashboard da Cafeteria</h1>
            <p className="text-muted-foreground">Gerencie seus NFTs de fidelidade e recompense seus clientes</p>
          </div>

          <Tabs defaultValue="mint" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="mint">Mintar NFT</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="mint" className="space-y-4">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Mintar NFT de Fidelidade</CardTitle>
                  <CardDescription>Crie um NFT de fidelidade para seu cliente na rede Polygon</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Passo a passo</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span
                          className={`mr-2 mt-0.5 rounded-full bg-purple-100 dark:bg-purple-900/20 p-1 ${walletAddress ? "text-green-600" : "text-muted-foreground"}`}
                        >
                          {walletAddress ? <Check className="h-3 w-3" /> : "1"}
                        </span>
                        <span>Conecte sua carteira</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-0.5 rounded-full bg-purple-100 dark:bg-purple-900/20 p-1 text-muted-foreground">
                          {customerAddress ? <Check className="h-3 w-3 text-green-600" /> : "2"}
                        </span>
                        <span>Cole o endereço do cliente</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-0.5 rounded-full bg-purple-100 dark:bg-purple-900/20 p-1 text-muted-foreground">
                          3
                        </span>
                        <span>Clique em "Mintar NFT"</span>
                      </li>
                    </ol>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerAddress">Endereço da carteira do cliente</Label>
                    <Input
                      id="customerAddress"
                      placeholder="0x..."
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Insira o endereço da carteira Ethereum do cliente que receberá o NFT
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                    onClick={handleMintNFT}
                    disabled={isMinting || !customerAddress}
                  >
                    {isMinting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>Mintar NFT</>
                    )}
                  </Button>

                  {lastMintedNFT && (
                    <div className="w-full bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                      <h3 className="font-medium text-green-800 dark:text-green-400 flex items-center gap-2 mb-2">
                        <Check className="h-4 w-4" />
                        NFT mintado com sucesso!
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cliente:</span>
                          <span className="font-mono flex items-center">
                            {truncateAddress(lastMintedNFT.customerAddress)}
                            <button
                              onClick={() => copyToClipboard(lastMintedNFT.customerAddress)}
                              className="ml-1 text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hash da transação:</span>
                          <span className="font-mono flex items-center">
                            {truncateAddress(lastMintedNFT.transactionHash || "")}
                            <button
                              onClick={() => copyToClipboard(lastMintedNFT.transactionHash || "")}
                              className="ml-1 text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data:</span>
                          <span>{formatDate(lastMintedNFT.mintedAt)}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Link
                          href="/marketplace"
                          className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 flex items-center"
                        >
                          Ver no Marketplace
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>

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
          </Tabs>
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
