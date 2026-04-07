import { motion } from 'framer-motion'
import { Brain, ChevronRight, Clock, Award, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ActivityList({ sessions }) {
  const navigate = useNavigate()

  if (sessions.length === 0) {
    return (
      <div className="glass-morphism rounded-3xl p-16 flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold tracking-tight mb-2 text-main">No Interviews Yet</h3>
        <p className="text-muted max-w-sm text-sm font-medium">Your AI interview journey starts here. Take your first shot and track your growth.</p>
        <button 
           onClick={() => navigate('/setup')}
           className="btn-premium mt-8"
        >
          Start My First Interview
        </button>
      </div>
    )
  }

  return (
    <div className="glass-morphism rounded-3xl p-8 relative overflow-hidden">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-main">Recent Sessions</h2>
          <p className="text-xs text-muted font-bold tracking-wide uppercase mt-1">Live History</p>
        </div>
        <button className="text-xs font-bold text-brand-400 flex items-center gap-1 hover:gap-2 transition-all">
          View Full History <ChevronRight size={14} />
        </button>
      </div>

      <div className="space-y-4">
        {sessions.slice(0, 5).map((session, i) => (
          <motion.div
            key={session._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => session.status === 'completed' && navigate(`/results/${session._id}`)}
            className={`group p-5 rounded-3xl border border-white/5 bg-button-theme hover:bg-white/5 transition-all duration-300 cursor-pointer flex items-center gap-6 relative`}
          >
             {/* Left Icon */}
             <div className="w-12 h-12 rounded-2xl bg-brand-500/10 group-hover:bg-brand-500/20 text-brand-400 flex items-center justify-center transition-colors shadow-lg">
                <Star size={20} className={session.status === 'completed' ? 'fill-brand-400/20' : ''} />
             </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-base tracking-tight truncate text-main">{session.role}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-[9px] font-bold text-brand-400 uppercase tracking-widest leading-none">
                       {session.level}
                    </span>
                 </div>
                 <div className="flex items-center gap-4 text-xs font-bold text-muted tracking-wide">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(session.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5 uppercase font-bold text-[10px] tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-accent-violet">
                       {session.status}
                    </span>
                 </div>
              </div>

             {/* Score / Status Badge */}
             <div className="text-right">
                {session.status === 'completed' ? (
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
                      {session.result?.overall_score || 0}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      (session.result?.overall_score || 0) >= 80 ? 'text-emerald-400' : 
                      (session.result?.overall_score || 0) >= 60 ? 'text-cyan-400' : 
                      'text-rose-400'
                    }`}>
                      Score
                    </span>
                  </div>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                    In Progress
                  </span>
                )}
             </div>

             <div className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ml-2">
                <ChevronRight size={18} className="text-gray-600" />
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
