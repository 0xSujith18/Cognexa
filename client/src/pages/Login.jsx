import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Brain, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, AlertCircle } from 'lucide-react'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-mesh">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/10 blur-[120px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-violet/10 blur-[120px] rounded-full animate-pulse-slow" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Branding Area */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-violet mb-6 shadow-xl shadow-brand-500/20 ring-1 ring-white/10"
          >
            <Brain size={30} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight text-main mb-2">Welcome back</h1>
          <p className="text-muted font-bold text-sm">Sign in to your AI preparation studio</p>
        </div>

        {/* Auth Card */}
        <div className="glass-morphism rounded-[2.5rem] p-10 relative overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -z-10" />

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 text-accent-rose text-sm bg-accent-rose/10 border border-accent-rose/20 rounded-2xl px-5 py-4 mb-6"
              >
                <AlertCircle size={18} className="shrink-0" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted tracking-widest uppercase ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-fancy pl-12"
                  placeholder="alex.johnson@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-muted tracking-widest uppercase">Password</label>
                <button type="button" className="text-[10px] font-bold text-brand-400 uppercase tracking-widest hover:text-brand-300 transition-colors">Forgot?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                </div>
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-fancy pl-12 pr-12"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-premium w-full h-[3.25rem] group overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="font-bold tracking-wide">Sign In to Dashboard</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </form>

          {/* Secondary Action */}
          <div className="text-center mt-10 space-y-4">
             <p className="text-sm text-muted">
               New to Cognexa?{' '}
               <Link to="/register" className="text-brand-400 font-extrabold hover:text-brand-300 transition-colors underline-offset-4 hover:underline">
                 Create dynamic account
               </Link>
             </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mt-12">
          Secure AI Authentication System &copy; 2025 Cognexa
        </p>
      </motion.div>
    </div>
  )
}
