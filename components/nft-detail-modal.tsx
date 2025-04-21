"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coins, ShoppingCart, Tag, Calendar, ImageOff, Loader2, Clock, Award, Info } from "lucide-react"
import { RarityBadge } from "@/components/rarity-badge"
import { PartnerLogo } from "@/components/partner-logo"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

interface NFTDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nft: any
  price: number
  isOwner: boolean
  isAuthenticated: boolean
  userBalance?: number
  onBuy?: () => Promise<void>
  onBid?: (bidAmount: number) => Promise<void>
  onSell?: () => void
  isSelling?: boolean
  isProcessing?: boolean
  bids?: Array<{
    id: string
    bidder_id: string
    bidder_name: string
    amount: number
    created_at: string
  }>
}

export function NFTDetailModal({
  open,
  onOpenChange,
  nft,
  price,
  isOwner,
  isAuthenticated,
  userBalance = 0,
  onBuy,
  onBid,
  onSell,
  isSelling = false,
  isProcessing = false,
  bids = [],
}: NFTDetailModalProps) {
  const [bidAmount, setBidAmount] = useState<number>(price + 10)
  const [imageError, setImageError] = useState(false)
  const [isSubmittingBid, setIsSubmittingBid] = useState(false)
  const supabase = createClientComponentClient<Database>()

  const hasExpiration = nft.expiration_date && new Date(nft.expiration_date) > new Date()
  const isPartnerNFT = !!nft.partner_company

  // Função para gerar uma imagem de fallback baseada no nome do NFT
  const generateFallbackImage = () => {
    const colors = [
      "from-purple-500 to-blue-500",
      "from-blue-500 to-teal-500",
      "from-teal-500 to-green-500",
      "from-green-500 to-yellow-500",
      "from-yellow-500 to-orange-500",
      "from-orange-500 to-red-500",
      "from-red-500 to-pink-500",
      "from-pink-500 to-purple-500",
    ]

    // Usar o nome do NFT para selecionar uma cor consistente
    const colorIndex = nft.name ? nft.name.length % colors.length : 0
    const gradientClass = colors[colorIndex]

    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradientClass}`}>
        <div className="text-white text-center p-4">
          <ImageOff className="h-12 w-12 mx-auto mb-2" />
          <p className="font-bold text-lg">{nft.name || "NFT"}</p>
          {nft.partner_company && <p className="text-sm">{nft.partner_company}</p>}
        </div>
      </div>
    )
  }

  const handleBid = async () => {
    if (!onBid) return

    if (bidAmount <= price) {
      toast({
        title: "Valor de lance inválido",
        description: "O lance deve ser maior que o preço atual.",
        variant: "destructive",
      })
      return
    }

    if (userBalance < bidAmount) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não possui LOYA suficiente para dar este lance.",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingBid(true)
    try {
      await onBid(bidAmount)
      toast({
        title: "Lance enviado com sucesso!",
        description: `Seu lance de ${bidAmount} LOYA foi registrado.`,
      })
    } catch (error: any) {
      toast({
        title: "Erro ao enviar lance",
        description: error.message || "Ocorreu um erro ao processar seu lance.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingBid(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{nft.name}</DialogTitle>
          <DialogDescription>{nft.description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagem do NFT */}
          <div className="aspect-square relative bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-950/50 dark:to-teal-950/50 overflow-hidden rounded-lg">
            {imageError ? (
              generateFallbackImage()
            ) : (
              <img
                src={nft.image_url || "/placeholder.svg?height=400&width=400"}
                alt={nft.name || "NFT"}
                className="object-cover w-full h-full"
                onError={() => setImageError(true)}
              />
            )}
            <div className="absolute top-2 right-2">
              <RarityBadge rarity={nft.rarity || "common"} />
            </div>
            {isPartnerNFT && (
              <div className="absolute top-2 left-2">
                <PartnerLogo partner={nft.partner_company} />
              </div>
            )}
          </div>

          {/* Detalhes do NFT */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Detalhes</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono text-sm">{nft.id?.substring(0, 8)}...</span>
                </div>
                {nft.creator_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Criador:</span>
                    <span className="font-mono text-sm">{nft.creator_id?.substring(0, 8)}...</span>
                  </div>
                )}
                {nft.owner_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Proprietário:</span>
                    <span className="font-mono text-sm">{nft.owner_id?.substring(0, 8)}...</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Criado em:</span>
                  <span>{formatDate(nft.created_at)}</span>
                </div>
              </div>
            </div>

            {isPartnerNFT && nft.benefit_description && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-600" />
                  Benefício
                </h3>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-muted-foreground">{nft.benefit_description}</p>
                  {hasExpiration && (
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        Expira em{" "}
                        {formatDistanceToNow(new Date(nft.expiration_date), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-purple-600" />
                Preço
              </h3>
              <div className="bg-muted p-3 rounded-md flex items-center">
                <Coins className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-xl font-bold">{price} LOYA</span>
              </div>
            </div>

            {/* Ações */}
            <div className="pt-4">
              {isOwner ? (
                <Button
                  className="w-full"
                  variant={isSelling ? "destructive" : "outline"}
                  onClick={onSell}
                  disabled={isSelling || isProcessing}
                >
                  <Tag className="h-4 w-4 mr-2" />
                  {isSelling ? "Cancelar Venda" : "Vender NFT"}
                </Button>
              ) : (
                <div className="space-y-4">
                  {onBuy && (
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                      onClick={onBuy}
                      disabled={!isAuthenticated || userBalance < price || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Comprar Agora
                        </>
                      )}
                    </Button>
                  )}

                  {onBid && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label htmlFor="bidAmount">Valor do Lance</Label>
                          <Input
                            id="bidAmount"
                            type="number"
                            min={price + 1}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(Number(e.target.value))}
                          />
                        </div>
                        <Button
                          className="self-end bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700"
                          onClick={handleBid}
                          disabled={!isAuthenticated || userBalance < bidAmount || isSubmittingBid}
                        >
                          {isSubmittingBid ? <Loader2 className="h-4 w-4 animate-spin" /> : "Dar Lance"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Seu saldo: {userBalance} LOYA</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Histórico de lances */}
        {bids && bids.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-600" />
                Histórico de Lances
              </h3>
              <div className="rounded-md border overflow-hidden">
                <div className="grid grid-cols-3 p-3 font-medium bg-muted">
                  <div>Usuário</div>
                  <div>Valor</div>
                  <div>Data</div>
                </div>
                {bids.map((bid) => (
                  <div key={bid.id} className="grid grid-cols-3 p-3 border-t">
                    <div className="truncate">{bid.bidder_name || bid.bidder_id.substring(0, 8)}</div>
                    <div className="flex items-center">
                      <Coins className="h-4 w-4 text-purple-600 mr-1" />
                      <span>{bid.amount} LOYA</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{formatDate(bid.created_at)}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Informações adicionais */}
        <div className="mt-4 bg-muted/50 p-3 rounded-md flex items-start">
          <Info className="h-5 w-5 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Os NFTs na plataforma Loyalty Cripto representam benefícios e recompensas digitais. Eles podem ser
            transferidos, vendidos ou trocados dentro da plataforma. Alguns NFTs oferecem benefícios exclusivos com
            parceiros.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
