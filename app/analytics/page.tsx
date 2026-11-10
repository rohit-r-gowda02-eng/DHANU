'use client'

import React, { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react'

const PIE_COLORS = ['#D4AF37', '#10B981', '#059669', '#F59E0B', '#E5C07B', '#34D399']

export default function AnalyticsPage() {
  const [range, setRange] = useState('30d') // 7d, 30d, 90d, 6m, 1y
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/analytics?range=${range}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [range])

  if (loading || !data) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      </AppShell>
    )
  }

  const { comparison, dailyTrend = [], weeklyTrend = [], activityBreakdown = [] } = data

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header & Range Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Growth & Discipline Analytics</h1>
            <p className="text-xs text-slate-400">
              Deterministic calculations computed from verified completion records.
            </p>
          </div>

          {/* Time range pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0D1510] border border-white/10 rounded-xl self-start sm:self-auto">
            {['7d', '30d', '90d', '6m', '1y'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                  range === r
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Period-Over-Period Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="dhanu-card p-5 border-amber-500/20">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Time Invested</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">vs prev {range}</span>
            </div>
            <div className="text-3xl font-extrabold font-display text-white my-1">
              {comparison.current.totalHours} <span className="text-xs text-slate-400">hours</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {comparison.hoursChangePercent >= 0 ? (
                <div className="flex items-center text-emerald-400 font-semibold">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+{comparison.hoursChangePercent}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-400 font-semibold">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>{comparison.hoursChangePercent}%</span>
                </div>
              )}
              <span className="text-slate-400">
                (prev: {comparison.previous.totalHours} hrs)
              </span>
            </div>
          </div>

          <div className="dhanu-card p-5 border-emerald-500/20">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Verified Sessions</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">vs prev {range}</span>
            </div>
            <div className="text-3xl font-extrabold font-display text-white my-1">
              {comparison.current.totalCompleted} <span className="text-xs text-slate-400">sessions</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {comparison.completionCountChangePercent >= 0 ? (
                <div className="flex items-center text-emerald-400 font-semibold">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+{comparison.completionCountChangePercent}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-400 font-semibold">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>{comparison.completionCountChangePercent}%</span>
                </div>
              )}
              <span className="text-slate-400">
                (prev: {comparison.previous.totalCompleted})
              </span>
            </div>
          </div>

          <div className="dhanu-card p-5 border-amber-500/20">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Daily Cadence Average</span>
              <span className="text-[10px] uppercase font-bold text-amber-400">Efficiency</span>
            </div>
            <div className="text-3xl font-extrabold font-display text-amber-400 my-1">
              {(
                Number(comparison.current.totalMinutes) /
                Math.max(1, dailyTrend.length * 60)
              ).toFixed(1)}{' '}
              <span className="text-xs text-slate-400">hrs/day</span>
            </div>
            <p className="text-xs text-slate-400">Consistent daily execution pace</p>
          </div>
        </div>

        {/* 1. Daily Consistency Timeline Chart */}
        <div className="dhanu-card p-6 border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-display text-white">
                Daily Focus Duration (Minutes)
              </h3>
              <p className="text-xs text-slate-400">Actual daily minutes verified with proof</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1510',
                    borderColor: 'rgba(212, 175, 55, 0.4)',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#areaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2 & 3. Activity Time Breakdown & Weekly Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Time spent per activity */}
          <div className="dhanu-card p-6">
            <h3 className="text-base font-bold font-display text-white mb-1">
              Time Spent per Commitment
            </h3>
            <p className="text-xs text-slate-400 mb-4">Hours distribution across routines</p>

            <div className="h-60 w-full flex items-center justify-center">
              {activityBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityBreakdown}
                      dataKey="hours"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {activityBreakdown.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0D1510',
                        borderColor: 'rgba(212, 175, 55, 0.4)',
                        borderRadius: '8px',
                        color: '#F8FAFC',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-slate-500">No activity data logged in this range.</p>
              )}
            </div>

            <div className="space-y-2 mt-4 pt-3 border-t border-white/5">
              {activityBreakdown.map((act: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: act.color || PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span className="text-slate-300 font-medium">{act.name}</span>
                  </div>
                  <span className="text-white font-bold">{act.hours} hrs</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Completion Frequency */}
          <div className="dhanu-card p-6">
            <h3 className="text-base font-bold font-display text-white mb-1">
              Weekly Volume Trends
            </h3>
            <p className="text-xs text-slate-400 mb-4">Hours logged by calendar week</p>

            <div className="h-60 w-full">
              {weeklyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="week" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0D1510',
                        borderColor: 'rgba(212, 175, 55, 0.4)',
                        borderRadius: '8px',
                        color: '#F8FAFC',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="hours" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-slate-500">
                  Insufficient weekly historical records
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
