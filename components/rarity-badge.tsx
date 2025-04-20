import { cn } from "@/lib/utils"

type RarityBadgeProps = {
  rarity: string
  className?: string
}

export function RarityBadge({ rarity, className }: RarityBadgeProps) {
  const rarityColors = {
    common: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    uncommon: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    rare: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    legendary: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  }

  const rarityKey = rarity?.toLowerCase() as keyof typeof rarityColors
  const colorClass = rarityColors[rarityKey] || rarityColors.common

  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", colorClass, className)}>
      {rarity}
    </span>
  )
}
