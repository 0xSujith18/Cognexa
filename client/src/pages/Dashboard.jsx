import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import {
  PlusCircle, TrendingUp, Award, Clock, ChevronRight,
  Brain, Target, BarChart3, Zap, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

const PERF_COLORS = {
  'Excellent':         'text-accent-emerald',
  'Good':              'text-accent-cyan',
  'Average':           'text-accent-amber',
  'Needs Improvement': 'text-accent-rose',
}
const SCORE_BG = score =>
  score >= 80 ? 'from-accent-emerald/20 to-accent-emerald/5 border-accent-emerald/30' :
  score >= 60 ? 'from-accent-cyan/20    to-accent-cyan/5    border-accent-cyan/30'    :
  score >= 40 ? 'from-accent-amber/20   to-accent-amber/5   border-accent-amber/30'   :
                'from-accent-rose/20    to-accent-rose/5    border-accent-rose/30'

function StatCard({ icon: Icon, label, value, sub, color = 'brand' }) {
  const colors = {
    brand:   'bg-brand-500/20   text-brand-400',
    cyan:    'bg-accent-cyan/20  text-accent-cyan',
    emerald: 'bg-accent-emerald/20 text-accent-emerald',
    amber:   'bg-accent-amber/20  text-accent-amber',
  }
  return (
    <div className="glass rounded-2xl p-5 hover:border-white/10 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm font-medium text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-4 py-3 text-sm">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-brand-400 font-semibold">{payload[0].value}pts</p>
    </div>
  )
}

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
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const completedSessions = sessions.filter(s => s.status === 'completed')
  const avgScore = analytics?.average_score ?? 0
  const trend = analytics?.trend ?? '—'

  return (
    <div className="p-8 animate-fade-in min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span className="text-gradient">{user?.name?.split(' ')[0] || 'there'}</span> 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">Here's how your interview prep is going.</p>
        </div>
        <Link to="/setup" id="new-interview-btn" className="btn-primary">
          <PlusCircle size={18} /> New Interview
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Brain}    label="Total Sessions"    value={sessions.length}              sub="All time"          color="brand"   />
            <StatCard icon={CheckCircle} label="Completed"      value={completedSessions.length}     sub="Fully evaluated"   color="emerald" />
            <StatCard icon={TrendingUp} label="Average Score"   value={`${Math.round(avgScore)}/100`} sub="Across all sessions" color="cyan" />
            <StatCard icon={BarChart3}  label="Trend"           value={trend}                        sub="Recent performance" color="amber"  />
          </div>

          {/* Chart + Insights */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Score trend chart */}
            <div className="lg:col-span-2 glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-200">Score Trend</h2>
                <span className="badge bg-brand-500/20 text-brand-400">Last 10 sessions</span>
              </div>
              {completedSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-600">
                  <BarChart3 size={36} className="mb-3 opacity-30" />
                  <p className="text-sm">Complete your first interview to see trends</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={completedSessions.slice(-10).map((s, i) => ({
                    name: `#${i + 1}`, score: s.result?.overall_score ?? 0
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5}
                      dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* AI Insights */}
            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold text-gray-200 mb-4">AI Insights</h2>
              {analytics?.recommendations?.length > 0 ? (
                <ul className="space-y-3">
                  {analytics.recommendations.slice(0, 4).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                      <Zap size={14} className="text-brand-400 mt-0.5 shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-600 text-sm text-center">
                  <Target size={30} className="mb-2 opacity-30" />
                  Complete sessions to unlock personalized AI insights.
                </div>
              )}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-200">Recent Sessions</h2>
            </div>
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-600">
                <Brain size={48} className="mb-4 opacity-20" />
                <p className="text-base font-medium text-gray-500 mb-2">No interviews yet</p>
                <p className="text-sm mb-5">Start your first AI-powered interview to see results here.</p>
                <Link to="/setup" className="btn-primary">
                  <PlusCircle size={16} /> Start Interview
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.slice().reverse().slice(0, 8).map(session => (
                  <div key={session._id}
                    className={`flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r ${SCORE_BG(session.result?.overall_score ?? 0)} hover:scale-[1.01] transition-all duration-200 cursor-pointer`}
                    onClick={() => session.status === 'completed' && navigate(`/results/${session._id}`)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center text-brand-400 shrink-0">
                      <Brain size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-200 text-sm">{session.role}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {session.level} · {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {session.status === 'completed' ? (
                        <>
                          <p className="text-lg font-bold text-white">{session.result?.overall_score ?? '—'}</p>
                          <p className={`text-xs font-medium ${PERF_COLORS[session.result?.performance_level] ?? 'text-gray-400'}`}>
                            {session.result?.performance_level ?? ''}
                          </p>
                        </>
                      ) : (
                        <span className="badge bg-accent-amber/20 text-accent-amber">In Progress</span>
                      )}
                    </div>
                    {session.status === 'completed' && (
                      <ChevronRight size={16} className="text-gray-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
