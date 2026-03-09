import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Target, Calendar, Pencil, Trash2, CheckCircle2,
  Pause, Play, TrendingUp, CheckCheck
} from 'lucide-react'
import GoalModal from '../components/GoalModal'

const CAT_META = {
  work:     { label: 'Trabalho',    emoji: '💼', color: '#5865F9' },
  personal: { label: 'Pessoal',     emoji: '🌱', color: '#00D4A0' },
  health:   { label: 'Saúde',       emoji: '🏃', color: '#FF4466' },
  learning: { label: 'Aprendizado', emoji: '📚', color: '#9B5CF6' },
  finance:  { label: 'Finanças',    emoji: '💰', color: '#F5A623' },
}

function daysRemaining(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days < 0) return { label: `${Math.abs(days)}d atrás`, color: 'var(--ar)' }
  if (days === 0) return { label: 'Hoje!', color: 'var(--am)' }
  if (days <= 7) return { label: `${days}d restantes`, color: 'var(--am)' }
  return { label: `${days}d restantes`, color: 'var(--t2)' }
}

function GoalCard({ goal, onEdit, onDelete, onToggleStatus }) {
  const [confirming, setConfirming] = useState(false)
  const cat     = CAT_META[goal.category] || CAT_META.personal
  const dl      = daysRemaining(goal.target_date)
  const done    = goal.status === 'completed'
  const paused  = goal.status === 'paused'
  const milestones = goal.milestones || []
  const doneMilestones = milestones.filter(m => m.done).length

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group bg-b2 border rounded-2xl p-5 transition-all ${
        done ? 'opacity-60 border-bd' : paused ? 'border-bd2 opacity-75' : 'border-bd hover:border-bd2'
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}
          >
            {cat.emoji}
          </span>
          <div className="min-w-0">
            <p className={`text-sm font-semibold leading-snug ${done ? 'line-through text-t2' : 'text-t0'}`}>
              {goal.title}
            </p>
            {goal.description && (
              <p className="text-t2 text-xs mt-0.5 line-clamp-1">{goal.description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {!done && (
            <button
              onClick={() => onToggleStatus(goal.id, paused ? 'active' : 'paused')}
              className="p-1.5 rounded-lg text-t2 hover:text-am hover:bg-am/10 transition-colors"
              title={paused ? 'Retomar' : 'Pausar'}
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          )}
          {!done && (
            <button
              onClick={() => onToggleStatus(goal.id, 'completed')}
              className="p-1.5 rounded-lg text-t2 hover:text-tc hover:bg-tc/10 transition-colors"
              title="Marcar como concluída"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onEdit(goal)}
            className="p-1.5 rounded-lg text-t2 hover:text-t0 hover:bg-bh transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="p-1.5 rounded-lg text-t2 hover:text-ar hover:bg-ar/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button onClick={() => onDelete(goal.id)} className="px-2 py-1 bg-ar text-white rounded-md text-[10px] font-semibold">Sim</button>
              <button onClick={() => setConfirming(false)} className="px-2 py-1 bg-b3 text-t1 rounded-md text-[10px]">Não</button>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-t2 text-[11px]">Progresso</span>
          <span className="text-t0 text-xs font-mono font-semibold">{goal.progress}%</span>
        </div>
        <div className="h-2 bg-b3 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goal.progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: done ? 'var(--tc)' : cat.color }}
          />
        </div>
      </div>

      {/* Milestones mini list */}
      {milestones.length > 0 && (
        <div className="mb-3 space-y-1">
          {milestones.slice(0, 3).map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full border flex-shrink-0 ${m.done ? 'bg-tc border-tc' : 'border-bd2'}`} />
              <span className={`text-[11px] truncate ${m.done ? 'line-through text-t2' : 'text-t1'}`}>{m.text}</span>
            </div>
          ))}
          {milestones.length > 3 && (
            <p className="text-t2 text-[10px] ml-5">+{milestones.length - 3} marcos</p>
          )}
        </div>
      )}

      {/* Footer row */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-md"
          style={{ background: `${cat.color}15`, color: cat.color }}
        >
          {cat.label}
        </span>
        {dl && (
          <span className="text-[11px] flex items-center gap-1" style={{ color: dl.color }}>
            <Calendar className="w-3 h-3" />
            {dl.label}
          </span>
        )}
        {milestones.length > 0 && (
          <span className="text-t2 text-[11px] ml-auto font-mono">
            {doneMilestones}/{milestones.length} marcos
          </span>
        )}
        {done && (
          <span className="text-tc text-[11px] font-semibold ml-auto flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Concluída
          </span>
        )}
        {paused && !done && (
          <span className="text-am text-[11px] font-semibold ml-auto flex items-center gap-1">
            <Pause className="w-3 h-3" /> Pausada
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default function GoalsView({ goals, onCreateGoal, onUpdateGoal, onDeleteGoal }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editGoal, setEditGoal]   = useState(null)
  const [filter, setFilter]       = useState('active')

  const filtered = goals.filter(g => {
    if (filter === 'all') return true
    return g.status === filter
  })

  const totalActive    = goals.filter(g => g.status === 'active').length
  const totalCompleted = goals.filter(g => g.status === 'completed').length
  const avgProgress    = goals.length > 0
    ? Math.round(goals.filter(g => g.status === 'active').reduce((s, g) => s + g.progress, 0) / Math.max(totalActive, 1))
    : 0

  function handleSave(form) {
    if (editGoal) onUpdateGoal(editGoal.id, form)
    else onCreateGoal(form)
    setEditGoal(null)
  }

  function handleToggleStatus(id, newStatus) {
    onUpdateGoal(id, { status: newStatus, ...(newStatus === 'completed' ? { progress: 100 } : {}) })
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-t0 text-2xl font-semibold tracking-tight">Metas de Longo Prazo</h1>
          <p className="text-t1 text-sm mt-1">{totalActive} ativas · {totalCompleted} concluídas</p>
        </div>
        <button
          onClick={() => { setEditGoal(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'var(--am)' }}
        >
          <Plus className="w-4 h-4" />
          Nova Meta
        </button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Metas Ativas',     value: totalActive,    color: 'var(--ac)',  icon: Target },
          { label: 'Concluídas',       value: totalCompleted, color: 'var(--tc)',  icon: CheckCircle2 },
          { label: 'Progresso Médio',  value: `${avgProgress}%`, color: 'var(--am)', icon: TrendingUp },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-b2 border border-bd rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <p className="text-t0 font-mono text-xl font-semibold">{value}</p>
              <p className="text-t2 text-xs">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-b2 p-1 rounded-xl border border-bd mb-5 w-fit">
        {[
          { id: 'active',    label: 'Ativas' },
          { id: 'paused',    label: 'Pausadas' },
          { id: 'completed', label: 'Concluídas' },
          { id: 'all',       label: 'Todas' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === tab.id ? 'bg-b3 text-t0' : 'text-t1 hover:text-t0 hover:bg-bh'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Goal grid */}
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 text-center py-16 text-t2"
            >
              <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma meta aqui.</p>
              {filter === 'active' && (
                <button
                  onClick={() => { setEditGoal(null); setModalOpen(true) }}
                  className="mt-3 text-am text-sm hover:underline"
                >
                  Criar primeira meta →
                </button>
              )}
            </motion.div>
          ) : (
            filtered.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={g => { setEditGoal(g); setModalOpen(true) }}
                onDelete={onDeleteGoal}
                onToggleStatus={handleToggleStatus}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <GoalModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditGoal(null) }}
        onSave={handleSave}
        goal={editGoal}
      />
    </div>
  )
}
