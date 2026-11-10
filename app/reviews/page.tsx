'use client'

import React, { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import {
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Loader2,
} from 'lucide-react'

export default function WeeklyReviewPage() {
  const [offset, setOffset] = useState(0) // 0 = current week, 1 = previous week
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/reviews/weekly?offset=${offset}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [offset])

  if (loading || !data) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      </AppShell>
    )
  }

  const {
    startDate,
    endDate,
    completedCount,
    missedCount,
    totalHours,
    prevTotalHours,
    hoursDiffPercent,
    bestActivityName,
    consistencyRate,
    insight,
  } = data

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Weekly Performance Review</h1>
            <p className="text-xs text-slate-400">
              Window: {startDate} to {endDate}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0D1510] p-1 rounded-xl border border-white/10 self-start sm:self-auto text-xs">
            <button
              onClick={() => setOffset(0)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                offset === 0
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Current Week
            </button>
            <button
              onClick={() => setOffset(1)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                offset === 1
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Previous Week
            </button>
          </div>
        </div>

        {/* Modular Intelligence Review Insight Banner */}
        {insight && (
          <div className="dhanu-card p-6 border-amber-500/30 bg-gradient-to-r from-emerald-950/40 via-[#0D1510] to-emerald-950/20">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>DHANU Intelligence Summary</span>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium mb-4">
              {insight.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Top Strength</span>
                <span className="font-semibold text-emerald-400">{insight.topStrength}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Focus Friction</span>
                <span className="font-semibold text-amber-300">{insight.areaToImprove}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Actionable Prescription</span>
                <span className="font-semibold text-amber-400">{insight.actionableAdvice}</span>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="dhanu-card p-5 border-amber-500/20">
            <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">
              Consistency Rate
            </span>
            <div className="text-3xl font-extrabold font-display text-amber-400">
              {consistencyRate}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {completedCount} completed vs {missedCount} missed
            </p>
          </div>

          <div className="dhanu-card p-5 border-emerald-500/20">
            <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">
              Total Focus Hours
            </span>
            <div className="text-3xl font-extrabold font-display text-white">{totalHours} hrs</div>
            <p className="text-[11px] text-emerald-400 mt-1">
              {hoursDiffPercent >= 0 ? `+${hoursDiffPercent}%` : `${hoursDiffPercent}%`} vs prev week ({prevTotalHours}h)
            </p>
          </div>

          <div className="dhanu-card p-5 border-emerald-500/20">
            <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">
              Completed Sessions
            </span>
            <div className="text-3xl font-extrabold font-display text-emerald-400">
              {completedCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Backed by verified photographic proof</p>
          </div>

          <div className="dhanu-card p-5 border-amber-500/20">
            <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">
              Anchor Performer
            </span>
            <div className="text-xl font-bold font-display text-amber-300 truncate mt-1">
              {bestActivityName}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Highest completed cadence</p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
