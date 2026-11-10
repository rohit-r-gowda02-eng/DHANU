'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { CompletionModal } from '@/components/completions/CompletionModal'
import { ActivityTimer } from '@/components/completions/ActivityTimer'
import { ProofViewerModal } from '@/components/completions/ProofViewerModal'
import { RecoveryModal } from '@/components/completions/RecoveryModal'
import {
  Flame,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Plus,
  BarChart2,
  Calendar as CalendarIcon,
  BookOpen,
  Camera,
  AlertTriangle,
  Loader2,
} from 'lucide-react'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [todayData, setTodayData] = useState<any>(null)
  const [recentCompletions, setRecentCompletions] = useState<any[]>([])
  const [streakData, setStreakData] = useState<any>(null)
  const [userName, setUserName] = useState('Alex')

  // Interactive tracking states
  const [activeTimerActivity, setActiveTimerActivity] = useState<any>(null)
  const [completeModalActivity, setCompleteModalActivity] = useState<any>(null)
  const [completeModalDuration, setCompleteModalDuration] = useState(60)

  // Recovery modal state
  const [recoveryActivity, setRecoveryActivity] = useState<any>(null)

  // Proof viewer modal
  const [viewerEntry, setViewerEntry] = useState<any>(null)

  const loadDashboardData = async () => {
    try {
      const [todayRes, streaksRes, journalRes, meRes] = await Promise.all([
        fetch('/api/completions/today'),
        fetch('/api/streaks'),
        fetch('/api/journal'),
        fetch('/api/auth/me'),
      ])

      const todayJson = await todayRes.json()
      const streaksJson = await streaksRes.json()
      const journalJson = await journalRes.json()
      const meJson = await meRes.json()

      setTodayData(todayJson)
      setStreakData(streaksJson)
      if (journalJson.entries) setRecentCompletions(journalJson.entries.slice(0, 4))
      if (meJson.user?.name) setUserName(meJson.user.name.split(' ')[0])

      setLoading(false)
    } catch (err) {
      console.error('Error loading dashboard:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading || !todayData) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      </AppShell>
    )
  }

  const { summary, items, date } = todayData

  return (
    <AppShell>
      <div className="space-y-6">
        {/* A. Welcome Banner & Daily Progress Card in Dark Forest Green & Gold */}
        <div className="dhanu-card p-6 border-[#D4AF37]/25 bg-gradient-to-r from-[#0D1510] via-[#121E17] to-[#0D1510] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
                <span>{date}</span>
                <span>•</span>
                <span>{getGreeting()}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                Welcome back, {userName}.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
                &quot;Don&apos;t just plan your growth. Prove it through daily actions.&quot;
              </p>
            </div>

            {/* Streak & Overall Progress Pill */}
            <div className="flex items-center gap-4 shrink-0 bg-[#070B08]/90 p-3 rounded-xl border border-[#D4AF37]/20 shadow-md">
              <div className="flex items-center gap-2.5 pr-4 border-r border-white/10">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Flame className="w-5 h-5 fill-[#D4AF37]/20" />
                </div>
                <div>
                  <div className="text-lg font-bold font-display text-[#D4AF37]">
                    {streakData?.loginStreak?.currentStreak || 1} Days
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                    Login Streak
                  </div>
                </div>
              </div>

              <div>
                <div className="text-lg font-bold font-display text-emerald-400">
                  {summary.completionRate}%
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                  Today&apos;s Target
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar in Emerald to Gold */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-300 font-medium">Daily Routine Execution</span>
              <span className="text-[#D4AF37] font-bold">
                {summary.completed} of {summary.totalScheduled} Completed ({summary.totalHoursSpent}{' '}
                hrs logged)
              </span>
            </div>
            <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-[#D4AF37] rounded-full transition-all duration-500"
                style={{ width: `${summary.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Timer Box (If an activity is actively running) */}
        {activeTimerActivity && (
          <ActivityTimer
            targetMinutes={activeTimerActivity.targetMinutes}
            onFinish={(duration) => {
              setCompleteModalActivity(activeTimerActivity)
              setCompleteModalDuration(duration)
              setActiveTimerActivity(null)
            }}
            onCancel={() => setActiveTimerActivity(null)}
          />
        )}

        {/* C. Today's Routine Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold font-display text-white">Today&apos;s Commitments</h2>
              <p className="text-xs text-slate-400">Scheduled activities for {date}</p>
            </div>

            <Link
              href="/routine"
              className="text-xs text-[#D4AF37] hover:text-amber-300 flex items-center gap-1 font-semibold"
            >
              <span>Manage Routine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item: any) => {
              const isCompleted = item.status === 'COMPLETED'
              const isMissed = item.status === 'MISSED'
              const isRest = item.status === 'REST_DAY'
              const isTimerRunning = activeTimerActivity?.id === item.activityId

              return (
                <div
                  key={item.activityId}
                  className={`dhanu-card p-5 relative overflow-hidden transition-all ${
                    isCompleted ? 'border-emerald-500/40 bg-[#070B08]/90' : 'hover:border-[#D4AF37]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3.5 h-10 rounded-md shrink-0"
                        style={{ backgroundColor: item.color || '#D4AF37' }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-white">{item.name}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Target: {item.targetMinutes} mins • Pref: {item.preferredTime}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isCompleted ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>VERIFIED</span>
                        </span>
                      ) : isMissed ? (
                        <button
                          onClick={() => setRecoveryActivity(item)}
                          className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-500/40 hover:bg-amber-900/40 flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>MISSED • RECOVER</span>
                        </button>
                      ) : isRest ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-white/5">
                          REST DAY
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-950/40 text-[#D4AF37] border border-[#D4AF37]/30">
                          PENDING
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Activity Details & Accomplishment if completed */}
                  {isCompleted && item.completion && (
                    <div className="my-3 p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-slate-300">
                      <div className="font-semibold text-white mb-1">
                        Accomplished: {item.completion.accomplishments}
                      </div>
                      {item.completion.proofImages?.[0] && (
                        <button
                          onClick={() =>
                            setViewerEntry({
                              activityName: item.name,
                              date,
                              durationMinutes: item.completion.durationMinutes,
                              accomplishments: item.completion.accomplishments,
                              learnings: item.completion.learnings,
                              problemsSolved: item.completion.problemsSolved,
                              imageUrl: item.completion.proofImages[0].imageUrl,
                              caption: item.completion.proofImages[0].caption,
                            })
                          }
                          className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 mt-2 font-medium"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>View Verified Proof Image</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Bottom Footer Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[#D4AF37] font-bold">
                        <Flame className="w-3.5 h-3.5" /> {item.currentStreak}d streak
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isCompleted && !isRest && (
                        <>
                          <button
                            onClick={() =>
                              setActiveTimerActivity({
                                id: item.activityId,
                                name: item.name,
                                category: item.category,
                                targetMinutes: item.targetMinutes,
                                color: item.color,
                              })
                            }
                            disabled={isTimerRunning}
                            className="px-3 py-1.5 bg-[#121E17] hover:bg-[#182A20] text-slate-200 rounded-lg font-semibold flex items-center gap-1.5 border border-[#D4AF37]/20 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Start Timer</span>
                          </button>

                          <button
                            onClick={() => {
                              setCompleteModalActivity({
                                id: item.activityId,
                                name: item.name,
                                category: item.category,
                                targetMinutes: item.targetMinutes,
                                color: item.color,
                              })
                              setCompleteModalDuration(item.targetMinutes)
                            }}
                            className="btn-primary px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Log Proof</span>
                          </button>
                        </>
                      )}

                      {isCompleted && (
                        <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Logged ({item.completion?.durationMinutes}m)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* E. Recent Activity & Proof Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 dhanu-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-display text-white">Recent Learning Portfolio</h3>
                <p className="text-xs text-slate-400">Verified accomplishments with photographic proof</p>
              </div>
              <Link
                href="/journal"
                className="text-xs text-[#D4AF37] hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span>Full Journal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentCompletions.length > 0 ? (
                recentCompletions.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3.5 bg-[#070B08] border border-white/5 rounded-xl flex items-start gap-4"
                  >
                    {entry.proofImages?.[0] ? (
                      <button
                        onClick={() =>
                          setViewerEntry({
                            activityName: entry.activity?.name,
                            date: entry.date,
                            durationMinutes: entry.durationMinutes,
                            accomplishments: entry.accomplishments,
                            learnings: entry.learnings,
                            problemsSolved: entry.problemsSolved,
                            imageUrl: entry.proofImages[0].imageUrl,
                            caption: entry.proofImages[0].caption,
                          })
                        }
                        className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10 hover:border-[#D4AF37] transition-colors group relative"
                      >
                        <img
                          src={entry.proofImages[0].imageUrl}
                          alt="Proof"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </button>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                        <Camera className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-xs text-white">
                          {entry.activity?.name}
                        </span>
                        <span className="text-[10px] text-slate-400">• {entry.date}</span>
                        <span className="text-[10px] text-[#D4AF37] font-bold ml-auto">
                          {entry.durationMinutes}m logged
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-1">
                        {entry.accomplishments}
                      </p>
                      {entry.learnings && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 italic mt-0.5">
                          &quot;{entry.learnings}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-500">
                  No verified sessions logged yet today. Complete an activity above to start your portfolio.
                </div>
              )}
            </div>
          </div>

          {/* Quick Shortcuts & Milestones card */}
          <div className="space-y-4">
            <div className="dhanu-card p-5">
              <h3 className="text-base font-bold font-display text-white mb-2">
                Consistency Shortcuts
              </h3>
              <div className="space-y-2">
                <Link
                  href="/analytics"
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#070B08] hover:bg-white/5 border border-white/5 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-emerald-400" />
                    <span>Growth Analytics</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>

                <Link
                  href="/calendar"
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#070B08] hover:bg-white/5 border border-white/5 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
                    <span>Monthly Calendar</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>

                <Link
                  href="/streaks"
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#070B08] hover:bg-white/5 border border-white/5 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Streaks & 365-Day Heatmap</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>

                <Link
                  href="/reviews"
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#070B08] hover:bg-white/5 border border-white/5 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Weekly Reviews</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {completeModalActivity && (
        <CompletionModal
          isOpen={!!completeModalActivity}
          activity={completeModalActivity}
          initialDurationMinutes={completeModalDuration}
          onClose={() => setCompleteModalActivity(null)}
          onSuccess={() => {
            loadDashboardData()
          }}
        />
      )}

      {/* Recovery Modal */}
      {recoveryActivity && (
        <RecoveryModal
          isOpen={!!recoveryActivity}
          activity={{
            id: recoveryActivity.activityId,
            name: recoveryActivity.name,
            targetMinutes: recoveryActivity.targetMinutes,
            activeDays: '',
          }}
          date={date}
          onClose={() => setRecoveryActivity(null)}
          onSuccess={() => {
            loadDashboardData()
          }}
        />
      )}

      {/* Lightbox Proof Viewer */}
      <ProofViewerModal
        isOpen={!!viewerEntry}
        entry={viewerEntry}
        onClose={() => setViewerEntry(null)}
      />
    </AppShell>
  )
}
