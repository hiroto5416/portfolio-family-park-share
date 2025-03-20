// src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AuthUser = {
  id: string;
  email?: string;
  username?: string;
  avataUrl?: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          park_id: string
          user_id: string
          content: string
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          park_id: string
          user_id: string
          content: string
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          park_id?: string
          user_id?: string
          content?: string
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      review_images: {
        Row: {
          id: string
          review_id: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          image_url?: string
          created_at?: string
        }
      }
      parks: {
        Row: {
          id: string
          name: string
          place_id: string
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          place_id: string
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          place_id?: string
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          review_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          user_id?: string
          created_at?: string
        }
      }
      privacy_settings: {
        Row: {
          user_id: string
          location_enabled: boolean
          updated_at: string
        }
        Insert: {
          user_id: string
          location_enabled?: boolean
          updated_at?: string
        }
        Update: {
          user_id?: string
          location_enabled?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}