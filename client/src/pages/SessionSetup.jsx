import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
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
        <h1 className="text-2xl font-bold text-main">Configure Your Interview</h1>
        <p className="text-muted text-sm mt-1">
          Cognexa will generate 5 adaptive questions tailored to your role and level.
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
            <h2 className="font-bold text-secondary">Target Role</h2>
            <span className="text-accent-rose ml-1 text-sm">*</span>
          </div>
          <div className="relative group">
            <select 
              id="role-select" 
              value={role} 
              onChange={e => setRole(e.target.value)}
              className="input-fancy pr-10 cursor-pointer appearance-none bg-button-theme"
            >
              <option value="" className="bg-card-theme">Select a role…</option>
              {ROLES.map(r => <option key={r} value={r} className="bg-card-theme">{r}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none group-focus-within:text-brand-400 transition-colors" />
          </div>
        </div>

        {/* Level */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={18} className="text-brand-400" />
            <h2 className="font-bold text-secondary">Experience Level</h2>
            <span className="text-accent-rose ml-1 text-sm">*</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {LEVELS.map(({ value, label, desc }) => (
              <button key={value} type="button" id={`level-${value.toLowerCase()}`}
                onClick={() => setLevel(value)}
                className={`p-4 rounded-xl border text-left transition-all duration-300
                  ${level === value
                    ? `bg-brand-500/10 border-brand-500 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]`
                    : 'bg-button-theme border-white/5 hover:border-brand-500/30'
                  }`}>
                <p className={`font-bold text-sm ${level === value ? 'text-brand-400' : 'text-main'}`}>{label}</p>
                <p className="text-xs text-muted mt-1 font-medium">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Code2 size={18} className="text-brand-400" />
            <h2 className="font-bold text-secondary">Tech Stack Focus</h2>
            <span className="text-muted text-xs ml-auto font-bold">(Optional)</span>
          </div>
          <p className="text-xs text-muted mb-5 font-medium">Select technologies to tailor questions toward.</p>
          <div className="flex flex-wrap gap-2">
            {STACKS.map(s => (
              <button key={s} type="button"
                onClick={() => toggleStack(s)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200
                  ${stack.includes(s)
                    ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/20 scale-105'
                    : 'bg-button-theme border-white/5 text-muted hover:border-brand-500/30 hover:text-main'
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-6 border border-brand-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={16} className="text-brand-400" />
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.2em]">Session Preview</span>
            </div>
            <p className="text-main font-bold text-lg">
              {role || '—'}{level ? ` (${level})` : ''}
            </p>
            {stack.length > 0 && (
              <p className="text-sm text-secondary font-medium mt-1">
                <span className="text-muted">Tech Focus:</span> {stack.join(', ')}
              </p>
            )}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.05]">
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest text-center">5 Questions Total</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse" />
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest text-center">AI Adaptive</span>
               </div>
            </div>
          </motion.div>
        )}

        <button id="start-interview-btn" type="submit" disabled={loading || !role || !level}
          className="btn-premium w-full h-14 justify-center text-base">
          {loading ? (
            <span className="flex items-center gap-3 font-bold">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating Environment…
            </span>
          ) : (
            <><Brain size={20} /><span className="font-bold tracking-wide">Start Secure Interview</span><ArrowRight size={20} /></>
          )}
        </button>
      </form>
    </div>
  )
}
