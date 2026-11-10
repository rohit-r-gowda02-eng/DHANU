'use client'

import React, { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { ProofViewerModal } from '@/components/completions/ProofViewerModal'
import {
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  Camera,
  Award,
  BookOpen,
  Wrench,
  Edit2,
  Check,
  X,
  Loader2,
} from 'lucide-react'

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedActivityId, setSelectedActivityId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Edit entry state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    accomplishments: '',
    learnings: '',
    problemsSolved: '',
    personalNotes: '',
  })

  // Lightbox
  const [viewerEntry, setViewerEntry] = useState<any>(null)

  const fetchJournalEntries = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (selectedActivityId) params.set('activityId', selectedActivityId)
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)

      const res = await fetch(`/api/journal?${params.toString()}`)
      const data = await res.json()
      if (data.entries) setEntries(data.entries)
      if (data.activities) setActivities(data.activities)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJournalEntries()
  }, [selectedActivityId, startDate, endDate])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJournalEntries()
  }

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch('/api/journal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm }),
      })
      if (res.ok) {
        setEditingId(null)
        fetchJournalEntries()
      }
    } catch {}
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header & Export CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">
              Personal Learning Portfolio
            </h1>
            <p className="text-xs text-slate-400">
              Verified record of accomplishments, insights, and problems solved.
            </p>
          </div>

          <a
            href="/api/account/export?format=csv"
            download
            className="btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Journal (CSV)</span>
          </a>
        </div>

        {/* Filter & Search Bar */}
        <div className="dhanu-card p-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search accomplishments, concepts learned, or problems solved..."
                className="w-full bg-[#070B08] border border-white/10 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <button type="submit" className="btn-primary px-4 py-2.5 text-xs font-bold">
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filters:</span>
            </div>

            {/* Activity Select */}
            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className="bg-[#070B08] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">All Activities</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.category})
                </option>
              ))}
            </select>

            {/* Start Date */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#070B08] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
            />

            <span className="text-slate-500">to</span>

            {/* End Date */}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#070B08] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
            />

            {(searchQuery || selectedActivityId || startDate || endDate) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedActivityId('')
                  setStartDate('')
                  setEndDate('')
                }}
                className="text-xs text-[#D4AF37] hover:underline ml-auto"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Entries List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
          </div>
        ) : entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => {
              const isEditing = editingId === entry.id

              return (
                <div key={entry.id} className="dhanu-card p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/5 gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.activity?.color || '#D4AF37' }}
                      />
                      <span className="font-bold text-sm text-white">{entry.activity?.name}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400">
                        {entry.activity?.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{entry.date}</span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-[#D4AF37]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{entry.durationMinutes} mins</span>
                      </span>

                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingId(entry.id)
                            setEditForm({
                              accomplishments: entry.accomplishments || '',
                              learnings: entry.learnings || '',
                              problemsSolved: entry.problemsSolved || '',
                              personalNotes: entry.personalNotes || '',
                            })
                          }}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                          title="Edit permitted entry notes"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 pt-2 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Accomplishments</label>
                        <textarea
                          rows={2}
                          value={editForm.accomplishments}
                          onChange={(e) =>
                            setEditForm({ ...editForm, accomplishments: e.target.value })
                          }
                          className="w-full bg-[#070B08] border border-white/10 rounded p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Learnings</label>
                        <textarea
                          rows={2}
                          value={editForm.learnings}
                          onChange={(e) => setEditForm({ ...editForm, learnings: e.target.value })}
                          className="w-full bg-[#070B08] border border-white/10 rounded p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Problems Solved</label>
                        <textarea
                          rows={2}
                          value={editForm.problemsSolved}
                          onChange={(e) =>
                            setEditForm({ ...editForm, problemsSolved: e.target.value })
                          }
                          className="w-full bg-[#070B08] border border-white/10 rounded p-2 text-white"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(entry.id)}
                          className="btn-primary px-4 py-1.5 font-bold"
                        >
                          Save Updates
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Accomplishments */}
                      <div className="bg-[#070B08] p-3 rounded-xl border border-white/5 space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-[#D4AF37]">
                          <Award className="w-3.5 h-3.5" />
                          <span>Accomplished</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{entry.accomplishments}</p>
                      </div>

                      {/* Learnings */}
                      <div className="bg-[#070B08] p-3 rounded-xl border border-white/5 space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Key Insight</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed italic">
                          &quot;{entry.learnings}&quot;
                        </p>
                      </div>

                      {/* Problems Solved */}
                      <div className="bg-[#070B08] p-3 rounded-xl border border-white/5 space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Problem Overcome</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{entry.problemsSolved}</p>
                      </div>
                    </div>
                  )}

                  {/* Photo Proof Thumbnail & Lightbox trigger */}
                  {entry.proofImages && entry.proofImages.length > 0 && (
                    <div className="pt-2 flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Visual Proof:</span>
                      </span>
                      {entry.proofImages.map((img: any) => (
                        <button
                          key={img.id}
                          onClick={() =>
                            setViewerEntry({
                              activityName: entry.activity?.name,
                              date: entry.date,
                              durationMinutes: entry.durationMinutes,
                              accomplishments: entry.accomplishments,
                              learnings: entry.learnings,
                              problemsSolved: entry.problemsSolved,
                              imageUrl: img.imageUrl,
                              caption: img.caption,
                            })
                          }
                          className="flex items-center gap-2 px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-xs text-slate-300 hover:text-white transition-colors"
                        >
                          <img
                            src={img.imageUrl}
                            alt="thumbnail"
                            className="w-4 h-4 rounded object-cover"
                          />
                          <span>View Proof Snapshot</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-xs text-slate-400 dhanu-card p-8">
            No entries matching your filter criteria. Complete your daily routine sessions to grow
            your portfolio.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <ProofViewerModal
        isOpen={!!viewerEntry}
        entry={viewerEntry}
        onClose={() => setViewerEntry(null)}
      />
    </AppShell>
  )
}
