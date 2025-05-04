"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle2 } from "lucide-react"
import { sanitizeInput, isValidEmail, isValidBrazilianPhone, checkRateLimit } from "@/lib/security-utils"

interface ContactFormProps {
  onSuccess?: () => void
  onClose?: () => void
}

export function ContactForm({ onSuccess, onClose }: ContactFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [csrfToken] = useState(`csrf-${Math.random().toString(36).substring(2, 15)}`)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target

      // Sanitizar entrada
      const sanitizedValue = sanitizeInput(value)

      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }))

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
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nome completo é obrigatório"
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Nome deve ter pelo menos 3 caracteres"
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email inválido"
    }

    // Validar telefone
    if (formData.phone && !isValidBrazilianPhone(formData.phone)) {
      newErrors.phone = "Telefone inválido"
    }

    // Validar estado
    if (formData.state && formData.state.length > 2) {
      newErrors.state = "Use a sigla do estado (ex: SP)"
    }

    // Validar cidade
    if (formData.city && formData.city.length < 2) {
      newErrors.city = "Nome da cidade inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Verificar se o formulário é válido
      if (!validateForm()) return

      // Implementar rate limiting para prevenir spam
      const clientId = formData.email || "anonymous"
      if (!checkRateLimit(clientId, 3, 60000)) {
        toast({
          title: "Muitas tentativas",
          description: "Por favor, aguarde um momento antes de tentar novamente.",
          variant: "destructive",
        })
        return
      }

      setIsSubmitting(true)

      try {
        // Simular envio do formulário
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Em produção, aqui seria feita uma chamada para uma API segura
        // com validação adicional no servidor

        setIsSubmitted(true)

        toast({
          title: "Mensagem enviada!",
          description: "Agradecemos seu contato. Retornaremos em breve.",
        })

        if (onSuccess) {
          onSuccess()
        }
      } catch (error) {
        toast({
          title: "Erro ao enviar mensagem",
          description: "Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, validateForm, onSuccess],
  )

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold mb-2">Mensagem Enviada!</h3>
        <p className="text-muted-foreground mb-6">Agradecemos seu contato. Nossa equipe retornará em breve.</p>
        <Button onClick={onClose}>Fechar</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <input type="hidden" name="csrf_token" value={csrfToken} />

      <div className="grid gap-2">
        <Label htmlFor="fullName">Nome completo*</Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder="Seu nome completo"
          value={formData.fullName}
          onChange={handleChange}
          aria-invalid={!!errors.fullName}
          required
        />
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email*</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={handleChange}
          aria-invalid={!!errors.email}
          required
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onChange={handleChange}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            name="state"
            placeholder="Estado"
            value={formData.state}
            onChange={handleChange}
            aria-invalid={!!errors.state}
          />
          {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            name="city"
            placeholder="Cidade"
            value={formData.city}
            onChange={handleChange}
            aria-invalid={!!errors.city}
          />
          {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Mensagem</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Como podemos ajudar?"
          value={formData.message}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar"
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-2">* Campos obrigatórios</p>
    </form>
  )
}
