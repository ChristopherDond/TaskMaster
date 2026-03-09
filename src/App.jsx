import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { calcTaskPoints, checkNewAchievements, getLevel } from './lib/scoring'
import Auth from './components/Auth'
import Sidebar from './components/Sidebar'
import Dashboard from './views/Dashboard'
import TasksView from './views/TasksView'
import CalendarView from './views/CalendarView'
import GoalsView from './views/GoalsView'
import { Zap } from 'lucide-react'

// ─── Achievement Toast ─────────────────────────────────────────
function AchievementToast({ achievement, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed top-5 right-5 z-50 bg-b2 border border-ac/40 rounded-2xl px-5 py-4 shadow-2xl glow-ac max-w-xs"
    >
      <p className="text-t2 text-[10px] uppercase tracking-wider mb-1 font-medium">Conquista desbloqueada!</p>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{achievement.icon}</span>
        <div>
          <p className="text-t0 font-semibold text-sm">{achievement.label}</p>
          <p className="text-t1 text-xs mt-0.5">{achievement.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Loading Screen ────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#06060F] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-b2 border border-bd flex items-center justify-center">
        <Zap className="w-6 h-6 text-ac animate-pulse-slow" style={{ color: '#5865F9' }} />
      </div>
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: '#5865F9', borderTopColor: 'transparent' }} />
    </div>
  )
}

// ─── Main App ──────────────────────────────────────────────────
export default function App() {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [view,    setView]    = useState('dashboard')
  const [theme,   setTheme]   = useState('dark')

  // Data
  const [tasks,   setTasks]   = useState([])
  const [goals,   setGoals]   = useState([])
  const [profile, setProfile] = useState(null)

  // UI state
  const [toast, setToast] = useState(null)

  // ── Theme effect
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  // ── Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // ── Fetch data when user changes
  useEffect(() => {
    if (!user) return
    fetchTasks()
    fetchGoals()
    fetchProfile()
    updateStreak()
  }, [user])

  // ── Mark overdue tasks periodically
  useEffect(() => {
    if (!user) return
    const interval = setInterval(() => {
      setTasks(prev =>
        prev.map(t => {
          if (
            (t.status === 'pending' || t.status === 'in_progress') &&
            t.deadline && new Date(t.deadline) < new Date()
          ) {
            return { ...t, status: 'overdue' }
          }
          return t
        })
      )
    }, 60_000)
    return () => clearInterval(interval)
  }, [user])

  // ─────────────────────────────────────────────────────────────
  // DATA FETCHERS
  // ─────────────────────────────────────────────────────────────
  async function fetchTasks() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (data) setTasks(data)
  }

  async function fetchGoals() {
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (data) setGoals(data)
  }

  async function fetchProfile() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (data) setProfile(data)
  }

  async function updateStreak() {
    const today = new Date().toISOString().split('T')[0]
    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!prof) return

    const lastActive = prof.last_active
    if (lastActive === today) return // Already updated today

    let newStreak = 1
    if (lastActive) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yStr = yesterday.toISOString().split('T')[0]
      if (lastActive === yStr) {
        newStreak = (prof.streak_days || 0) + 1
      }
    }

    await supabase
      .from('profiles')
      .update({ streak_days: newStreak, last_active: today })
      .eq('id', user.id)

    setProfile(p => p ? { ...p, streak_days: newStreak, last_active: today } : p)
  }

  // ─────────────────────────────────────────────────────────────
  // TASK CRUD
  // ─────────────────────────────────────────────────────────────
  async function createTask(form) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...form, user_id: user.id }])
      .select()
      .single()
    if (!error && data) {
      setTasks(prev => [data, ...prev])
    }
  }

  async function updateTask(id, updates) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error && data) {
      setTasks(prev => prev.map(t => t.id === id ? data : t))
    }
  }

  async function deleteTask(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) setTasks(prev => prev.filter(t => t.id !== id))
  }

  async function completeTask(id) {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    const pts = calcTaskPoints(task)
    const now = new Date().toISOString()

    // Update task
    const { data: updatedTask } = await supabase
      .from('tasks')
      .update({ status: 'completed', completed_at: now, points_earned: pts })
      .eq('id', id)
      .select()
      .single()

    if (updatedTask) {
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t))
    }

    // Update profile points
    const newPoints = (profile?.total_points || 0) + pts
    const newLevel  = getLevel(newPoints).level

    // Check achievements
    const allTasks = tasks.map(t => t.id === id ? { ...t, status: 'completed', completed_at: now } : t)
    const allGoals = goals
    const stats = {
      totalCompleted:  allTasks.filter(t => t.status === 'completed').length,
      earlyCompletions: allTasks.filter(t => t.completed_at && t.deadline && new Date(t.completed_at) < new Date(t.deadline)).length,
      streakDays:      profile?.streak_days || 0,
      weeklyCompleted: allTasks.filter(t => {
        const w = new Date(); w.setDate(w.getDate() - 7)
        return t.completed_at && new Date(t.completed_at) >= w
      }).length,
      goalsCompleted:  allGoals.filter(g => g.status === 'completed').length,
    }

    const newAchievements = checkNewAchievements(stats, profile?.achievements || [])

    const updatedAchievements = [
      ...(profile?.achievements || []),
      ...newAchievements.map(a => a.id),
    ]

    await supabase
      .from('profiles')
      .update({ total_points: newPoints, level: newLevel, achievements: updatedAchievements })
      .eq('id', user.id)

    setProfile(p => p ? { ...p, total_points: newPoints, level: newLevel, achievements: updatedAchievements } : p)

    // Show achievement toasts
    if (newAchievements.length > 0) {
      setToast(newAchievements[0])
    }
  }

  // ─────────────────────────────────────────────────────────────
  // GOALS CRUD
  // ─────────────────────────────────────────────────────────────
  async function createGoal(form) {
    const { data, error } = await supabase
      .from('goals')
      .insert([{ ...form, user_id: user.id }])
      .select()
      .single()
    if (!error && data) setGoals(prev => [data, ...prev])
  }

  async function updateGoal(id, updates) {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error && data) {
      setGoals(prev => prev.map(g => g.id === id ? data : g))

      // Award points for goal completion
      if (updates.status === 'completed') {
        const pts = 200
        const newPoints = (profile?.total_points || 0) + pts
        await supabase.from('profiles').update({ total_points: newPoints }).eq('id', user.id)
        setProfile(p => p ? { ...p, total_points: newPoints } : p)
      }
    }
  }

  async function deleteGoal(id) {
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (!error) setGoals(prev => prev.filter(g => g.id !== id))
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  if (loading) return <LoadingScreen />
  if (!user)   return <Auth />

  return (
    <div className="flex min-h-screen bg-b0 text-t0">
      <Sidebar
        view={view}
        setView={setView}
        user={user}
        theme={theme}
        setTheme={setTheme}
        profile={profile}
      />

      <main className="flex-1 overflow-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="min-h-screen"
          >
            {view === 'dashboard' && (
              <Dashboard tasks={tasks} goals={goals} profile={profile} />
            )}
            {view === 'tasks' && (
              <TasksView
                tasks={tasks}
                onCreateTask={createTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onCompleteTask={completeTask}
              />
            )}
            {view === 'calendar' && (
              <CalendarView tasks={tasks} />
            )}
            {view === 'goals' && (
              <GoalsView
                goals={goals}
                onCreateGoal={createGoal}
                onUpdateGoal={updateGoal}
                onDeleteGoal={deleteGoal}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Achievement Toast */}
      <AnimatePresence>
        {toast && (
          <AchievementToast
            achievement={toast}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
