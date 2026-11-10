'use client'

import React from 'react'
import Link from 'next/link'
import { DhanuLogo } from '@/components/brand/DhanuLogo'
import {
  ShieldCheck,
  Flame,
  Camera,
  BarChart3,
  CheckCircle2,
  Bell,
  Smartphone,
  ArrowRight,
  Target,
  Clock,
  Layers,
  Lock,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070B08] text-slate-100 selection:bg-amber-400 selection:text-black">
      {/* Top Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-[#D4AF37]/15">
        <DhanuLogo size="md" showTagline={false} />

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="btn-primary px-4 py-2 text-xs font-bold shadow-3d-btn"
          >
            Create Your Routine
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1510] border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-bold tracking-wide uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>Consistency creates progress</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white leading-tight mb-6">
            Don&apos;t just plan your growth.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#D4AF37] to-amber-200">
              Prove it through daily actions.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            DHANU is a personal accountability platform that converts ambitious aspirations into
            measurable routines with verifiable photographic proof, dual-streak tracking, and smart
            inactivity reminders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
            <Link
              href="/signup"
              className="btn-primary w-full sm:w-auto px-7 py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-3d-btn"
            >
              <span>Build Your Daily Routine</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="btn-secondary w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-center"
            >
              Access Your Dashboard
            </Link>
          </div>
        </div>

        {/* 3D Dashboard Preview Mockup Panel in Dark Green & Gold */}
        <div className="relative mx-auto max-w-5xl rounded-2xl border border-[#D4AF37]/25 bg-[#0D1510] p-4 sm:p-6 shadow-3d-card overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-slate-400">dhanu.growth / app / live</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[#D4AF37] font-bold">
                <Flame className="w-3.5 h-3.5 fill-[#D4AF37]/20" /> 14-DAY STREAK
              </span>
              <span className="hidden sm:inline text-emerald-400 font-semibold">4 OF 4 COMPLETED (100%)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#070B08] border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">DSA Practice</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                  COMPLETED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">120m target • Solved 3 Graph BFS problems</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Photo Proof Verified
                </span>
                <span className="text-[#D4AF37] font-bold">14d streak</span>
              </div>
            </div>

            <div className="bg-[#070B08] border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">Project Development</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                  COMPLETED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">90m target • Distributed queue integration</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Photo Proof Verified
                </span>
                <span className="text-[#D4AF37] font-bold">12d streak</span>
              </div>
            </div>

            <div className="bg-[#070B08] border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">Technical Reading</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                  COMPLETED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">30m target • Raft consensus paper chapter 4</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Photo Proof Verified
                </span>
                <span className="text-[#D4AF37] font-bold">10d streak</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Manifesto Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#D4AF37]/15 bg-[#0D1510]/60">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-[#D4AF37] flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mb-4">
            The DHANU Philosophy
          </h2>
          <blockquote className="text-xl sm:text-2xl text-slate-200 font-medium italic mb-6 leading-snug">
            &quot;Don&apos;t just plan your growth. Prove it through your daily actions.&quot;
          </blockquote>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Traditional habit apps are passive check-boxes that encourage self-deception. DHANU is an
            accountability engine. Completion requires real, verified photographic proof, documented
            learnings, and honest time accounting. If you miss a commitment, you reflect and adjust—without
            excuses and without shame.
          </p>
        </div>
      </section>

      {/* Core Architectural Pillars in Dark Forest & Gold */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold font-display text-white mb-3">
            Engineered for Unbroken Follow-Through
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Six disciplined systems working together to build a person who consistently follows through.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="dhanu-card p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 text-[#D4AF37] flex items-center justify-center mb-4 border border-[#D4AF37]/30">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-display">
              Mandatory Photographic Proof
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every completed session demands verified visual evidence—IDE code snapshots, handwritten
              derivations, or gym timers. No fabricated completion without evidence.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="dhanu-card p-6">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-[#D4AF37] flex items-center justify-center mb-4 border border-[#D4AF37]/30">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-display">
              Dual Streak Engine
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Independent streaks for overall daily check-ins and for each individual activity. Rest days
              protect your streaks; unverified misses break them.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="dhanu-card p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-display">
              4-Hour Inactivity Alerts
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              If you remain inactive for 4 hours during wake hours, DHANU reminds you before the day slips
              away. Respects quiet sleep hours automatically.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="dhanu-card p-6">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-[#D4AF37] flex items-center justify-center mb-4 border border-[#D4AF37]/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-display">
              Growth Analytics & Grid
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              GitHub-style 365-day contribution heatmaps, weekly hour trends, and period-over-period
              comparisons computed strictly from verified completion logs.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="dhanu-card p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-display">
              Long-term Goal Projection
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define 60-day or 90-day targets (e.g. 300 DSA problems). Track live velocity and predicted
              completion date based on real daily cadence.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="dhanu-card p-6">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-[#D4AF37] flex items-center justify-center mb-4 border border-[#D4AF37]/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-display">
              Mobile PWA Installation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Installs directly to iOS and Android home screens without app store downloads. Full
              standalone experience, camera support, and offline caching.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#D4AF37]/15 bg-gradient-to-b from-[#070B08] to-[#0D1510]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold font-display text-white mb-4">
            Start Your Routine Today
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            Create your account, configure your daily commitments, and prove your dedication.
          </p>
          <Link
            href="/signup"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold shadow-3d-btn"
          >
            <span>Begin DHANU Setup</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D4AF37]/15 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <DhanuLogo size="sm" showText={true} />
          <span className="text-slate-600">|</span>
          <span>Consistency creates progress</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-amber-200 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-amber-200 transition-colors">
            Terms & Conditions
          </Link>
        </div>
      </footer>
    </div>
  )
}
