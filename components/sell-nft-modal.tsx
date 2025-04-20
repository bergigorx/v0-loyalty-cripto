"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Tag } from "lucide-react"
import { createClientComponentClient } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import type { Database } from "@/types/supabase"

interface SellNFTModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nft: any
  userId: string
  onSuccess: () => void
}

export function SellNFTModal({ open, onOpenChange, nft, userId, onSuccess }: SellNFTModalProps) {
  const [price, setPrice] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()

  const handleSellNFT = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const priceValue = Number.parseFloat(price)

      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error("Por favor, insira um preço válido maior que zero.")
      }

      // Atualizar o NFT para indicar que está à venda
      const { error: nftError } = await supabase.from("nfts").update({ is_for_sale: true }).eq("id", nft.id)

      if (nftError) throw nftError

      // Criar um item no marketplace
      const { error: marketplaceError } = await supabase.from("marketplace_items").insert({
        seller_id: userId,
        nft_id: nft.id,
        price: priceValue,
        item_type: "NFT",
        status: "active",
      })

      if (marketplaceError) throw marketplaceError

      toast({
        title: "NFT colocado à venda com sucesso!",
        description: `Seu NFT "${nft.name}" foi listado no marketplace por ${priceValue} LOYA.`,
      })

      onOpenChange(false)
      onSuccess()
    } catch (error: any) {
      toast({
        title: "Erro ao vender NFT",
        description: error.message || "Ocorreu um erro ao colocar seu NFT à venda.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Vender NFT</DialogTitle>
          <DialogDescription>Defina o preço para vender seu NFT "{nft?.name}" no marketplace.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSellNFT}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Preço em LOYA</Label>
              <Input
                id="price"
                type="number"
                placeholder="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="1"
                step="1"
                required
              />
              <p className="text-sm text-muted-foreground">Defina um preço justo para aumentar as chances de venda.</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Tag className="mr-2 h-4 w-4" />
                  Colocar à venda
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
