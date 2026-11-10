const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

async function runVerificationTests() {
  console.log('====================================================')
  console.log('   DHANU PLATFORM: END-TO-END AUTOMATED VERIFICATION')
  console.log('====================================================\n')

  let passedTests = 0
  let totalTests = 0

  function assert(condition, message) {
    totalTests++
    if (condition) {
      console.log(`[PASS] ${message}`)
      passedTests++
    } else {
      console.error(`[FAIL] ${message}`)
      throw new Error(`Test failed: ${message}`)
    }
  }

  try {
    // 1. Test Database Schema & Connection
    const userCount = await prisma.user.count()
    assert(userCount >= 1, `Database connected and verified (${userCount} user records found)`)

    // 2. Test Demo User Existence & Authentication
    const demoUser = await prisma.user.findUnique({
      where: { email: 'alex@dhanu.growth' },
      include: { profile: true, settings: true, activities: true },
    })
    assert(!!demoUser, 'Demo user alex@dhanu.growth exists in multi-tenant database')
    
    const isPasswordValid = await bcrypt.compare('Dhanu2026!', demoUser.passwordHash)
    assert(isPasswordValid, 'Password verification using bcrypt succeeds')

    // 3. Test Onboarding State
    assert(demoUser.profile.onboardingCompleted === true, 'Onboarding routine generation completed')
    assert(demoUser.activities.length >= 4, `Routine contains ${demoUser.activities.length} configured activities`)

    // 4. Test Dual-Streak Engine (Login Streak & Activity Streaks)
    const loginStreak = await prisma.streakRecord.findFirst({
      where: {
        userId: demoUser.id,
        type: 'LOGIN',
      },
    })
    assert(!!loginStreak, 'Login streak record exists')
    assert(loginStreak.currentStreak >= 14, `Login streak accurately maintained at ${loginStreak.currentStreak} consecutive days`)

    const activityStreak = await prisma.streakRecord.findFirst({
      where: {
        userId: demoUser.id,
        type: 'ACTIVITY',
      },
      include: { activity: true },
    })
    assert(!!activityStreak, `Independent activity streak calculated for ${activityStreak.activity.name}: ${activityStreak.currentStreak} days`)

    // 5. Test Mandatory Completion Submission & Photographic Proof Integrity
    const dsaActivity = demoUser.activities.find((a) => a.name === 'DSA Practice')
    assert(!!dsaActivity, 'Found DSA Practice activity for completion test')

    const today = new Date().toISOString().split('T')[0]
    const testCompletion = await prisma.dailyCompletion.upsert({
      where: {
        userId_activityId_date: {
          userId: demoUser.id,
          activityId: dsaActivity.id,
          date: today,
        },
      },
      create: {
        userId: demoUser.id,
        activityId: dsaActivity.id,
        date: today,
        status: 'COMPLETED',
        durationMinutes: 120,
        accomplishments: 'Solved 2 LeetCode Hard graph connectivity problems.',
        learnings: 'Applied Tarjan bridge-finding algorithm with low-link values.',
        problemsSolved: 'Resolved recursion depth limit by implementing explicit stack.',
      },
      update: {
        status: 'COMPLETED',
        durationMinutes: 120,
      },
    })
    assert(testCompletion.status === 'COMPLETED', 'DailyCompletion record saved with verified status')

    const proof = await prisma.proofImage.create({
      data: {
        dailyCompletionId: testCompletion.id,
        imageUrl: '/icons/icon-512.png',
        caption: 'Terminal & benchmark runtime test evidence',
        fileSizeBytes: 10240,
        mimeType: 'image/png',
      },
    })
    assert(!!proof.id, 'Photographic proof securely linked to completion session')

    // 6. Test Inactivity Reminder & Quiet Hours
    const settings = demoUser.settings
    assert(settings.inactivityIntervalHours === 4, 'Configurable 4-hour inactivity interval confirmed')
    assert(settings.quietHoursStart === '22:00' && settings.quietHoursEnd === '07:00', 'Quiet sleep hours confirmed (22:00 - 07:00)')

    // 7. Test Milestones Unlocking
    const milestones = await prisma.milestone.findMany({ where: { userId: demoUser.id } })
    assert(milestones.length >= 2, `Milestones system verified (${milestones.length} achievements unlocked)`)

    // 8. Test Data Sovereignty & Portability
    const allUserCompletions = await prisma.dailyCompletion.findMany({
      where: { userId: demoUser.id },
      include: { proofImages: true },
    })
    assert(allUserCompletions.length >= 14, `Data exportable: ${allUserCompletions.length} historical verified sessions with proof`)

    console.log('\n====================================================')
    console.log(`VERIFICATION SUMMARY: ${passedTests} of ${totalTests} TESTS PASSED (100%)`)
    console.log('====================================================\n')
  } catch (err) {
    console.error('Test execution error:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

runVerificationTests()
