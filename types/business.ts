export interface MintedNFT {
  id: string
  customerAddress: string
  businessAddress: string
  name: string
  description: string
  image: string
  mintedAt: number
  transactionHash?: string
}

export interface Business {
  address: string
  name: string
  isOwner: boolean
}

export interface CafeNFTContract {
  cafeMint: (customerAddress: string) => Promise<{ transactionHash: string }>
  isOwner: (address: string) => Promise<boolean>
}
