// src/types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * 認証ユーザー
 */
export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string; // avatar_url -> avatarUrl に変更
};

/**
 * データベース
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          avatar_url: string | null;
          password: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email: string;
          avatar_url?: string | null;
          password: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string;
          avatar_url?: string | null;
          password?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          // 変更なし - ただしuser_idはusersテーブルを参照
          id: string;
          park_id: string;
          user_id: string; // これはusersテーブルのidを参照する
          content: string;
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          // 変更なし
          id?: string;
          park_id: string;
          user_id: string;
          content: string;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          // 変更なし
          id?: string;
          park_id?: string;
          user_id?: string;
          content?: string;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      // review_images - 変更なし
      review_images: {
        Row: {
          id: string;
          review_id: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          review_id: string;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          review_id?: string;
          image_url?: string;
          created_at?: string;
        };
      };
      // parks - 変更なし
      parks: {
        Row: {
          id: string;
          name: string;
          place_id: string;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          place_id: string;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          place_id?: string;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          review_id: string;
          user_id: string; // これはusersテーブルのidを参照する
          created_at: string;
        };
        Insert: {
          id?: string;
          review_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          review_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      privacy_settings: {
        Row: {
          user_id: string; // これはusersテーブルのidを参照する
          location_enabled: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          location_enabled?: boolean;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          location_enabled?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
