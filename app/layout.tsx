import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Web3Provider } from "@/components/web3-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { NavigationEvents } from "@/components/navigation-events"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Loyalty Cripto - Programa de Fidelidade com NFTs",
  description: "Transforme pontos em experiências e renda extra com NFTs de fidelidade",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <Web3Provider>
            {children}
            <Toaster />
            <NavigationEvents />
          </Web3Provider>
        </AuthProvider>
      </body>
    </html>
  )
}
