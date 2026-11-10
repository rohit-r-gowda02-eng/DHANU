'use client'

import React, { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import {
  Target,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles,
  Loader2,
  X,
  AlertCircle,
} from 'lucide-react'

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'Engineering',
    description: '',
    targetValue: 100,
    currentValue: 0,
    unit: 'problems',
    targetDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
  })
  const [error, setError] = useState('')

  const loadGoals = async () => {
    try {
      const res = await fetch('/api/goals')
      const data = await res.json()
      if (data.goals) setGoals(data.goals)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
  }, [])

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.title.trim()) return

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal),
      })
      if (res.ok) {
        setModalOpen(false)
        setNewGoal({
          title: '',
          category: 'Engineering',
          description: '',
          targetValue: 100,
          currentValue: 0,
          unit: 'problems',
          targetDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        })
        loadGoals()
      }
    } catch {}
  }

  const handleUpdateProgress = async (id: string, currentValue: number) => {
    try {
      await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, currentValue }),
      })
      loadGoals()
    } catch {}
  }

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Are you sure you want to remove this goal?')) return
    try {
      await fetch(`/api/goals?id=${id}`, { method: 'DELETE' })
      loadGoals()
    } catch {}
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Long-term Goal Milestones</h1>
            <p className="text-xs text-slate-400">
              Transform daily actions into measurable multi-week achievements.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Goal</span>
          </button>
        </div>

        {/* Create Modal */}
        {modalOpen && (
          <div className="dhanu-card p-6 border-amber-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-display text-white">Define Target Milestone</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Goal Title *</label>
                <input
                  type="text"
                  required
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g. Solve 300 DSA Problems in 90 Days"
                  className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Target Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
                    className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Unit of Measure *</label>
                  <input
                    type="text"
                    required
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    placeholder="problems, hours, projects, chapters"
                    className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Target Deadline *</label>
                  <input
                    type="date"
                    required
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-5 py-2 font-semibold">
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Goals List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          </div>
        ) : goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((g) => (
              <div key={g.id} className="dhanu-card p-5 space-y-4 border-emerald-500/15">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-amber-400 border border-amber-400/20">
                      {g.category}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1">{g.title}</h3>
                  </div>

                  <button
                    onClick={() => handleDeleteGoal(g.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-white/5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-white">
                      {g.currentValue} of {g.targetValue} {g.unit}
                    </span>
                    <span className="text-amber-400 font-bold">{g.percent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-300"
                      style={{ width: `${g.percent}%` }}
                    />
                  </div>
                </div>

                {/* Cadence Prediction & Remaining days */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{g.daysRemaining} days left</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateProgress(g.id, Math.max(0, g.currentValue - 1))}
                      className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateProgress(g.id, Math.min(g.targetValue, g.currentValue + 1))
                      }
                      className="w-6 h-6 rounded bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dhanu-card p-12 text-center text-xs text-slate-400">
            No active goals. Define an anchor milestone to measure your daily compounding.
          </div>
        )}
      </div>
    </AppShell>
  )
}
