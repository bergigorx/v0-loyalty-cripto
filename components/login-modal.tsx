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
import { Wallet, Loader2 } from "lucide-react"
import { createClientComponentClient } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRegisterClick: () => void
}

export function LoginModal({ open, onOpenChange, onRegisterClick }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleLoginWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta à plataforma Loyalty Cripto.",
      })

      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginWithGoogle = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      toast({
        title: "Erro ao conectar com Google",
        description: error.message || "Ocorreu um erro ao conectar com Google.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginWithMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setIsLoading(true)
        // Solicitar conexão de conta
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        const walletAddress = accounts[0]

        // Gerar um nonce aleatório para assinar
        const nonce = Math.floor(Math.random() * 1000000).toString()

        // Solicitar assinatura do usuário
        const message = `Autenticação Loyalty Cripto: ${nonce}`
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, walletAddress],
        })

        // Autenticar com Supabase usando o endereço da carteira como identificador
        const { data, error } = await supabase.auth.signInWithPassword({
          email: `${walletAddress.toLowerCase()}@wallet.metamask`,
          password: signature.slice(0, 20), // Usar parte da assinatura como senha
        })

        if (error) {
          // Se o usuário não existir, sugerir registro
          if (error.status === 400) {
            toast({
              title: "Conta não encontrada",
              description: "Você ainda não tem uma conta. Por favor, registre-se primeiro.",
              variant: "destructive",
            })
            onOpenChange(false)
            onRegisterClick()
            return
          }
          throw error
        }

        toast({
          title: "Login realizado com sucesso!",
          description: "Você está conectado com MetaMask.",
        })

        onOpenChange(false)
      } catch (error: any) {
        toast({
          title: "Erro ao conectar com MetaMask",
          description: error.message || "Ocorreu um erro ao conectar com MetaMask.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      toast({
        title: "MetaMask não encontrado",
        description: "Por favor, instale a extensão MetaMask.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Entrar</DialogTitle>
          <DialogDescription>Acesse sua conta na plataforma Loyalty Cripto</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={handleLoginWithGoogle}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" className="h-5 w-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar com Google
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={handleLoginWithMetaMask}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wallet className="h-5 w-5 text-orange-500" />}
            Conectar com MetaMask
          </Button>

          <Separator className="my-2" />

          <form onSubmit={handleLoginWithEmail}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </div>
          </form>
        </div>
        <DialogFooter className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <button
              type="button"
              onClick={() => {
                onOpenChange(false)
                onRegisterClick()
              }}
              className="text-purple-600 hover:underline"
            >
              Registrar-se
            </button>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
