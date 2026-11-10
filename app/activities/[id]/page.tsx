'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { CompletionModal } from '@/components/completions/CompletionModal'
import { ProofViewerModal } from '@/components/completions/ProofViewerModal'
import { ActivityTimer } from '@/components/completions/ActivityTimer'
import {
  ArrowLeft,
  Flame,
  Clock,
  Calendar,
  CheckCircle2,
  Camera,
  Award,
  BookOpen,
  Wrench,
  Play,
  Loader2,
} from 'lucide-react'

export default function ActivityDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [activityData, setActivityData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Modals
  const [completeModalOpen, setCompleteModalOpen] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [viewerEntry, setViewerEntry] = useState<any>(null)

  const loadActivity = async () => {
    try {
      const res = await fetch(`/api/activities/${id}`)
      if (!res.ok) throw new Error('Not found')
      const data = await res.json()
      setActivityData(data)
      setLoading(false)
    } catch {
      router.push('/routine')
    }
  }

  useEffect(() => {
    if (id) loadActivity()
  }, [id])

  if (loading || !activityData) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      </AppShell>
    )
  }

  const { activity, stats } = activityData

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          href="/routine"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Routine Schedule</span>
        </Link>

        {/* Hero Card */}
        <div className="dhanu-card p-6 border-[#D4AF37]/25 bg-gradient-to-r from-[#0D1510] to-[#121E17]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="w-4 h-16 rounded-lg shrink-0"
                style={{ backgroundColor: activity.color || '#D4AF37' }}
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold font-display text-white">{activity.name}</h1>
                  <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded bg-white/5 text-amber-200">
                    {activity.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-xl">
                  {activity.description || 'Dedicated daily focus activity'}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> Daily Target: {activity.targetMinutes}m
                  </span>
                  <span>•</span>
                  <span>Active Days: {activity.activeDays}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="px-4 py-2.5 bg-[#121E17] hover:bg-[#182A20] border border-[#D4AF37]/30 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>{timerRunning ? 'Timer Active' : 'Start Session'}</span>
              </button>

              <button
                onClick={() => setCompleteModalOpen(true)}
                className="btn-primary px-4 py-2.5 text-xs font-bold flex items-center gap-2"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Log Verified Proof</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Current Streak</div>
              <div className="text-xl font-bold font-display text-[#D4AF37] flex items-center gap-1.5 mt-0.5">
                <Flame className="w-4 h-4 fill-[#D4AF37]/20" />
                <span>{stats.currentStreak} Days</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Longest Streak</div>
              <div className="text-xl font-bold font-display text-white mt-0.5">
                {stats.longestStreak} Days
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Total Time Invested</div>
              <div className="text-xl font-bold font-display text-emerald-400 mt-0.5">
                {stats.totalHours} Hours
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Verified Sessions</div>
              <div className="text-xl font-bold font-display text-white mt-0.5">
                {stats.totalCompletedCount} Sessions
              </div>
            </div>
          </div>
        </div>

        {/* Live Timer if triggered */}
        {timerRunning && (
          <ActivityTimer
            targetMinutes={activity.targetMinutes}
            onFinish={(dur) => {
              setTimerRunning(false)
              setCompleteModalOpen(true)
            }}
            onCancel={() => setTimerRunning(false)}
          />
        )}

        {/* Historical Proof Submissions */}
        <div className="dhanu-card p-6">
          <h2 className="text-base font-bold font-display text-white mb-1">
            Verified Execution History
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            Every session saved with photographic proof, accomplishments, and learnings.
          </p>

          <div className="space-y-4">
            {activity.completions && activity.completions.length > 0 ? (
              activity.completions.map((comp: any) => (
                <div
                  key={comp.id}
                  className="p-4 bg-[#070B08] border border-white/5 rounded-xl flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {comp.proofImages?.[0] ? (
                      <button
                        onClick={() =>
                          setViewerEntry({
                            activityName: activity.name,
                            date: comp.date,
                            durationMinutes: comp.durationMinutes,
                            accomplishments: comp.accomplishments,
                            learnings: comp.learnings,
                            problemsSolved: comp.problemsSolved,
                            imageUrl: comp.proofImages[0].imageUrl,
                            caption: comp.proofImages[0].caption,
                          })
                        }
                        className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-white/10 hover:border-[#D4AF37] transition-colors group relative"
                      >
                        <img
                          src={comp.proofImages[0].imageUrl}
                          alt="Proof"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </button>
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                        <Camera className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{comp.date}</span>
                        <span className="text-[#D4AF37] font-semibold">• {comp.durationMinutes}m logged</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                          COMPLETED
                        </span>
                      </div>

                      {comp.accomplishments && (
                        <p className="text-slate-300">
                          <strong className="text-slate-200">Accomplished:</strong> {comp.accomplishments}
                        </p>
                      )}

                      {comp.learnings && (
                        <p className="text-slate-400 italic">
                          <strong className="text-slate-300">Learnings:</strong> {comp.learnings}
                        </p>
                      )}

                      {comp.problemsSolved && (
                        <p className="text-slate-400">
                          <strong className="text-slate-300">Solved:</strong> {comp.problemsSolved}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">
                No completion logs recorded yet. Start tracking to establish this activity streak.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {completeModalOpen && (
        <CompletionModal
          isOpen={completeModalOpen}
          activity={activity}
          initialDurationMinutes={activity.targetMinutes}
          onClose={() => setCompleteModalOpen(false)}
          onSuccess={() => loadActivity()}
        />
      )}

      {/* Proof Lightbox */}
      <ProofViewerModal
        isOpen={!!viewerEntry}
        entry={viewerEntry}
        onClose={() => setViewerEntry(null)}
      />
    </AppShell>
  )
}
