"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowRight,
  CreditCard,
  Bitcoin,
  DollarSign,
  Wallet,
  Copy,
  Check,
  RefreshCw,
  HelpCircle,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Lock,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Logo } from "@/components/logo"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MobileMenu } from "@/components/mobile-menu"
import { useWeb3 } from "@/components/web3-provider"

// Preço simulado do token LOYA
const LOYA_PRICE = 0.1 // R$ 0,10

// Taxas simuladas
const FEES = {
  pix: 0.01, // 1%
  usdt: 0.02, // 2%
  btc: 0.03, // 3%
}

// Endereços simulados para pagamento
const PAYMENT_ADDRESSES = {
  pix: "00020126580014br.gov.bcb.pix0136a629534e-7693-4846-b028-f142c3d4533f5204000053039865802BR5925Loyalty Crypto Pagamentos6009SAO PAULO62070503***63041D57",
  usdt: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  btc: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
}

export default function BuyTokensPage() {
  const {
    isMetaMaskInstalled,
    isMobileDevice,
    connectWallet,
    disconnectWallet,
    walletAddress,
    walletProvider,
    isConnecting,
  } = useWeb3()

  const [paymentMethod, setPaymentMethod] = useState("pix")
  const [amount, setAmount] = useState("100")
  const [tokenAmount, setTokenAmount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [manualWalletAddress, setManualWalletAddress] = useState("")
  const [authMethod, setAuthMethod] = useState<"wallet" | "credentials">("wallet")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Calcular quantidade de tokens com base no valor
  useEffect(() => {
    const amountValue = Number.parseFloat(amount) || 0
    setTokenAmount(Math.floor(amountValue / LOYA_PRICE))
  }, [amount])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Copiado!",
      description: "Endereço copiado para a área de transferência.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirmPayment = () => {
    if (authMethod === "wallet" && !getEffectiveWalletAddress()) {
      toast({
        title: "Endereço da carteira necessário",
        description: "Por favor, informe o endereço da sua carteira para receber os tokens.",
        variant: "destructive",
      })
      return
    }

    if (authMethod === "credentials" && (!email || !password)) {
      toast({
        title: "Credenciais necessárias",
        description: "Por favor, informe seu email e senha para receber os tokens.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulação de processamento
    setTimeout(() => {
      setIsProcessing(false)
      setIsConfirmed(true)
      toast({
        title: "Pagamento confirmado!",
        description: `${tokenAmount} tokens LOYA foram enviados para sua ${authMethod === "wallet" ? "carteira" : "conta"}.`,
      })
    }, 2000)
  }

  const getFee = () => {
    const amountValue = Number.parseFloat(amount) || 0
    return amountValue * FEES[paymentMethod as keyof typeof FEES]
  }

  const getTotal = () => {
    const amountValue = Number.parseFloat(amount) || 0
    return amountValue + getFee()
  }

  const resetForm = () => {
    setIsConfirmed(false)
    setAmount("100")
    setManualWalletAddress("")
    setEmail("")
    setPassword("")
  }

  // Obter o endereço efetivo da carteira (conectada ou manual)
  const getEffectiveWalletAddress = () => {
    return walletAddress || manualWalletAddress
  }

  // Formatar endereço da carteira para exibição
  const formatWalletAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Logo />
            <nav className="hidden md:flex gap-6">
              <Link
                href="/"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Início
              </Link>
              <Link
                href="/marketplace"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Marketplace
              </Link>
              <Link href="/buy-tokens" className="flex items-center text-sm font-medium text-foreground">
                Comprar LOYA
              </Link>
              <Link
                href="/business/metrics"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Para Empresas
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/business/login">
                <Button variant="outline" size="sm">
                  Área da Empresa
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm">Área do Cliente</Button>
              </Link>
            </div>
            <MobileMenu activeRoute="buy-tokens" />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-8 max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Comprar Tokens LOYA</h1>
            <p className="text-muted-foreground mt-2">
              Adquira tokens LOYA para usar em nosso marketplace e programas de fidelidade
            </p>
          </div>

          {isConfirmed ? (
            <Card className="shadow-md">
              <CardHeader className="text-center">
                <div className="mx-auto rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/20 dark:text-green-400 mb-4">
                  <Check className="h-8 w-8" />
                </div>
                <CardTitle>Compra Confirmada!</CardTitle>
                <CardDescription>Seus tokens LOYA foram enviados para sua carteira</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantidade:</span>
                    <span className="font-medium">{tokenAmount} LOYA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor:</span>
                    <span className="font-medium">R$ {Number.parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa:</span>
                    <span className="font-medium">R$ {getFee().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">R$ {getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Método:</span>
                    <span className="font-medium capitalize">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recebimento:</span>
                    <span className="font-medium">
                      {authMethod === "wallet"
                        ? walletProvider
                          ? `${walletProvider} (${formatWalletAddress(getEffectiveWalletAddress())})`
                          : `Carteira (${formatWalletAddress(getEffectiveWalletAddress())})`
                        : `Conta (${email})`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">{new Date().toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Você pode visualizar seus tokens na área do cliente</p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Link href="/dashboard">
                      <Button className="w-full">
                        Ir para Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={resetForm}>
                      Comprar mais tokens
                      <RefreshCw className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Comprar Tokens LOYA</CardTitle>
                <CardDescription>Escolha a quantidade e o método de pagamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor em Reais (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      min="10"
                      step="10"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Valor mínimo: R$ 10,00</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tokens">Quantidade de Tokens LOYA</Label>
                  <div className="relative">
                    <Input id="tokens" value={tokenAmount} readOnly className="bg-muted" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      1 LOYA = R$ {LOYA_PRICE.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Método de Recebimento</Label>
                  <div className="flex rounded-md overflow-hidden border">
                    <button
                      type="button"
                      className={`flex-1 px-4 py-2 text-sm font-medium ${
                        authMethod === "wallet"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                          : "bg-transparent hover:bg-muted"
                      }`}
                      onClick={() => setAuthMethod("wallet")}
                    >
                      <Wallet className="h-4 w-4 inline-block mr-2" />
                      Carteira
                    </button>
                    <button
                      type="button"
                      className={`flex-1 px-4 py-2 text-sm font-medium ${
                        authMethod === "credentials"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                          : "bg-transparent hover:bg-muted"
                      }`}
                      onClick={() => setAuthMethod("credentials")}
                    >
                      <User className="h-4 w-4 inline-block mr-2" />
                      Login/Senha
                    </button>
                  </div>
                </div>

                {authMethod === "wallet" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="wallet">Endereço da Carteira</Label>
                      <div className="relative">
                        <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="wallet"
                          placeholder="0x..."
                          value={walletAddress || manualWalletAddress}
                          onChange={(e) => setManualWalletAddress(e.target.value)}
                          className="pl-10"
                          disabled={!!walletAddress}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          {walletAddress
                            ? `Conectado com ${walletProvider}: ${formatWalletAddress(walletAddress)}`
                            : "Informe o endereço da sua carteira ou conecte diretamente"}
                        </p>
                        {walletAddress ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={disconnectWallet}
                            className="h-8 text-xs w-full sm:w-auto"
                          >
                            Desconectar
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={connectWallet}
                            className="h-8 text-xs w-full sm:w-auto"
                          >
                            {isConnecting ? (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Conectando...
                              </>
                            ) : (
                              <>
                                <Image
                                  src="/placeholder.svg?height=16&width=16"
                                  alt="MetaMask"
                                  width={16}
                                  height={16}
                                  className="mr-1"
                                />
                                {isMobileDevice ? "Abrir MetaMask" : "Conectar MetaMask"}
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {!isMetaMaskInstalled && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {isMobileDevice ? (
                            <>
                              MetaMask não detectado.{" "}
                              <a
                                href="https://metamask.io/download/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                              >
                                Instalar MetaMask
                              </a>{" "}
                              ou use o botão acima para abrir o app.
                            </>
                          ) : (
                            <>
                              MetaMask não detectado.{" "}
                              <a
                                href="https://metamask.io/download/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                              >
                                Instalar MetaMask
                              </a>
                            </>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Entre com suas credenciais para receber os tokens em sua conta
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Método de Pagamento</Label>
                  <Tabs defaultValue="pix" onValueChange={setPaymentMethod}>
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="pix" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>PIX</span>
                      </TabsTrigger>
                      <TabsTrigger value="usdt" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>USDT</span>
                      </TabsTrigger>
                      <TabsTrigger value="btc" className="flex items-center gap-2">
                        <Bitcoin className="h-4 w-4" />
                        <span>Bitcoin</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pix" className="space-y-4 mt-4">
                      <div className="bg-muted p-4 rounded-lg text-center">
                        <div className="mb-2 text-sm font-medium">Escaneie o QR Code PIX</div>
                        <div className="bg-white p-4 rounded-lg inline-block">
                          <Image
                            src="/placeholder.svg?height=150&width=150"
                            alt="QR Code PIX"
                            width={150}
                            height={150}
                            className="mx-auto"
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-center gap-2">
                          <div className="text-xs font-mono bg-muted-foreground/10 p-2 rounded truncate max-w-[200px]">
                            {PAYMENT_ADDRESSES.pix.slice(0, 20)}...
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopy(PAYMENT_ADDRESSES.pix)}
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="usdt" className="space-y-4 mt-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="mb-2 text-sm font-medium">Endereço USDT (Polygon)</div>
                        <div className="flex items-center gap-2 bg-muted-foreground/10 p-3 rounded">
                          <div className="text-xs font-mono truncate">{PAYMENT_ADDRESSES.usdt}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => handleCopy(PAYMENT_ADDRESSES.usdt)}
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Envie USDT pela rede Polygon para o endereço acima
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="btc" className="space-y-4 mt-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="mb-2 text-sm font-medium">Endereço Bitcoin</div>
                        <div className="flex items-center gap-2 bg-muted-foreground/10 p-3 rounded">
                          <div className="text-xs font-mono truncate">{PAYMENT_ADDRESSES.btc}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => handleCopy(PAYMENT_ADDRESSES.btc)}
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Envie Bitcoin para o endereço acima</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Atenção</AlertTitle>
                  <AlertDescription>
                    Este é um ambiente de demonstração. Nenhum pagamento real será processado.
                  </AlertDescription>
                </Alert>

                <div className="rounded-lg bg-muted p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>R$ {Number.parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center">
                      Taxa ({(FEES[paymentMethod as keyof typeof FEES] * 100).toFixed(0)}%):
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-xs">
                              Taxa de processamento do pagamento. Varia conforme o método escolhido.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                    <span>R$ {getFee().toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total:</span>
                    <span>R$ {getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                  onClick={handleConfirmPayment}
                  disabled={
                    isProcessing ||
                    !amount ||
                    Number.parseFloat(amount) < 10 ||
                    (authMethod === "wallet" && !getEffectiveWalletAddress()) ||
                    (authMethod === "credentials" && (!email || !password))
                  }
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>Confirmar Pagamento</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>

      <footer className="w-full border-t bg-background">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <Logo size="sm" />
            <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
              &copy; {new Date().getFullYear()} Loyalty Cripto. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
