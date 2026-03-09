import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Filter, CheckCircle2, Circle, Pencil,
  Trash2, Clock, Tag, Flag, ChevronDown, Loader2,
  AlertCircle, CheckCheck
} from 'lucide-react'
import TaskModal from '../components/TaskModal'

const CATEGORY_META = {
  work:     { label: 'Trabalho', color: '#5865F9', emoji: '💼' },
  personal: { label: 'Pessoal',  color: '#00D4A0', emoji: '🌱' },
  goals:    { label: 'Metas',    color: '#F5A623', emoji: '🎯' },
}

const PRIORITY_META = {
  low:    { label: 'Baixa',  color: '#8B8BB8' },
  medium: { label: 'Média',  color: '#F5A623' },
  high:   { label: 'Alta',   color: '#FF4466' },
}

const STATUS_TABS = [
  { id: 'all',        label: 'Todas' },
  { id: 'pending',    label: 'Pendente' },
  { id: 'in_progress',label: 'Em progresso' },
  { id: 'completed',  label: 'Concluídas' },
  { id: 'overdue',    label: 'Atrasadas' },
]

function formatDeadline(dl) {
  if (!dl) return null
  const d    = new Date(dl)
  const now  = new Date()
  const diff = d - now
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days < -1)  return { label: `${Math.abs(days)}d atrasada`, color: 'var(--ar)', urgent: true }
  if (days < 0)   return { label: 'Atrasada',       color: 'var(--ar)', urgent: true }
  if (days === 0) return { label: 'Hoje!',           color: 'var(--am)', urgent: true }
  if (days === 1) return { label: 'Amanhã',          color: 'var(--am)', urgent: false }
  return { label: `Em ${days}d`, color: 'var(--t2)', urgent: false }
}

function TaskCard({ task, onComplete, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const dl = formatDeadline(task.deadline)
  const cat = CATEGORY_META[task.category] || CATEGORY_META.work
  const pri = PRIORITY_META[task.priority] || PRIORITY_META.medium
  const done = task.status === 'completed'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
      className={`group bg-b2 border rounded-xl px-5 py-4 flex items-start gap-4 transition-all hover:border-bd2 ${
        done ? 'opacity-50 border-bd' : 'border-bd hover:bg-b3'
      }`}
    >
      {/* Complete toggle */}
      <button
        onClick={() => !done && onComplete(task.id)}
        disabled={done}
        className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
      >
        {done
          ? <CheckCircle2 className="w-5 h-5 text-tc" />
          : <Circle className="w-5 h-5 text-t2 hover:text-ac transition-colors" />
        }
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <p className={`text-sm font-medium leading-snug ${done ? 'line-through text-t2' : 'text-t0'}`}>
            {task.title}
          </p>
          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={() => onEdit(task)}
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
                <button onClick={() => onDelete(task.id)} className="px-2 py-1 bg-ar text-white rounded-md text-[10px] font-semibold hover:bg-ar/80 transition-colors">
                  Sim
                </button>
                <button onClick={() => setConfirming(false)} className="px-2 py-1 bg-b3 text-t1 rounded-md text-[10px]">
                  Não
                </button>
              </div>
            )}
          </div>
        </div>

        {task.description && (
          <p className="text-t2 text-xs mt-1 leading-relaxed line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center gap-3 mt-2.5 flex-wrap">
          {/* Category */}
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md"
            style={{ background: `${cat.color}15`, color: cat.color }}>
            {cat.emoji} {cat.label}
          </span>

          {/* Priority */}
          <span className="inline-flex items-center gap-1 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: pri.color }} />
            <span style={{ color: pri.color }}>{pri.label}</span>
          </span>

          {/* Deadline */}
          {dl && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium">
              <Clock className="w-3 h-3" style={{ color: dl.color }} />
              <span style={{ color: dl.color }}>{dl.label}</span>
            </span>
          )}

          {/* Points earned (if completed) */}
          {done && task.points_earned > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-ac ml-auto">
              +{task.points_earned} pts
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function TasksView({ tasks, onCreateTask, onUpdateTask, onDeleteTask, onCompleteTask }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('deadline')

  const filtered = useMemo(() => {
    let list = [...tasks]

    // Status filter
    if (activeTab !== 'all') {
      if (activeTab === 'overdue') {
        list = list.filter(t =>
          t.status === 'overdue' ||
          (t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed')
        )
      } else {
        list = list.filter(t => t.status === activeTab)
      }
    }

    // Category filter
    if (categoryFilter !== 'all') {
      list = list.filter(t => t.category === categoryFilter)
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
      )
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline) - new Date(b.deadline)
      }
      if (sortBy === 'priority') {
        const p = { high: 0, medium: 1, low: 2 }
        return (p[a.priority] ?? 1) - (p[b.priority] ?? 1)
      }
      if (sortBy === 'created') {
        return new Date(b.created_at) - new Date(a.created_at)
      }
      return 0
    })
    return list
  }, [tasks, activeTab, search, categoryFilter, sortBy])

  function handleSaveTask(form) {
    if (editTask) {
      onUpdateTask(editTask.id, form)
    } else {
      onCreateTask(form)
    }
    setEditTask(null)
  }

  const counts = useMemo(() => ({
    pending:    tasks.filter(t => t.status === 'pending').length,
    in_progress:tasks.filter(t => t.status === 'in_progress').length,
    completed:  tasks.filter(t => t.status === 'completed').length,
    overdue:    tasks.filter(t => t.status === 'overdue' || (t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed')).length,
  }), [tasks])

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-t0 text-2xl font-semibold tracking-tight">Tarefas</h1>
          <p className="text-t1 text-sm mt-1">{tasks.length} tarefas no total</p>
        </div>
        <button
          onClick={() => { setEditTask(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-ac hover:bg-ac/90 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-ac"
        >
          <Plus className="w-4 h-4" />
          Nova Tarefa
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 bg-b2 p-1 rounded-xl border border-bd mb-5 overflow-x-auto">
        {STATUS_TABS.map(tab => {
          const count = tab.id === 'all' ? tasks.length : counts[tab.id] ?? 0
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-b3 text-t0'
                  : 'text-t1 hover:text-t0 hover:bg-bh'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  tab.id === 'overdue' && count > 0 ? 'bg-ar/20 text-ar' : 'bg-b1 text-t2'
                }`}>{count}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Filters row */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t2 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar tarefas..."
            className="w-full bg-b2 border border-bd text-t0 placeholder-t2 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-ac transition-colors"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-b2 border border-bd text-t1 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-ac transition-colors"
        >
          <option value="all">Todas categorias</option>
          <option value="work">💼 Trabalho</option>
          <option value="personal">🌱 Pessoal</option>
          <option value="goals">🎯 Metas</option>
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-b2 border border-bd text-t1 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-ac transition-colors"
        >
          <option value="deadline">Ordenar: Prazo</option>
          <option value="priority">Ordenar: Prioridade</option>
          <option value="created">Ordenar: Recentes</option>
        </select>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-t2"
            >
              <CheckCheck className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Nenhuma tarefa encontrada</p>
              {activeTab === 'all' && !search && (
                <button
                  onClick={() => { setEditTask(null); setModalOpen(true) }}
                  className="mt-3 text-ac text-sm hover:underline"
                >
                  Criar a primeira tarefa →
                </button>
              )}
            </motion.div>
          ) : (
            filtered.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onCompleteTask}
                onEdit={t => { setEditTask(t); setModalOpen(true) }}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null) }}
        onSave={handleSaveTask}
        task={editTask}
      />
    </div>
  )
}
