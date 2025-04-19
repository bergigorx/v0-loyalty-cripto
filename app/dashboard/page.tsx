"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Coins, Wallet, Settings, LogOut, Plus, ShoppingBag, CreditCard } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClientComponentClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"

type NFT = Database["public"]["Tables"]["nfts"]["Row"]
type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  marketplace_item?: {
    nft?: NFT
  }
}

export default function DashboardPage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [userNfts, setUserNfts] = useState<NFT[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState("")
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    fetchUserData()
  }, [user, router])

  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      // Buscar NFTs do usuário
      const { data: nftsData, error: nftsError } = await supabase.from("nfts").select("*").eq("owner_id", user?.id)

      if (nftsError) throw nftsError

      // Buscar transações do usuário
      const { data: transactionsData, error: transactionsError } = await supabase
        .from("transactions")
        .select(`
          *,
          marketplace_item:marketplace_items(
            *,
            nft:nfts(*)
          )
        `)
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
        .order("created_at", { ascending: false })

      if (transactionsError) throw transactionsError

      setUserNfts(nftsData || [])
      setTransactions(transactionsData || [])

      // Atualizar o perfil do usuário
      await refreshProfile()
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message || "Ocorreu um erro ao carregar seus dados.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Solicitar conexão de conta
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        const address = accounts[0]

        setWalletAddress(address)

        // Atualizar o perfil do usuário com o endereço da carteira
        const { error } = await supabase.from("profiles").update({ wallet_address: address }).eq("id", user?.id)

        if (error) throw error

        toast({
          title: "Carteira conectada com sucesso!",
          description: `Endereço: ${address.slice(0, 6)}...${address.slice(-4)}`,
        })

        // Atualizar o perfil
        await refreshProfile()
      } catch (error: any) {
        toast({
          title: "Erro ao conectar carteira",
          description: error.message || "Ocorreu um erro ao conectar sua carteira.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "MetaMask não encontrado",
        description: "Por favor, instale a extensão MetaMask.",
        variant: "destructive",
      })
    }
  }

  const claimDailyReward = async () => {
    if (!user || !profile) return

    try {
      // Adicionar 100 LOYA como recompensa diária
      const newBalance = (profile.loya_balance || 0) + 100

      // Atualizar o saldo do usuário
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ loya_balance: newBalance })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Registrar a transação
      const { error: transactionError } = await supabase.from("transactions").insert({
        buyer_id: user.id,
        amount: 100,
        transaction_type: "reward",
      })

      if (transactionError) throw transactionError

      toast({
        title: "Recompensa diária recebida!",
        description: "Você recebeu 100 LOYA como recompensa diária.",
      })

      // Atualizar o perfil
      await refreshProfile()
      await fetchUserData()
    } catch (error: any) {
      toast({
        title: "Erro ao receber recompensa",
        description: error.message || "Ocorreu um erro ao processar sua recompensa diária.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "purchase":
        return "Compra"
      case "sale":
        return "Venda"
      case "reward":
        return "Recompensa"
      case "transfer":
        return "Transferência"
      default:
        return type
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Coins className="h-6 w-6 text-purple-600" />
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
              <Link href="/dashboard" className="flex items-center text-sm font-medium text-foreground">
                Minha Conta
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            {profile && (
              <div className="hidden md:flex items-center mr-4 bg-purple-100 dark:bg-purple-900/20 px-3 py-1 rounded-full">
                <Coins className="h-4 w-4 text-purple-600 mr-2" />
                <span className="text-sm font-medium">{profile.loya_balance} LOYA</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Minha Conta</h1>
              <p className="text-muted-foreground">Gerencie seus tokens, NFTs e transações</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={connectWallet} disabled={!!profile?.wallet_address}>
                <Wallet className="h-4 w-4 mr-2" />
                {profile?.wallet_address ? "Carteira Conectada" : "Conectar Carteira"}
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                onClick={claimDailyReward}
              >
                <Plus className="h-4 w-4 mr-2" />
                Recompensa Diária
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Saldo LOYA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Coins className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-2xl font-bold">{profile?.loya_balance || 0}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/marketplace")}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Ir para o Marketplace
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">NFTs Colecionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-teal-600 mr-2" />
                  <span className="text-2xl font-bold">{userNfts.length}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => document.getElementById("nfts-tab")?.click()}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Ver Meus NFTs
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Carteira</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Wallet className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium truncate">
                    {profile?.wallet_address
                      ? `${profile.wallet_address.slice(0, 6)}...${profile.wallet_address.slice(-4)}`
                      : "Não conectada"}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={connectWallet}
                  disabled={!!profile?.wallet_address}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {profile?.wallet_address ? "Carteira Conectada" : "Conectar Carteira"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Tabs defaultValue="nfts" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="nfts" id="nfts-tab">
                Meus NFTs
              </TabsTrigger>
              <TabsTrigger value="transactions">Histórico de Transações</TabsTrigger>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
            </TabsList>

            <TabsContent value="nfts" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : userNfts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">Você ainda não possui NFTs</h3>
                  <p className="text-muted-foreground mt-2">Visite o marketplace para adquirir seus primeiros NFTs</p>
                  <Button
                    className="mt-4 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                    onClick={() => router.push("/marketplace")}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Ir para o Marketplace
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {userNfts.map((nft) => (
                    <Card key={nft.id} className="overflow-hidden">
                      <div className="aspect-square relative bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-950/50 dark:to-teal-950/50">
                        <img
                          src={nft.image_url || "/placeholder.svg?height=400&width=400"}
                          alt={nft.name}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                          {nft.rarity}
                        </div>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{nft.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{nft.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 text-purple-600 mr-1" />
                          <span className="font-medium text-sm">#{nft.id.slice(0, 8)}</span>
                        </div>
                        <Button size="sm" variant="outline" disabled={nft.is_for_sale}>
                          {nft.is_for_sale ? "À venda" : "Vender NFT"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">Nenhuma transação encontrada</h3>
                  <p className="text-muted-foreground mt-2">Suas transações aparecerão aqui</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-4 font-medium border-b">
                    <div>Tipo</div>
                    <div>Data</div>
                    <div>Item</div>
                    <div>Valor</div>
                    <div>Status</div>
                  </div>
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="grid grid-cols-5 p-4 border-b last:border-0 items-center">
                      <div className="font-medium">{getTransactionTypeLabel(transaction.transaction_type)}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(transaction.created_at)}</div>
                      <div className="text-sm">{transaction.marketplace_item?.nft?.name || "Token LOYA"}</div>
                      <div className="flex items-center">
                        <Coins className="h-4 w-4 text-purple-600 mr-1" />
                        <span>{transaction.amount} LOYA</span>
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                  <CardDescription>Gerencie suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user?.email || ""} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Nome de Usuário</Label>
                      <Input id="username" value={profile?.username || ""} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome Completo</Label>
                      <Input id="fullName" value={profile?.full_name || ""} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="walletAddress">Endereço da Carteira</Label>
                      <Input id="walletAddress" value={profile?.wallet_address || "Não conectada"} readOnly />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={connectWallet} disabled={!!profile?.wallet_address}>
                    <Wallet className="h-4 w-4 mr-2" />
                    {profile?.wallet_address ? "Carteira Conectada" : "Conectar Carteira"}
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600">
                    <Settings className="h-4 w-4 mr-2" />
                    Atualizar Perfil
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="w-full border-t bg-background">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-purple-600" />
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
