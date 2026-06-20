export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      mother_cat: {
        Row: {
          id: string
          user_id: string
          name: string
          age: number | null
          breed: string | null
          weight: number | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          age?: number | null
          breed?: string | null
          weight?: number | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          age?: number | null
          breed?: string | null
          weight?: number | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      kittens: {
        Row: {
          id: string
          user_id: string
          number: number
          name: string
          gender: string | null
          color: string | null
          birth_date: string | null
          weight: number | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          number: number
          name: string
          gender?: string | null
          color?: string | null
          birth_date?: string | null
          weight?: number | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          number?: number
          name?: string
          gender?: string | null
          color?: string | null
          birth_date?: string | null
          weight?: number | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      feeding_logs: {
        Row: {
          id: string
          user_id: string
          cat_id: string
          food_type: string
          amount: number
          unit: string
          notes: string | null
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cat_id: string
          food_type: string
          amount: number
          unit: string
          notes?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cat_id?: string
          food_type?: string
          amount?: number
          unit?: string
          notes?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      medicine_logs: {
        Row: {
          id: string
          user_id: string
          cat_id: string
          medicine_name: string
          dosage: string
          notes: string | null
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cat_id: string
          medicine_name: string
          dosage: string
          notes?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cat_id?: string
          medicine_name?: string
          dosage?: string
          notes?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      nursing_logs: {
        Row: {
          id: string
          user_id: string
          start_time: string
          end_time: string | null
          duration_minutes: number | null
          kitten_ids: string[] | null
          notes: string | null
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_time: string
          end_time?: string | null
          duration_minutes?: number | null
          kitten_ids?: string[] | null
          notes?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_time?: string
          end_time?: string | null
          duration_minutes?: number | null
          kitten_ids?: string[] | null
          notes?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          user_id: string
          cat_id: string | null
          category: string
          url: string
          thumbnail_url: string | null
          title: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cat_id?: string | null
          category: string
          url: string
          thumbnail_url?: string | null
          title?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cat_id?: string | null
          category?: string
          url?: string
          thumbnail_url?: string | null
          title?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          title: string
          type: string
          description: string | null
          reminder_time: string
          repeat_days: number[] | null
          interval_minutes: number | null
          start_date: string
          end_date: string | null
          is_active: boolean
          notification_sent: boolean
          last_triggered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: string
          description?: string | null
          reminder_time: string
          repeat_days?: number[] | null
          interval_minutes?: number | null
          start_date: string
          end_date?: string | null
          is_active?: boolean
          notification_sent?: boolean
          last_triggered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: string
          description?: string | null
          reminder_time?: string
          repeat_days?: number[] | null
          interval_minutes?: number | null
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          notification_sent?: boolean
          last_triggered_at?: string | null
          created_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
