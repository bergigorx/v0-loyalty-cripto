"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-foreground" : "text-muted-foreground",
        )}
      >
        Início
      </Link>
      <Link
        href="/marketplace"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/marketplace" ? "text-foreground" : "text-muted-foreground",
        )}
      >
        Marketplace
      </Link>
      <Link
        href="/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground",
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/buy-tokens"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/buy-tokens" ? "text-foreground" : "text-muted-foreground",
        )}
      >
        Comprar LOYA
      </Link>
      <Link
        href="/business/metrics"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/business/metrics" ? "text-foreground" : "text-muted-foreground",
        )}
      >
        Para Empresas
      </Link>
    </nav>
  )
}
