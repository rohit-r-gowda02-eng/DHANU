'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DhanuLogo } from '@/components/brand/DhanuLogo'
import {
  Plus,
  Trash2,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Target,
  Loader2,
  AlertCircle,
} from 'lucide-react'

interface ActivityDraft {
  name: string
  category: string
  description?: string
  targetMinutes: number
  preferredTime: string
  activeDays: string // "MON,TUE,WED,THU,FRI,SAT,SUN"
  restDays?: string
  color: string
}

const PRESET_ACTIVITIES: ActivityDraft[] = [
  {
    name: 'DSA Practice',
    category: 'Problem Solving',
    description: 'Algorithmic problem solving and data structures.',
    targetMinutes: 120,
    preferredTime: '07:00',
    activeDays: 'MON,TUE,WED,THU,FRI,SAT',
    restDays: 'SUN',
    color: '#D4AF37', // Gold
  },
  {
    name: 'Project Development',
    category: 'Engineering',
    description: 'Building production full-stack software and tools.',
    targetMinutes: 120,
    preferredTime: '18:00',
    activeDays: 'MON,TUE,WED,THU,FRI',
    restDays: 'SAT,SUN',
    color: '#10B981', // Emerald
  },
  {
    name: 'Physical Training',
    category: 'Health',
    description: 'Resistance training or cardiovascular exercise.',
    targetMinutes: 45,
    preferredTime: '06:00',
    activeDays: 'MON,TUE,WED,THU,FRI,SAT',
    restDays: 'SUN',
    color: '#059669', // Forest
  },
  {
    name: 'Technical Reading',
    category: 'Knowledge',
    description: 'System design papers, books, or documentation.',
    targetMinutes: 30,
    preferredTime: '21:30',
    activeDays: 'MON,TUE,WED,THU,FRI,SAT,SUN',
    restDays: '',
    color: '#F59E0B', // Amber Gold
  },
]

const ALL_DAYS = [
  { id: 'MON', label: 'Mon' },
  { id: 'TUE', label: 'Tue' },
  { id: 'WED', label: 'Wed' },
  { id: 'THU', label: 'Thu' },
  { id: 'FRI', label: 'Fri' },
  { id: 'SAT', label: 'Sat' },
  { id: 'SUN', label: 'Sun' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [activities, setActivities] = useState<ActivityDraft[]>(PRESET_ACTIVITIES)
  const [initialGoal, setInitialGoal] = useState({
    title: 'Solve 300 DSA Problems in 90 Days',
    targetValue: 300,
    unit: 'problems',
    category: 'Algorithms',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // New activity form
  const [newActivity, setNewActivity] = useState<ActivityDraft>({
    name: '',
    category: 'Focus',
    targetMinutes: 60,
    preferredTime: '09:00',
    activeDays: 'MON,TUE,WED,THU,FRI',
    color: '#D4AF37',
  })

  const handleAddCustomActivity = () => {
    if (!newActivity.name.trim()) return
    setActivities([...activities, { ...newActivity, name: newActivity.name.trim() }])
    setNewActivity({
      name: '',
      category: 'Focus',
      targetMinutes: 60,
      preferredTime: '09:00',
      activeDays: 'MON,TUE,WED,THU,FRI',
      color: '#10B981',
    })
  }

  const handleRemoveActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index))
  }

  const handleToggleDay = (actIndex: number, dayId: string) => {
    const act = activities[actIndex]
    const days = act.activeDays.split(',').filter(Boolean)
    let newDays: string[]
    if (days.includes(dayId)) {
      newDays = days.filter((d) => d !== dayId)
    } else {
      newDays = [...days, dayId]
    }
    const updated = [...activities]
    updated[actIndex].activeDays = newDays.join(',')
    setActivities(updated)
  }

  const handleSubmitOnboarding = async () => {
    if (activities.length === 0) {
      setError('Please add at least one routine activity.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activities,
          initialGoal: initialGoal.title ? initialGoal : undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete routine setup')
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error initializing routine')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070B08] text-white py-10 px-4 sm:px-6 lg:px-8 selection:bg-amber-400 selection:text-black">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-3">
            <DhanuLogo size="md" showTagline={false} />
          </div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-white mb-2">
            Design Your Daily Routine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Growth is not an accident. Configure your daily commitments, weekly schedule, and
            target durations to create your personalized accountability dashboard.
          </p>

          {/* Step Progress Indicators */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                step >= 1 ? 'bg-[#D4AF37] text-black shadow-sm' : 'bg-white/5 text-slate-500'
              }`}
            >
              1. Routine Activities
            </div>
            <div className="w-6 h-0.5 bg-white/10" />
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                step >= 2 ? 'bg-[#D4AF37] text-black shadow-sm' : 'bg-white/5 text-slate-500'
              }`}
            >
              2. Weekly Schedules
            </div>
            <div className="w-6 h-0.5 bg-white/10" />
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                step >= 3 ? 'bg-[#D4AF37] text-black shadow-sm' : 'bg-white/5 text-slate-500'
              }`}
            >
              3. Anchor Goal & Launch
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-xs text-red-200 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Routine Activities */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-[#0D1510] border border-[#D4AF37]/25 rounded-2xl p-6 shadow-3d-card">
              <h2 className="text-base font-bold font-display text-white mb-1">
                Your Initial Daily Commitments
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                We pre-populated recommended high-leverage activities. You can edit, remove, or add custom ones.
              </p>

              <div className="space-y-3">
                {activities.map((act, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#070B08] border border-white/5 rounded-xl gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3.5 h-10 rounded-md shrink-0"
                        style={{ backgroundColor: act.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">{act.name}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400">
                            {act.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{act.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
                      <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold bg-amber-950/40 px-2.5 py-1 rounded-md border border-[#D4AF37]/20">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{act.targetMinutes}m</span>
                      </div>
                      <button
                        onClick={() => handleRemoveActivity(index)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-white/5 transition-colors"
                        title="Remove activity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Activity */}
              <div className="mt-5 pt-5 border-t border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block mb-3">
                  + Add Another Commitment
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Activity Name (e.g. System Design)"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                    className="bg-[#070B08] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g. Engineering)"
                    value={newActivity.category}
                    onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                    className="bg-[#070B08] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="10"
                      max="480"
                      placeholder="Minutes"
                      value={newActivity.targetMinutes}
                      onChange={(e) =>
                        setNewActivity({ ...newActivity, targetMinutes: Number(e.target.value) })
                      }
                      className="w-24 bg-[#070B08] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomActivity}
                      className="btn-primary flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-3d-btn"
              >
                <span>Next: Configure Weekly Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Weekly Schedule & Rest Days */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-[#0D1510] border border-[#D4AF37]/25 rounded-2xl p-6 shadow-3d-card">
              <h2 className="text-base font-bold font-display text-white mb-1">
                Active Days & Designated Rest Days
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                Toggle the days of the week each activity is active. On unscheduled rest days, your streak
                is protected and does not reset!
              </p>

              <div className="space-y-5">
                {activities.map((act, actIndex) => {
                  const activeList = act.activeDays.split(',')

                  return (
                    <div key={actIndex} className="p-4 bg-[#070B08] border border-white/5 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-sm text-white">{act.name}</span>
                        <span className="text-xs text-amber-200/70">
                          {activeList.filter(Boolean).length} days / week
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {ALL_DAYS.map((d) => {
                          const isDayActive = activeList.includes(d.id)
                          return (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => handleToggleDay(actIndex, d.id)}
                              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                                isDayActive
                                  ? 'bg-[#D4AF37] text-black shadow-sm'
                                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              {d.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-3d-btn"
              >
                <span>Next: Goal & Launch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Anchor Goal & Launch */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-[#0D1510] border border-[#D4AF37]/25 rounded-2xl p-6 shadow-3d-card">
              <h2 className="text-base font-bold font-display text-white mb-1">
                Set Your 90-Day Anchor Goal
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                Every consistent daily routine serves a long-term milestone. Define your primary ambition.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={initialGoal.title}
                    onChange={(e) => setInitialGoal({ ...initialGoal, title: e.target.value })}
                    placeholder="e.g. Solve 300 DSA Problems"
                    className="w-full bg-[#070B08] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Target Quantity
                    </label>
                    <input
                      type="number"
                      value={initialGoal.targetValue}
                      onChange={(e) =>
                        setInitialGoal({ ...initialGoal, targetValue: Number(e.target.value) })
                      }
                      className="w-full bg-[#070B08] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Unit of Measure
                    </label>
                    <input
                      type="text"
                      value={initialGoal.unit}
                      onChange={(e) => setInitialGoal({ ...initialGoal, unit: e.target.value })}
                      placeholder="problems, hours, projects"
                      className="w-full bg-[#070B08] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitOnboarding}
                className="btn-primary px-8 py-3 text-xs font-bold flex items-center gap-2 shadow-3d-btn"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Dashboard...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Launch My DHANU Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
