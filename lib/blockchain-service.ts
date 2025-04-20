import type { MintedNFT, Business, CafeNFTContract } from "@/types/business"

// Endereço do contrato (mock)
const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"

// Lista de donos aprovados (mock)
const APPROVED_OWNERS = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Endereço de teste do Hardhat
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Outro endereço de teste
]

// Função para carregar NFTs do localStorage
export function loadMintedNFTs(): MintedNFT[] {
  if (typeof window === "undefined") return []

  const storedNFTs = localStorage.getItem("mintedNFTs")
  return storedNFTs ? JSON.parse(storedNFTs) : []
}

// Função para salvar NFTs no localStorage
export function saveMintedNFTs(nfts: MintedNFT[]): void {
  if (typeof window === "undefined") return

  localStorage.setItem("mintedNFTs", JSON.stringify(nfts))
}

// Mock do contrato CafeNFT
export const cafeNFTContract: CafeNFTContract = {
  cafeMint: async (customerAddress: string): Promise<{ transactionHash: string }> => {
    // Simular atraso da blockchain
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Gerar hash de transação aleatório
    const transactionHash =
      "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

    // Criar novo NFT
    const newNFT: MintedNFT = {
      id: `nft-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customerAddress,
      businessAddress: window.ethereum?.selectedAddress || "0xUnknown",
      name: "Café Fidelidade",
      description: "Este NFT representa 10 cafés grátis na nossa cafeteria. Apresente este NFT para resgatar.",
      image: "/nfts/partners/wecoffe-free-coffee.png",
      mintedAt: Date.now(),
      transactionHash,
    }

    // Salvar no localStorage
    const nfts = loadMintedNFTs()
    saveMintedNFTs([...nfts, newNFT])

    return { transactionHash }
  },

  isOwner: async (address: string): Promise<boolean> => {
    // Verificar se o endereço está na lista de donos aprovados
    return APPROVED_OWNERS.includes(address)
  },
}

// Função para conectar carteira
export async function connectWallet(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask não encontrado. Por favor, instale a extensão MetaMask.")
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    return accounts[0]
  } catch (error) {
    console.error("Erro ao conectar carteira:", error)
    return null
  }
}

// Função para verificar se o usuário é dono
export async function checkIsOwner(address: string): Promise<boolean> {
  if (!address) return false

  // No mundo real, isso seria uma chamada para o contrato
  return cafeNFTContract.isOwner(address)
}

// Função para obter informações do negócio
export async function getBusinessInfo(address: string): Promise<Business | null> {
  if (!address) return null

  const isOwner = await checkIsOwner(address)

  return {
    address,
    name: "Café do João",
    isOwner,
  }
}
