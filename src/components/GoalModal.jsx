import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Target, Calendar, Tag, AlignLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react'

const CATEGORIES = [
  { id: 'work',     label: 'Trabalho',   emoji: '💼' },
  { id: 'personal', label: 'Pessoal',    emoji: '🌱' },
  { id: 'health',   label: 'Saúde',      emoji: '🏃' },
  { id: 'learning', label: 'Aprendizado',emoji: '📚' },
  { id: 'finance',  label: 'Finanças',   emoji: '💰' },
]

export default function GoalModal({ open, onClose, onSave, goal = null }) {
  const [form, setForm] = useState({
    title:       '',
    description: '',
    target_date: '',
    category:    'personal',
    progress:    0,
    status:      'active',
  })
  const [milestones, setMilestones] = useState([])
  const [newMilestone, setNewMilestone] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (goal) {
      setForm({
        title:       goal.title || '',
        description: goal.description || '',
        target_date: goal.target_date || '',
        category:    goal.category || 'personal',
        progress:    goal.progress || 0,
        status:      goal.status || 'active',
      })
      setMilestones(goal.milestones || [])
    } else {
      setForm({ title: '', description: '', target_date: '', category: 'personal', progress: 0, status: 'active' })
      setMilestones([])
    }
  }, [goal, open])

  function addMilestone() {
    if (!newMilestone.trim()) return
    setMilestones(ms => [...ms, { id: Date.now(), text: newMilestone.trim(), done: false }])
    setNewMilestone('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    await onSave({ ...form, milestones })
    setSaving(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-b2 border border-bd rounded-2xl shadow-2xl pointer-events-auto my-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-bd">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-am" />
                  <h2 className="text-t0 font-semibold text-base">
                    {goal ? 'Editar Meta' : 'Nova Meta'}
                  </h2>
                </div>
                <button onClick={onClose} className="text-t2 hover:text-t0 p-1.5 rounded-lg hover:bg-bh transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-t1 text-xs font-medium mb-1.5 uppercase tracking-wider">Título *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Sua meta..."
                    required
                    className="w-full bg-b1 border border-bd text-t0 placeholder-t2 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-am transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-t1 text-xs font-medium mb-1.5 uppercase tracking-wider">
                    <AlignLeft className="inline w-3 h-3 mr-1" />Descrição
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Por que essa meta é importante..."
                    rows={2}
                    className="w-full bg-b1 border border-bd text-t0 placeholder-t2 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-am transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-t1 text-xs font-medium mb-1.5 uppercase tracking-wider">
                      <Calendar className="inline w-3 h-3 mr-1" />Data alvo
                    </label>
                    <input
                      type="date"
                      value={form.target_date}
                      onChange={e => setForm(f => ({ ...f, target_date: e.target.value }))}
                      className="w-full bg-b1 border border-bd text-t0 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-am transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-t1 text-xs font-medium mb-1.5 uppercase tracking-wider">
                      <Tag className="inline w-3 h-3 mr-1" />Categoria
                    </label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-b1 border border-bd text-t0 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-am transition-colors"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Progress slider (only when editing) */}
                {goal && (
                  <div>
                    <label className="block text-t1 text-xs font-medium mb-2 uppercase tracking-wider">
                      Progresso: <span className="text-am font-mono">{form.progress}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={form.progress}
                      onChange={e => setForm(f => ({ ...f, progress: +e.target.value }))}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Milestones */}
                <div>
                  <label className="block text-t1 text-xs font-medium mb-2 uppercase tracking-wider">Marcos / Milestones</label>
                  <div className="space-y-1.5 mb-2 max-h-32 overflow-y-auto">
                    {milestones.map((m, i) => (
                      <div key={m.id || i} className="flex items-center gap-2 bg-b1 rounded-lg px-3 py-2">
                        <input
                          type="checkbox"
                          checked={m.done}
                          onChange={() => setMilestones(ms => ms.map((x, xi) => xi === i ? { ...x, done: !x.done } : x))}
                          className="accent-am"
                        />
                        <span className={`flex-1 text-sm ${m.done ? 'line-through text-t2' : 'text-t0'}`}>{m.text}</span>
                        <button
                          type="button"
                          onClick={() => setMilestones(ms => ms.filter((_, xi) => xi !== i))}
                          className="text-t2 hover:text-ar transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMilestone}
                      onChange={e => setNewMilestone(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMilestone())}
                      placeholder="Adicionar marco..."
                      className="flex-1 bg-b1 border border-bd text-t0 placeholder-t2 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-am transition-colors"
                    />
                    <button
                      type="button"
                      onClick={addMilestone}
                      className="px-3 py-2 bg-am/10 border border-am/30 text-am rounded-lg hover:bg-am/20 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-b1 border border-bd text-t1 hover:text-t0 rounded-xl text-sm font-medium hover:bg-bh transition-colors">
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-am hover:bg-am/90 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                    style={{ backgroundColor: 'var(--am)' }}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {goal ? 'Salvar' : 'Criar meta'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
