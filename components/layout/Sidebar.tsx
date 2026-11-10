'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  BarChart3,
  Flame,
  Target,
  Calendar,
  Compass,
  FileText,
  Bell,
  User,
  Settings,
  ShieldCheck,
} from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  const navSections = [
    {
      title: 'CORE PLATFORM',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Daily Routine', href: '/routine', icon: CheckSquare },
        { label: 'Learning Journal', href: '/journal', icon: BookOpen },
        { label: 'Growth Analytics', href: '/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'ACCOUNTABILITY',
      items: [
        { label: 'Streaks & Grid', href: '/streaks', icon: Flame },
        { label: 'Long-term Goals', href: '/goals', icon: Target },
        { label: 'Monthly Calendar', href: '/calendar', icon: Calendar },
        { label: 'Weekly Reviews', href: '/reviews', icon: Compass },
        { label: 'Monthly Reports', href: '/reports', icon: FileText },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Inactivity & Alerts', href: '/notifications', icon: Bell },
        { label: 'My Profile', href: '/profile', icon: User },
        { label: 'Settings & Privacy', href: '/settings', icon: Settings },
      ],
    },
  ]

  return (
    <aside className="w-64 border-r border-[#D4AF37]/15 bg-[#070B08] flex-col justify-between hidden md:flex shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="py-5 px-3 space-y-6">
        {navSections.map((sec, idx) => (
          <div key={idx}>
            <div className="px-3 text-[10px] font-bold font-display uppercase tracking-wider text-amber-200/60 mb-2">
              {sec.title}
            </div>
            <nav className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#121E17] text-[#D4AF37] border border-[#D4AF37]/35 shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-emerald-500/70'}`} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Philosophy Badge in Dark Emerald & Gold */}
      <div className="p-4 border-t border-[#D4AF37]/15 mx-3 mb-3 bg-[#0D1510] rounded-xl border border-[#D4AF37]/20 shadow-md">
        <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>DHANU Principle</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          &quot;Don&apos;t just plan your growth. Prove it through daily actions.&quot;
        </p>
      </div>
    </aside>
  )
}
