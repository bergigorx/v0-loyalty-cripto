"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Coins,
  Wallet,
  Settings,
  LogOut,
  ShoppingBag,
  CreditCard,
  Gift,
  Calendar,
  UserPlus,
  Share2,
  Trophy,
  Target,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClientComponentClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { NFTCard } from "@/components/nft-card"
import { SellNFTModal } from "@/components/sell-nft-modal"
import { Logo } from "@/components/logo"
import { DailyRewardWheel } from "@/components/daily-reward-wheel"
import { ProgressBar } from "@/components/progress-bar"
import { MissionsPanel } from "@/components/missions-panel"
import { SpecialNFTs } from "@/components/special-nfts"
import { MobileMenu } from "@/components/mobile-menu"
// Adicione o import
import { FloatingActionButton } from "@/components/floating-action-button"

type NFT = Database["public"]["Tables"]["nfts"]["Row"]
type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  marketplace_item?: {
    nft?: NFT
  }
}

// Função para verificar se o usuário já recebeu a recompensa diária hoje
const hasClaimedDailyReward = (): boolean => {
  if (typeof window === "undefined") return false

  const lastClaim = localStorage.getItem("lastDailyRewardClaim")
  if (!lastClaim) return false

  const lastClaimDate = new Date(lastClaim)
  const today = new Date()

  return (
    lastClaimDate.getDate() === today.getDate() &&
    lastClaimDate.getMonth() === today.getMonth() &&
    lastClaimDate.getFullYear() === today.getFullYear()
  )
}

// Função para marcar a recompensa diária como recebida
const setDailyRewardClaimed = () => {
  if (typeof window === "undefined") return
  localStorage.setItem("lastDailyRewardClaim", new Date().toISOString())
}

// Dados de exemplo para missões
const MISSIONS_DATA = [
  {
    id: "daily-login",
    title: "Login Diário",
    description: "Faça login no aplicativo todos os dias",
    reward: 10,
    progress: 1,
    target: 1,
    icon: <Calendar className="h-4 w-4 text-purple-600" />,
    isCompleted: true,
    isClaimable: false,
  },
  {
    id: "invite-friends",
    title: "Convide Amigos",
    description: "Convide amigos para a plataforma",
    reward: 50,
    progress: 1,
    target: 5,
    icon: <UserPlus className="h-4 w-4 text-purple-600" />,
    isCompleted: false,
    isClaimable: false,
  },
  {
    id: "share-social",
    title: "Compartilhe nas Redes",
    description: "Compartilhe a plataforma nas redes sociais",
    reward: 25,
    progress: 0,
    target: 3,
    icon: <Share2 className="h-4 w-4 text-purple-600" />,
    isCompleted: false,
    isClaimable: false,
  },
  {
    id: "first-purchase",
    title: "Primeira Compra",
    description: "Realize sua primeira compra no marketplace",
    reward: 100,
    progress: 0,
    target: 1,
    icon: <ShoppingBag className="h-4 w-4 text-purple-600" />,
    isCompleted: false,
    isClaimable: false,
  },
]

// Dados de exemplo para NFTs especiais
const SPECIAL_NFTS_DATA = [
  {
    id: "discount-nft",
    name: "NFT de Desconto Premium",
    description: "Desconto em toda plataforma por 6 meses",
    imageUrl: "/nfts/special/discount-premium.png",
    price: 10000,
    benefit: "Desconto de 15% em todas as compras na plataforma por 6 meses",
    rarity: "Lendário",
  },
  {
    id: "vip-access",
    name: "Acesso VIP",
    description: "Acesso antecipado a novos lançamentos",
    imageUrl: "/nfts/special/vip-access.png",
    price: 5000,
    benefit: "Acesso antecipado a novos lançamentos e eventos exclusivos",
    rarity: "Raro",
  },
  {
    id: "cashback-boost",
    name: "Boost de Cashback",
    description: "Aumente seu cashback em todas as compras",
    imageUrl: "/nfts/special/cashback-boost.png",
    price: 7500,
    benefit: "Cashback adicional de 5% em todas as compras por 3 meses",
    rarity: "Épico",
  },
  {
    id: "loyalty-badge",
    name: "Distintivo de Fidelidade",
    description: "Mostre seu status de membro fiel",
    imageUrl: "/nfts/special/loyalty-badge.png",
    price: 2500,
    benefit: "Status especial no perfil e acesso a promoções exclusivas",
    rarity: "Incomum",
  },
]

export default function DashboardPage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [userNfts, setUserNfts] = useState<NFT[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState("")
  const [sellModalOpen, setSellModalOpen] = useState(false)
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null)
  const [rewardWheelOpen, setRewardWheelOpen] = useState(false)
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(hasClaimedDailyReward())
  const [missions, setMissions] = useState(MISSIONS_DATA)
  const [specialNfts, setSpecialNfts] = useState(SPECIAL_NFTS_DATA)
  const [activeTab, setActiveTab] = useState("account")
  const [processingReward, setProcessingReward] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  // Verificar se é o primeiro login do dia e mostrar a roleta apenas uma vez
  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    fetchUserData()

    // Verificar se é o primeiro login do dia para mostrar a roleta
    const shouldShowReward = !dailyRewardClaimed && !localStorage.getItem("rewardShownToday")

    if (shouldShowReward) {
      // Marcar que a roleta já foi mostrada hoje (mesmo que o usuário não tenha girado)
      localStorage.setItem("rewardShownToday", "true")

      // Pequeno atraso para melhorar a experiência do usuário
      const timer = setTimeout(() => {
        setRewardWheelOpen(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [user, router])

  // Resetar o flag "rewardShownToday" à meia-noite
  useEffect(() => {
    const resetRewardShownFlag = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const timeUntilMidnight = tomorrow.getTime() - now.getTime()

      setTimeout(() => {
        localStorage.removeItem("rewardShownToday")
        localStorage.removeItem("lastDailyRewardClaim")
        setDailyRewardClaimed(false)
      }, timeUntilMidnight)
    }

    resetRewardShownFlag()
  }, [])

  // Função para buscar dados do usuário com cache busting
  const fetchUserData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Adicionar timestamp para evitar cache
      const timestamp = new Date().getTime()

      // Buscar NFTs do usuário
      const { data: nftsData, error: nftsError } = await supabase
        .from("nfts")
        .select("*")
        .eq("owner_id", user?.id)
        .order("created_at", { ascending: false })

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

      // Remover transações duplicadas (usando o ID como chave)
      const uniqueTransactions =
        transactionsData?.filter(
          (transaction, index, self) => index === self.findIndex((t) => t.id === transaction.id),
        ) || []

      setUserNfts(nftsData || [])
      setTransactions(uniqueTransactions)

      // Atualizar o perfil do usuário
      await refreshProfile()

      // Atualizar missões com base nas transações
      updateMissionsProgress(uniqueTransactions)
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message || "Ocorreu um erro ao carregar seus dados.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, refreshProfile, supabase])

  // Atualizar dados a cada 30 segundos para manter tudo atualizado
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (user) {
        fetchUserData()
      }
    }, 30000) // 30 segundos

    return () => clearInterval(intervalId)
  }, [user, fetchUserData])

  const updateMissionsProgress = (transactions: Transaction[]) => {
    const updatedMissions = [...missions]

    // Atualizar missão de primeira compra
    const hasPurchase = transactions.some((t) => t.transaction_type === "purchase")
    if (hasPurchase) {
      const purchaseMissionIndex = updatedMissions.findIndex((m) => m.id === "first-purchase")
      if (purchaseMissionIndex >= 0) {
        updatedMissions[purchaseMissionIndex] = {
          ...updatedMissions[purchaseMissionIndex],
          progress: 1,
          isCompleted: true,
          isClaimable: true,
        }
      }
    }

    setMissions(updatedMissions)
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

    if (dailyRewardClaimed) {
      setRewardWheelOpen(true)
      return
    }

    try {
      // Abrir a roleta em vez de dar a recompensa diretamente
      setRewardWheelOpen(true)
    } catch (error: any) {
      toast({
        title: "Erro ao abrir roleta",
        description: error.message || "Ocorreu um erro ao abrir a roleta de recompensas.",
        variant: "destructive",
      })
    }
  }

  const handleRewardClaimed = async (amount: number) => {
    if (!user || !profile || processingReward) return

    setProcessingReward(true)
    try {
      // Verificar se já existe uma transação de recompensa para hoje
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data: existingRewards } = await supabase
        .from("transactions")
        .select("*")
        .eq("buyer_id", user.id)
        .eq("transaction_type", "reward")
        .gte("created_at", today.toISOString())

      // Se já existe uma recompensa hoje, não adicionar outra
      if (existingRewards && existingRewards.length > 0) {
        toast({
          title: "Recompensa já recebida",
          description: "Você já recebeu sua recompensa diária hoje.",
        })
        setDailyRewardClaimed(true)
        setDailyRewardClaimed()
        return
      }

      // Adicionar a recompensa ao saldo do usuário
      const newBalance = (profile.loya_balance || 0) + amount

      // Atualizar o saldo do usuário
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ loya_balance: newBalance })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Registrar a transação
      const { error: transactionError } = await supabase.from("transactions").insert({
        buyer_id: user.id,
        amount: amount,
        transaction_type: "reward",
        status: "completed",
      })

      if (transactionError) throw transactionError

      toast({
        title: "Recompensa recebida!",
        description: `Você recebeu ${amount} LOYA como recompensa diária.`,
      })

      // Marcar a recompensa diária como recebida
      setDailyRewardClaimed(true)
      setDailyRewardClaimed()

      // Atualizar o perfil
      await refreshProfile()
      await fetchUserData()
    } catch (error: any) {
      toast({
        title: "Erro ao receber recompensa",
        description: error.message || "Ocorreu um erro ao processar sua recompensa diária.",
        variant: "destructive",
      })
    } finally {
      setProcessingReward(false)
    }
  }

  const handleClaimMissionReward = async (missionId: string) => {
    if (!user || !profile) return

    try {
      // Encontrar a missão
      const mission = missions.find((m) => m.id === missionId)
      if (!mission) throw new Error("Missão não encontrada")

      // Adicionar a recompensa ao saldo do usuário
      const newBalance = (profile.loya_balance || 0) + mission.reward

      // Atualizar o saldo do usuário
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ loya_balance: newBalance })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Registrar a transação
      const { error: transactionError } = await supabase.from("transactions").insert({
        buyer_id: user.id,
        amount: mission.reward,
        transaction_type: "mission_reward",
        status: "completed",
      })

      if (transactionError) throw transactionError

      toast({
        title: "Recompensa de missão recebida!",
        description: `Você recebeu ${mission.reward} LOYA por completar a missão "${mission.title}".`,
      })

      // Atualizar o estado das missões
      const updatedMissions = missions.map((m) => (m.id === missionId ? { ...m, isClaimable: false } : m))
      setMissions(updatedMissions)

      // Atualizar o perfil
      await refreshProfile()
      await fetchUserData()
    } catch (error: any) {
      toast({
        title: "Erro ao receber recompensa",
        description: error.message || "Ocorreu um erro ao processar sua recompensa de missão.",
        variant: "destructive",
      })
    }
  }

  const handlePurchaseSpecialNFT = async (nftId: string) => {
    if (!user || !profile) return

    try {
      // Encontrar o NFT especial
      const nft = specialNfts.find((n) => n.id === nftId)
      if (!nft) throw new Error("NFT não encontrado")

      // Verificar se o usuário tem saldo suficiente
      if (profile.loya_balance < nft.price) {
        toast({
          title: "Saldo insuficiente",
          description: `Você precisa de ${nft.price} LOYA para resgatar este NFT.`,
          variant: "destructive",
        })
        return
      }

      // Deduzir o preço do saldo do usuário
      const newBalance = profile.loya_balance - nft.price

      // Atualizar o saldo do usuário
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ loya_balance: newBalance })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Criar o NFT para o usuário
      const { error: nftError } = await supabase.from("nfts").insert({
        name: nft.name,
        description: nft.description,
        image_url: nft.imageUrl,
        owner_id: user.id,
        creator_id: user.id,
        price: 0,
        is_for_sale: false,
        rarity: nft.rarity,
      })

      if (nftError) throw nftError

      // Registrar a transação
      const { error: transactionError } = await supabase.from("transactions").insert({
        buyer_id: user.id,
        amount: nft.price,
        transaction_type: "nft_purchase",
        status: "completed",
      })

      if (transactionError) throw transactionError

      toast({
        title: "NFT resgatado com sucesso!",
        description: `Você resgatou o NFT "${nft.name}" por ${nft.price} LOYA.`,
      })

      // Atualizar o perfil e os NFTs
      await refreshProfile()
      await fetchUserData()
    } catch (error: any) {
      toast({
        title: "Erro ao resgatar NFT",
        description: error.message || "Ocorreu um erro ao resgatar o NFT especial.",
        variant: "destructive",
      })
    }
  }

  const handleSellNFT = (nft: NFT) => {
    setSelectedNft(nft)
    setSellModalOpen(true)
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
      case "mission_reward":
        return "Missão"
      case "nft_purchase":
        return "Resgate NFT"
      case "transfer":
        return "Transferência"
      default:
        return type
    }
  }

  // Função para mudar a aba ativa
  const changeTab = (tab: string) => {
    setActiveTab(tab)
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
            <div className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await signOut()
                  router.push("/")
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
            <MobileMenu
              activeRoute="dashboard"
              onSignOut={async () => {
                await signOut()
                router.push("/")
              }}
            />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Minha Conta</h1>
              <p className="text-muted-foreground">
                Gerencie seus tokens, NFTs e participe de missões para ganhar recompensas
              </p>
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
                <Gift className="h-4 w-4 mr-2" />
                {dailyRewardClaimed ? "Recompensa Diária" : "Recompensa Diária"}
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
                <Button variant="outline" size="sm" className="w-full" onClick={() => changeTab("nfts")}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Ver Meus NFTs
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Próximo NFT Especial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progresso:</span>
                  <span className="text-sm font-medium">{profile?.loya_balance || 0} / 2500 LOYA</span>
                </div>
                <ProgressBar value={Math.min(profile?.loya_balance || 0, 2500)} max={2500} showLabel={false} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => changeTab("special-nfts")}>
                  <Trophy className="h-4 w-4 mr-2" />
                  Ver NFTs Especiais
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={changeTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="account">Conta</TabsTrigger>
              <TabsTrigger value="missions">Missões</TabsTrigger>
              <TabsTrigger value="special-nfts">NFTs Especiais</TabsTrigger>
              <TabsTrigger value="nfts">Meus NFTs</TabsTrigger>
              <TabsTrigger value="transactions">Transações</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Perfil</CardTitle>
                    <CardDescription>Gerencie suas informações pessoais</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
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

                <Card>
                  <CardHeader>
                    <CardTitle>Progresso de Fidelidade</CardTitle>
                    <CardDescription>Acompanhe seu progresso e desbloqueie recompensas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Trophy className="h-5 w-5 text-purple-600 mr-2" />
                          <span className="font-medium">Nível de Fidelidade</span>
                        </div>
                        <span className="text-lg font-bold">{Math.floor((profile?.loya_balance || 0) / 1000) + 1}</span>
                      </div>
                      <ProgressBar value={(profile?.loya_balance || 0) % 1000} max={1000} />
                      <p className="text-xs text-muted-foreground text-center">
                        Acumule mais {1000 - ((profile?.loya_balance || 0) % 1000)} LOYA para o próximo nível
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center">
                        <Target className="h-4 w-4 text-purple-600 mr-2" />
                        Próximas Conquistas
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Colecionador Iniciante</span>
                            <span className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 px-2 py-0.5 rounded-full">
                              {userNfts.length} / 5 NFTs
                            </span>
                          </div>
                          <ProgressBar value={userNfts.length} max={5} size="sm" showLabel={false} />
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Investidor Bronze</span>
                            <span className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 px-2 py-0.5 rounded-full">
                              {profile?.loya_balance || 0} / 5000 LOYA
                            </span>
                          </div>
                          <ProgressBar
                            value={Math.min(profile?.loya_balance || 0, 5000)}
                            max={5000}
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                      onClick={() => changeTab("missions")}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Ver Missões Disponíveis
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="missions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Missões Disponíveis</CardTitle>
                  <CardDescription>Complete missões para ganhar LOYA tokens</CardDescription>
                </CardHeader>
                <CardContent>
                  <MissionsPanel missions={missions} onClaimReward={handleClaimMissionReward} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="special-nfts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>NFTs Especiais</CardTitle>
                  <CardDescription>
                    Acumule LOYA tokens e resgate NFTs exclusivos com benefícios especiais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SpecialNFTs
                    nfts={specialNfts}
                    currentBalance={profile?.loya_balance || 0}
                    onPurchase={handlePurchaseSpecialNFT}
                  />
                </CardContent>
              </Card>
            </TabsContent>

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
                    <NFTCard
                      key={nft.id}
                      nft={nft}
                      price={nft.price || 0}
                      showSellOption={true}
                      isSelling={nft.is_for_sale}
                      onSell={() => handleSellNFT(nft)}
                      isOwner={true}
                      userBalance={profile?.loya_balance || 0}
                      isAuthenticated={true}
                    />
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
                          {transaction.status || "completed"}
                        </span>
                      </div>
                    </div>
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
            <Logo size="sm" />
            <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
              &copy; {new Date().getFullYear()} Loyalty Cripto. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {selectedNft && (
        <SellNFTModal
          open={sellModalOpen}
          onOpenChange={setSellModalOpen}
          nft={selectedNft}
          userId={user?.id || ""}
          onSuccess={fetchUserData}
        />
      )}

      <DailyRewardWheel
        open={rewardWheelOpen}
        onOpenChange={setRewardWheelOpen}
        onRewardClaimed={handleRewardClaimed}
        dailyRewardClaimed={dailyRewardClaimed}
      />
      {profile && (
        <FloatingActionButton action="balance" balance={profile.loya_balance} onClick={() => claimDailyReward()} />
      )}
    </div>
  )
}
