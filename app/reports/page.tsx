'use client'

import React, { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import {
  FileText,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  Trophy,
  Printer,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'

export default function ReportsPage() {
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchReport = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reports/monthly?month=${month}`)
      const json = await res.json()
      setData(json)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [month])

  const handlePrevMonth = () => {
    const [y, m] = month.split('-').map(Number)
    const prevDate = new Date(y, m - 2, 1)
    setMonth(`${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`)
  }

  const handleNextMonth = () => {
    const [y, m] = month.split('-').map(Number)
    const nextDate = new Date(y, m, 1)
    setMonth(`${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`)
  }

  const handlePrint = () => {
    window.print()
  }

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
    totalCompleted,
    totalMissed,
    totalHours,
    consistencyRate,
    milestones = [],
    activityBreakdown = [],
    growthAnalysis,
    areasForImprovement,
  } = data

  return (
    <AppShell>
      <div className="max-w-4xl space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Monthly Personal Report</h1>
            <p className="text-xs text-slate-400">
              Deterministic verification summary for month: {month}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Month Navigator */}
            <div className="flex items-center gap-2 bg-[#0D1510] border border-white/10 rounded-xl px-3 py-1.5 text-xs">
              <button
                onClick={handlePrevMonth}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-white min-w-[70px] text-center font-display">
                {month}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-2"
            >
              <Printer className="w-3.5 h-3.5 text-black" />
              <span>Print / Export PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Certificate/Report Sheet */}
        <div className="dhanu-card p-6 sm:p-8 space-y-8 border-amber-500/30 bg-[#0D1510]">
          {/* Document Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>DHANU Verified Growth Record</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                Monthly Performance & Accountability Summary
              </h2>
              <p className="text-xs text-slate-400 mt-1">Audit Period: {month} • Zero Fabricated Proofs</p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black font-display text-amber-400">{consistencyRate}%</div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Consistency Score
              </span>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#0B130E] border border-white/5 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Invested Time
              </span>
              <div className="text-2xl font-black font-display text-white">{totalHours}h</div>
              <p className="text-[10px] text-slate-400 mt-1">Total focus hours</p>
            </div>

            <div className="p-4 bg-[#0B130E] border border-white/5 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Verified Actions
              </span>
              <div className="text-2xl font-black font-display text-emerald-400">{totalCompleted}</div>
              <p className="text-[10px] text-slate-400 mt-1">With photo evidence</p>
            </div>

            <div className="p-4 bg-[#0B130E] border border-white/5 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Missed Targets
              </span>
              <div className="text-2xl font-black font-display text-amber-400">{totalMissed}</div>
              <p className="text-[10px] text-slate-400 mt-1">Scheduled sessions</p>
            </div>

            <div className="p-4 bg-[#0B130E] border border-white/5 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Milestones Earned
              </span>
              <div className="text-2xl font-black font-display text-amber-400">{milestones.length}</div>
              <p className="text-[10px] text-slate-400 mt-1">Unlocked this month</p>
            </div>
          </div>

          {/* Analysis & Insights */}
          <div className="p-5 bg-gradient-to-r from-emerald-950/40 via-[#14221A] to-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Platform Growth Assessment</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {growthAnalysis}
            </p>
            <p className="text-xs text-amber-300">
              <strong>Focus Calibration:</strong> {areasForImprovement}
            </p>
          </div>

          {/* Activity Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
              Routines & Time Allocation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activityBreakdown.map((act: any, i: number) => (
                <div
                  key={i}
                  className="p-3.5 bg-[#0B130E] border border-white/5 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{act.name}</span>
                    <span className="text-slate-400 text-[11px]">{act.count} completed sessions</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-amber-400 text-sm">{act.hours} hrs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Affirmation */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <span>&ldquo;Don&apos;t just plan your growth. Prove it through your daily actions.&rdquo;</span>
            <span className="text-slate-400 font-mono text-[10px]">DHANU Accountability Core v2.0</span>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

