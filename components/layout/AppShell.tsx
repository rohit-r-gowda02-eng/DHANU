'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { PwaInstallBanner } from '@/components/pwa/PwaInstallBanner'
import { CompletionModal } from '@/components/completions/CompletionModal'
import { Loader2 } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [streak, setStreak] = useState<any>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // Quick log modal state
  const [quickLogOpen, setQuickLogOpen] = useState(false)
  const [userActivities, setUserActivities] = useState<any[]>([])
  const [selectedActivity, setSelectedActivity] = useState<any>(null)

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) {
        router.push('/login')
        return
      }
      const data = await res.json()
      if (!data.user) {
        router.push('/login')
        return
      }

      setUser(data.user)
      setStreak(data.streak)
      setUnreadCount(data.unreadNotifications || 0)

      // If user hasn't completed onboarding and not currently on /onboarding
      if (data.profile && !data.profile.onboardingCompleted && pathname !== '/onboarding') {
        router.push('/onboarding')
        return
      }

      setLoading(false)
    } catch {
      router.push('/login')
    }
  }

  useEffect(() => {
    fetchSession()

    // Load activities for quick log
    fetch('/api/activities')
      .then((res) => res.json())
      .then((data) => {
        if (data.activities && data.activities.length > 0) {
          setUserActivities(data.activities)
          setSelectedActivity(data.activities[0])
        }
      })
      .catch(() => {})

    // Check inactivity periodically every 15 minutes
    const interval = setInterval(() => {
      fetch('/api/notifications/check-inactivity').catch(() => {})
    }, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [pathname])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B08] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          <span className="text-xs text-amber-200/80 font-mono tracking-wider">
            INITIALIZING DHANU...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070B08] flex flex-col text-slate-100">
      <PwaInstallBanner />

      <Navbar
        user={user}
        streak={streak}
        unreadCount={unreadCount}
        onQuickLog={() => setQuickLogOpen(true)}
      />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pb-20 md:pb-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>

      <MobileNav />

      {/* Global Quick Completion Modal */}
      {selectedActivity && (
        <CompletionModal
          isOpen={quickLogOpen}
          activity={selectedActivity}
          initialDurationMinutes={selectedActivity.targetMinutes || 60}
          onClose={() => setQuickLogOpen(false)}
          onSuccess={() => {
            setQuickLogOpen(false)
            fetchSession()
            router.refresh()
          }}
        />
      )}
    </div>
  )
}
