'use client'

import React, { useState, useRef } from 'react'
import {
  X,
  Camera,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Flame,
  Award,
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface CompletionModalProps {
  activity: {
    id: string
    name: string
    category: string
    targetMinutes: number
    color?: string
  }
  initialDurationMinutes?: number
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: any) => void
}

export function CompletionModal({
  activity,
  initialDurationMinutes = 60,
  isOpen,
  onClose,
  onSuccess,
}: CompletionModalProps) {
  const [durationMinutes, setDurationMinutes] = useState(initialDurationMinutes)
  const [accomplishments, setAccomplishments] = useState('')
  const [learnings, setLearnings] = useState('')
  const [problemsSolved, setProblemsSolved] = useState('')
  const [personalNotes, setPersonalNotes] = useState('')

  // Photographic Proof State
  const [proofImage, setProofImage] = useState<{
    imageUrl: string
    caption?: string
    fileSizeBytes?: number
    mimeType?: string
  } | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setErrorMessage('')
    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('photo', file)

      const res = await fetch('/api/completions/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload photo proof')
      }

      setProofImage({
        imageUrl: data.imageUrl,
        fileSizeBytes: data.fileSizeBytes,
        mimeType: data.mimeType,
      })
    } catch (err: any) {
      setErrorMessage(err.message || 'Image upload failed. Try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    // Validation
    if (!accomplishments.trim()) {
      setErrorMessage('Please describe what you accomplished today.')
      return
    }
    if (!learnings.trim()) {
      setErrorMessage('Please describe what you learned.')
      return
    }
    if (!problemsSolved.trim()) {
      setErrorMessage('Please describe problems you solved or challenges overcome.')
      return
    }
    if (!proofImage || !proofImage.imageUrl) {
      setErrorMessage('Photographic proof is mandatory. Upload an image to verify completion.')
      return
    }
    if (durationMinutes <= 0) {
      setErrorMessage('Please enter a valid time spent.')
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        activityId: activity.id,
        durationMinutes: Number(durationMinutes),
        accomplishments: accomplishments.trim(),
        learnings: learnings.trim(),
        problemsSolved: problemsSolved.trim(),
        personalNotes: personalNotes.trim() || undefined,
        status: 'COMPLETED',
        proofImages: [proofImage],
      }

      const res = await fetch('/api/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error || 'Failed to record completion')
      }

      // Celebratory Gold & Emerald Confetti
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#10B981', '#F59E0B', '#34D399', '#E5C07B'],
      })

      onSuccess(result)
      onClose()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit completion')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0D1510] border border-[#D4AF37]/30 rounded-2xl shadow-3d-card my-8 overflow-hidden text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121E17]">
          <div className="flex items-center gap-3">
            <div
              className="w-3.5 h-8 rounded-full"
              style={{ backgroundColor: activity.color || '#D4AF37' }}
            />
            <div>
              <h2 className="text-lg font-bold font-display tracking-tight text-white">
                Verify Completion — {activity.name}
              </h2>
              <p className="text-xs text-slate-400">
                Target: {activity.targetMinutes}m • &quot;Prove it through your daily actions&quot;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-500/40 rounded-lg text-xs text-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Duration Tracker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-1.5">
              Actual Time Spent (Minutes) *
            </label>
            <div className="relative flex items-center">
              <Clock className="w-4 h-4 text-[#D4AF37] absolute left-3.5" />
              <input
                type="number"
                min="1"
                max="1440"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-[#0A100C] border border-white/10 focus:border-[#D4AF37] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                required
              />
              <span className="absolute right-3 text-xs text-slate-400">
                ({(durationMinutes / 60).toFixed(1)} hours)
              </span>
            </div>
          </div>

          {/* 1. What did you accomplish? */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              1. What did you accomplish today? *
            </label>
            <textarea
              rows={2}
              value={accomplishments}
              onChange={(e) => setAccomplishments(e.target.value)}
              placeholder="e.g. Solved 3 medium problems on Graphs, implemented Dijkstra algorithm..."
              className="w-full bg-[#0A100C] border border-white/10 focus:border-[#D4AF37] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* 2. What did you learn today? */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              2. What did you learn today? *
            </label>
            <textarea
              rows={2}
              value={learnings}
              onChange={(e) => setLearnings(e.target.value)}
              placeholder="e.g. Discovered how adjacency lists optimize memory over matrices for sparse graphs..."
              className="w-full bg-[#0A100C] border border-white/10 focus:border-[#D4AF37] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* 3. What problems did you solve? */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              3. What problems did you solve or friction overcome? *
            </label>
            <textarea
              rows={2}
              value={problemsSolved}
              onChange={(e) => setProblemsSolved(e.target.value)}
              placeholder="e.g. Debugged an infinite recursion loop caused by missing visited set check..."
              className="w-full bg-[#0A100C] border border-white/10 focus:border-[#D4AF37] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* 4. Photographic Evidence Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Photographic Proof of Work *
              </label>
              <span className="text-[11px] text-[#D4AF37] font-semibold">Mandatory verification</span>
            </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
            <input
              type="file"
              ref={galleryInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />

            {proofImage ? (
              <div className="relative rounded-xl overflow-hidden border border-[#D4AF37]/35 bg-[#0A100C] p-3 flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-black/50 border border-white/10">
                  <img
                    src={proofImage.imageUrl}
                    alt="Proof evidence"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Evidence Attached</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Optional caption (e.g. IDE screenshot, workout summary)..."
                    value={proofImage.caption || ''}
                    onChange={(e) =>
                      setProofImage({ ...proofImage, caption: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="p-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded flex items-center gap-1 transition-colors"
                    title="Replace image"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProofImage(null)}
                    className="p-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/50 rounded flex items-center gap-1 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-4 border border-dashed border-[#D4AF37]/30 hover:border-[#D4AF37]/70 bg-[#0A100C] hover:bg-[#121E17] rounded-xl transition-all text-center group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-950/50 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black flex items-center justify-center mb-2 transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-white">Capture Camera</span>
                  <span className="text-[11px] text-slate-400">Mobile camera photo</span>
                </button>

                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-4 border border-dashed border-white/15 hover:border-[#D4AF37]/70 bg-[#0A100C] hover:bg-[#121E17] rounded-xl transition-all text-center group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 text-slate-300 group-hover:bg-[#D4AF37] group-hover:text-black flex items-center justify-center mb-2 transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-white">Upload Gallery</span>
                  <span className="text-[11px] text-slate-400">Screenshot or file</span>
                </button>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="btn-primary px-6 py-2.5 text-sm font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying & Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Verified Proof</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
