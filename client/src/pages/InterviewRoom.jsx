import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Mic, MicOff, Send, SkipForward, Brain, Clock, AlertTriangle,
  MessageSquare, Volume2, ChevronRight, Lightbulb, Loader2
} from 'lucide-react'
import useVoiceToText from '../hooks/useVoiceToText'

const TYPE_COLORS = {
  technical:   'bg-brand-500/20 text-brand-300 border-brand-500/30',
  behavioral:  'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30',
  situational: 'bg-accent-violet/20 text-accent-violet border-accent-violet/30',
}
const DIFF_COLORS = {
  easy:   'text-accent-emerald',
  medium: 'text-accent-amber',
  hard:   'text-accent-rose',
}

export default function InterviewRoom() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [session, setSession]       = useState(null)
  const [questions, setQuestions]   = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answer, setAnswer]         = useState('')
  const [showHint, setShowHint]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [elapsed, setElapsed]       = useState(0)
  const textareaRef = useRef(null)

  const { transcript, isListening, startListening, stopListening, supported } = useVoiceToText()

  // Merge voice transcript into answer
  useEffect(() => {
    if (transcript) setAnswer(prev => prev + (prev ? ' ' : '') + transcript)
  }, [transcript])

  // Timer
  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // Load session
  useEffect(() => {
    async function load() {
      try {
        const { data } = await axios.get(`/api/sessions/${sessionId}`)
        setSession(data.session)
        setQuestions(data.session.questions || [])
        setCurrentIdx(data.session.currentIndex || 0)
      } catch { setError('Failed to load interview session.') }
      finally { setLoading(false) }
    }
    load()
  }, [sessionId])

  const currentQ = questions[currentIdx]
  const progress  = questions.length ? ((currentIdx) / questions.length) * 100 : 0
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  async function handleSubmit() {
    if (!answer.trim()) return
    setSubmitting(true)
    try {
      await axios.post(`/api/sessions/${sessionId}/answer`, {
        questionIndex: currentIdx,
        answer: answer.trim(),
      })
      if (currentIdx + 1 >= questions.length) {
        navigate(`/results/${sessionId}`)
      } else {
        setCurrentIdx(i => i + 1)
        setAnswer('')
        setShowHint(false)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleVoiceToggle() {
    if (isListening) stopListening()
    else startListening()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading your interview session…</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="glass rounded-2xl p-8 text-center max-w-sm">
        <AlertTriangle size={36} className="text-accent-rose mx-auto mb-4" />
        <p className="text-gray-300">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="p-8 animate-fade-in max-w-3xl mx-auto min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center">
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-main">{session?.role}</p>
            <p className="text-xs text-muted font-bold">{session?.level} Level</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-muted text-sm font-bold">
            <Clock size={14} />
            <span className="font-mono">{fmt(elapsed)}</span>
          </div>
          <div className="bg-button-theme rounded-xl border border-white/5 px-3 py-1.5 text-xs text-muted font-bold">
            Q {currentIdx + 1} / {questions.length}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-button-theme rounded-full mb-8 overflow-hidden border border-white/5">
        <div className="h-full bg-gradient-to-r from-brand-500 to-accent-violet rounded-full transition-all duration-500 shadow-lg shadow-brand-500/20"
          style={{ width: `${progress}%` }} />
      </div>

      {currentQ && (
        <>
          {/* Question card */}
          <div className="glass rounded-3xl p-8 mb-5 animate-slide-up border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-6">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${TYPE_COLORS[currentQ.type] || 'bg-button-theme text-muted border-white/5'}`}>
                {currentQ.type}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-2 ${DIFF_COLORS[currentQ.difficulty] || 'text-muted'}`}>
                {currentQ.difficulty}
              </span>
            </div>

            <h2 className="text-xl font-bold text-main leading-relaxed mb-2">
              {currentQ.question_text}
            </h2>

            {/* Hint */}
            {showHint && currentQ.hint && (
              <div className="flex items-start gap-3 mt-4 bg-accent-amber/10 border border-accent-amber/20 rounded-xl px-4 py-3 animate-slide-up">
                <Lightbulb size={16} className="text-accent-amber mt-0.5 shrink-0" />
                <p className="text-sm text-accent-amber/80">{currentQ.hint}</p>
              </div>
            )}
          </div>

          {/* Answer area */}
          <div className="glass rounded-3xl p-6 mb-6 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} className="text-brand-400" />
              <span className="text-[10px] text-muted font-bold uppercase tracking-[0.2em]">Your Answer</span>
              {isListening && (
                <span className="ml-auto flex items-center gap-1.5 text-xs text-accent-rose font-bold">
                  <div className="w-2 h-2 bg-accent-rose rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                  Live Transcript…
                </span>
              )}
            </div>
            <textarea
              ref={textareaRef}
              id="answer-textarea"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={6}
              placeholder="Type your answer here, or use the microphone button for voice-to-text..."
              className="w-full bg-transparent border-0 focus:ring-0 p-0 text-main font-medium placeholder-muted/50 leading-relaxed resize-none text-base"
            />
          </div>

          {/* Action bar */}
          <div className="flex items-center gap-3">
            {/* Hint toggle */}
            <button id="hint-btn" onClick={() => setShowHint(h => !h)}
              className="btn-ghost text-accent-amber hover:bg-accent-amber/10">
              <Lightbulb size={16} />
              {showHint ? 'Hide Hint' : 'Get Hint'}
            </button>

            {/* Voice */}
            {supported && (
              <button id="voice-btn" onClick={handleVoiceToggle}
                className={`btn-ghost ${isListening ? 'text-accent-rose hover:bg-accent-rose/10 recording-pulse' : 'text-accent-cyan hover:bg-accent-cyan/10'}`}>
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                {isListening ? 'Stop' : 'Speak'}
              </button>
            )}

            <div className="flex-1" />

            {/* Submit */}
            <button id="submit-answer-btn" onClick={handleSubmit}
              disabled={submitting || !answer.trim()}
              className="btn-premium h-12 px-8">
              {submitting
                ? <><Loader2 size={16} className="animate-spin" /><span className="font-bold">Evaluating…</span></>
                : currentIdx + 1 >= questions.length
                  ? <><Send size={16} /><span className="font-bold">Finish Interview</span></>
                  : <><span className="font-bold">Submit & Next</span><ChevronRight size={16} /></>
              }
            </button>
          </div>
        </>
      )}
    </div>
  )
}
