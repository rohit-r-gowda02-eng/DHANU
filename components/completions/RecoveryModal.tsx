'use client'

import React, { useState } from 'react'
import { X, HeartHandshake, CheckCircle2, Loader2 } from 'lucide-react'

interface RecoveryModalProps {
  activity: {
    id: string
    name: string
    targetMinutes: number
    activeDays: string
  }
  date: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function RecoveryModal({ activity, date, isOpen, onClose, onSuccess }: RecoveryModalProps) {
  const [reason, setReason] = useState('')
  const [adjustTarget, setAdjustTarget] = useState(false)
  const [newTargetMinutes, setNewTargetMinutes] = useState(activity.targetMinutes)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError('Please provide a reason. Honest reflection turns setbacks into lessons.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/completions/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: activity.id,
          date,
          missedReason: reason.trim(),
          adjustTargetMinutes: adjustTarget ? newTargetMinutes : undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit recovery log')
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Recovery failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0D1510] border border-[#D4AF37]/30 rounded-2xl shadow-3d-card text-white p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#D4AF37] flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-white">
              Recovery Log — {activity.name}
            </h3>
            <p className="text-xs text-slate-400">Accountability without shame • {date}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg text-xs text-red-200 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              What caused this session to be missed? *
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Unexpected production fire drill at work, fatigue, or schedule conflict..."
              className="w-full bg-[#070B08] border border-white/10 rounded-lg p-3 text-white placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
              required
            />
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={adjustTarget}
                onChange={(e) => setAdjustTarget(e.target.checked)}
                className="rounded bg-[#070B08] border-white/20 text-[#D4AF37] focus:ring-0"
              />
              <span className="font-semibold text-white">Adjust target duration to reduce friction?</span>
            </label>

            {adjustTarget && (
              <div className="mt-2 pl-6">
                <label className="block text-slate-400 mb-1">New Daily Target (Minutes):</label>
                <input
                  type="number"
                  min="10"
                  max="480"
                  value={newTargetMinutes}
                  onChange={(e) => setNewTargetMinutes(Number(e.target.value))}
                  className="w-32 bg-[#070B08] border border-white/10 rounded px-2.5 py-1 text-white focus:outline-none"
                />
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed italic">
            &quot;Consistency is not the absence of failure; it is the discipline of returning immediately without self-deception.&quot;
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-5 py-2 font-bold rounded-lg flex items-center gap-1.5"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>Record Honest Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
