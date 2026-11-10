'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Flame,
  Menu,
  X,
  BarChart3,
  Target,
  Calendar,
  Compass,
  FileText,
  Bell,
  User,
  Settings,
} from 'lucide-react'

export function MobileNav() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const mainTabs = [
    { label: 'Today', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Routine', href: '/routine', icon: CheckSquare },
    { label: 'Journal', href: '/journal', icon: BookOpen },
    { label: 'Streaks', href: '/streaks', icon: Flame },
  ]

  const moreItems = [
    { label: 'Growth Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Long-term Goals', href: '/goals', icon: Target },
    { label: 'Calendar View', href: '/calendar', icon: Calendar },
    { label: 'Weekly Reviews', href: '/reviews', icon: Compass },
    { label: 'Monthly Reports', href: '/reports', icon: FileText },
    { label: 'Inactivity & Alerts', href: '/notifications', icon: Bell },
    { label: 'My Profile', href: '/profile', icon: User },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070B08]/95 backdrop-blur-lg border-t border-[#D4AF37]/20 md:hidden safe-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {mainTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.href

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                  isActive ? 'text-[#D4AF37] font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </Link>
            )
          })}

          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              drawerOpen ? 'text-[#D4AF37]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Menu className="w-5 h-5 mb-1" />
            <span className="text-[10px] tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer in Dark Green & Gold */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm md:hidden flex flex-col justify-end">
          <div className="bg-[#0D1510] border-t border-[#D4AF37]/35 rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto safe-bottom">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <span className="text-sm font-bold font-display uppercase tracking-wider text-[#D4AF37]">
                All Navigation
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {moreItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#121E17] border-[#D4AF37]/50 text-[#D4AF37]'
                        : 'bg-[#070B08] border-white/5 text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
