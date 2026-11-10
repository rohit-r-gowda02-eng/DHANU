'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import {
  Settings,
  Bell,
  Clock,
  Moon,
  Download,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<any>({
    inactivityReminderEnabled: true,
    inactivityIntervalHours: 4,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    pushNotificationsEnabled: false,
    soundEnabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Account deletion modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.settings) setSettings(data.settings)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMsg('')
    setErrorMsg('')

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Failed to update settings')
      setSuccessMsg('Settings updated successfully')
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return
    setDeleting(true)
    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' })
      if (res.ok) {
        router.push('/')
      }
    } catch {
      setDeleting(false)
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
          <h1 className="text-2xl font-bold font-display text-white">
            Platform Settings & Data Sovereignty
          </h1>
          <p className="text-xs text-slate-400">
            Configure inactivity thresholds, quiet hours, data backups, and account controls.
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

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Notification & Inactivity Settings */}
          <div className="dhanu-card p-6 space-y-4">
            <h2 className="text-base font-bold font-display text-white">
              Inactivity Reminders & Quiet Hours
            </h2>

            <div className="space-y-4 text-xs">
              <label className="flex items-center justify-between p-3 bg-[#0B130E] rounded-xl border border-white/5 cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">
                    Inactivity Reminder Engine
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Alerts you if no check-in occurs after the specified interval.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.inactivityReminderEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, inactivityReminderEnabled: e.target.checked })
                  }
                  className="rounded bg-[#0B130E] border-white/20 text-amber-500 focus:ring-0 w-4 h-4"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    Inactivity Interval (Hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={settings.inactivityIntervalHours}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        inactivityIntervalHours: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    Quiet Hours Start (Sleep)
                  </label>
                  <input
                    type="time"
                    value={settings.quietHoursStart}
                    onChange={(e) =>
                      setSettings({ ...settings, quietHoursStart: e.target.value })
                    }
                    className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    Quiet Hours End (Wake)
                  </label>
                  <input
                    type="time"
                    value={settings.quietHoursEnd}
                    onChange={(e) => setSettings({ ...settings, quietHoursEnd: e.target.value })}
                    className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
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
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-black" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Data Export & Backup Section */}
        <div className="dhanu-card p-6 space-y-4">
          <h2 className="text-base font-bold font-display text-white">
            Data Sovereignty & Backups
          </h2>
          <p className="text-xs text-slate-400">
            You own all your personal data. Export your entire consistency history, routines, and
            proof archives at any time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="/api/account/export?format=json"
              download
              className="btn-secondary px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export Full Account Data (JSON)</span>
            </a>

            <a
              href="/api/account/export?format=csv"
              download
              className="btn-secondary px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Learning Journal (CSV)</span>
            </a>
          </div>
        </div>

        {/* Danger Zone: Account Deletion */}
        <div className="dhanu-card p-6 border-red-500/20 bg-red-950/10 space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-base font-bold font-display">Danger Zone</h2>
          </div>
          <p className="text-xs text-slate-300">
            Permanently delete your account, routines, completions, and all uploaded proof images.
            This action cannot be undone.
          </p>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account Permanently</span>
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="bg-[#0D1510] border border-red-500/40 rounded-2xl p-6 max-w-md w-full text-white shadow-2xl">
              <h3 className="text-lg font-bold font-display text-red-400 mb-2">
                Confirm Account Deletion
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                This will irreversibly erase your user profile, streaks, milestones, daily records,
                and photographic proofs from the database.
              </p>
              <p className="text-xs text-slate-400 mb-2">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-[#0B130E] border border-white/10 rounded-lg p-2.5 text-xs text-white mb-4 focus:outline-none focus:border-red-500"
              />

              <div className="flex justify-end gap-2 text-xs font-semibold">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  disabled={deleteConfirmText !== 'DELETE' || deleting}
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white rounded-lg transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Permanently Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
