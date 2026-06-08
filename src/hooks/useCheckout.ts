import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface UseCheckoutResult {
  startCheckout: () => Promise<void>
  loading: boolean
  error: string | null
}

export function useCheckout(): UseCheckoutResult {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCheckout = async () => {
    if (!user || !profile) {
      // Redirect to signup if not logged in
      window.location.href = '/signup'
      return
    }

    if (profile.plan === 'pro') {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? 'Failed to create checkout session')
      }

      // Open Lemon Squeezy checkout
      window.location.href = data.url
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Checkout failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return { startCheckout, loading, error }
}