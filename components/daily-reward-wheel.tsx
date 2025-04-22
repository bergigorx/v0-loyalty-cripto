"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Coins, Gift, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import confetti from "canvas-confetti"

interface DailyRewardWheelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRewardClaimed: (amount: number) => Promise<void>
  dailyRewardClaimed: boolean
}

const REWARDS = [2, 3, 5, 8, 10, 0, 15, 1]
const COLORS = [
  "#9333ea", // purple-600
  "#14b8a6", // teal-500
  "#8b5cf6", // purple-500
  "#0d9488", // teal-600
  "#a855f7", // purple-500
  "#f9fafb", // gray-50
  "#7c3aed", // violet-600
  "#d8b4fe", // purple-300
]

export function DailyRewardWheel({ open, onOpenChange, onRewardClaimed, dailyRewardClaimed }: DailyRewardWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [reward, setReward] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const selectedSegmentRef = useRef<number | null>(null)

  // Calcular o tempo restante para a próxima recompensa
  useEffect(() => {
    if (dailyRewardClaimed) {
      const updateTimeRemaining = () => {
        const now = new Date()
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)

        const diff = tomorrow.getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTimeRemaining(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        )
      }

      updateTimeRemaining()
      const interval = setInterval(updateTimeRemaining, 1000)
      return () => clearInterval(interval)
    }
  }, [dailyRewardClaimed])

  // Desenhar a roleta quando o componente montar ou quando o modal abrir
  useEffect(() => {
    if (open) {
      // Pequeno atraso para garantir que o canvas esteja pronto
      const timer = setTimeout(() => {
        drawWheel()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  const drawWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Desenhar segmentos
    const segmentAngle = (2 * Math.PI) / REWARDS.length
    REWARDS.forEach((reward, index) => {
      const startAngle = index * segmentAngle
      const endAngle = (index + 1) * segmentAngle

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      ctx.fillStyle = COLORS[index]
      ctx.fill()
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 1
      ctx.stroke()

      // Desenhar texto
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + segmentAngle / 2)
      ctx.textAlign = "right"
      ctx.fillStyle = index === 5 ? "#6b7280" : "#ffffff" // Texto cinza para o segmento "0"
      ctx.font = "bold 20px sans-serif"

      const rewardText = reward === 0 ? "X" : `${reward}`
      ctx.fillText(rewardText, radius - 20, 5)
      ctx.restore()
    })

    // Desenhar círculo central
    ctx.beginPath()
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI)
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    ctx.stroke()
  }

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setReward(null)

    // Número aleatório de rotações completas (3-5) mais um segmento aleatório
    const fullRotations = 3 + Math.floor(Math.random() * 3)
    const randomSegment = Math.floor(Math.random() * REWARDS.length)
    const segmentAngle = 360 / REWARDS.length
    const targetRotation = fullRotations * 360 + randomSegment * segmentAngle

    // Ajustar para que o ponteiro aponte para o meio do segmento
    const adjustedRotation = targetRotation + segmentAngle / 2

    // Definir a recompensa final - o segmento que ficará no topo após a rotação
    selectedSegmentRef.current = randomSegment
    const finalReward = REWARDS[randomSegment]

    // Animar a roleta
    setRotation(adjustedRotation)

    // Após a animação terminar
    setTimeout(() => {
      setIsSpinning(false)
      setReward(finalReward)

      if (finalReward > 0) {
        // Disparar confete se houver uma recompensa
        if (typeof window !== "undefined") {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })
        }
      }
    }, 5000) // Combinar com a duração da animação CSS
  }

  const handleClaimReward = async () => {
    if (reward !== null) {
      try {
        await onRewardClaimed(reward)
        onOpenChange(false)
      } catch (error) {
        console.error("Error claiming reward:", error)
        toast({
          title: "Erro ao receber recompensa",
          description: "Ocorreu um erro ao processar sua recompensa diária.",
          variant: "destructive",
        })
      }
    }
  }

  // Renderizar conteúdo diferente se a recompensa já foi reivindicada
  if (dailyRewardClaimed && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Recompensa Diária</DialogTitle>
            <DialogDescription className="text-center">Você já recebeu sua recompensa diária hoje.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-8">
            <Clock className="h-16 w-16 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Próxima recompensa em:</h3>
            <div className="text-3xl font-mono font-bold text-purple-600 mb-4">{timeRemaining}</div>
            <p className="text-center text-muted-foreground">
              Volte amanhã para receber sua próxima recompensa diária!
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
            >
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Recompensa Diária</DialogTitle>
          <DialogDescription className="text-center">
            Gire a roleta para receber sua recompensa diária em LOYA tokens!
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-64 h-64 mb-4 max-w-full">
            {/* Ponteiro fixo no topo */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-500"></div>
            </div>

            {/* Roleta giratória */}
            <div
              className="absolute inset-0 transition-transform duration-5000 ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <canvas ref={canvasRef} width="256" height="256" className="w-full h-full" />
            </div>
          </div>

          {reward !== null ? (
            <div className="text-center mb-4">
              {reward > 0 ? (
                <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold mb-2">Parabéns!</h3>
                  <div className="flex items-center text-2xl font-bold text-purple-600">
                    <Coins className="h-6 w-6 mr-2" />
                    <span>{reward} LOYA</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold mb-2">Que pena!</h3>
                  <p>Não foi dessa vez. Tente novamente amanhã!</p>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={spinWheel}
              disabled={isSpinning}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
            >
              {isSpinning ? "Girando..." : "Girar Roleta"}
            </Button>
          )}
        </div>

        <DialogFooter>
          {reward !== null && (
            <Button
              onClick={handleClaimReward}
              className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
            >
              <Gift className="h-4 w-4 mr-2" />
              {reward > 0 ? "Receber Recompensa" : "Fechar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
