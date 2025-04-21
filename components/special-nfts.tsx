"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/progress-bar"
import { Coins, Lock, ShoppingBag } from "lucide-react"
import Image from "next/image"

interface SpecialNFT {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
  benefit: string
  rarity: string
}

interface SpecialNFTsProps {
  nfts: SpecialNFT[]
  currentBalance: number
  onPurchase: (nftId: string) => Promise<void>
}

export function SpecialNFTs({ nfts, currentBalance, onPurchase }: SpecialNFTsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nfts.map((nft) => {
          const canPurchase = currentBalance >= nft.price

          return (
            <Card key={nft.id} className="overflow-hidden">
              <div className="aspect-video relative bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-950/50 dark:to-teal-950/50">
                <div className="absolute inset-0 flex items-center justify-center">
                  {canPurchase ? (
                    <Image
                      src={nft.imageUrl || "/placeholder.svg"}
                      alt={nft.name}
                      width={300}
                      height={200}
                      className="object-contain max-h-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Lock className="h-12 w-12 mb-2 opacity-50" />
                      <span className="text-sm font-medium">Bloqueado</span>
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 px-2 py-1 rounded-full text-xs font-medium">
                  {nft.rarity}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle>{nft.name}</CardTitle>
                <CardDescription>{nft.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pb-2">
                <div className="bg-muted p-2 rounded-md text-sm">
                  <p className="font-medium mb-1">Benefício:</p>
                  <p className="text-muted-foreground">{nft.benefit}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Preço:</span>
                    <span className="font-medium flex items-center">
                      <Coins className="h-3.5 w-3.5 mr-1 text-purple-600" />
                      {nft.price} LOYA
                    </span>
                  </div>
                  <ProgressBar value={Math.min(currentBalance, nft.price)} max={nft.price} size="sm" />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                  disabled={!canPurchase}
                  onClick={() => onPurchase(nft.id)}
                >
                  {canPurchase ? (
                    <>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Resgatar NFT
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Acumule mais {nft.price - currentBalance} LOYA
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
