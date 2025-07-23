import { useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
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
      // Get user profile from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
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
        phone: profile?.phone || ''
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
    userData: { firstName: string; lastName: string; phone?: string }
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

    // Create profile record
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone || null
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
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