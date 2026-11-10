'use client'

import React from 'react'
import { X, Calendar, Clock, Award, BookOpen, Wrench } from 'lucide-react'

interface ProofViewerModalProps {
  isOpen: boolean
  onClose: () => void
  entry: {
    activityName: string
    date: string
    durationMinutes: number
    accomplishments?: string | null
    learnings?: string | null
    problemsSolved?: string | null
    imageUrl: string
    caption?: string | null
  } | null
}

export function ProofViewerModal({ isOpen, onClose, entry }: ProofViewerModalProps) {
  if (!isOpen || !entry) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#0D1510] border border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 text-slate-300 hover:text-white bg-black/70 rounded-full hover:bg-black/90 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Photographic Evidence Image Side */}
        <div className="md:w-1/2 bg-black flex items-center justify-center overflow-hidden min-h-[260px] md:min-h-full">
          <img
            src={entry.imageUrl}
            alt="Photographic evidence"
            className="w-full h-full object-contain max-h-[70vh]"
          />
        </div>

        {/* Metadata & Journal Side */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                Verified Proof
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{entry.date}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold font-display text-white mb-1">
              {entry.activityName}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{entry.durationMinutes} minutes ({(entry.durationMinutes / 60).toFixed(1)} hrs)</span>
            </div>

            {entry.caption && (
              <p className="text-xs text-slate-300 italic bg-white/5 p-2.5 rounded-lg border border-white/5 mb-4">
                &quot;{entry.caption}&quot;
              </p>
            )}

            <div className="space-y-3.5 text-xs">
              {entry.accomplishments && (
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-[#D4AF37] mb-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Accomplished</span>
                  </div>
                  <p className="text-slate-300 bg-[#070B08] p-2.5 rounded-lg border border-white/5 leading-relaxed">
                    {entry.accomplishments}
                  </p>
                </div>
              )}

              {entry.learnings && (
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Key Learning</span>
                  </div>
                  <p className="text-slate-300 bg-[#070B08] p-2.5 rounded-lg border border-white/5 leading-relaxed">
                    {entry.learnings}
                  </p>
                </div>
              )}

              {entry.problemsSolved && (
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-1">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Problems Solved</span>
                  </div>
                  <p className="text-slate-300 bg-[#070B08] p-2.5 rounded-lg border border-white/5 leading-relaxed">
                    {entry.problemsSolved}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-white/10 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
