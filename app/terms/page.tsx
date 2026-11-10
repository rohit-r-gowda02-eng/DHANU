import React from 'react'
import Link from 'next/link'
import { DhanuLogo } from '@/components/brand/DhanuLogo'
import { ArrowLeft, Scale, Award, ShieldCheck, AlertCircle } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#070B08] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <DhanuLogo size="sm" showTagline={false} />
          </Link>
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Terms of Service
          </span>
          <h1 className="text-3xl font-extrabold font-display text-white mt-1 mb-3">
            DHANU Terms and Conditions
          </h1>
          <p className="text-xs text-slate-400">Effective Date: November 2026</p>
        </div>

        <div className="dhanu-card p-6 space-y-6 text-xs text-slate-300 leading-relaxed border-emerald-500/15">
          <section className="space-y-2">
            <h2 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>1. Agreement to Terms</span>
            </h2>
            <p>
              By creating an account or accessing the DHANU platform, you agree to these Terms. DHANU
              is an accountability system designed to convert personal intentions into measurable,
              verifiable daily actions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>2. Integrity & Photographic Proof Standard</span>
            </h2>
            <p>
              The foundational philosophy of DHANU is: &quot;Don&apos;t just plan your growth. Prove it
              through your daily actions.&quot;
            </p>
            <p className="text-slate-400">
              Users commit to providing honest representations of their work. Submitting fabricated,
              misleading, or stolen evidence defeats the intrinsic purpose of self-accountability.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>3. Account Security & Multi-Tenant Data Isolation</span>
            </h2>
            <p>
              Each user account is strictly isolated. You are responsible for safeguarding your login
              credentials. We enforce server-side validation and secure password hashing to protect
              your records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>4. Service Availability & Mobile PWA Installation</span>
            </h2>
            <p>
              DHANU is distributed as a Progressive Web Application (PWA) installable directly to
              mobile devices without app store gatekeeping. While we implement offline service workers
              and resilient caching, periodic connectivity is required for streak synchronization and
              cloud verification backups.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
