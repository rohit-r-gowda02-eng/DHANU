'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import {
  Plus,
  Clock,
  Calendar,
  Pause,
  Play,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  Loader2,
  Flame,
  ArrowUpDown,
} from 'lucide-react'

export default function RoutinePage() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [newActivityOpen, setNewActivityOpen] = useState(false)
  const [newForm, setNewForm] = useState({
    name: '',
    category: 'Engineering',
    description: '',
    targetMinutes: 60,
    preferredTime: '09:00',
    activeDays: 'MON,TUE,WED,THU,FRI',
    color: '#D4AF37',
  })

  const loadActivities = async () => {
    try {
      const res = await fetch('/api/activities')
      const data = await res.json()
      if (data.activities) setActivities(data.activities)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [])

  const handleTogglePause = async (activity: any) => {
    try {
      const res = await fetch(`/api/activities/${activity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaused: !activity.isPaused }),
      })
      if (res.ok) {
        loadActivities()
      }
    } catch {}
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity? Historical logs will be removed.'))
      return
    try {
      const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadActivities()
      }
    } catch {}
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    try {
      const res = await fetch(`/api/activities/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (res.ok) {
        setEditingId(null)
        loadActivities()
      }
    } catch {}
  }

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newForm.name.trim()) return

    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm),
      })

      if (res.ok) {
        setNewActivityOpen(false)
        setNewForm({
          name: '',
          category: 'Engineering',
          description: '',
          targetMinutes: 60,
          preferredTime: '09:00',
          activeDays: 'MON,TUE,WED,THU,FRI',
          color: '#D4AF37',
        })
        loadActivities()
      }
    } catch {}
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Daily Routine & Schedule</h1>
            <p className="text-xs text-slate-400">
              Manage activities, active day frequencies, target durations, and pause states.
            </p>
          </div>

          <button
            onClick={() => setNewActivityOpen(true)}
            className="btn-primary px-4 py-2 text-xs font-bold flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Routine Activity</span>
          </button>
        </div>

        {/* New Activity Drawer/Card */}
        {newActivityOpen && (
          <div className="dhanu-card p-6 border-[#D4AF37]/35">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-display text-[#D4AF37]">
                Add New Routine Activity
              </h3>
              <button
                onClick={() => setNewActivityOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Activity Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newForm.name}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    placeholder="e.g. System Design Practice"
                    className="w-full bg-[#070B08] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={newForm.category}
                    onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                    placeholder="e.g. Architecture"
                    className="w-full bg-[#070B08] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Daily Target (Minutes)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="480"
                    value={newForm.targetMinutes}
                    onChange={(e) =>
                      setNewForm({ ...newForm, targetMinutes: Number(e.target.value) })
                    }
                    className="w-full bg-[#070B08] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    value={newForm.preferredTime}
                    onChange={(e) => setNewForm({ ...newForm, preferredTime: e.target.value })}
                    className="w-full bg-[#070B08] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Color</label>
                  <input
                    type="color"
                    value={newForm.color}
                    onChange={(e) => setNewForm({ ...newForm, color: e.target.value })}
                    className="w-full h-9 bg-[#070B08] border border-white/10 rounded-lg p-1 text-xs text-white cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Active Days (Comma separated: MON,TUE,WED,THU,FRI,SAT,SUN)
                </label>
                <input
                  type="text"
                  value={newForm.activeDays}
                  onChange={(e) => setNewForm({ ...newForm, activeDays: e.target.value })}
                  className="w-full bg-[#070B08] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewActivityOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-5 py-2 text-xs font-bold">
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activities List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((act) => {
              const isEditing = editingId === act.id

              if (isEditing) {
                return (
                  <div key={act.id} className="dhanu-card p-5 border-[#D4AF37]/35 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Name</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full bg-[#070B08] border border-white/10 rounded p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Category</label>
                        <input
                          type="text"
                          value={editForm.category}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="w-full bg-[#070B08] border border-white/10 rounded p-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Target (Minutes)</label>
                        <input
                          type="number"
                          value={editForm.targetMinutes}
                          onChange={(e) =>
                            setEditForm({ ...editForm, targetMinutes: Number(e.target.value) })
                          }
                          className="w-full bg-[#070B08] border border-white/10 rounded p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Active Days</label>
                        <input
                          type="text"
                          value={editForm.activeDays}
                          onChange={(e) =>
                            setEditForm({ ...editForm, activeDays: e.target.value })
                          }
                          className="w-full bg-[#070B08] border border-white/10 rounded p-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="btn-primary px-4 py-1.5 text-xs font-bold"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={act.id}
                  className={`dhanu-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    act.isPaused ? 'opacity-60 bg-[#070B08]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-12 rounded-md shrink-0"
                      style={{ backgroundColor: act.color }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/activities/${act.id}`}
                          className="font-bold text-sm text-white hover:text-[#D4AF37] transition-colors"
                        >
                          {act.name}
                        </Link>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400">
                          {act.category}
                        </span>
                        {act.isPaused && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                            PAUSED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" /> {act.targetMinutes}m target
                        </span>
                        <span>•</span>
                        <span>Pref: {act.preferredTime}</span>
                        <span>•</span>
                        <span className="text-[#D4AF37] font-bold flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" /> {act.currentStreak}d streak
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
                    {/* Pause / Resume Button */}
                    <button
                      onClick={() => handleTogglePause(act)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                      title={act.isPaused ? 'Resume streak tracking' : 'Pause streak tracking'}
                    >
                      {act.isPaused ? (
                        <>
                          <Play className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Resume</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Pause</span>
                        </>
                      )}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        setEditingId(act.id)
                        setEditForm({
                          name: act.name,
                          category: act.category,
                          targetMinutes: act.targetMinutes,
                          preferredTime: act.preferredTime,
                          activeDays: act.activeDays,
                        })
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Edit activity"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(act.id)}
                      className="p-1.5 rounded-lg bg-red-950/20 hover:bg-red-950/50 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
