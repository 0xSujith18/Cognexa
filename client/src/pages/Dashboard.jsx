import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { PlusCircle, Sparkles } from 'lucide-react'
import DashboardStats from '../components/dashboard/DashboardStats'
import DashboardCharts from '../components/dashboard/DashboardCharts'
import ActivityList from '../components/dashboard/ActivityList'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [sessRes, anaRes] = await Promise.all([
          axios.get('/api/sessions/my'),
          axios.get('/api/sessions/analytics'),
        ])
        setSessions(sessRes.data.sessions || [])
        setAnalytics(anaRes.data || {})
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-24 w-full bg-white/5 rounded-3xl" />
        <div className="grid grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl" />)}
        </div>
        <div className="h-64 w-full bg-white/5 rounded-3xl" />
      </div>
    )
  }

  const firstName = user?.name?.split(' ')[0] || 'Candidate'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-10 min-h-full pb-20">
      {/* Hero Greeting Section */}
      <section className="relative overflow-hidden group">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
         >
            <div className="space-y-2">
               <div className="flex items-center gap-2 mb-1">
                  <div className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-[10px] font-bold text-brand-400 uppercase tracking-widest shadow-lg">
                    Current Goal: System Design Interview
                  </div>
                  <Sparkles size={14} className="text-brand-400 animate-pulse" />
               </div>
               <h1 className="text-4xl font-extrabold tracking-tight text-main">
                  {greeting}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-accent-violet">{firstName}!</span>
               </h1>
               <p className="text-muted font-medium text-sm max-w-xl">
                  You've completed <span className="text-main font-bold">{sessions.length} sessions</span> this month. 
                  Ready for a new simulation to level up your skills?
               </p>
            </div>
            <Link 
              to="/setup" 
              className="btn-premium group flex items-center justify-center gap-3 px-8 shadow-xl shadow-brand-500/20 hover:scale-105 transition-all duration-300"
            >
              <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-500" />
              <span>Start New Simulation</span>
            </Link>
         </motion.div>
      </section>

      {/* Quick Stats Grid */}
      <section className="section-content">
         <DashboardStats sessions={sessions} analytics={analytics} />
      </section>

      {/* Analytics Visualization Section */}
      <section className="space-y-6">
         <div className="flex items-center gap-2 px-2">
            <h2 className="text-lg font-bold tracking-tight text-main">AI Analytics Engine</h2>
            <div className="h-0.5 w-12 bg-gradient-to-r from-brand-500 to-transparent opacity-30" />
         </div>
         <DashboardCharts sessions={sessions} analytics={analytics} />
      </section>

      {/* Recent Activity Section */}
      <section className="space-y-6">
         <div className="flex items-center gap-2 px-2">
            <h2 className="text-lg font-bold tracking-tight text-main">Recent Sessions</h2>
            <div className="h-0.5 w-12 bg-gradient-to-r from-brand-500 to-transparent opacity-30" />
         </div>
         <ActivityList sessions={sessions} />
      </section>

      {/* Decorative background gradients (scoped to page) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 blur-[150px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent-violet/10 blur-[120px] -z-10 rounded-full" />
    </div>
  )
}
