'use client'

import React, { useState } from 'react'

interface ContributionDay {
  date: string
  count: number
  minutes: number
  level: number
}

interface ContributionCalendarProps {
  days: ContributionDay[]
  totalActiveDays?: number
  longestStreak?: number
}

export function ContributionCalendar({
  days,
  totalActiveDays = 0,
  longestStreak = 0,
}: ContributionCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null)

  // Group days into 53 columns (weeks) of 7 days
  const weeks: ContributionDay[][] = []
  let currentWeek: ContributionDay[] = []

  days.forEach((day, index) => {
    currentWeek.push(day)
    if (currentWeek.length === 7 || index === days.length - 1) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  const getColorClass = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-[#14291B] border-[#1B3A26]'
      case 2:
        return 'bg-[#065F46] border-[#047857]'
      case 3:
        return 'bg-[#10B981] border-[#34D399] shadow-[0_0_6px_rgba(16,185,129,0.4)]'
      case 4:
        return 'bg-[#D4AF37] border-[#F3E5AB] shadow-[0_0_8px_rgba(212,175,55,0.6)]'
      default:
        return 'bg-[#0A100C] border-white/5 hover:border-[#D4AF37]/30'
    }
  }

  return (
    <div className="bg-[#0D1510] border border-[#D4AF37]/20 rounded-2xl p-5 shadow-3d-card text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold font-display text-white">
            Daily Consistency & Proof Grid
          </h3>
          <p className="text-xs text-slate-400">
            {totalActiveDays} verified active days across the past 365 calendar days
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Longest Streak:</span>
            <span className="font-bold text-[#D4AF37]">{longestStreak} days</span>
          </div>

          {/* Shading Legend */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 mr-1">Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-[#0A100C] border border-white/5" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#14291B] border border-[#1B3A26]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#065F46] border border-[#047857]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#10B981] border border-[#34D399]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#D4AF37] border border-[#F3E5AB]" />
            <span className="text-[10px] text-slate-400 ml-1">More</span>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1 min-w-max p-1">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-3 h-3 rounded-[3px] border transition-colors cursor-pointer ${getColorClass(
                    day.level
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hover Tooltip display */}
      <div className="h-6 text-xs text-slate-300 mt-2 flex items-center justify-between border-t border-white/5 pt-2">
        {hoveredDay ? (
          <div>
            <span className="font-semibold text-[#D4AF37]">{hoveredDay.date}</span>: {hoveredDay.count}{' '}
            {hoveredDay.count === 1 ? 'activity' : 'activities'} completed ({hoveredDay.minutes}{' '}
            minutes)
          </div>
        ) : (
          <div className="text-slate-500 italic">Hover over any day to inspect verified proof</div>
        )}
      </div>
    </div>
  )
}
