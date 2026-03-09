import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Flag, Tag, AlignLeft, Save, Loader2 } from 'lucide-react'

const CATEGORIES = [
  { id: 'work',     label: 'Trabalho', color: '#5865F9', emoji: '💼' },
  { id: 'personal', label: 'Pessoal',  color: '#00D4A0', emoji: '🌱' },
  { id: 'goals',    label: 'Metas',    color: '#F5A623', emoji: '🎯' },
]

const PRIORITIES = [
  { id: 'low',    label: 'Baixa',  color: '#8B8BB8' },
  { id: 'medium', label: 'Média',  color: '#F5A623' },
  { id: 'high',   label: 'Alta',   color: '#FF4466' },
]

export default function TaskModal({ open, onClose, onSave, task = null }) {
  const [form, setForm] = useState({
    title:       '',
    description: '',
    deadline:    '',
    category:    'work',
    priority:    'medium',
    status:      'pending',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title || '',
        description: task.description || '',
        deadline:    task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
        category:    task.category || 'work',
        priority:    task.priority || 'medium',
        status:      task.status || 'pending',
      })
    } else {
      setForm({ title: '', description: '', deadline: '', category: 'work', priority: 'medium', status: 'pending' })
    }
  }, [task, open])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    const payload = {
      ...form,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    }
    await onSave(payload)
    setSaving(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div className="w-full max-w-lg bg-b2 border border-bd rounded-2xl shadow-2xl pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-bd">
                <h2 className="text-t0 font-semibold text-base">
                  {task ? 'Editar Tarefa' : 'Nova Tarefa'}
                </h2>
                <button onClick={onClose} className="text-t2 hover:text-t0 p-1.5 rounded-lg hover:bg-bh transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-t1 text-xs font-medium mb-1.5 uppercase tracking-wider">Título *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Nome da tarefa..."
                    required
                    className="w-full bg-b1 border border-bd text-t0 placeholder-t2 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ac transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-t1 text-xs font-medium mb-1.5 uppercase tracking-wider">
                    <AlignLeft className="inline w-3 h-3 mr-1" />Descrição
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Detalhes opcionais..."
                    rows={3}
                    className="w-full bg-b1 border border-bd text-t0 placeholder-t2 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ac transition-colors resize-none"
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-t1 text-xs font-medium mb-1.5 uppercase tracking-wider">
                    <Calendar className="inline w-3 h-3 mr-1" />Prazo (deadline)
                  </label>
                  <input
                    type="datetime-local"
                    value={form.deadline}
                    onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                    className="w-full bg-b1 border border-bd text-t0 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ac transition-colors [color-scheme:dark]"
                  />
                </div>

                {/* Category + Priority row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-t1 text-xs font-medium mb-1.5 uppercase tracking-wider">
                      <Tag className="inline w-3 h-3 mr-1" />Categoria
                    </label>
                    <div className="space-y-1.5">
                      {CATEGORIES.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, category: c.id }))}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${
                            form.category === c.id
                              ? 'border-current text-t0'
                              : 'border-bd text-t1 hover:bg-bh'
                          }`}
                          style={form.category === c.id ? { borderColor: c.color, background: `${c.color}15`, color: c.color } : {}}
                        >
                          <span>{c.emoji}</span>
                          <span className="font-medium text-xs">{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-t1 text-xs font-medium mb-1.5 uppercase tracking-wider">
                      <Flag className="inline w-3 h-3 mr-1" />Prioridade
                    </label>
                    <div className="space-y-1.5">
                      {PRIORITIES.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, priority: p.id }))}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${
                            form.priority === p.id
                              ? 'border-current'
                              : 'border-bd text-t1 hover:bg-bh'
                          }`}
                          style={form.priority === p.id ? { borderColor: p.color, background: `${p.color}15`, color: p.color } : {}}
                        >
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: p.color }}
                          />
                          <span className="font-medium text-xs">{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status (only when editing) */}
                {task && (
                  <div>
                    <label className="block text-t1 text-xs font-medium mb-1.5 uppercase tracking-wider">Status</label>
                    <select
                      value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full bg-b1 border border-bd text-t0 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ac transition-colors"
                    >
                      <option value="pending">Pendente</option>
                      <option value="in_progress">Em progresso</option>
                      <option value="completed">Concluída</option>
                    </select>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 bg-b1 border border-bd text-t1 hover:text-t0 rounded-xl text-sm font-medium hover:bg-bh transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-ac hover:bg-ac/90 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-ac disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {task ? 'Salvar' : 'Criar tarefa'}
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
