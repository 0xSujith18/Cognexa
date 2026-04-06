import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brain, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'

export default function Register() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent-violet/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-violet mb-4 glow-brand">
            <Brain size={30} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="text-gray-400 mt-1 text-sm">Start your AI-powered interview journey today</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {error && (
            <div className="flex items-center gap-2 text-accent-rose text-sm bg-accent-rose/10 border border-accent-rose/20 rounded-xl px-4 py-3 mb-5 animate-fade-in">
              <AlertCircle size={15} />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="reg-name" type="text" required value={name} onChange={e => setName(e.target.value)}
                  className="input pl-10" placeholder="Alex Johnson" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="reg-email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="input pl-10" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="reg-password" type={showPwd ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)} className="input pl-10 pr-10" placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button id="reg-submit" type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account…</span>
                : <><User size={16} />Create Account<ArrowRight size={16} /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
