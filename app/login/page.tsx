'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DhanuLogo } from '@/components/brand/DhanuLogo'
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)

    const loginEmail = customEmail || email
    const loginPassword = customPassword || password

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in')
      }

      if (!data.user.onboardingCompleted) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.')
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setEmail('alex@dhanu.growth')
    setPassword('Dhanu2026!')
    handleLogin(undefined, 'alex@dhanu.growth', 'Dhanu2026!')
  }

  return (
    <div className="min-h-screen bg-[#070B08] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-white selection:bg-amber-400 selection:text-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex justify-center mb-4">
          <DhanuLogo size="md" showTagline={false} />
        </Link>
        <h2 className="text-2xl font-bold font-display tracking-tight text-white">
          Sign In to DHANU
        </h2>
        <p className="mt-1.5 text-xs text-slate-400">
          Access your personal consistency dashboard and daily proofs.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0D1510] border border-[#D4AF37]/25 py-8 px-6 sm:px-10 rounded-2xl shadow-3d-card">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-500/40 rounded-lg text-xs text-red-200 mb-5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@dhanu.growth"
                  className="w-full bg-[#070B08] border border-white/10 focus:border-[#D4AF37] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#D4AF37] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#070B08] border border-white/10 focus:border-[#D4AF37] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-3d-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Instant 1-Click Demo Sign In */}
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-2.5 bg-[#121E17] hover:bg-[#182A20] border border-[#D4AF37]/35 text-[#D4AF37] rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Instant 1-Click Demo Login</span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 pt-4 border-t border-white/5">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="text-[#D4AF37] font-semibold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
