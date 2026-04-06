import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import {
  Award, TrendingUp, ChevronDown, ChevronUp, Brain, RotateCcw,
  CheckCircle, XCircle, Lightbulb, BarChart3, Download, Sparkles, Star
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid
} from 'recharts'

const SCORE_COLOR = s =>
  s >= 80 ? '#10b981' : s >= 60 ? '#06b6d4' : s >= 40 ? '#f59e0b' : '#f43f5e'

const PERF_CONFIG = {
  'Excellent':         { color: 'text-accent-emerald', bg: 'bg-accent-emerald/20 border-accent-emerald/30', icon: '🏆' },
  'Good':              { color: 'text-accent-cyan',    bg: 'bg-accent-cyan/20    border-accent-cyan/30',    icon: '✅' },
  'Average':           { color: 'text-accent-amber',   bg: 'bg-accent-amber/20   border-accent-amber/30',   icon: '📊' },
  'Needs Improvement': { color: 'text-accent-rose',    bg: 'bg-accent-rose/20    border-accent-rose/30',    icon: '💡' },
}

function ScoreGauge({ score }) {
  const color = SCORE_COLOR(score)
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-bold text-white">{score}</p>
        <p className="text-xs text-gray-500">/ 100</p>
      </div>
    </div>
  )
}

function ScoreBar({ label, value, weight }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-gray-400 font-medium">{label}</span>
        <span className="text-gray-300 font-semibold">{value}/10 <span className="text-gray-600">({weight}%)</span></span>
      </div>
      <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value * 10}%`, backgroundColor: SCORE_COLOR(value * 10) }} />
      </div>
    </div>
  )
}

function QuestionAccordion({ q, idx }) {
  const [open, setOpen] = useState(false)
  const s = q.evaluation?.scores || {}
  const overall = q.evaluation?.overall_score ?? 0

  return (
    <div className={`glass-light rounded-xl overflow-hidden transition-all duration-200 border
      ${overall >= 70 ? 'border-accent-emerald/20' : overall >= 50 ? 'border-accent-amber/20' : 'border-accent-rose/20'}`}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/2 transition-colors">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ backgroundColor: SCORE_COLOR(overall) + '33', border: `1px solid ${SCORE_COLOR(overall)}44` }}>
          {idx + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-200 truncate">{q.question_text}</p>
          <p className="text-xs text-gray-500 mt-0.5 capitalize">{q.type} · {q.difficulty}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-lg font-bold" style={{ color: SCORE_COLOR(overall) }}>{overall}</span>
          {open ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </div>
      </button>

      {open && q.evaluation && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 animate-slide-up space-y-4">
          {/* Answer */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Your Answer</p>
            <p className="text-sm text-gray-300 bg-surface-700/50 rounded-xl p-4 leading-relaxed">{q.answer || '—'}</p>
          </div>

          {/* Score bars */}
          <div className="space-y-3">
            <ScoreBar label="Technical Accuracy" value={s.technical_accuracy ?? 0} weight={30} />
            <ScoreBar label="Completeness"        value={s.completeness ?? 0}        weight={25} />
            <ScoreBar label="Clarity"             value={s.clarity ?? 0}             weight={20} />
            <ScoreBar label="Relevance"           value={s.relevance ?? 0}           weight={15} />
            <ScoreBar label="Examples"            value={s.examples ?? 0}            weight={10} />
          </div>

          {/* Strengths */}
          {q.evaluation.strengths?.length > 0 && (
            <div>
              <p className="text-xs text-accent-emerald uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5">
                <CheckCircle size={12} />Strengths
              </p>
              <ul className="space-y-1.5">
                {q.evaluation.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-accent-emerald mt-0.5">▸</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {q.evaluation.improvements?.length > 0 && (
            <div>
              <p className="text-xs text-accent-amber uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5">
                <Lightbulb size={12} />Improvements
              </p>
              <ul className="space-y-1.5">
                {q.evaluation.improvements.map((imp, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-accent-amber mt-0.5">▸</span>{imp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ResultsView() {
  const { sessionId } = useParams()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await axios.get(`/api/sessions/${sessionId}`)
        setSession(data.session)
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    load()
  }, [sessionId])

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
    </div>
  )

  const report = session?.result
  if (!report) return (
    <div className="flex items-center justify-center h-screen">
      <div className="glass rounded-2xl p-8 text-center max-w-sm">
        <Brain size={36} className="text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No results found for this session.</p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-flex">Back to Dashboard</Link>
      </div>
    </div>
  )

  const perf = PERF_CONFIG[report.performance_level] || PERF_CONFIG['Average']
  const questions = session?.questions || []

  // Radar data
  const radarData = [
    { subject: 'Technical',   A: report.avg_scores?.technical_accuracy ?? 0 },
    { subject: 'Completeness',A: report.avg_scores?.completeness ?? 0 },
    { subject: 'Clarity',     A: report.avg_scores?.clarity ?? 0 },
    { subject: 'Relevance',   A: report.avg_scores?.relevance ?? 0 },
    { subject: 'Examples',    A: report.avg_scores?.examples ?? 0 },
  ]

  // Per-question bar data
  const barData = questions.map((q, i) => ({
    name: `Q${i + 1}`, score: q.evaluation?.overall_score ?? 0
  }))

  return (
    <div className="p-8 animate-fade-in max-w-4xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-brand-400" />
            <span className="section-label">Interview Complete</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Your Results</h1>
          <p className="text-gray-400 text-sm mt-0.5">{session?.role} · {session?.level}</p>
        </div>
        <Link to="/setup" className="btn-primary"><RotateCcw size={16} />New Interview</Link>
      </div>

      {/* Score hero */}
      <div className="glass rounded-2xl p-8 mb-6 flex flex-col md:flex-row items-center gap-8">
        <ScoreGauge score={report.overall_score} />
        <div className="flex-1 text-center md:text-left">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border mb-3 ${perf.bg}`}>
            <span>{perf.icon}</span>
            <span className={`font-bold text-lg ${perf.color}`}>{report.performance_level}</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed max-w-md">{report.final_feedback}</p>
          <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-sm font-semibold border
            ${report.hiring_decision === 'Hire'
              ? 'bg-accent-emerald/20 text-accent-emerald border-accent-emerald/30'
              : report.hiring_decision === 'Maybe'
                ? 'bg-accent-amber/20 text-accent-amber border-accent-amber/30'
                : 'bg-accent-rose/20 text-accent-rose border-accent-rose/30'
            }`}>
            <Star size={14} />
            Hiring Verdict: {report.hiring_decision}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Radar */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Award size={17} className="text-brand-400" /> Skill Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <BarChart3 size={17} className="text-brand-400" /> Per-Question Scores
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={v => [`${v}/100`, 'Score']}
                contentStyle={{ background: '#0f1021', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}
                labelStyle={{ color: '#9ca3af' }} itemStyle={{ color: '#a5b4fc' }} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {barData.map((e, i) => <Cell key={i} fill={SCORE_COLOR(e.score)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-accent-emerald mb-4 flex items-center gap-2">
            <CheckCircle size={16} /> Strengths
          </h2>
          <ul className="space-y-2">
            {report.strengths?.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                <span className="text-accent-emerald mt-0.5 shrink-0">▸</span>{s}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-accent-amber mb-4 flex items-center gap-2">
            <Lightbulb size={16} /> Areas to Improve
          </h2>
          <ul className="space-y-2">
            {report.weaknesses?.map((w, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                <span className="text-accent-amber mt-0.5 shrink-0">▸</span>{w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Per-question accordion */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-gray-200 mb-5 flex items-center gap-2">
          <TrendingUp size={17} className="text-brand-400" /> Detailed Question Review
        </h2>
        <div className="space-y-3">
          {questions.map((q, i) => <QuestionAccordion key={i} q={q} idx={i} />)}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 flex items-center gap-4 justify-center">
        <Link to="/dashboard" className="btn-secondary">
          <BarChart3 size={16} /> View Dashboard
        </Link>
        <Link to="/setup" className="btn-primary">
          <RotateCcw size={16} /> Practice Again
        </Link>
      </div>
    </div>
  )
}
