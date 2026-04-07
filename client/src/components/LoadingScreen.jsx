import { Brain, Sparkles } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-mesh flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glows (Subtle in both modes) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] animate-pulse-slow" />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center shadow-2xl shadow-brand-500/20 animate-bounce-in">
            <Brain size={40} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles size={20} className="text-brand-400 animate-pulse" />
          </div>
        </div>

        {/* Text and Spinner */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl font-black text-main tracking-tight">Cognexa</h2>
          <div className="flex items-center gap-3 text-muted font-bold">
            <div className="w-4 h-4 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            <span className="text-[10px] uppercase tracking-[0.2em] animate-pulse">Initializing simulation...</span>
          </div>
        </div>
      </div>

      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-brand-500 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent-violet to-transparent" />
      </div>
    </div>
  )
}
