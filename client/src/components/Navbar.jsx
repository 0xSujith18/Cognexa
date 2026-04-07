import { Search, Bell, Sun, Moon, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return (
    <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 bg-rgb(var(--surface-main))/80 backdrop-blur-md border-b border-white/5">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-muted group-focus-within:text-brand-400 transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Search for interviews, results..." 
          className="input-fancy pl-10"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:text-brand-400 transition-all active:scale-95"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-xl glass flex items-center justify-center hover:text-brand-400 transition-all active:scale-95">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full glow-indigo animate-pulse" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/[0.08]">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-main">{user?.name || 'Candidate'}</p>
            <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Premium Plan</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-brand-500/20 ring-2 ring-white/5 cursor-pointer">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}
