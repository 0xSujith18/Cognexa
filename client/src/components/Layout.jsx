import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Navbar from './Navbar'
import {
  Brain, LayoutDashboard, PlusCircle, History, BarChart3, 
  User as UserIcon, LogOut, ChevronRight, Sparkles
} from 'lucide-react'

export default function Layout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', label: 'Dashboard',       icon: LayoutDashboard },
    { to: '/setup',     label: 'Start Interview', icon: PlusCircle },
    { to: '/results',   label: 'Results',         icon: History },
    { to: '/analytics', label: 'Analytics',       icon: BarChart3 },
    { to: '/profile',   label: 'Profile',         icon: UserIcon },
  ]

  return (
    <div className="flex min-h-screen bg-rgb(var(--surface-main)) text-rgb(var(--text-main))">
      {/* Dynamic Background Blobs */}
      <div className="bg-blob w-[500px] h-[500px] bg-brand-500 top-[-10%] left-[-10%]" />
      <div className="bg-blob w-[400px] h-[400px] bg-accent-violet bottom-[10%] right-[-5%]" />

      {/* Sidebar */}
      <aside className="w-72 glass border-r border-white/5 flex flex-col fixed h-full z-40 transition-all duration-300">
        {/* Logo */}
        <div className="px-8 py-10">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform duration-300">
                <Brain size={22} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles size={14} className="text-brand-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-main">Cognexa</span>
              <p className="text-[10px] text-brand-400 font-bold uppercase tracking-widest leading-none mt-1">AI Studio</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden
                ${isActive 
                  ? 'nav-link-active' 
                  : 'text-muted hover:text-main hover:bg-button-theme'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon size={19} className={`transition-colors duration-300 ${isActive ? 'text-brand-400' : 'group-hover:text-brand-300'}`} />
                  <span className="relative z-10">{label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-brand-500 rounded-r-full glow-indigo"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <ChevronRight size={14} className={`ml-auto transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold text-muted hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300 active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-xl bg-button-theme flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
              <LogOut size={16} />
            </div>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-72 flex-1 flex flex-col min-h-screen relative z-10">
        <Navbar />
        
        <div className="flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="p-8 h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
