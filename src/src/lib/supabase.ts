import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Database types for the real estate application
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          role_id: string
          preferences: Record<string, any> | null
          settings: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role_id: string
          preferences?: Record<string, any> | null
          settings?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role_id?: string
          preferences?: Record<string, any> | null
          settings?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          name: string
          description: string | null
          permissions: Record<string, any>
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          permissions?: Record<string, any>
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          permissions?: Record<string, any>
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      role_approvals: {
        Row: {
          id: string
          user_id: string
          role_name: string
          status: string
          submitted_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          rejection_reason: string | null
          documentation_url: string | null
          additional_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role_name: string
          status?: string
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          rejection_reason?: string | null
          documentation_url?: string | null
          additional_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role_name?: string
          status?: string
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          rejection_reason?: string | null
          documentation_url?: string | null
          additional_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_properties: {
        Row: {
          id: string
          user_id: string
          property_id: string
          saved_at: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          saved_at?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          saved_at?: string
          notes?: string | null
          created_at?: string
        }
      }
      search_alerts: {
        Row: {
          id: string
          user_id: string
          name: string
          criteria: Record<string, any>
          frequency: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          criteria: Record<string, any>
          frequency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          criteria?: Record<string, any>
          frequency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 