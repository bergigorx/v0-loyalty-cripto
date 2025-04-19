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
import { Separator } from "@/components/ui/separator"
import { Facebook, Wallet } from "lucide-react"

interface RegisterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegisterModal({ open, onOpenChange }: RegisterModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegisterWithEmail = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de registro com email/senha
    console.log("Registrando com email:", email)
    onOpenChange(false)
  }

  const handleRegisterWithGoogle = () => {
    // Implementar lógica de registro com Google
    console.log("Registrando com Google")
    onOpenChange(false)
  }

  const handleRegisterWithFacebook = () => {
    // Implementar lógica de registro com Facebook
    console.log("Registrando com Facebook")
    onOpenChange(false)
  }

  const handleRegisterWithMetaMask = async () => {
    // Implementar lógica de conexão com MetaMask
    if (typeof window.ethereum !== "undefined") {
      try {
        // Solicitar conexão de conta
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log("Conectado com MetaMask:", accounts[0])
        onOpenChange(false)
      } catch (error) {
        console.error("Erro ao conectar com MetaMask:", error)
      }
    } else {
      alert("MetaMask não encontrado. Por favor, instale a extensão MetaMask.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Criar Conta</DialogTitle>
          <DialogDescription>Escolha como deseja criar sua conta na plataforma Loyalty Cripto</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={handleRegisterWithGoogle}
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
            onClick={handleRegisterWithFacebook}
          >
            <Facebook className="h-5 w-5 text-blue-600" />
            Continuar com Facebook
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={handleRegisterWithMetaMask}
          >
            <Wallet className="h-5 w-5 text-orange-500" />
            Conectar com MetaMask
          </Button>
          <Separator className="my-2" />
          <form onSubmit={handleRegisterWithEmail}>
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
              >
                Criar Conta
              </Button>
            </div>
          </form>
        </div>
        <DialogFooter className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <a href="#" className="text-purple-600 hover:underline">
              Entrar
            </a>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
