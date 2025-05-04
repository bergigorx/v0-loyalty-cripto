"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"
import { isValidEthereumAddress } from "@/lib/security-utils"

interface Web3ContextType {
  isMetaMaskInstalled: boolean
  isMobileDevice: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  walletAddress: string
  walletProvider: string | null
  isConnecting: boolean
  chainId: string | null
  switchToPolygon: () => Promise<void>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [walletProvider, setWalletProvider] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState<string | null>(null)

  // Detectar dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }

    checkMobile()

    // Atualizar em caso de redimensionamento
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Verificar se MetaMask está instalado
  useEffect(() => {
    const checkMetaMask = () => {
      const isInstalled =
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined" &&
        (window.ethereum.isMetaMask || window.ethereum.providers?.some((p) => p.isMetaMask))

      setIsMetaMaskInstalled(isInstalled)
    }

    checkMetaMask()

    // Verificar novamente se o status mudar
    window.addEventListener("ethereum#initialized", checkMetaMask, { once: true })

    // Timeout como fallback
    const timeout = setTimeout(checkMetaMask, 3000)
    return () => clearTimeout(timeout)
  }, [])

  // Verificar se já existe uma carteira conectada
  useEffect(() => {
    const checkConnectedWallet = async () => {
      if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
          // Obter contas conectadas
          const accounts = await window.ethereum.request({ method: "eth_accounts" })

          if (accounts && accounts.length > 0 && isValidEthereumAddress(accounts[0])) {
            setWalletAddress(accounts[0])
            setWalletProvider("MetaMask")

            // Obter chainId
            const chainId = await window.ethereum.request({ method: "eth_chainId" })
            setChainId(chainId)
          }
        } catch (error) {
          console.error("Error checking connected wallet:", error)
        }
      }
    }

    checkConnectedWallet()
  }, [])

  // Escutar eventos de mudança de conta e rede
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // Usuário desconectou a carteira
          disconnectWallet()
        } else if (isValidEthereumAddress(accounts[0])) {
          setWalletAddress(accounts[0])
        }
      }

      const handleChainChanged = (chainId: string) => {
        setChainId(chainId)
        // Recarregar a página é recomendado pela documentação do MetaMask
        window.location.reload()
      }

      const handleDisconnect = (error: { code: number; message: string }) => {
        console.log("Wallet disconnected", error)
        disconnectWallet()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
      window.ethereum.on("disconnect", handleDisconnect)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
        window.ethereum.removeListener("disconnect", handleDisconnect)
      }
    }
  }, [])

  // Função para conectar carteira
  const connectWallet = async () => {
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
      if (isMobileDevice) {
        // Redirecionar para deep link do MetaMask em dispositivos móveis
        window.open("https://metamask.app.link/dapp/" + window.location.host + window.location.pathname, "_blank")
        return
      }

      toast({
        title: "MetaMask não encontrado",
        description: "Por favor, instale a extensão MetaMask para conectar sua carteira.",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      // Implementar proteção contra replay attacks com nonce
      const nonce = Math.floor(Math.random() * 1000000).toString()
      localStorage.setItem("auth_nonce", nonce)

      // Solicitar conexão de conta
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [{ eth_chainId: true }],
      })

      if (accounts && accounts.length > 0 && isValidEthereumAddress(accounts[0])) {
        setWalletAddress(accounts[0])
        setWalletProvider("MetaMask")

        // Obter chainId
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        setChainId(chainId)

        toast({
          title: "Carteira conectada com sucesso!",
          description: `Conectado com MetaMask: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        })

        // Verificar se está na rede correta
        if (chainId !== "0x89") {
          // Polygon Mainnet
          toast({
            title: "Rede incorreta",
            description: "Por favor, mude para a rede Polygon para melhor experiência.",
            variant: "warning",
          })
        }
      }
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
          title: "Erro ao conectar carteira",
          description: error.message || "Ocorreu um erro ao conectar com MetaMask.",
          variant: "destructive",
        })
      }
    } finally {
      setIsConnecting(false)
    }
  }

  // Função para desconectar carteira
  const disconnectWallet = () => {
    setWalletAddress("")
    setWalletProvider(null)
    setChainId(null)

    // Limpar dados de autenticação
    localStorage.removeItem("auth_nonce")

    toast({
      title: "Carteira desconectada",
      description: "Sua carteira foi desconectada com sucesso.",
    })
  }

  // Função para mudar para a rede Polygon
  const switchToPolygon = async () => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x89" }], // Polygon Mainnet
      })
    } catch (switchError: any) {
      // Rede não adicionada, adicionar rede
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x89",
                chainName: "Polygon Mainnet",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                rpcUrls: ["https://polygon-rpc.com/"],
                blockExplorerUrls: ["https://polygonscan.com/"],
              },
            ],
          })
        } catch (addError) {
          toast({
            title: "Erro ao adicionar rede",
            description: "Não foi possível adicionar a rede Polygon.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Erro ao mudar de rede",
          description: switchError.message || "Ocorreu um erro ao mudar para a rede Polygon.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Web3Context.Provider
      value={{
        isMetaMaskInstalled,
        isMobileDevice,
        connectWallet,
        disconnectWallet,
        walletAddress,
        walletProvider,
        isConnecting,
        chainId,
        switchToPolygon,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}
