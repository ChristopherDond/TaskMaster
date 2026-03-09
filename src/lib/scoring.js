// ─── Scoring system ───────────────────────────────────────────
// Points for task completion
export const POINTS = {
  COMPLETE_EARLY:   100,  // completed > 1 day before deadline
  COMPLETE_ON_TIME:  75,  // completed on deadline day
  COMPLETE_LATE:     25,  // completed after deadline
  COMPLETE_NO_DATE:  50,  // task had no deadline
  STREAK_DAILY:      15,  // per active streak day (multiplied)
}

// Level thresholds
export const LEVELS = [
  { level: 1, label: 'Iniciante',    min: 0,     color: '#8B8BB8' },
  { level: 2, label: 'Focado',       min: 500,   color: '#5865F9' },
  { level: 3, label: 'Eficiente',    min: 1500,  color: '#00D4A0' },
  { level: 4, label: 'Expert',       min: 3500,  color: '#F5A623' },
  { level: 5, label: 'Mestre',       min: 7500,  color: '#FF4466' },
]

// Achievement definitions
export const ACHIEVEMENTS = [
  {
    id: 'first_task',
    label: 'Primeiro Passo',
    description: 'Complete sua primeira tarefa',
    icon: '🎯',
    condition: (stats) => stats.totalCompleted >= 1,
  },
  {
    id: 'early_bird',
    label: 'Early Bird',
    description: 'Complete 5 tarefas antes do prazo',
    icon: '🌅',
    condition: (stats) => stats.earlyCompletions >= 5,
  },
  {
    id: 'on_fire',
    label: 'On Fire',
    description: 'Mantenha um streak de 7 dias',
    icon: '🔥',
    condition: (stats) => stats.streakDays >= 7,
  },
  {
    id: 'unstoppable',
    label: 'Imparável',
    description: 'Mantenha um streak de 30 dias',
    icon: '⚡',
    condition: (stats) => stats.streakDays >= 30,
  },
  {
    id: 'centurion',
    label: 'Centurião',
    description: 'Complete 100 tarefas',
    icon: '💯',
    condition: (stats) => stats.totalCompleted >= 100,
  },
  {
    id: 'goal_crusher',
    label: 'Goal Crusher',
    description: 'Conclua uma meta de longo prazo',
    icon: '🏆',
    condition: (stats) => stats.goalsCompleted >= 1,
  },
  {
    id: 'sprint_master',
    label: 'Sprint Master',
    description: 'Complete 10 tarefas em uma semana',
    icon: '🚀',
    condition: (stats) => stats.weeklyCompleted >= 10,
  },
]

// Calculate points for completing a task
export function calcTaskPoints(task) {
  if (!task.deadline) return POINTS.COMPLETE_NO_DATE

  const now     = new Date()
  const dl      = new Date(task.deadline)
  const diffMs  = dl - now
  const diffH   = diffMs / (1000 * 60 * 60)

  if (diffH > 24)  return POINTS.COMPLETE_EARLY
  if (diffH >= -2) return POINTS.COMPLETE_ON_TIME
  return POINTS.COMPLETE_LATE
}

// Determine level from total points
export function getLevel(points) {
  let current = LEVELS[0]
  for (const lvl of LEVELS) {
    if (points >= lvl.min) current = lvl
  }
  return current
}

// Next level info (for progress bar)
export function getNextLevel(points) {
  const sorted = [...LEVELS].sort((a, b) => a.min - b.min)
  for (let i = 0; i < sorted.length - 1; i++) {
    if (points < sorted[i + 1].min) {
      const from  = sorted[i].min
      const to    = sorted[i + 1].min
      const pct   = ((points - from) / (to - from)) * 100
      return { next: sorted[i + 1], pct: Math.round(pct), pointsNeeded: to - points }
    }
  }
  return { next: null, pct: 100, pointsNeeded: 0 }
}

// Check which achievements are newly unlocked
export function checkNewAchievements(stats, currentAchievements = []) {
  const earned = currentAchievements.map(a => (typeof a === 'string' ? a : a.id))
  return ACHIEVEMENTS.filter(a => !earned.includes(a.id) && a.condition(stats))
}

// Weekly efficiency score (0-100)
export function calcWeeklyEfficiency(tasks) {
  const now   = new Date()
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
  const thisWeek = tasks.filter(t => t.completed_at && new Date(t.completed_at) >= weekAgo)

  if (thisWeek.length === 0) return 0

  const totalPossible = thisWeek.length * POINTS.COMPLETE_EARLY
  const earned = thisWeek.reduce((sum, t) => sum + (t.points_earned || 0), 0)
  return Math.round((earned / totalPossible) * 100)
}

// Tasks completed in the last 7 days, grouped by day label
export function weeklyCompletionData(tasks) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      label: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
      date:  d.toDateString(),
      count: 0,
    })
  }

  for (const task of tasks) {
    if (task.completed_at) {
      const cd = new Date(task.completed_at).toDateString()
      const slot = days.find(d => d.date === cd)
      if (slot) slot.count++
    }
  }
  return days
}
