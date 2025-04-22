"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

interface Web3ContextType {
  isMetaMaskInstalled: boolean
  isMobileDevice: boolean
  connectWallet: () => Promise<string | null>
  disconnectWallet: () => void
  walletAddress: string | null
  walletProvider: string | null
  isConnecting: boolean
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

interface Web3ProviderProps {
  children: ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletProvider, setWalletProvider] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  // Detectar se o usuário está em um dispositivo móvel
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mobile =
        typeof window.orientation !== "undefined" ||
        navigator.userAgent.indexOf("IEMobile") !== -1 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      setIsMobileDevice(mobile)
      setIsMetaMaskInstalled(typeof window.ethereum !== "undefined")
    }
  }, [])

  // Verificar se já existe uma carteira conectada ao carregar a página
  useEffect(() => {
    const checkConnectedWallet = async () => {
      if (isMetaMaskInstalled) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0])
            setWalletProvider("MetaMask")
          }
        } catch (error) {
          console.error("Error checking connected wallet:", error)
        }
      }
    }

    checkConnectedWallet()
  }, [isMetaMaskInstalled])

  // Verificar se o usuário está retornando do app MetaMask no celular
  useEffect(() => {
    const checkPendingConnection = async () => {
      const isPending = sessionStorage.getItem("pendingWalletConnection")
      const shouldConnect = new URLSearchParams(window.location.search).get("connect") === "true"

      if ((isPending || shouldConnect) && isMetaMaskInstalled) {
        sessionStorage.removeItem("pendingWalletConnection")

        // Pequeno atraso para garantir que o MetaMask esteja pronto
        setTimeout(async () => {
          await connectWallet()
        }, 500)
      }
    }

    checkPendingConnection()
  }, [isMetaMaskInstalled])

  // Função para abrir o MetaMask no celular via deep link
  const openMetaMaskMobile = () => {
    // Salvar o estado atual para quando o usuário retornar
    sessionStorage.setItem("pendingWalletConnection", "true")

    // URL da página atual para retorno
    const currentUrl = encodeURIComponent(window.location.href)

    // Criar deep link para o MetaMask
    const metamaskDeepLink = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}?connect=true`

    // Redirecionar para o app do MetaMask
    window.location.href = metamaskDeepLink
  }

  // Função para conectar com MetaMask
  const connectWallet = async (): Promise<string | null> => {
    if (!isMetaMaskInstalled) {
      if (isMobileDevice) {
        // Em dispositivos móveis, oferecer opção de abrir o app
        toast({
          title: "MetaMask não detectado",
          description: "Redirecionando para o aplicativo MetaMask...",
        })
        openMetaMaskMobile()
        return null
      } else {
        // No desktop, sugerir instalação
        toast({
          title: "MetaMask não encontrado",
          description: "Por favor, instale a extensão MetaMask para conectar sua carteira.",
          variant: "destructive",
        })
        return null
      }
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0])
        setWalletProvider("MetaMask")

        toast({
          title: "Carteira conectada com sucesso!",
          description: `Conectado com MetaMask: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        })

        return accounts[0]
      }
      return null
    } catch (error: any) {
      toast({
        title: "Erro ao conectar carteira",
        description: error.message || "Ocorreu um erro ao conectar com MetaMask.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsConnecting(false)
    }
  }

  // Função para desconectar carteira
  const disconnectWallet = () => {
    setWalletAddress(null)
    setWalletProvider(null)

    toast({
      title: "Carteira desconectada",
      description: "Sua carteira foi desconectada com sucesso.",
    })
  }

  // Ouvir eventos de mudança de conta
  useEffect(() => {
    if (isMetaMaskInstalled) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // Usuário desconectou a carteira
          disconnectWallet()
        } else if (accounts[0] !== walletAddress) {
          // Usuário trocou de conta
          setWalletAddress(accounts[0])
          toast({
            title: "Conta alterada",
            description: `Nova conta conectada: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          })
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [isMetaMaskInstalled, walletAddress])

  const value = {
    isMetaMaskInstalled,
    isMobileDevice,
    connectWallet,
    disconnectWallet,
    walletAddress,
    walletProvider,
    isConnecting,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}
