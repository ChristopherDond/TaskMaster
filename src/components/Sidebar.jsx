import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, CheckSquare, Calendar, Target, Sun, Moon, LogOut, Zap, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getLevel, getNextLevel } from '../lib/scoring'

const NAV = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'tasks',     label: 'Tarefas',    icon: CheckSquare },
  { id: 'calendar',  label: 'Calendário', icon: Calendar },
  { id: 'goals',     label: 'Metas',      icon: Target },
]

export default function Sidebar({ view, setView, user, theme, setTheme, profile }) {
  const isDark = theme === 'dark'

  const points = profile?.total_points ?? 0
  const lvl    = getLevel(points)
  const { pct, pointsNeeded, next } = getNextLevel(points)
  const streak = profile?.streak_days ?? 0

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <aside className="w-64 min-h-screen bg-b1 border-r border-bd flex flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-bd">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-ac/10 border border-ac/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-ac" />
          </div>
          <div>
            <span className="text-t0 font-semibold text-sm tracking-tight">TaskMaster</span>
            <p className="text-t2 text-[10px] font-mono">PRODUCTIVITY OS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(item => {
          const Icon    = item.icon
          const active  = view === item.id
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                active
                  ? 'bg-ac/10 text-ac'
                  : 'text-t1 hover:bg-bh hover:text-t0'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute inset-0 bg-ac/10 rounded-xl border border-ac/20"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon className={`w-4 h-4 relative z-10 transition-all ${active ? 'text-ac' : 'text-t2 group-hover:text-t1'}`} />
              <span className="relative z-10">{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto text-ac relative z-10" />}
            </button>
          )
        })}
      </nav>

      {/* Profile / Level card */}
      <div className="p-3 border-t border-bd">
        <div className="bg-b2 border border-bd rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-t0 text-xs font-semibold truncate max-w-[120px]">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-t2 text-[10px] font-mono mt-0.5" style={{ color: lvl.color }}>
                LVL {lvl.level} · {lvl.label}
              </p>
            </div>
            <div className="text-right">
              <p className="text-ac font-mono font-semibold text-sm">{points.toLocaleString()}</p>
              <p className="text-t2 text-[10px]">pts</p>
            </div>
          </div>

          {/* Level progress bar */}
          {next && (
            <>
              <div className="h-1 bg-b3 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-ac rounded-full"
                />
              </div>
              <p className="text-t2 text-[10px] mt-1">{pointsNeeded} pts para {next.label}</p>
            </>
          )}

          {/* Streak */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs">🔥</span>
            <span className="text-t1 text-[11px] font-medium">{streak} dias de streak</span>
          </div>
        </div>

        {/* Theme + Logout */}
        <div className="flex gap-2">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-b2 border border-bd text-t1 hover:text-t0 rounded-lg text-xs hover:bg-bh transition-colors"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            {isDark ? 'Light' : 'Dark'}
          </button>
          <button
            onClick={signOut}
            className="flex items-center justify-center p-2 bg-b2 border border-bd text-t1 hover:text-ar rounded-lg hover:bg-ar/10 hover:border-ar/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
