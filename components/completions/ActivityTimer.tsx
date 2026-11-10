'use client'

import React, { useState, useEffect } from 'react'
import { Play, Pause, Square, RotateCcw, Clock } from 'lucide-react'

interface ActivityTimerProps {
  targetMinutes: number
  onFinish: (durationMinutes: number) => void
  onCancel?: () => void
}

export function ActivityTimer({ targetMinutes, onFinish, onCancel }: ActivityTimerProps) {
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    } else if (!isActive && seconds !== 0 && interval) {
      clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, seconds])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hours > 0 ? `${hours}:` : ''}${minutes < 10 && hours > 0 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }

  const elapsedMinutes = Math.max(1, Math.round(seconds / 60))
  const progressPercent = Math.min(100, Math.round((elapsedMinutes / targetMinutes) * 100))

  return (
    <div className="bg-[#0D1510] border border-[#D4AF37]/35 rounded-xl p-4 shadow-3d-card text-white flex flex-col items-center">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-2">
        <Clock className="w-3.5 h-3.5" />
        <span>Live Session Tracker</span>
      </div>

      <div className="font-mono text-3xl font-extrabold tracking-tight text-white my-1">
        {formatTime(seconds)}
      </div>

      {/* Target Progress Bar in Emerald to Gold */}
      <div className="w-full max-w-xs bg-black/50 rounded-full h-1.5 my-3 overflow-hidden border border-white/5">
        <div
          className="bg-gradient-to-r from-emerald-500 to-[#D4AF37] h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="text-[11px] text-slate-400 mb-4">
        {elapsedMinutes}m of {targetMinutes}m target ({progressPercent}%)
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isActive
              ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 hover:bg-amber-900/40'
              : 'btn-emerald text-white'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Resume</span>
            </>
          )}
        </button>

        <button
          onClick={() => setSeconds(0)}
          className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          title="Reset timer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onFinish(elapsedMinutes)}
          className="btn-primary px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>Finish & Log Proof</span>
        </button>

        {onCancel && (
          <button
            onClick={onCancel}
            className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
