import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Area, AreaChart, Legend
} from 'recharts'
import { Activity, Target } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DashboardCharts({ sessions, analytics }) {
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark')

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const isLight = theme === 'light'
  const chartTextColor = isLight ? '#4b5563' : '#9ca3af'
  const gridColor = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.03)'
  const tooltipBg = isLight ? 'rgba(255,255,255,0.95)' : 'rgba(15, 16, 33, 0.9)'
  const tooltipBorder = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)'

  const completedSessions = sessions.filter(s => s.status === 'completed')
  const chartData = completedSessions.slice(-8).map((s, i) => ({
    name: `S${i + 1}`,
    score: s.result?.overall_score || 0,
    technical: s.result?.avg_scores?.technical_accuracy || 0,
  }))

  const radarData = analytics?.average_scores ? [
    { subject: 'Technical', A: analytics.average_scores.technical_accuracy || 0, fullMark: 100 },
    { subject: 'Clarity',   A: analytics.average_scores.clarity || 0, fullMark: 100 },
    { subject: 'Relevance', A: analytics.average_scores.relevance || 0, fullMark: 100 },
    { subject: 'Examples',  A: analytics.average_scores.examples || 0, fullMark: 100 },
    { subject: 'Complete',  A: analytics.average_scores.completeness || 0, fullMark: 100 },
  ] : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Score Trend (Line) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2 glass-morphism rounded-3xl p-8 relative overflow-hidden group"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-500 dark:text-brand-400 flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-main">Performance Trend</h2>
              <p className="text-xs text-muted font-medium tracking-wide first-letter:uppercase">Last 8 completed interviews</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-button-theme border border-white/5 text-[10px] font-bold text-muted tracking-wider uppercase">
             Live Data
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: chartTextColor, fontSize: 11, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: chartTextColor, fontSize: 11, fontWeight: 600 }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: tooltipBg, 
                  border: `1px solid ${tooltipBorder}`, 
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  color: isLight ? '#111827' : '#f3f4f6'
                }}
                itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)"
                animationDuration={2000}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: isLight ? '#fff' : '#0a0b14' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Skills Analysis (Radar) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-morphism rounded-3xl p-8 group relative overflow-hidden"
      >
         <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent-violet/20 text-accent-violet flex items-center justify-center">
              <Target size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-main">Skills Radar</h2>
              <p className="text-xs text-muted font-bold tracking-wide">Competency breakdown</p>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center">
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke={gridColor} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: chartTextColor, fontSize: 10, fontWeight: 700 }} />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                    animationDuration={2000}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted font-bold text-sm bg-button-theme p-6 rounded-2xl border border-white/5">
                Complete an interview to see analysis
              </div>
            )}
          </div>
      </motion.div>
    </div>
  )
}
