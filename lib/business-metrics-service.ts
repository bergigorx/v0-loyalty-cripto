// Tipos para as métricas de negócios
export interface BusinessMetrics {
  ltv: MetricData[]
  cac: MetricData[]
  retention: MetricData[]
  engagement: EngagementData[]
  summary: SummaryMetrics
  lastUpdated: number
}

export interface MetricData {
  month: string
  tradicional: number
  nft: number
}

export interface EngagementData {
  name: string
  value: number
}

export interface SummaryMetrics {
  ltv: {
    value: string
    change: string
    description: string
  }
  cac: {
    value: string
    change: string
    description: string
  }
  retention: {
    value: string
    change: string
    description: string
  }
  engagement: {
    value: string
    change: string
    description: string
  }
}

// Dados iniciais simulados
const initialMetricsData: BusinessMetrics = {
  ltv: [
    { month: "Jan", tradicional: 120, nft: 150 },
    { month: "Fev", tradicional: 130, nft: 170 },
    { month: "Mar", tradicional: 125, nft: 190 },
    { month: "Abr", tradicional: 140, nft: 210 },
    { month: "Mai", tradicional: 150, nft: 230 },
    { month: "Jun", tradicional: 155, nft: 250 },
    { month: "Jul", tradicional: 160, nft: 280 },
    { month: "Ago", tradicional: 170, nft: 310 },
    { month: "Set", tradicional: 175, nft: 340 },
    { month: "Out", tradicional: 180, nft: 370 },
    { month: "Nov", tradicional: 190, nft: 400 },
    { month: "Dez", tradicional: 200, nft: 430 },
  ],
  cac: [
    { month: "Jan", tradicional: 50, nft: 40 },
    { month: "Fev", tradicional: 52, nft: 38 },
    { month: "Mar", tradicional: 48, nft: 35 },
    { month: "Abr", tradicional: 55, nft: 32 },
    { month: "Mai", tradicional: 53, nft: 30 },
    { month: "Jun", tradicional: 57, nft: 28 },
    { month: "Jul", tradicional: 60, nft: 25 },
    { month: "Ago", tradicional: 58, nft: 24 },
    { month: "Set", tradicional: 62, nft: 22 },
    { month: "Out", tradicional: 65, nft: 20 },
    { month: "Nov", tradicional: 63, nft: 19 },
    { month: "Dez", tradicional: 67, nft: 18 },
  ],
  retention: [
    { month: "Jan", tradicional: 65, nft: 75 },
    { month: "Fev", tradicional: 63, nft: 78 },
    { month: "Mar", tradicional: 60, nft: 80 },
    { month: "Abr", tradicional: 62, nft: 83 },
    { month: "Mai", tradicional: 58, nft: 85 },
    { month: "Jun", tradicional: 55, nft: 87 },
    { month: "Jul", tradicional: 57, nft: 88 },
    { month: "Ago", tradicional: 54, nft: 90 },
    { month: "Set", tradicional: 52, nft: 91 },
    { month: "Out", tradicional: 50, nft: 92 },
    { month: "Nov", tradicional: 48, nft: 93 },
    { month: "Dez", tradicional: 45, nft: 94 },
  ],
  engagement: [
    { name: "Programa Tradicional", value: 35 },
    { name: "Programa com NFTs", value: 65 },
  ],
  summary: {
    ltv: {
      value: "R$ 430",
      change: "+115%",
      description: "vs. programas tradicionais",
    },
    cac: {
      value: "R$ 18",
      change: "-73%",
      description: "vs. programas tradicionais",
    },
    retention: {
      value: "94%",
      change: "+108%",
      description: "vs. programas tradicionais",
    },
    engagement: {
      value: "65%",
      change: "+85%",
      description: "vs. programas tradicionais",
    },
  },
  lastUpdated: Date.now(),
}

// Chave para armazenar os dados no localStorage
const METRICS_STORAGE_KEY = "business_metrics_data"

// Função para carregar métricas do localStorage
export function loadBusinessMetrics(): BusinessMetrics {
  if (typeof window === "undefined") return initialMetricsData

  const storedMetrics = localStorage.getItem(METRICS_STORAGE_KEY)
  return storedMetrics ? JSON.parse(storedMetrics) : initialMetricsData
}

// Função para salvar métricas no localStorage
export function saveBusinessMetrics(metrics: BusinessMetrics): void {
  if (typeof window === "undefined") return

  localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(metrics))
}

// Função para simular a atualização de métricas em tempo real
export function simulateMetricsUpdate(): BusinessMetrics {
  const currentMetrics = loadBusinessMetrics()

  // Simular pequenas variações nos dados para dar a impressão de dados em tempo real
  const updatedMetrics: BusinessMetrics = {
    ...currentMetrics,
    ltv: currentMetrics.ltv.map((item) => ({
      ...item,
      nft: Math.round(item.nft * (1 + (Math.random() * 0.04 - 0.02))), // Variação de -2% a +2%
      tradicional: Math.round(item.tradicional * (1 + (Math.random() * 0.02 - 0.01))), // Variação de -1% a +1%
    })),
    cac: currentMetrics.cac.map((item) => ({
      ...item,
      nft: Math.round(item.nft * (1 + (Math.random() * 0.03 - 0.02))), // Variação de -2% a +1%
      tradicional: Math.round(item.tradicional * (1 + (Math.random() * 0.02 - 0.01))), // Variação de -1% a +1%
    })),
    retention: currentMetrics.retention.map((item) => ({
      ...item,
      nft: Math.min(100, Math.round(item.nft * (1 + (Math.random() * 0.02 - 0.01)))), // Variação de -1% a +1%, máximo 100%
      tradicional: Math.min(100, Math.round(item.tradicional * (1 + (Math.random() * 0.02 - 0.01)))), // Variação de -1% a +1%, máximo 100%
    })),
    lastUpdated: Date.now(),
  }

  // Atualizar os valores de resumo com base nos dados mais recentes
  const lastMonthLtv = updatedMetrics.ltv[updatedMetrics.ltv.length - 1]
  const lastMonthCac = updatedMetrics.cac[updatedMetrics.cac.length - 1]
  const lastMonthRetention = updatedMetrics.retention[updatedMetrics.retention.length - 1]

  updatedMetrics.summary = {
    ltv: {
      value: `R$ ${lastMonthLtv.nft}`,
      change: `+${Math.round((lastMonthLtv.nft / lastMonthLtv.tradicional - 1) * 100)}%`,
      description: "vs. programas tradicionais",
    },
    cac: {
      value: `R$ ${lastMonthCac.nft}`,
      change: `-${Math.round((1 - lastMonthCac.nft / lastMonthCac.tradicional) * 100)}%`,
      description: "vs. programas tradicionais",
    },
    retention: {
      value: `${lastMonthRetention.nft}%`,
      change: `+${Math.round((lastMonthRetention.nft / lastMonthRetention.tradicional - 1) * 100)}%`,
      description: "vs. programas tradicionais",
    },
    engagement: {
      value: `${updatedMetrics.engagement[1].value}%`,
      change: `+${Math.round((updatedMetrics.engagement[1].value / updatedMetrics.engagement[0].value - 1) * 100)}%`,
      description: "vs. programas tradicionais",
    },
  }

  // Salvar as métricas atualizadas
  saveBusinessMetrics(updatedMetrics)

  return updatedMetrics
}

// Função para simular a conexão com a blockchain e obter dados atualizados
export async function fetchBlockchainMetrics(): Promise<BusinessMetrics> {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simular atualização de dados
  return simulateMetricsUpdate()
}

// Função para obter métricas em tempo real
export async function getRealtimeMetrics(): Promise<BusinessMetrics> {
  try {
    // Em um cenário real, isso faria uma chamada para um contrato na blockchain
    return await fetchBlockchainMetrics()
  } catch (error) {
    console.error("Erro ao obter métricas da blockchain:", error)
    // Fallback para dados locais em caso de erro
    return loadBusinessMetrics()
  }
}

// Inicializar os dados se não existirem
export function initializeMetricsData(): void {
  if (typeof window === "undefined") return

  const storedMetrics = localStorage.getItem(METRICS_STORAGE_KEY)
  if (!storedMetrics) {
    saveBusinessMetrics(initialMetricsData)
  }
}
