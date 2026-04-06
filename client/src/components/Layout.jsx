import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Brain, LayoutDashboard, PlusCircle, LogOut, ChevronRight, Sparkles
} from 'lucide-react'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', label: 'Dashboard',        icon: LayoutDashboard },
    { to: '/setup',     label: 'New Interview',     icon: PlusCircle },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/5 flex flex-col fixed h-full z-20">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center glow-sm">
              <Brain size={18} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">Cognexa</span>
              <div className="flex items-center gap-1">
                <Sparkles size={10} className="text-brand-400" />
                <span className="text-xs text-brand-400 font-medium">AI Interviewer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                 ${isActive
                   ? 'bg-brand-600/20 text-brand-300 border border-brand-500/20'
                   : 'text-gray-400 hover:text-white hover:bg-surface-600'
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} className={isActive ? 'text-brand-400' : ''} />
                  <span>{label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-brand-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-ghost w-full justify-start text-gray-400">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
