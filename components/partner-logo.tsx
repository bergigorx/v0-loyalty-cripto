import type React from "react"
import { cn } from "@/lib/utils"

type PartnerLogoProps = {
  partner: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function PartnerLogo({ partner, className, size = "md" }: PartnerLogoProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const partnerColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    WeCoffe: {
      bg: "bg-amber-100 dark:bg-amber-900/20",
      text: "text-amber-800 dark:text-amber-400",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={sizeClasses[size]}
        >
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" x2="6" y1="2" y2="4" />
          <line x1="10" x2="10" y1="2" y2="4" />
          <line x1="14" x2="14" y1="2" y2="4" />
        </svg>
      ),
    },
    "CVC Viagens": {
      bg: "bg-blue-100 dark:bg-blue-900/20",
      text: "text-blue-800 dark:text-blue-400",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={sizeClasses[size]}
        >
          <path d="M3 17h1m16 0h1M5 17H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5z" />
          <path d="M6 7v.01M8 7v.01M10 7v.01M12 7v.01M14 7v.01M16 7v.01M18 7v.01M12 17v.01M14 17v.01M16 17v.01M18 17v.01" />
          <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          <path d="M17 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          <path d="M7 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        </svg>
      ),
    },
    "Mercado Atacadão": {
      bg: "bg-green-100 dark:bg-green-900/20",
      text: "text-green-800 dark:text-green-400",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={sizeClasses[size]}
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    "Livraria Cultura": {
      bg: "bg-red-100 dark:bg-red-900/20",
      text: "text-red-800 dark:text-red-400",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={sizeClasses[size]}
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    SmartFit: {
      bg: "bg-purple-100 dark:bg-purple-900/20",
      text: "text-purple-800 dark:text-purple-400",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={sizeClasses[size]}
        >
          <path d="M18 8a5 5 0 0 0-10 0v7h10z" />
          <path d="M18 15v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-4" />
          <path d="M14 4a2 2 0 0 0-4 0" />
          <path d="M18 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          <path d="M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        </svg>
      ),
    },
  }

  const defaultPartner = {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-800 dark:text-gray-300",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={sizeClasses[size]}
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
  }

  const partnerStyle = partnerColors[partner] || defaultPartner

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        partnerStyle.bg,
        partnerStyle.text,
        className,
      )}
    >
      {partnerStyle.icon}
      <span className="ml-1">{partner}</span>
    </div>
  )
}
