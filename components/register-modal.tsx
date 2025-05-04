"use client"

import type React from "react"

import { useState, useCallback } from "react"
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
import { Facebook, Wallet, Loader2, AlertCircle } from "lucide-react"
import { createClientComponentClient } from "@/lib/supabase-config"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { sanitizeInput, isValidEmail, checkRateLimit } from "@/lib/security-utils"

interface RegisterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegisterModal({ open, onOpenChange }: RegisterModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [csrfToken] = useState(`csrf-${Math.random().toString(36).substring(2, 15)}`)
  const supabase = createClientComponentClient()

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
      const { name, value } = e.target
      const sanitizedValue = sanitizeInput(value)
      setter(sanitizedValue)

      // Limpar erro quando o usuário digita
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    },
    [errors],
  )

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    // Validar nome completo
    if (!fullName.trim()) {
      newErrors.fullName = "Nome completo é obrigatório"
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = "Nome deve ter pelo menos 3 caracteres"
    }

    // Validar email
    if (!email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!isValidEmail(email)) {
      newErrors.email = "Email inválido"
    }

    // Validar senha
    if (!password) {
      newErrors.password = "Senha é obrigatória"
    } else if (password.length < 8) {
      newErrors.password = "Senha deve ter pelo menos 8 caracteres"
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      newErrors.password = "Senha deve conter letras maiúsculas, minúsculas e números"
    }

    // Validar confirmação de senha
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [fullName, email, password, confirmPassword])

  const handleRegisterWithEmail = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validar formulário
      if (!validateForm()) return

      // Implementar rate limiting para prevenir spam
      if (!checkRateLimit(email, 3, 300000)) {
        toast({
          title: "Muitas tentativas",
          description: "Por favor, aguarde alguns minutos antes de tentar novamente.",
          variant: "destructive",
        })
        return
      }

      setIsLoading(true)

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) {
          throw error
        }

        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar o cadastro.",
        })

        onOpenChange(false)
      } catch (error: any) {
        // Mensagem de erro específica para email já em uso
        if (error.message?.includes("email already in use")) {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está sendo usado. Tente fazer login ou use outro email.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Erro ao criar conta",
            description: "Ocorreu um erro ao criar sua conta. Tente novamente mais tarde.",
            variant: "destructive",
          })
        }

        // Log detalhado apenas para desenvolvimento
        console.error("Registration error:", error.message)
      } finally {
        setIsLoading(false)
      }
    },
    [validateForm, fullName, email, password, supabase, onOpenChange],
  )

  const handleRegisterWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
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
  }, [supabase])

  const handleRegisterWithFacebook = useCallback(async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "email",
        },
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      toast({
        title: "Erro ao conectar com Facebook",
        description: error.message || "Ocorreu um erro ao conectar com Facebook.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  const handleRegisterWithMetaMask = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setIsLoading(true)

        // Gerar um nonce aleatório para assinar
        const nonce = Math.floor(Math.random() * 1000000).toString()
        localStorage.setItem("auth_nonce", nonce)

        // Solicitar conexão de conta
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        const walletAddress = accounts[0]

        // Solicitar assinatura do usuário com mensagem que inclui nonce
        const message = `Registro Loyalty Cripto: ${nonce}`
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, walletAddress],
        })

        // Verificar se o usuário já existe
        const { data, error } = await supabase.auth.signInWithPassword({
          email: `${walletAddress.toLowerCase()}@wallet.metamask`,
          password: signature.slice(0, 20), // Usar parte da assinatura como senha
        })

        if (error && error.status === 400) {
          // Se o usuário não existir, criar uma nova conta
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: `${walletAddress.toLowerCase()}@wallet.metamask`,
            password: signature.slice(0, 20),
            options: {
              data: {
                wallet_address: walletAddress,
              },
            },
          })

          if (signUpError) throw signUpError

          // Atualizar o perfil com o endereço da carteira
          if (signUpData.user) {
            const { error: updateError } = await supabase
              .from("profiles")
              .update({ wallet_address: walletAddress })
              .eq("id", signUpData.user.id)

            if (updateError) throw updateError
          }

          toast({
            title: "Conta criada com sucesso!",
            description: "Você está conectado com MetaMask.",
          })
        } else if (error) {
          throw error
        } else {
          toast({
            title: "Login realizado com sucesso!",
            description: "Você está conectado com MetaMask.",
          })
        }

        onOpenChange(false)
      } catch (error: any) {
        // Tratamento específico de erros
        if (error.code === 4001) {
          // Usuário rejeitou a solicitação
          toast({
            title: "Conexão rejeitada",
            description: "Você rejeitou a solicitação de conexão da carteira.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Erro ao conectar com MetaMask",
            description: error.message || "Ocorreu um erro ao conectar com MetaMask.",
            variant: "destructive",
          })
        }
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
  }, [onOpenChange, supabase])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Criar Conta</DialogTitle>
          <DialogDescription>Escolha como deseja criar sua conta na plataforma Loyalty Cripto</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={handleRegisterWithGoogle}
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
            onClick={handleRegisterWithFacebook}
            disabled={isLoading}
          >
            <Facebook className="h-5 w-5 text-blue-600" />
            Continuar com Facebook
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={handleRegisterWithMetaMask}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wallet className="h-5 w-5 text-orange-500" />}
            Conectar com MetaMask
          </Button>
          <Separator className="my-2" />
          <form onSubmit={handleRegisterWithEmail}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => handleInputChange(e, setFullName)}
                  required
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => handleInputChange(e, setEmail)}
                  required
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => handleInputChange(e, setPassword)}
                  required
                  aria-invalid={!!errors.password}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => handleInputChange(e, setConfirmPassword)}
                  required
                  aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>

              {/* Campo oculto para proteção CSRF */}
              <input type="hidden" name="csrf_token" value={csrfToken} />

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
                  "Criar Conta"
                )}
              </Button>
            </div>
          </form>

          {typeof window !== "undefined" && !window.ethereum && (
            <Alert variant="warning" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                MetaMask não detectado. Para usar a autenticação com carteira,{" "}
                <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="underline">
                  instale a extensão MetaMask
                </a>
                .
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <a href="#" className="text-purple-600 hover:underline" onClick={() => onOpenChange(false)}>
              Entrar
            </a>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
