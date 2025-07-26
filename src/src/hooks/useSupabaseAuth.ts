import { useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { UserRole } from '../types/user'

export interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
  role?: UserRole
}

export interface AuthState {
  user: AuthUser | null
  session: Session | null
  loading: boolean
}

export const useSupabaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange(session)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthStateChange(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuthStateChange = async (session: Session | null) => {
    if (session?.user) {
      // Get user profile and role from profiles table with join to user_roles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          role:user_roles(*)
        `)
        .eq('id', session.user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
      }

      const authUser: AuthUser = {
        id: session.user.id,
        email: session.user.email!,
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        phone: profile?.phone || '',
        avatar: profile?.avatar_url || '',
        role: profile?.role || undefined
      }

      setAuthState({
        user: authUser,
        session,
        loading: false
      })
    } else {
      setAuthState({
        user: null,
        session: null,
        loading: false
      })
    }
  }

  const signUp = async (
    email: string,
    password: string,
    userData: { firstName: string; lastName: string; phone?: string; roleName?: string }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone || ''
        }
      }
    })

    if (error) throw error

    // Create profile record with role
    if (data.user) {
      // Get the role ID for the selected role (default to buyer if not specified)
      const roleName = userData.roleName || 'buyer'
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('name', roleName)
        .single()

      if (roleError) {
        console.error('Error fetching role:', roleError)
        throw new Error('Invalid role selected')
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone || '',
          role_id: roleData.id
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
        throw profileError
      }
    }

    return data
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resetPassword = async (email: string) => {
    const redirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/reset-password`
      : 'http://localhost:3000/auth/reset-password'
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo
    })

    if (error) throw error
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  }

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  }
} 