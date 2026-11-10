'use client'

import React, { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { ProofViewerModal } from '@/components/completions/ProofViewerModal'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Camera,
  AlertTriangle,
  Loader2,
  X,
} from 'lucide-react'

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  const [calendarData, setCalendarData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Selected date modal / inspect drawer
  const [selectedDay, setSelectedDay] = useState<any>(null)
  const [viewerEntry, setViewerEntry] = useState<any>(null)

  const fetchCalendar = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/calendar?month=${currentMonth}`)
      const data = await res.json()
      setCalendarData(data)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCalendar()
  }, [currentMonth])

  const handlePrevMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number)
    const prevDate = new Date(y, m - 2, 1)
    setCurrentMonth(
      `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`
    )
  }

  const handleNextMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number)
    const nextDate = new Date(y, m, 1)
    setCurrentMonth(
      `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FULL_COMPLETED':
        return 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
      case 'PARTIAL_COMPLETED':
        return 'bg-amber-950/50 border-amber-500/40 text-amber-300'
      case 'REST_DAY':
        return 'bg-white/5 border-white/5 text-slate-500'
      case 'MISSED':
        return 'bg-red-950/40 border-red-500/30 text-red-300'
      default:
        return 'bg-[#0B130E] border-white/5 text-slate-400'
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header & Month Navigator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Monthly Activity Calendar</h1>
            <p className="text-xs text-slate-400">
              Interactive timeline of daily routine completions and proof logs.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#0D1510] border border-white/10 rounded-xl px-3 py-1.5 self-start sm:self-auto">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-xs text-white min-w-[90px] text-center font-display">
              {currentMonth}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">All Completed (100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">Partially Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="text-slate-300">Missed Session</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span className="text-slate-400">Designated Rest Day</span>
          </div>
        </div>

        {/* Calendar Grid */}
        {loading || !calendarData ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          </div>
        ) : (
          <div className="dhanu-card p-4 sm:p-6">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold font-display text-slate-400 uppercase tracking-wider mb-2">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7 gap-2">
              {calendarData.days.map((day: any) => {
                const colorClass = getStatusColor(day.status)
                const isSelected = selectedDay?.date === day.date

                return (
                  <button
                    key={day.date}
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[85px] sm:min-h-[100px] p-2 rounded-xl border flex flex-col justify-between text-left transition-all ${colorClass} ${
                      isSelected ? 'ring-2 ring-amber-400 shadow-3d-card' : 'hover:scale-[1.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{day.dayNumber}</span>
                      {day.status === 'FULL_COMPLETED' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>

                    <div className="text-[10px] space-y-0.5">
                      {day.status === 'FULL_COMPLETED' && (
                        <span className="block font-semibold text-emerald-300">
                          {day.completedCount} Done
                        </span>
                      )}
                      {day.status === 'PARTIAL_COMPLETED' && (
                        <span className="block font-semibold text-amber-300">
                          {day.completedCount}/{day.scheduledCount} Done
                        </span>
                      )}
                      {day.status === 'REST_DAY' && (
                        <span className="block text-slate-500">Rest</span>
                      )}
                      {day.status === 'MISSED' && (
                        <span className="block font-semibold text-red-400">Missed</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Selected Date Inspector Panel */}
        {selectedDay && (
          <div className="dhanu-card p-6 border-amber-500/30">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold font-display text-white">
                  Inspect Records for {selectedDay.date}
                </h3>
                <p className="text-xs text-slate-400">
                  Status: {selectedDay.status} • {selectedDay.completedCount} completed sessions
                </p>
              </div>
              <button onClick={() => setSelectedDay(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedDay.completions && selectedDay.completions.length > 0 ? (
              <div className="space-y-3">
                {selectedDay.completions.map((comp: any) => (
                  <div
                    key={comp.id}
                    className="p-3.5 bg-[#0B130E] border border-white/5 rounded-xl flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">
                          {comp.activity?.name}
                        </span>
                        <span className="text-amber-400 font-semibold">• {comp.durationMinutes}m</span>
                      </div>
                      <p className="text-slate-300">{comp.accomplishments}</p>
                    </div>

                    {comp.proofImages?.[0] && (
                      <button
                        onClick={() =>
                          setViewerEntry({
                            activityName: comp.activity?.name,
                            date: comp.date,
                            durationMinutes: comp.durationMinutes,
                            accomplishments: comp.accomplishments,
                            learnings: comp.learnings,
                            problemsSolved: comp.problemsSolved,
                            imageUrl: comp.proofImages[0].imageUrl,
                            caption: comp.proofImages[0].caption,
                          })
                        }
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-amber-400 font-medium flex items-center gap-1.5 shrink-0"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>View Proof</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                No activity logs recorded for this calendar day.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Proof Lightbox */}
      <ProofViewerModal
        isOpen={!!viewerEntry}
        entry={viewerEntry}
        onClose={() => setViewerEntry(null)}
      />
    </AppShell>
  )
}
