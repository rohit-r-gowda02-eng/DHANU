import webpush from 'web-push'
import { prisma } from './prisma'
import { getUserLocalDate } from './streaks'

// Configure Web Push with VAPID keys if provided
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjZJuGTUMUyVnM4819vqGyq1_Inao'
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || 'DEMO_PRIVATE_KEY_FOR_LOCAL_DEVELOPMENT_ONLY_123456789'
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:support@dhanu.growth'

try {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)
} catch {
  // Graceful fallback in development or if demo keys
}

const INACTIVITY_MESSAGES = [
  'Your goals are waiting. Take a moment to check in with DHANU.',
  'Consistency starts with one action. Have you checked off today’s commitments?',
  'Don’t let today’s progress become tomorrow’s regret. Every minute of effort compounds.',
  'Prove your growth through daily action. Log in and maintain your streaks.',
  'Momentum is fragile. A short focused session today keeps your momentum alive.',
]

export function isInQuietHours(quietStart: string, quietEnd: string, userTimezone = 'UTC'): boolean {
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: userTimezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    const currentTime = formatter.format(new Date()) // "HH:mm"
    const [currH, currM] = currentTime.split(':').map(Number)
    const [startH, startM] = quietStart.split(':').map(Number)
    const [endH, endM] = quietEnd.split(':').map(Number)

    const currMinutes = currH * 60 + currM
    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM

    if (startMinutes > endMinutes) {
      // Crosses midnight, e.g. 22:00 to 07:00
      return currMinutes >= startMinutes || currMinutes < endMinutes
    } else {
      return currMinutes >= startMinutes && currMinutes < endMinutes
    }
  } catch {
    return false
  }
}

/**
 * Check inactivity for a user and dispatch reminder if > interval hours have passed
 */
export async function checkAndSendInactivityReminder(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      settings: true,
      pushSubscriptions: true,
      activities: {
        where: { isPaused: false },
      },
    },
  })

  if (!user || !user.settings || !user.settings.inactivityReminderEnabled) {
    return { status: 'disabled' }
  }

  // Check quiet hours
  const quietStart = user.settings.quietHoursStart || '22:00'
  const quietEnd = user.settings.quietHoursEnd || '07:00'
  if (isInQuietHours(quietStart, quietEnd, user.timezone)) {
    return { status: 'quiet_hours' }
  }

  // Calculate hours since last active
  const now = new Date()
  const lastActive = new Date(user.lastActiveAt)
  const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60)
  const thresholdHours = user.settings.inactivityIntervalHours || 4

  if (diffHours < thresholdHours) {
    return { status: 'active_recently', diffHours }
  }

  // Check if a reminder was already sent in the last 4 hours to prevent duplicate spam
  const recentReminder = await prisma.notification.findFirst({
    where: {
      userId,
      type: 'INACTIVITY_REMINDER',
      createdAt: {
        gte: new Date(now.getTime() - thresholdHours * 60 * 60 * 1000),
      },
    },
  })

  if (recentReminder) {
    return { status: 'already_reminded_recently' }
  }

  // Pick an inspirational, targeted message
  const randomMsg = INACTIVITY_MESSAGES[Math.floor(Math.random() * INACTIVITY_MESSAGES.length)]
  const title = 'DHANU Inactivity Alert'

  // Create in-app notification
  const notification = await prisma.notification.create({
    data: {
      userId,
      title,
      message: randomMsg,
      type: 'INACTIVITY_REMINDER',
      linkUrl: '/dashboard',
    },
  })

  // Send Web Push notifications to all active subscriptions
  let pushSentCount = 0
  for (const sub of user.pushSubscriptions) {
    try {
      const payload = JSON.stringify({
        title,
        body: randomMsg,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        url: '/dashboard',
      })

      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      )
      pushSentCount++
    } catch (err: any) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Subscription expired or gone, delete it
        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
      }
    }
  }

  return {
    status: 'reminder_sent',
    notificationId: notification.id,
    pushSentCount,
  }
}

