import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max: number
  className?: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function ProgressBar({ value, max, className, showLabel = true, size = "md" }: ProgressBarProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100)

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }

  return (
    <div className={cn("w-full space-y-1", className)}>
      <div className="flex justify-between text-xs">
        {showLabel && (
          <>
            <span className="text-muted-foreground">
              {value} / {max}
            </span>
            <span className="font-medium">{Math.round(percentage)}%</span>
          </>
        )}
      </div>
      <div className={cn("w-full bg-secondary rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className="bg-gradient-to-r from-purple-600 to-teal-500 h-full rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
