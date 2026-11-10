'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DhanuLogo } from '@/components/brand/DhanuLogo'
import {
  Flame,
  Bell,
  Plus,
  User,
  Settings,
  LogOut,
  Download,
  ChevronDown,
} from 'lucide-react'

interface NavbarProps {
  user?: {
    id: string
    name: string
    email: string
    timezone: string
  } | null
  streak?: {
    currentStreak: number
    longestStreak: number
    totalActiveDays: number
  } | null
  unreadCount?: number
  onQuickLog?: () => void
}

export function Navbar({ user, streak, unreadCount = 0, onQuickLog }: NavbarProps) {
  const router = useRouter()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [recentNotifications, setRecentNotifications] = useState<any[]>([])

  useEffect(() => {
    if (notificationsOpen) {
      fetch('/api/notifications')
        .then((res) => res.json())
        .then((data) => {
          if (data.notifications) setRecentNotifications(data.notifications.slice(0, 5))
        })
        .catch(() => {})
    }
  }, [notificationsOpen])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch {
      router.push('/login')
    }
  }

  return (
    <header className="h-16 border-b border-[#D4AF37]/20 bg-[#070B08]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Brand Logo */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <DhanuLogo size="sm" showTagline={false} />
      </Link>

      {/* Center / Right controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Daily Login Streak Flame Counter in Gold */}
        {streak && (
          <Link
            href="/streaks"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D1510] border border-[#D4AF37]/35 hover:border-[#D4AF37]/70 transition-all text-xs font-bold text-white shadow-sm group"
            title={`${streak.currentStreak} day login streak! Longest: ${streak.longestStreak} days`}
          >
            <Flame className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform fill-[#D4AF37]/20" />
            <span className="tracking-tight text-[#D4AF37] font-extrabold">{streak.currentStreak}</span>
            <span className="text-[10px] text-amber-200/70 font-normal hidden sm:inline">DAYS</span>
          </Link>
        )}

        {/* Quick Log Action */}
        {onQuickLog && (
          <button
            onClick={onQuickLog}
            className="btn-primary hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Log Proof</span>
          </button>
        )}

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4AF37] ring-2 ring-[#070B08]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0D1510] border border-[#D4AF37]/25 rounded-xl shadow-2xl p-3 z-50 text-white">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <span className="text-xs font-bold font-display uppercase tracking-wider text-[#D4AF37]">
                  Notifications & Reminders
                </span>
                <Link
                  href="/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg text-xs border ${
                        n.isRead
                          ? 'bg-transparent border-white/5 text-slate-400'
                          : 'bg-emerald-950/40 border-emerald-500/30 text-white'
                      }`}
                    >
                      <div className="font-semibold text-white mb-0.5">{n.title}</div>
                      <p className="text-[11px] text-slate-300 leading-tight">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No new notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-700 to-amber-500 flex items-center justify-center text-white text-xs font-bold border border-[#D4AF37]/30 shadow-sm">
                {user.name ? user.name[0].toUpperCase() : 'D'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0D1510] border border-[#D4AF37]/25 rounded-xl shadow-2xl py-1.5 z-50 text-white text-xs">
                <div className="px-3.5 py-2 border-b border-white/10">
                  <p className="font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#D4AF37]" />
                    <span>Inactivity & Settings</span>
                  </Link>

                  <a
                    href="/api/account/export?format=json"
                    download
                    className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Export My Data</span>
                  </a>
                </div>

                <div className="pt-1 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-red-950/30 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
