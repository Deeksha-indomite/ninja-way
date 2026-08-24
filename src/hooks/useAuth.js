import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase'

/**
 * Centralized authentication hook
 * Handles session management, auth state changes, and provides auth actions
 */
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize session
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Sign in with Google
  const signInWithGoogle = useCallback(async (redirectTo) => {
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo || window.location.origin
        }
      })
      if (error) throw error
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  // Sign out
  const signOut = useCallback(async () => {
    setError(null)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      if (error) throw error
      setUser(session?.user ?? null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    refreshSession,
    isAuthenticated: !!user,
  }
}