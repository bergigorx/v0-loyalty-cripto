"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  LineChartIcon,
  Download,
  Share2,
  Info,
  RefreshCw,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MobileMenu } from "@/components/mobile-menu"
import {
  type BusinessMetrics,
  initializeMetricsData,
  loadBusinessMetrics,
  getRealtimeMetrics,
} from "@/lib/business-metrics-service"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

const COLORS = ["#0088FE", "#8884d8"]

export default function BusinessMetricsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  // Inicializar dados e carregar métricas
  useEffect(() => {
    initializeMetricsData()
    const initialMetrics = loadBusinessMetrics()
    setMetrics(initialMetrics)
    setLastUpdated(formatLastUpdated(initialMetrics.lastUpdated))
    setLoading(false)

    // Simular atualizações periódicas (a cada 30 segundos)
    const intervalId = setInterval(async () => {
      await refreshMetrics()
    }, 30000)

    return () => clearInterval(intervalId)
  }, [])

  // Função para formatar a data da última atualização
  const formatLastUpdated = (timestamp: number): string => {
    const date = new Date(timestamp)
    return `${date.toLocaleDateString()} às ${date.toLocaleTimeString()}`
  }

  // Função para atualizar métricas manualmente
  const refreshMetrics = async () => {
    setRefreshing(true)
    try {
      const updatedMetrics = await getRealtimeMetrics()
      setMetrics(updatedMetrics)
      setLastUpdated(formatLastUpdated(updatedMetrics.lastUpdated))
    } catch (error) {
      console.error("Erro ao atualizar métricas:", error)
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
            <div className="flex gap-6 md:gap-10">
              <Logo />
              <nav className="hidden md:flex gap-6">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </nav>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </header>

        <main className="flex-1 container py-8">
          <div className="flex flex-col space-y-8">
            <div>
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/2" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <Card key={index} className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-20 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </CardContent>
                  </Card>
                ))}
            </div>

            <Card className="shadow-md">
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (!metrics) {
    return <div>Erro ao carregar métricas. Por favor, recarregue a página.</div>
  }

  const metricsData = [
    {
      title: "LTV Médio",
      value: metrics.summary.ltv.value,
      change: metrics.summary.ltv.change,
      description: metrics.summary.ltv.description,
    },
    {
      title: "CAC",
      value: metrics.summary.cac.value,
      change: metrics.summary.cac.change,
      description: metrics.summary.cac.description,
    },
    {
      title: "Taxa de Retenção",
      value: metrics.summary.retention.value,
      change: metrics.summary.retention.change,
      description: metrics.summary.retention.description,
    },
    {
      title: "Engajamento",
      value: metrics.summary.engagement.value,
      change: metrics.summary.engagement.change,
      description: metrics.summary.engagement.description,
    },
  ]

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
              <Link
                href="/buy-tokens"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Comprar LOYA
              </Link>
              <Link href="/business/metrics" className="flex items-center text-sm font-medium text-foreground">
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
            <MobileMenu activeRoute="business" />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Métricas de Fidelidade com NFTs</h1>
              <p className="text-muted-foreground mt-2">
                Análise comparativa entre programas de fidelidade tradicionais e programas baseados em NFTs
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Dados da Blockchain
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={refreshMetrics}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Atualizando..." : "Atualizar Dados"}
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">Última atualização: {lastUpdated}</div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metricsData.map((metric, index) => (
              <Card key={index} className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                    <TooltipProvider>
                      <TooltipUI>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-1 inline text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            {metric.title === "LTV Médio" &&
                              "Valor médio que um cliente gera durante todo seu relacionamento com a empresa."}
                            {metric.title === "CAC" && "Custo para adquirir um novo cliente."}
                            {metric.title === "Taxa de Retenção" &&
                              "Percentual de clientes que continuam ativos após 12 meses."}
                            {metric.title === "Engajamento" &&
                              "Percentual de clientes que interagem com o programa regularmente."}
                          </p>
                        </TooltipContent>
                      </TooltipUI>
                    </TooltipProvider>
                  </CardTitle>
                  <div className="rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                    {metric.title === "LTV Médio" && <TrendingUp className="h-4 w-4" />}
                    {metric.title === "CAC" && <DollarSign className="h-4 w-4" />}
                    {metric.title === "Taxa de Retenção" && <Users className="h-4 w-4" />}
                    {metric.title === "Engajamento" && <BarChart3 className="h-4 w-4" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <span className={`mr-1 ${metric.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                      {metric.change}
                    </span>
                    <span>{metric.description}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="ltv">LTV</TabsTrigger>
              <TabsTrigger value="cac">CAC</TabsTrigger>
              <TabsTrigger value="retention">Retenção</TabsTrigger>
              <TabsTrigger value="engagement">Engajamento</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Comparativo de Métricas</CardTitle>
                  <CardDescription>
                    Análise comparativa entre programas de fidelidade tradicionais e programas baseados em NFTs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <LineChartIcon className="h-4 w-4 mr-2 text-purple-600" />
                          LTV ao Longo do Tempo
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={metrics.ltv}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="tradicional" stroke="#0088FE" name="Programa Tradicional" />
                            <Line type="monotone" dataKey="nft" stroke="#8884d8" name="Programa com NFTs" />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2 text-purple-600" />
                          CAC ao Longo do Tempo
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={metrics.cac}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="tradicional" fill="#0088FE" name="Programa Tradicional" />
                            <Bar dataKey="nft" fill="#8884d8" name="Programa com NFTs" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Principais Benefícios</CardTitle>
                    <CardDescription>Vantagens de programas de fidelidade baseados em NFTs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="mr-3 rounded-full bg-purple-100 p-1 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Maior Engajamento</h4>
                          <p className="text-sm text-muted-foreground">
                            Clientes interagem 85% mais com programas baseados em NFTs devido à exclusividade e valor
                            percebido.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 rounded-full bg-purple-100 p-1 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Redução de Custos</h4>
                          <p className="text-sm text-muted-foreground">
                            Redução de até 73% no CAC e eliminação de custos operacionais com infraestrutura
                            tradicional.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 rounded-full bg-purple-100 p-1 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Aumento do LTV</h4>
                          <p className="text-sm text-muted-foreground">
                            Aumento médio de 115% no valor vitalício do cliente devido à maior retenção e frequência de
                            compra.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 rounded-full bg-purple-100 p-1 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Dados Acionáveis</h4>
                          <p className="text-sm text-muted-foreground">
                            Acesso a dados granulares sobre comportamento do cliente para personalização de ofertas.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Casos de Sucesso</CardTitle>
                    <CardDescription>Empresas que implementaram programas de fidelidade com NFTs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="mr-3 rounded-full bg-purple-100 p-1 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Rede de Cafeterias WeCoffee</h4>
                          <p className="text-sm text-muted-foreground">
                            Aumento de 127% na frequência de visitas e 89% na retenção de clientes após 6 meses.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 rounded-full bg-purple-100 p-1 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Rede de Varejo Atacadão</h4>
                          <p className="text-sm text-muted-foreground">
                            Redução de 68% no CAC e aumento de 93% no ticket médio dos clientes com NFTs.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 rounded-full bg-purple-100 p-1 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Agência de Viagens CVC</h4>
                          <p className="text-sm text-muted-foreground">
                            Aumento de 145% no LTV e redução de 52% nos custos de marketing para clientes existentes.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-3 rounded-full bg-purple-100 p-1 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Rede de Academias SmartFit</h4>
                          <p className="text-sm text-muted-foreground">
                            Redução de 42% na taxa de cancelamento e aumento de 78% na aquisição de serviços premium.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ltv" className="space-y-4">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Lifetime Value (LTV)</CardTitle>
                  <CardDescription>
                    Análise detalhada do valor vitalício do cliente em programas de fidelidade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={metrics.ltv}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="tradicional" stroke="#0088FE" name="Programa Tradicional" />
                        <Line type="monotone" dataKey="nft" stroke="#8884d8" name="Programa com NFTs" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">O que é LTV?</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        O Lifetime Value (LTV) é uma métrica que calcula o valor total que um cliente gera para sua
                        empresa durante todo o relacionamento. É uma das métricas mais importantes para avaliar a saúde
                        financeira de um programa de fidelidade.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Por que o LTV é maior com NFTs?</h3>
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                        <li>Maior percepção de valor pelos clientes devido à exclusividade e escassez dos NFTs</li>
                        <li>Aumento na frequência de compra para acumular e desbloquear novos NFTs</li>
                        <li>Maior engajamento com a marca através de colecionáveis digitais</li>
                        <li>Possibilidade de revenda e transferência de benefícios, criando um mercado secundário</li>
                        <li>Gamificação natural do programa, incentivando comportamentos desejados</li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-lg font-medium">Cálculo do LTV</h3>
                      <p className="text-sm mt-1">LTV = Ticket Médio × Frequência de Compra × Tempo de Retenção</p>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Programa Tradicional</h4>
                          <p className="text-xs text-muted-foreground">R$ 50 × 4 compras/ano × 1 ano = R$ 200</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Programa com NFTs</h4>
                          <p className="text-xs text-muted-foreground">R$ 50 × 6 compras/ano × 1,5 anos = R$ 450</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cac" className="space-y-4">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Custo de Aquisição de Cliente (CAC)</CardTitle>
                  <CardDescription>Análise detalhada do custo para adquirir novos clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={metrics.cac}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="tradicional" fill="#0088FE" name="Programa Tradicional" />
                        <Bar dataKey="nft" fill="#8884d8" name="Programa com NFTs" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">O que é CAC?</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        O Custo de Aquisição de Cliente (CAC) é o custo total para adquirir um novo cliente, incluindo
                        marketing, vendas e outros gastos relacionados. Um CAC menor significa maior eficiência na
                        aquisição de clientes.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Por que o CAC é menor com NFTs?</h3>
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                        <li>Marketing orgânico através de comunidades de colecionadores de NFTs</li>
                        <li>Efeito de rede quando clientes compartilham seus NFTs em redes sociais</li>
                        <li>Maior taxa de indicação de novos clientes (referral)</li>
                        <li>Menor necessidade de descontos agressivos para atrair novos clientes</li>
                        <li>Redução em custos de infraestrutura tradicional (cartões físicos, sistemas legados)</li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-lg font-medium">Cálculo do CAC</h3>
                      <p className="text-sm mt-1">
                        CAC = Total de Gastos com Marketing e Vendas ÷ Número de Novos Clientes
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Programa Tradicional</h4>
                          <p className="text-xs text-muted-foreground">R$ 50.000 ÷ 1.000 clientes = R$ 50/cliente</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Programa com NFTs</h4>
                          <p className="text-xs text-muted-foreground">R$ 50.000 ÷ 3.000 clientes = R$ 16,67/cliente</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="retention" className="space-y-4">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Taxa de Retenção</CardTitle>
                  <CardDescription>Análise detalhada da retenção de clientes ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={metrics.retention}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="tradicional" stroke="#0088FE" name="Programa Tradicional" />
                        <Line type="monotone" dataKey="nft" stroke="#8884d8" name="Programa com NFTs" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">O que é Taxa de Retenção?</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        A Taxa de Retenção mede a porcentagem de clientes que continuam ativos após um determinado
                        período. Uma alta taxa de retenção indica que os clientes estão satisfeitos e continuam
                        engajados com sua marca.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Por que a Retenção é maior com NFTs?</h3>
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                        <li>Senso de propriedade e investimento emocional nos NFTs adquiridos</li>
                        <li>Benefícios exclusivos que aumentam com o tempo de relacionamento</li>
                        <li>Gamificação que incentiva interações contínuas com a marca</li>
                        <li>Comunidade de usuários que compartilham interesses comuns</li>
                        <li>Valor percebido que aumenta com o tempo (raridade, exclusividade)</li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-lg font-medium">Cálculo da Taxa de Retenção</h3>
                      <p className="text-sm mt-1">
                        Taxa de Retenção = (Clientes no final do período - Novos clientes adquiridos durante o período)
                        ÷ Clientes no início do período × 100
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Programa Tradicional</h4>
                          <p className="text-xs text-muted-foreground">(800 - 300) ÷ 1000 × 100 = 50%</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Programa com NFTs</h4>
                          <p className="text-xs text-muted-foreground">(950 - 300) ÷ 1000 × 100 = 65%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Engajamento</CardTitle>
                  <CardDescription>
                    Análise detalhada do engajamento dos clientes com o programa de fidelidade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={metrics.engagement}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {metrics.engagement.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">O que é Engajamento?</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        O Engajamento mede o nível de interação dos clientes com seu programa de fidelidade. Inclui
                        métricas como frequência de uso, interações com a plataforma e participação em atividades.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Por que o Engajamento é maior com NFTs?</h3>
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                        <li>Gamificação natural através de coleções e níveis de raridade</li>
                        <li>Incentivo para completar coleções e desbloquear benefícios exclusivos</li>
                        <li>Aspecto social de compartilhamento e exibição de NFTs</li>
                        <li>Valor percebido maior devido à escassez e exclusividade</li>
                        <li>Experiência digital moderna e inovadora que atrai mais interações</li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-lg font-medium">Métricas de Engajamento</h3>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Programa Tradicional</h4>
                          <ul className="mt-1 space-y-1 text-xs text-muted-foreground list-disc pl-4">
                            <li>Frequência de uso: 1-2 vezes por mês</li>
                            <li>Taxa de abertura de emails: 15%</li>
                            <li>Participação em promoções: 20%</li>
                            <li>Tempo médio no app: 2 minutos</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Programa com NFTs</h4>
                          <ul className="mt-1 space-y-1 text-xs text-muted-foreground list-disc pl-4">
                            <li>Frequência de uso: 5-6 vezes por mês</li>
                            <li>Taxa de abertura de emails: 42%</li>
                            <li>Participação em promoções: 68%</li>
                            <li>Tempo médio no app: 8 minutos</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Baixar Relatório
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
          </div>
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
