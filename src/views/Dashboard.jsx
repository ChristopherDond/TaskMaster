import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, CheckCircle2, Clock, Flame, Zap,
  Award, Target, BarChart2, Star
} from 'lucide-react'
import {
  getLevel, getNextLevel, calcWeeklyEfficiency,
  weeklyCompletionData, ACHIEVEMENTS, LEVELS
} from '../lib/scoring'

// ─── Mini Metric Card ──────────────────────────────────────────
function MetricCard({ label, value, sub, icon: Icon, color = 'var(--ac)', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: 'easeOut' }}
      className="bg-b2 border border-bd rounded-2xl p-5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 blur-2xl"
        style={{ background: color, transform: 'translate(30%, -30%)' }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-t2 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
          <p className="text-t0 font-mono text-3xl font-semibold leading-none">{value}</p>
          {sub && <p className="text-t1 text-xs mt-1.5">{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Weekly Bar Chart ──────────────────────────────────────────
function WeeklyChart({ data }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="flex items-end gap-2 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.count / max) * 100}%` }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
            className="w-full rounded-t-md min-h-[3px]"
            style={{ background: d.count > 0 ? 'var(--ac)' : 'var(--bd)', maxHeight: '100%' }}
          />
          <span className="text-t2 text-[10px] font-mono capitalize">{d.label}</span>
          <span className="text-t1 text-[10px] font-mono">{d.count}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Efficiency Ring ───────────────────────────────────────────
function EfficiencyRing({ pct }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bd2)" strokeWidth="8" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none"
          stroke="var(--tc)" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="text-center relative z-10">
        <p className="text-t0 font-mono text-xl font-semibold leading-none">{pct}%</p>
        <p className="text-t2 text-[10px] mt-0.5">Eficiência</p>
      </div>
    </div>
  )
}

// ─── Achievement Badge ─────────────────────────────────────────
function AchievementBadge({ achievement, unlocked }) {
  return (
    <div
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
        unlocked
          ? 'border-ac/30 bg-ac/5 text-t0'
          : 'border-bd bg-b1 text-t2 opacity-40 grayscale'
      }`}
    >
      <span className="text-2xl">{achievement.icon}</span>
      <p className="text-xs font-semibold text-center leading-tight">{achievement.label}</p>
      <p className="text-[10px] text-t2 text-center leading-tight">{achievement.description}</p>
    </div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────
export default function Dashboard({ tasks, goals, profile }) {
  const now = new Date()

  const stats = useMemo(() => {
    const completed   = tasks.filter(t => t.status === 'completed')
    const pending     = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress')
    const overdue     = tasks.filter(t => t.status === 'overdue' || (t.deadline && new Date(t.deadline) < now && t.status !== 'completed'))
    const weekAgo     = new Date(now - 7 * 24 * 60 * 60 * 1000)
    const weeklyDone  = completed.filter(t => t.completed_at && new Date(t.completed_at) >= weekAgo)
    const earlyDone   = completed.filter(t => t.completed_at && t.deadline && new Date(t.completed_at) < new Date(t.deadline))
    const goalsCompleted = goals.filter(g => g.status === 'completed').length

    return {
      totalCompleted: completed.length,
      pendingCount:   pending.length,
      overdueCount:   overdue.length,
      weeklyCompleted: weeklyDone.length,
      earlyCompletions: earlyDone.length,
      streakDays:     profile?.streak_days ?? 0,
      goalsCompleted,
      completionRate: tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0,
    }
  }, [tasks, goals, profile])

  const weeklyEff  = useMemo(() => calcWeeklyEfficiency(tasks), [tasks])
  const chartData  = useMemo(() => weeklyCompletionData(tasks), [tasks])
  const points     = profile?.total_points ?? 0
  const lvl        = getLevel(points)
  const { pct: lvlPct, next: nextLvl } = getNextLevel(points)

  // Achievements
  const earnedIds  = (profile?.achievements || []).map(a => typeof a === 'string' ? a : a.id)

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-t0 text-2xl font-semibold tracking-tight">Performance Dashboard</h1>
        <p className="text-t1 text-sm mt-1">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Metric cards row */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="Score Total"
          value={points.toLocaleString()}
          sub={`Nível ${lvl.level} — ${lvl.label}`}
          icon={Zap}
          color="var(--ac)"
          delay={0}
        />
        <MetricCard
          label="Streak Atual"
          value={`${stats.streakDays}d`}
          sub="dias consecutivos ativos"
          icon={Flame}
          color="var(--am)"
          delay={0.05}
        />
        <MetricCard
          label="Esta Semana"
          value={stats.weeklyCompleted}
          sub="tarefas concluídas"
          icon={CheckCircle2}
          color="var(--tc)"
          delay={0.1}
        />
        <MetricCard
          label="Pendentes"
          value={stats.pendingCount}
          sub={stats.overdueCount > 0 ? `${stats.overdueCount} atrasadas` : 'todas em dia'}
          icon={Clock}
          color={stats.overdueCount > 0 ? 'var(--ar)' : 'var(--pur)'}
          delay={0.15}
        />
      </div>

      {/* Middle row: efficiency ring + level + chart */}
      <div className="grid grid-cols-3 gap-4">
        {/* Weekly Focus */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-b2 border border-bd rounded-2xl p-6 flex flex-col items-center justify-center gap-3"
        >
          <p className="text-t1 text-xs uppercase tracking-wider font-medium">Foco Semanal</p>
          <EfficiencyRing pct={weeklyEff} />
          <p className="text-t2 text-xs text-center">
            {weeklyEff >= 80 ? '🔥 Performance excelente' :
             weeklyEff >= 50 ? '📈 Bom progresso' :
             '⚡ Há espaço pra melhorar'}
          </p>
        </motion.div>

        {/* Level progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-b2 border border-bd rounded-2xl p-6"
        >
          <p className="text-t1 text-xs uppercase tracking-wider font-medium mb-4">Nível de Foco</p>
          <div className="space-y-3">
            {LEVELS.map(l => (
              <div key={l.level} className="flex items-center gap-3">
                <div className="w-6 text-center">
                  <span className="text-xs font-mono font-bold" style={{ color: l.color }}>{l.level}</span>
                </div>
                <div className="flex-1 h-2 bg-b3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: points >= l.min ? (lvl.level === l.level ? `${lvlPct}%` : '100%') : '0%' }}
                    transition={{ duration: 0.8, delay: l.level * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: l.color }}
                  />
                </div>
                <span className="text-t2 text-xs w-20 font-medium"
                  style={{ color: lvl.level === l.level ? l.color : undefined }}>
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-b2 border border-bd rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-t1 text-xs uppercase tracking-wider font-medium">Últimos 7 dias</p>
            <BarChart2 className="w-4 h-4 text-t2" />
          </div>
          <WeeklyChart data={chartData} />
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-b2 border border-bd rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Award className="w-4 h-4 text-am" />
          <p className="text-t0 font-semibold text-sm">Conquistas</p>
          <span className="ml-auto text-t2 text-xs font-mono">
            {earnedIds.length}/{ACHIEVEMENTS.length} desbloqueadas
          </span>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {ACHIEVEMENTS.map(a => (
            <AchievementBadge
              key={a.id}
              achievement={a}
              unlocked={earnedIds.includes(a.id)}
            />
          ))}
        </div>
      </motion.div>

      {/* Goals overview */}
      {goals.filter(g => g.status === 'active').length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-b2 border border-bd rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-4 h-4 text-am" />
            <p className="text-t0 font-semibold text-sm">Metas Ativas</p>
          </div>
          <div className="space-y-3">
            {goals.filter(g => g.status === 'active').slice(0, 4).map(g => (
              <div key={g.id} className="flex items-center gap-4">
                <p className="text-t0 text-sm w-40 truncate">{g.title}</p>
                <div className="flex-1 h-2 bg-b3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${g.progress}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: 'var(--am)' }}
                  />
                </div>
                <span className="text-t1 text-xs font-mono w-10 text-right">{g.progress}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
