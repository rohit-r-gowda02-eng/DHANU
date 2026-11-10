'use client'

import React, { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import {
  User,
  Mail,
  Clock,
  Briefcase,
  FileText,
  Moon,
  Sun,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>({
    bio: '',
    profession: '',
    dailyCommitmentMinutes: 120,
    targetWakeupTime: '06:30',
    targetSleepTime: '23:00',
    weeklyTargetHours: 14.0,
  })
  const [name, setName] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
        setName(data.user.name)
        setTimezone(data.user.timezone || 'UTC')
      }
      if (data.profile) {
        setProfile(data.profile)
      }
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMsg('')
    setErrorMsg('')

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          timezone,
          ...profile,
        }),
      })

      if (!res.ok) throw new Error('Failed to update profile')
      setSuccessMsg('Profile details updated successfully')
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">My Profile & Focus Rhythm</h1>
          <p className="text-xs text-slate-400">
            Define your daily commitments, profession, sleep schedule, and local timezone.
          </p>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity Card */}
          <div className="dhanu-card p-6 space-y-4">
            <h2 className="text-base font-bold font-display text-white">Identity & Profession</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Email (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-black/40 border border-white/5 rounded-lg p-2.5 text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Profession / Primary Pursuit
                </label>
                <input
                  type="text"
                  value={profile.profession || ''}
                  onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                  placeholder="e.g. Distributed Systems Engineer"
                  className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Local Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="e.g. Asia/Kolkata or America/New_York"
                  className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-300 mb-1 font-semibold">Personal Growth Bio</label>
              <textarea
                rows={3}
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Share your personal philosophy or current focus objectives..."
                className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Schedule & Targets Card */}
          <div className="dhanu-card p-6 space-y-4">
            <h2 className="text-base font-bold font-display text-white">
              Daily Target Commitment & Sleep Rhythm
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Daily Target (Mins)
                </label>
                <input
                  type="number"
                  min="30"
                  max="720"
                  value={profile.dailyCommitmentMinutes || 120}
                  onChange={(e) =>
                    setProfile({ ...profile, dailyCommitmentMinutes: Number(e.target.value) })
                  }
                  className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Weekly Target (Hours)
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  step="0.5"
                  value={profile.weeklyTargetHours || 14}
                  onChange={(e) =>
                    setProfile({ ...profile, weeklyTargetHours: Number(e.target.value) })
                  }
                  className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Target Wake Up
                </label>
                <input
                  type="time"
                  value={profile.targetWakeupTime || '06:30'}
                  onChange={(e) => setProfile({ ...profile, targetWakeupTime: e.target.value })}
                  className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Target Sleep Time
                </label>
                <input
                  type="time"
                  value={profile.targetSleepTime || '23:00'}
                  onChange={(e) => setProfile({ ...profile, targetSleepTime: e.target.value })}
                  className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-6 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-3d-btn"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-black" />
                  <span>Save Profile Updates</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
