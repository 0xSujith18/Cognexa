import { motion } from 'framer-motion'
import { Brain, CheckCircle, TrendingUp, BarChart3, ArrowUpRight } from 'lucide-react'

const stats = [
  { label: 'Total Sessions',    key: 'total',     icon: Brain,       color: 'indigo' },
  { label: 'Completed',         key: 'completed', icon: CheckCircle, color: 'emerald' },
  { label: 'Average Score',     key: 'avg',       icon: TrendingUp,  color: 'cyan' },
  { label: 'Growth',            key: 'trend',     icon: BarChart3,   color: 'purple' },
]

export default function DashboardStats({ sessions, analytics }) {
  const completedCount = sessions.filter(s => s.status === 'completed').length
  const avgScore = analytics?.average_score ?? 0
  const trendValue = analytics?.trend || '0%'

  const data = {
    total: sessions.length,
    completed: completedCount,
    avg: `${Math.round(avgScore)}/100`,
    trend: trendValue
  }

  const colors = {
    indigo:  'from-indigo-500/20 to-indigo-500/5 text-indigo-500 dark:text-indigo-400 border-indigo-500/20',
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-500 dark:text-emerald-400 border-emerald-500/20',
    cyan:    'from-cyan-500/20 to-cyan-500/5 text-cyan-500 dark:text-cyan-400 border-cyan-500/20',
    purple:  'from-purple-500/20 to-purple-500/5 text-purple-500 dark:text-purple-400 border-purple-500/20',
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-morphism rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}
          >
            {/* Background Glow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color === 'indigo' ? 'from-indigo-500/10' : stat.color === 'emerald' ? 'from-emerald-500/10' : stat.color === 'cyan' ? 'from-cyan-500/10' : 'from-purple-500/10'} to-transparent blur-2xl group-hover:opacity-100 opacity-50 transition-opacity`} />
            
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[stat.color]} flex items-center justify-center shadow-lg border-white/5`}>
                <Icon size={22} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted uppercase tracking-widest">
                Real-time <ArrowUpRight size={10} />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-bold tracking-tight text-main">{data[stat.key]}</h3>
              <p className="text-sm font-medium text-muted">{stat.label}</p>
            </div>

            {/* Micro-sparkline decoration */}
            <div className="mt-4 h-1 w-full bg-gray-500/10 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '60%' }}
                 transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                 className={`h-full bg-gradient-to-r ${stat.color === 'indigo' ? 'from-indigo-500' : stat.color === 'emerald' ? 'from-emerald-500' : stat.color === 'cyan' ? 'from-cyan-500' : 'from-purple-500'} to-transparent opacity-50`}
               />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
