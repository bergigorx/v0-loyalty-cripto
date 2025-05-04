import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { Web3Provider } from "@/components/web3-provider"
import { PageLoading } from "@/components/page-loading"
import { NavigationEvents } from "@/components/navigation-events"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Loyalty Cripto - Programa de Fidelidade com NFTs",
  description: "Plataforma de fidelidade baseada em blockchain que conecta empresas e clientes através de NFTs.",
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <Web3Provider>
              <PageLoading />
              <NavigationEvents />
              {children}
              <Toaster />
            </Web3Provider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
