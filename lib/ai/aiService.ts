/**
 * Modular AI Service Architecture for DHANU
 * 
 * Provides an interface for intelligent consistency analysis, routine recommendations,
 * and growth summaries. Uses deterministic heuristics and rule engines by default,
 * allowing zero-config operation while providing a clean plug-in interface for LLMs
 * (e.g. Gemini, Anthropic, OpenAI) in future versions.
 */

export interface WeeklyInsightResult {
  summary: string
  consistencyScore: number
  topStrength: string
  areaToImprove: string
  actionableAdvice: string
  source: 'deterministic_engine' | 'ai_model'
}

export interface RoutineOptimizationResult {
  recommendations: Array<{
    activityName: string
    suggestedDurationChange?: number
    suggestedTime?: string
    reason: string
  }>
  overallAssessment: string
}

export interface AIService {
  generateWeeklyReviewSummary(data: {
    totalCompleted: number
    totalMissed: number
    totalMinutes: number
    bestActivityName?: string
    streakDays: number
  }): Promise<WeeklyInsightResult>

  analyzeJournalEntry(entry: {
    accomplishments: string
    learnings: string
    problemsSolved: string
    durationMinutes: number
  }): Promise<{ keyTakeaways: string[]; focusArea: string }>

  predictGoalCompletion(params: {
    currentValue: number
    targetValue: number
    daysElapsed: number
    totalDays: number
    recentDailyAverage: number
  }): Promise<{ onTrack: boolean; estimatedDaysRemaining: number; velocityRatio: number }>
}

class DeterministicAIService implements AIService {
  async generateWeeklyReviewSummary(data: {
    totalCompleted: number
    totalMissed: number
    totalMinutes: number
    bestActivityName?: string
    streakDays: number
  }): Promise<WeeklyInsightResult> {
    const totalScheduled = data.totalCompleted + data.totalMissed
    const consistencyScore = totalScheduled > 0 ? Math.round((data.totalCompleted / totalScheduled) * 100) : 0
    const hours = (data.totalMinutes / 60).toFixed(1)

    let summary = `This week, you dedicated ${hours} hours across ${data.totalCompleted} completed sessions.`
    let topStrength = data.bestActivityName
      ? `High dedication to ${data.bestActivityName}`
      : 'Solid daily execution'
    let areaToImprove = data.totalMissed > 0
      ? `Recovering from ${data.totalMissed} missed scheduled sessions`
      : 'Maintaining peak momentum without burnout'

    let actionableAdvice = ''
    if (consistencyScore >= 85) {
      summary += ` Exceptional consistency rate of ${consistencyScore}%. Your discipline is forming strong automatic habits.`
      actionableAdvice = 'Keep this identical schedule next week. Do not increase targets prematurely; consolidate this cadence first.'
    } else if (consistencyScore >= 60) {
      summary += ` Good consistency rate of ${consistencyScore}%. Progress is measurable, though slight schedule friction occurred.`
      actionableAdvice = 'Review the days you missed: were they due to unrealistic duration targets or conflicting commitments? Adjust your preferred times.'
    } else {
      summary += ` Consistency rate of ${consistencyScore}%. You faced obstacles this week, but showing up and measuring reality is step one.`
      actionableAdvice = 'Reduce friction by lowering target durations by 25% next week until 7 consecutive days are completed.'
    }

    return {
      summary,
      consistencyScore,
      topStrength,
      areaToImprove,
      actionableAdvice,
      source: 'deterministic_engine',
    }
  }

  async analyzeJournalEntry(entry: {
    accomplishments: string
    learnings: string
    problemsSolved: string
    durationMinutes: number
  }) {
    const takeaways: string[] = []
    if (entry.accomplishments && entry.accomplishments.length > 5) {
      takeaways.push(`Completed: ${entry.accomplishments.slice(0, 100)}...`)
    }
    if (entry.learnings && entry.learnings.length > 5) {
      takeaways.push(`Key Insight: ${entry.learnings.slice(0, 100)}...`)
    }
    if (entry.problemsSolved && entry.problemsSolved.length > 5) {
      takeaways.push(`Problem Overcome: ${entry.problemsSolved.slice(0, 100)}...`)
    }

    return {
      keyTakeaways: takeaways.length > 0 ? takeaways : ['Demonstrated structured effort and verified completion.'],
      focusArea: entry.durationMinutes >= 60 ? 'Deep Work Endurance' : 'Consistent Daily Action',
    }
  }

  async predictGoalCompletion(params: {
    currentValue: number
    targetValue: number
    daysElapsed: number
    totalDays: number
    recentDailyAverage: number
  }) {
    const remainingValue = Math.max(0, params.targetValue - params.currentValue)
    const dailyVelocity = params.recentDailyAverage > 0
      ? params.recentDailyAverage
      : (params.currentValue / Math.max(1, params.daysElapsed))

    const estimatedDaysRemaining = dailyVelocity > 0 ? Math.ceil(remainingValue / dailyVelocity) : 999
    const remainingDaysInTarget = Math.max(1, params.totalDays - params.daysElapsed)
    const onTrack = estimatedDaysRemaining <= remainingDaysInTarget
    const velocityRatio = Number((dailyVelocity / (remainingValue / remainingDaysInTarget || 1)).toFixed(2))

    return {
      onTrack,
      estimatedDaysRemaining,
      velocityRatio: isFinite(velocityRatio) ? velocityRatio : 1.0,
    }
  }
}

// Export singleton instance of the AI / Intelligence service
export const aiService: AIService = new DeterministicAIService()

