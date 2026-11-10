'use client'

import React, { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Moon,
  Volume2,
  Trash2,
  Send,
  Loader2,
  Smartphone,
  ShieldCheck,
} from 'lucide-react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)
  const [simResult, setSimResult] = useState<string | null>(null)
  const [pushStatus, setPushStatus] = useState<string>('default')

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      if (data.notifications) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount || 0)
      }
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
    if ('Notification' in window) {
      setPushStatus(Notification.permission)
    }
  }, [])

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      })
      loadNotifications()
    } catch {}
  }

  const handleClearAll = async () => {
    if (!confirm('Clear all notifications?')) return
    try {
      await fetch('/api/notifications', { method: 'DELETE' })
      loadNotifications()
    } catch {}
  }

  const handleRequestPushPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support Web Push notifications.')
      return
    }

    try {
      const permission = await Notification.requestPermission()
      setPushStatus(permission)

      if (permission === 'granted' && 'serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        })

        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub),
        })
      }
    } catch (err: any) {
      console.error('Push permission error:', err)
    }
  }

  const handleSimulateInactivity = async () => {
    setSimulating(true)
    setSimResult(null)
    try {
      const res = await fetch('/api/notifications/check-inactivity?simulate=true')
      const data = await res.json()
      setSimResult(
        data.result?.status === 'reminder_sent'
          ? 'Inactivity Alert Dispatched! Reminder added to your inbox.'
          : `Inactivity Check Status: ${data.result?.status || 'Executed'}`
      )
      loadNotifications()
    } catch {
      setSimResult('Error executing simulation.')
    } finally {
      setSimulating(false)
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">
              Inactivity Reminders & Notifications
            </h1>
            <p className="text-xs text-slate-400">
              4-hour inactivity monitoring, quiet hours, and Web Push infrastructure.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="btn-secondary px-3.5 py-1.5 text-xs font-semibold"
              >
                Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 4-Hour Inactivity Architecture Card */}
        <div className="dhanu-card p-6 border-amber-500/25 bg-gradient-to-r from-[#0D1510] to-[#14221A]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>4-Hour Inactivity Scheduler</span>
              </div>
              <h2 className="text-lg font-bold font-display text-white">
                Intelligent Inactivity Safeguard
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                If 4 consecutive hours elapse during your wake schedule without a verified completion or
                interaction, DHANU triggers targeted reminders so you don&apos;t let momentum break.
                Quiet hours (22:00 to 07:00) suppress reminders during sleep.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 shrink-0">
              {/* Web Push Permission Button */}
              <button
                onClick={handleRequestPushPermission}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  pushStatus === 'granted'
                    ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                    : 'btn-primary shadow-3d-btn'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>
                  {pushStatus === 'granted' ? 'Web Push Active' : 'Enable Mobile Push'}
                </span>
              </button>

              {/* Instant Test / Simulate Button */}
              <button
                onClick={handleSimulateInactivity}
                disabled={simulating}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {simulating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>Simulate 4h Inactivity Test</span>
              </button>
            </div>
          </div>

          {simResult && (
            <div className="mt-4 p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{simResult}</span>
            </div>
          )}
        </div>

        {/* Notifications Feed */}
        <div className="dhanu-card p-6">
          <h2 className="text-base font-bold font-display text-white mb-4">
            Alert & Inactivity Log
          </h2>

          {loading ? (
            <div className="text-center py-10">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-4 ${
                    n.isRead
                      ? 'bg-[#0B130E]/50 border-white/5 text-slate-400'
                      : 'bg-[#14221A] border-amber-500/30 text-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        n.type === 'INACTIVITY_REMINDER'
                          ? 'bg-amber-600/20 text-amber-400'
                          : 'bg-emerald-600/20 text-emerald-400'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white">{n.title}</span>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-2 block">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-8">
              No notifications. Your consistency is up to date!
            </p>
          )}
        </div>
      </div>
    </AppShell>
  )
}
