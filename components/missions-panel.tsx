"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/progress-bar"
import { Coins, Gift, CheckCircle2 } from "lucide-react"

interface Mission {
  id: string
  title: string
  description: string
  reward: number
  progress: number
  target: number
  icon: React.ReactNode
  isCompleted: boolean
  isClaimable: boolean
}

interface MissionsPanelProps {
  missions: Mission[]
  onClaimReward: (missionId: string) => Promise<void>
}

export function MissionsPanel({ missions, onClaimReward }: MissionsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((mission) => (
          <Card
            key={mission.id}
            className={mission.isCompleted ? "border-green-200 bg-green-50/50 dark:bg-green-950/10" : ""}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2">{mission.icon}</div>
                  <CardTitle className="text-base">{mission.title}</CardTitle>
                </div>
                <div className="flex items-center text-sm font-medium text-purple-600">
                  <Coins className="h-3.5 w-3.5 mr-1" />
                  <span>{mission.reward}</span>
                </div>
              </div>
              <CardDescription>{mission.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <ProgressBar value={mission.progress} max={mission.target} size="sm" showLabel={!mission.isCompleted} />
            </CardContent>
            <CardFooter>
              {mission.isCompleted ? (
                mission.isClaimable ? (
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                    onClick={() => onClaimReward(mission.id)}
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Receber Recompensa
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    Recompensa Recebida
                  </Button>
                )
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Em Progresso
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
