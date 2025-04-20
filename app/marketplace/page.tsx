"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Coins, Search, Tag, User, Store } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClientComponentClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { NFTCard } from "@/components/nft-card"
import { Badge } from "@/components/ui/badge"

type NFT = Database["public"]["Tables"]["nfts"]["Row"]
type MarketplaceItem = Database["public"]["Tables"]["marketplace_items"]["Row"] & {
  nft?: NFT
}

export default function MarketplacePage() {
  const { user, profile } = useAuth()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRarity, setFilterRarity] = useState<string | null>(null)
  const [filterPartner, setFilterPartner] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("recent")
  const [partnerCompanies, setPartnerCompanies] = useState<string[]>([])
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    // Remover a verificação de autenticação para permitir visualização sem login
    fetchMarketplaceData()
  }, [])

  const fetchMarketplaceData = async () => {
    setIsLoading(true)
    try {
      // Buscar NFTs
      const { data: nftsData, error: nftsError } = await supabase.from("nfts").select("*")

      if (nftsError) throw nftsError

      // Buscar itens do marketplace
      const { data: marketplaceData, error: marketplaceError } = await supabase
        .from("marketplace_items")
        .select(`
          *,
          nft:nfts(*)
        `)
        .eq("status", "active")

      if (marketplaceError) throw marketplaceError

      setNfts(nftsData || [])
      setMarketplaceItems(marketplaceData || [])

      // Extrair empresas parceiras únicas
      const partners = nftsData
        ?.filter((nft) => nft.partner_company)
        .map((nft) => nft.partner_company as string)
        .filter((value, index, self) => value && self.indexOf(value) === index)

      setPartnerCompanies(partners || [])
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message || "Ocorreu um erro ao carregar os dados do marketplace.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuyNFT = async (item: MarketplaceItem) => {
    if (!user || !profile) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para comprar este item.",
        variant: "destructive",
      })
      // Redirecionar para a página inicial com parâmetro para abrir o modal de login
      router.push("/?login=true")
      return
    }

    if (!item.price) {
      toast({
        title: "Erro na compra",
        description: "Este item não possui um preço definido.",
        variant: "destructive",
      })
      return
    }

    if (profile.loya_balance < item.price) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não possui LOYA suficiente para comprar este item.",
        variant: "destructive",
      })
      return
    }

    try {
      // Iniciar transação
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          buyer_id: user.id,
          seller_id: item.seller_id,
          marketplace_item_id: item.id,
          amount: item.price,
          transaction_type: "purchase",
        })
        .select()
        .single()

      if (transactionError) throw transactionError

      // Atualizar o status do item no marketplace
      const { error: updateItemError } = await supabase
        .from("marketplace_items")
        .update({ status: "sold" })
        .eq("id", item.id)

      if (updateItemError) throw updateItemError

      // Atualizar o proprietário do NFT se for um NFT
      if (item.nft_id) {
        const { error: updateNftError } = await supabase
          .from("nfts")
          .update({
            owner_id: user.id,
            is_for_sale: false,
          })
          .eq("id", item.nft_id)

        if (updateNftError) throw updateNftError
      }

      // Atualizar o saldo do comprador
      const { error: updateBuyerError } = await supabase
        .from("profiles")
        .update({
          loya_balance: profile.loya_balance - item.price,
        })
        .eq("id", user.id)

      if (updateBuyerError) throw updateBuyerError

      // Atualizar o saldo do vendedor
      const { error: updateSellerError } = await supabase
        .from("profiles")
        .update({
          loya_balance: supabase.rpc("get_profile_balance", { profile_id: item.seller_id }) + item.price,
        })
        .eq("id", item.seller_id)

      if (updateSellerError) throw updateSellerError

      toast({
        title: "Compra realizada com sucesso!",
        description: "O item foi adicionado à sua coleção.",
      })

      // Recarregar os dados
      fetchMarketplaceData()
    } catch (error: any) {
      toast({
        title: "Erro na compra",
        description: error.message || "Ocorreu um erro ao processar a compra.",
        variant: "destructive",
      })
    }
  }

  const filteredItems = marketplaceItems.filter((item) => {
    const matchesSearch =
      item.nft?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nft?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nft?.partner_company?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRarity = !filterRarity || item.nft?.rarity === filterRarity
    const matchesPartner = !filterPartner || item.nft?.partner_company === filterPartner

    return matchesSearch && matchesRarity && matchesPartner
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "price-asc") {
      return (a.price || 0) - (b.price || 0)
    } else if (sortBy === "price-desc") {
      return (b.price || 0) - (a.price || 0)
    } else if (sortBy === "recent") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    return 0
  })

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
              <Link href="/marketplace" className="flex items-center text-sm font-medium text-foreground">
                Marketplace
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Minha Conta
                </Link>
              )}
              <Link
                href="/business/login"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Para Empresas
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
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <User className="h-4 w-4 mr-2" />
                  Minha Conta
                </Button>
              </Link>
            ) : (
              <Link href="/?login=true">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">
              Explore e adquira NFTs exclusivos de empresas parceiras e troque por benefícios reais
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar NFTs e tokens..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Select
                value={filterRarity || "all"}
                onValueChange={(value) => setFilterRarity(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Raridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas raridades</SelectItem>
                  <SelectItem value="common">Comum</SelectItem>
                  <SelectItem value="uncommon">Incomum</SelectItem>
                  <SelectItem value="rare">Raro</SelectItem>
                  <SelectItem value="legendary">Lendário</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filterPartner || "all"}
                onValueChange={(value) => setFilterPartner(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Empresa Parceira" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas empresas</SelectItem>
                  {partnerCompanies.map((partner) => (
                    <SelectItem key={partner} value={partner}>
                      {partner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="price-asc">Menor preço</SelectItem>
                  <SelectItem value="price-desc">Maior preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filterPartner && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Store className="h-3 w-3" />
                <span>Empresa: {filterPartner}</span>
                <button className="ml-1 rounded-full hover:bg-muted p-1" onClick={() => setFilterPartner(null)}>
                  <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </Badge>
            </div>
          )}

          <Tabs defaultValue="nfts" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="nfts">NFTs de Benefícios</TabsTrigger>
              <TabsTrigger value="tokens">Tokens LOYA</TabsTrigger>
            </TabsList>
            <TabsContent value="nfts" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : sortedItems.filter((item) => item.item_type === "NFT").length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">Nenhum NFT disponível no momento</h3>
                  <p className="text-muted-foreground mt-2">Volte mais tarde para ver novos itens</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {sortedItems
                    .filter((item) => item.item_type === "NFT" && item.nft)
                    .map((item) => (
                      <NFTCard
                        key={item.id}
                        nft={item.nft}
                        price={item.price || 0}
                        onBuy={() => handleBuyNFT(item)}
                        disableBuy={!user || (profile?.loya_balance || 0) < (item.price || 0)}
                        isAuthenticated={!!user}
                      />
                    ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="tokens" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : sortedItems.filter((item) => item.item_type === "LOYA").length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">Nenhum token LOYA disponível no momento</h3>
                  <p className="text-muted-foreground mt-2">Volte mais tarde para ver novos itens</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {sortedItems
                    .filter((item) => item.item_type === "LOYA")
                    .map((item) => (
                      <Card key={item.id}>
                        <CardHeader className="p-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 flex items-center justify-center mx-auto mb-2">
                            <Coins className="h-8 w-8 text-white" />
                          </div>
                          <CardTitle className="text-center">{item.token_amount} LOYA</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-center">
                          <p className="text-muted-foreground">Tokens LOYA para uso na plataforma</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between items-center">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 text-purple-600 mr-1" />
                            <span className="font-bold">{item.price} LOYA</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleBuyNFT(item)}
                            disabled={!user || (profile?.loya_balance || 0) < (item.price || 0)}
                            className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                          >
                            <Tag className="h-4 w-4 mr-1" />
                            Comprar
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              )}
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
