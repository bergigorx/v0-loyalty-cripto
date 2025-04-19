export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          wallet_address: string | null
          loya_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          wallet_address?: string | null
          loya_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          wallet_address?: string | null
          loya_balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      nfts: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string
          owner_id: string | null
          creator_id: string | null
          price: number | null
          is_for_sale: boolean
          rarity: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url: string
          owner_id?: string | null
          creator_id?: string | null
          price?: number | null
          is_for_sale?: boolean
          rarity?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string
          owner_id?: string | null
          creator_id?: string | null
          price?: number | null
          is_for_sale?: boolean
          rarity?: string | null
          created_at?: string
        }
      }
      marketplace_items: {
        Row: {
          id: string
          seller_id: string
          nft_id: string | null
          price: number
          token_amount: number | null
          item_type: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          nft_id?: string | null
          price: number
          token_amount?: number | null
          item_type: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          nft_id?: string | null
          price?: number
          token_amount?: number | null
          item_type?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          buyer_id: string | null
          seller_id: string | null
          marketplace_item_id: string | null
          amount: number
          transaction_type: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          buyer_id?: string | null
          seller_id?: string | null
          marketplace_item_id?: string | null
          amount: number
          transaction_type: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string | null
          seller_id?: string | null
          marketplace_item_id?: string | null
          amount?: number
          transaction_type?: string
          status?: string
          created_at?: string
        }
      }
    }
  }
}
