import { useState, useEffect, useCallback } from 'react'

export default function useVoiceToText() {
  const [transcript, setTranscript]   = useState('')
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)

  const supported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  useEffect(() => {
    if (!supported) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SpeechRecognition()
    rec.continuous      = true
    rec.interimResults  = true
    rec.lang            = 'en-US'

    rec.onresult = (event) => {
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript
        }
      }
      if (final) setTranscript(final.trim())
    }

    rec.onerror = () => setIsListening(false)
    rec.onend   = () => setIsListening(false)

    setRecognition(rec)
    return () => rec.abort()
  }, [supported])

  const startListening = useCallback(() => {
    if (!recognition) return
    setTranscript('')
    recognition.start()
    setIsListening(true)
  }, [recognition])

  const stopListening = useCallback(() => {
    if (!recognition) return
    recognition.stop()
    setIsListening(false)
  }, [recognition])

  return { transcript, isListening, startListening, stopListening, supported }
}
