'use client'

import React, { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { ContributionCalendar } from '@/components/streaks/ContributionCalendar'
import {
  Flame,
  Shield,
  Trophy,
  Award,
  Crown,
  Sparkles,
  CheckCircle2,
  Lock,
  Loader2,
} from 'lucide-react'

export default function StreaksPage() {
  const [data, setData] = useState<any>(null)
  const [milestonesData, setMilestonesData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetch('/api/streaks'), fetch('/api/milestones')])
      .then(async ([sRes, mRes]) => {
        const sJson = await sRes.json()
        const mJson = await mRes.json()
        setData(sJson)
        setMilestonesData(mJson)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      </AppShell>
    )
  }

  const { loginStreak, activityStreaks, calendarDays, totalCompletionsCount } = data
  const { standards = [] } = milestonesData || {}

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            Streak Engine & Contribution Grid
          </h1>
          <p className="text-xs text-slate-400">
            Consecutive daily accountability inspired by LeetCode and GitHub contribution grids.
          </p>
        </div>

        {/* Top 3 Streak Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="dhanu-card p-5 border-amber-500/25 bg-gradient-to-br from-[#0D1510] to-[#14221A]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Current Login Streak
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-amber-400/20" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-display text-white">
              {loginStreak.currentStreak}{' '}
              <span className="text-sm font-normal text-amber-400">Days</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Active consecutive calendar days logged in
            </p>
          </div>

          <div className="dhanu-card p-5 border-emerald-500/20 bg-gradient-to-br from-[#0D1510] to-[#14221A]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Longest Login Streak
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-display text-white">
              {loginStreak.longestStreak}{' '}
              <span className="text-sm font-normal text-emerald-400">Days</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Personal all-time best consistency record</p>
          </div>

          <div className="dhanu-card p-5 border-emerald-500/20 bg-gradient-to-br from-[#0D1510] to-[#14221A]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Total Verified Days
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-display text-white">
              {loginStreak.totalActiveDays}{' '}
              <span className="text-sm font-normal text-emerald-400">Days</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Lifetime verified actions ({totalCompletionsCount} total sessions)
            </p>
          </div>
        </div>

        {/* GitHub-style Contribution Calendar (Past 365 Days) */}
        <ContributionCalendar
          days={calendarDays}
          totalActiveDays={loginStreak.totalActiveDays}
          longestStreak={loginStreak.longestStreak}
        />

        {/* Activity-Specific Streaks */}
        <div className="dhanu-card p-6">
          <div className="mb-4">
            <h2 className="text-base font-bold font-display text-white">
              Individual Activity Streaks
            </h2>
            <p className="text-xs text-slate-400">
              Each commitment holds its own streak. Unscheduled rest days protect the streak; missed
              scheduled sessions reset it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activityStreaks.map((item: any) => (
              <div
                key={item.id}
                className="p-4 bg-[#0B130E] border border-white/5 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-10 rounded-md shrink-0"
                    style={{ backgroundColor: item.activity?.color || '#D4AF37' }}
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white">{item.activity?.name}</h3>
                    <p className="text-xs text-slate-400">{item.activity?.category}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold font-display text-amber-400 flex items-center justify-end gap-1">
                    <Flame className="w-4 h-4 fill-amber-400/20" />
                    <span>{item.currentStreak}d</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Longest: {item.longestStreak}d</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Genuine Milestone Showcase (7, 14, 30, 60, 100 days) */}
        <div className="dhanu-card p-6">
          <div className="mb-5">
            <h2 className="text-base font-bold font-display text-white">
              Consistency Milestone Badges
            </h2>
            <p className="text-xs text-slate-400">
              Honest badges unlocked only by verifiable consecutive days of effort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {standards.map((m: any, idx: number) => {
              const unlocked = m.isUnlocked

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    unlocked
                      ? 'bg-[#14221A] border-amber-500/40 text-white shadow-3d-card'
                      : 'bg-[#0B130E]/50 border-white/5 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        unlocked
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-glow-gold'
                          : 'bg-white/5 text-slate-500'
                      }`}
                    >
                      {unlocked ? <Trophy className="w-4 h-4 text-black" /> : <Lock className="w-4 h-4" />}
                    </div>

                    {unlocked && (
                      <span className="text-[10px] font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
                        UNLOCKED
                      </span>
                    )}
                  </div>

                  <h4
                    className={`font-bold text-xs mb-1 ${unlocked ? 'text-white' : 'text-slate-400'}`}
                  >
                    {m.title}
                  </h4>
                  <p className="text-[11px] leading-relaxed line-clamp-2">{m.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

