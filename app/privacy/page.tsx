import React from 'react'
import Link from 'next/link'
import { DhanuLogo } from '@/components/brand/DhanuLogo'
import { ArrowLeft, Shield, Lock, Eye, Download, Trash2 } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
            Legal & Data Protection
          </span>
          <h1 className="text-3xl font-extrabold font-display text-white mt-1 mb-3">
            DHANU Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">Effective Date: November 2026</p>
        </div>

        <div className="dhanu-card p-6 space-y-6 text-xs text-slate-300 leading-relaxed border-emerald-500/15">
          <section className="space-y-2">
            <h2 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>1. Our Core Commitment to Privacy</span>
            </h2>
            <p>
              DHANU exists to build disciplined individuals through verified daily actions. Your daily
              habits, learnings, and photographic evidence are personal. We do not sell your personal
              information, advertise against your routines, or monetize your consistency records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>2. Information We Collect</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>
                <strong>Account Credentials:</strong> Email address, encrypted password hash
                (bcrypt), name, and timezone.
              </li>
              <li>
                <strong>Routines & Commitments:</strong> Activities defined by you, schedules, targets,
                and milestone goals.
              </li>
              <li>
                <strong>Verification Evidence:</strong> Uploaded photographic proofs, accomplishment
                descriptions, problem-solving notes, and time spent.
              </li>
              <li>
                <strong>Session Metadata:</strong> Timestamps of logins and interactions used strictly
                to calculate login streaks and inactivity reminder checks.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>3. Photographic Proof Storage & Access</span>
            </h2>
            <p>
              Uploaded photographic evidence is stored securely in dedicated user partitions. Only you
              have access to view and manage your verified proof images. Images are never processed
              for public indexing or commercial advertising.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>4. Data Sovereignty & Portability</span>
            </h2>
            <p>
              You maintain 100% ownership of your records. You may export your complete data as JSON
              or CSV at any time directly from your Settings dashboard.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>5. Account Deletion</span>
            </h2>
            <p>
              You have the permanent right to delete your account. Initiating account deletion cascades
              and permanently erases your profile, routines, completions, and all associated images from
              our databases.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
