import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CalendarDays, Clock, X } from 'lucide-react'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const CATEGORY_COLOR = {
  work:     '#5865F9',
  personal: '#00D4A0',
  goals:    '#F5A623',
}

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay  = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const days     = []

  // Previous month padding
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ date: d, current: false })
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ date: new Date(year, month, d), current: true })
  }

  // Next month padding
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    days.push({ date: new Date(year, month + 1, d), current: false })
  }
  return days
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export default function CalendarView({ tasks }) {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(null)

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  const days = useMemo(() => buildCalendarDays(year, month), [year, month])

  // Group tasks by date
  const tasksByDay = useMemo(() => {
    const map = {}
    for (const task of tasks) {
      if (!task.deadline) continue
      const key = new Date(task.deadline).toDateString()
      if (!map[key]) map[key] = []
      map[key].push(task)
    }
    return map
  }, [tasks])

  const selectedTasks = useMemo(() => {
    if (!selectedDay) return []
    return tasksByDay[selectedDay.toDateString()] || []
  }, [selectedDay, tasksByDay])

  const monthLabel = new Date(year, month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-t0 text-2xl font-semibold tracking-tight">Calendário</h1>
          <p className="text-t1 text-sm mt-1">Visão mensal dos prazos</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-xl bg-b2 border border-bd text-t1 hover:text-t0 hover:bg-bh transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-t0 font-semibold capitalize w-44 text-center">{monthLabel}</span>
          <button onClick={nextMonth} className="p-2 rounded-xl bg-b2 border border-bd text-t1 hover:text-t0 hover:bg-bh transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {/* Weekday headers */}
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-t2 text-xs font-semibold uppercase tracking-wider pb-2">
            {d}
          </div>
        ))}

        {/* Day cells */}
        {days.map(({ date, current }, i) => {
          const dayKey   = date.toDateString()
          const dayTasks = tasksByDay[dayKey] || []
          const isToday  = isSameDay(date, today)
          const isSel    = selectedDay && isSameDay(date, selectedDay)
          const hasTasks = dayTasks.length > 0

          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => current && setSelectedDay(isSel ? null : date)}
              className={`relative min-h-[72px] rounded-xl p-2 text-left transition-all border ${
                !current
                  ? 'opacity-20 cursor-default border-transparent'
                  : isSel
                  ? 'border-ac bg-ac/10'
                  : isToday
                  ? 'border-tc/50 bg-tc/5'
                  : hasTasks
                  ? 'border-bd2 bg-b2 hover:border-ac/40 hover:bg-b3 cursor-pointer'
                  : 'border-bd bg-b2 hover:border-bd2 cursor-pointer'
              }`}
            >
              <span className={`text-xs font-mono font-semibold ${
                isToday ? 'text-tc' : isSel ? 'text-ac' : current ? 'text-t0' : 'text-t2'
              }`}>
                {date.getDate()}
              </span>

              {/* Today indicator */}
              {isToday && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-tc" />
              )}

              {/* Task dots */}
              {dayTasks.length > 0 && (
                <div className="mt-1.5 space-y-1">
                  {dayTasks.slice(0, 3).map((t, ti) => (
                    <div
                      key={ti}
                      className="w-full h-1.5 rounded-full opacity-80"
                      style={{ background: CATEGORY_COLOR[t.category] || 'var(--ac)' }}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <p className="text-[10px] text-t2 font-mono">+{dayTasks.length - 3}</p>
                  )}
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Selected day panel */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="mt-6 bg-b2 border border-bd rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-ac" />
                <h3 className="text-t0 font-semibold text-sm">
                  {selectedDay.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <span className="text-t2 text-xs font-mono ml-1">
                  {selectedTasks.length} {selectedTasks.length === 1 ? 'tarefa' : 'tarefas'}
                </span>
              </div>
              <button onClick={() => setSelectedDay(null)} className="text-t2 hover:text-t0 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedTasks.length === 0 ? (
              <p className="text-t2 text-sm">Nenhuma tarefa com prazo neste dia.</p>
            ) : (
              <div className="space-y-2">
                {selectedTasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                      task.status === 'completed' ? 'border-bd opacity-50' : 'border-bd2 bg-b3'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: CATEGORY_COLOR[task.category] || 'var(--ac)' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-t2' : 'text-t0'}`}>
                        {task.title}
                      </p>
                      {task.deadline && (
                        <p className="text-t2 text-xs flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(task.deadline).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                      style={{
                        background: `${CATEGORY_COLOR[task.category] || 'var(--ac)'}18`,
                        color: CATEGORY_COLOR[task.category] || 'var(--ac)',
                      }}
                    >
                      {task.category === 'work' ? 'Trabalho' : task.category === 'personal' ? 'Pessoal' : 'Meta'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-5">
        <p className="text-t2 text-xs">Legenda:</p>
        {Object.entries(CATEGORY_COLOR).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full" style={{ background: color }} />
            <span className="text-t2 text-xs capitalize">
              {cat === 'work' ? 'Trabalho' : cat === 'personal' ? 'Pessoal' : 'Meta'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
