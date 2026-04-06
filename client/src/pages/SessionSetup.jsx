import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Briefcase, GraduationCap, Code2, ArrowRight, Brain,
  ChevronDown, Sparkles, AlertCircle, Cpu
} from 'lucide-react'

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'Data Analyst', 'Data Scientist',
  'DevOps Engineer', 'Cloud Engineer', 'Machine Learning Engineer',
  'QA Engineer', 'Product Manager', 'UI/UX Designer',
]

const LEVELS = [
  { value: 'Fresher',  label: 'Fresher',  desc: 'Fundamentals & basics',      color: 'accent-emerald' },
  { value: 'Junior',   label: 'Junior',   desc: 'Applied concepts (0–2 yrs)',  color: 'accent-cyan'    },
  { value: 'Mid',      label: 'Mid-Level',desc: 'Real-world problems (2–5 yrs)', color: 'accent-amber' },
  { value: 'Senior',   label: 'Senior',   desc: 'System design & tradeoffs',   color: 'accent-rose'    },
]

const STACKS = [
  'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Django',
  'FastAPI', 'Java', 'Spring Boot', 'Go', 'MongoDB', 'PostgreSQL',
  'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'GraphQL', 'Redis',
]

export default function SessionSetup() {
  const [role,  setRole]  = useState('')
  const [level, setLevel] = useState('')
  const [stack, setStack] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function toggleStack(s) {
    setStack(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  async function handleStart(e) {
    e.preventDefault()
    if (!role || !level) { setError('Please select a role and experience level.'); return }
    setError('')
    setLoading(true)
    try {
      const { data } = await axios.post('/api/sessions/create', { role, level, techStack: stack })
      navigate(`/interview/${data.session._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start session. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-brand-400" />
          <span className="section-label">Setup</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Configure Your Interview</h1>
        <p className="text-gray-400 text-sm mt-1">
          Cognexa will generate 10 adaptive questions tailored to your role and level.
        </p>
      </div>

      <form onSubmit={handleStart} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 text-accent-rose text-sm bg-accent-rose/10 border border-accent-rose/20 rounded-xl px-4 py-3 animate-fade-in">
            <AlertCircle size={15} />{error}
          </div>
        )}

        {/* Role */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={18} className="text-brand-400" />
            <h2 className="font-semibold text-gray-200">Target Role</h2>
            <span className="text-accent-rose ml-1 text-sm">*</span>
          </div>
          <div className="relative">
            <select id="role-select" value={role} onChange={e => setRole(e.target.value)}
              className="input appearance-none pr-10 cursor-pointer">
              <option value="">Select a role…</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Level */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={18} className="text-brand-400" />
            <h2 className="font-semibold text-gray-200">Experience Level</h2>
            <span className="text-accent-rose ml-1 text-sm">*</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {LEVELS.map(({ value, label, desc, color }) => (
              <button key={value} type="button" id={`level-${value.toLowerCase()}`}
                onClick={() => setLevel(value)}
                className={`p-4 rounded-xl border text-left transition-all duration-200
                  ${level === value
                    ? `bg-brand-600/20 border-brand-500/40 shadow-lg shadow-brand-600/10`
                    : 'bg-surface-700/50 border-white/5 hover:border-white/15'
                  }`}>
                <p className="font-semibold text-sm text-white">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Code2 size={18} className="text-brand-400" />
            <h2 className="font-semibold text-gray-200">Tech Stack Focus</h2>
            <span className="text-gray-500 text-xs ml-auto">(Optional)</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">Select technologies to tailor questions toward.</p>
          <div className="flex flex-wrap gap-2">
            {STACKS.map(s => (
              <button key={s} type="button"
                onClick={() => toggleStack(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
                  ${stack.includes(s)
                    ? 'bg-brand-600/25 border-brand-500/40 text-brand-300'
                    : 'bg-surface-700/50 border-white/5 text-gray-400 hover:border-white/15 hover:text-gray-300'
                  }`}>
                {s}
              </button>
            ))}
          </div>
          {stack.length > 0 && (
            <p className="text-xs text-brand-400 mt-3 font-medium">
              {stack.length} technology{stack.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Preview + Submit */}
        {(role || level) && (
          <div className="glass-light rounded-2xl p-5 border border-brand-500/20 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={15} className="text-brand-400" />
              <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest">Session Preview</span>
            </div>
            <p className="text-white font-medium">
              {role || '—'}{level ? ` (${level})` : ''}
              {stack.length > 0 ? ` · ${stack.join(', ')}` : ''}
            </p>
            <p className="text-xs text-gray-500 mt-1">10 questions · 6 Technical · 2 Behavioral · 2 Situational</p>
          </div>
        )}

        <button id="start-interview-btn" type="submit" disabled={loading || !role || !level}
          className="btn-primary w-full justify-center py-4 text-base">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating questions…
            </span>
          ) : (
            <><Brain size={20} />Start AI Interview<ArrowRight size={18} /></>
          )}
        </button>
      </form>
    </div>
  )
}
