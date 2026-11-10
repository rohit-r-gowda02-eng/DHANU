'use client'

import React, { useState, useEffect } from 'react'
import { Download, Share, PlusSquare, X, Smartphone, Check } from 'lucide-react'

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIos, setIsIos] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showIosGuide, setShowIosGuide] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if running in standalone mode
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    setIsStandalone(standalone)

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const iosDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIos(iosDevice)

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  if (isStandalone || dismissed) {
    return null
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    } else if (isIos) {
      setShowIosGuide(true)
    }
  }

  // Only show if either Android prompt is available or is on iOS browser
  if (!deferredPrompt && !isIos) {
    return null
  }

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-950/90 via-[#0D1510] to-[#070B08] border-b border-[#D4AF37]/30 px-4 py-2.5 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/50 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/30">
              <Smartphone className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Install DHANU on your device</p>
              <p className="text-[11px] text-slate-300">Fast offline access, camera integration & daily reminders.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="btn-primary px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Installation Instructions Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0D1510] border border-[#D4AF37]/30 rounded-2xl max-w-sm w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowIosGuide(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/40 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-900/40">
                <Smartphone className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Install DHANU on iOS</h3>
                <p className="text-xs text-slate-400">Add to Home Screen in 2 taps</p>
              </div>
            </div>

            <div className="space-y-4 my-5 text-xs text-slate-300">
              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="p-1.5 bg-amber-500/20 text-[#D4AF37] rounded-lg shrink-0 mt-0.5">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Step 1: Tap the Share button</span>
                  Tap the Safari Share button at the bottom navigation bar of your browser.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="p-1.5 bg-amber-500/20 text-[#D4AF37] rounded-lg shrink-0 mt-0.5">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Step 2: Add to Home Screen</span>
                  Scroll down the share menu and select <strong>&quot;Add to Home Screen&quot;</strong>.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Step 3: Launch DHANU</span>
                  Open DHANU directly from your iPhone/iPad home screen like a native app.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="btn-primary w-full py-2.5 text-sm font-bold transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  )
}
