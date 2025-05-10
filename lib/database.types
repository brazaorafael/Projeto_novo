export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          matched_breeds: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          matched_breeds?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          matched_breeds?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      breeders: {
        Row: {
          id: string
          name: string
          location: string
          website: string | null
          instagram: string | null
          breed_id: number
          breed_name: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          website?: string | null
          instagram?: string | null
          breed_id: number
          breed_name: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          website?: string | null
          instagram?: string | null
          breed_id?: number
          breed_name?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
