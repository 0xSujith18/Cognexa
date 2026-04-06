import Session from '../models/Session.js'
import {
  generateQuestions,
  evaluateAnswer,
  generateReport,
  analyzeHistory,
} from '../services/aiService.js'

// POST /api/sessions/create
export async function createSession(req, res) {
  try {
    const { role, level, techStack = [] } = req.body
    if (!role || !level)
      return res.status(400).json({ message: 'Role and level are required.' })

    const questions = await generateQuestions(role, level, techStack)

    const session = await Session.create({
      user: req.user.id,
      role,
      level,
      techStack,
      questions,
      status: 'in-progress',
    })

    res.status(201).json({ session })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/sessions/:id
export async function getSession(req, res) {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user.id })
    if (!session) return res.status(404).json({ message: 'Session not found.' })
    res.json({ session })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/sessions/my
export async function getMySessions(req, res) {
  try {
    const sessions = await Session.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json({ sessions })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/sessions/:id/answer
export async function submitAnswer(req, res) {
  try {
    const { questionIndex, answer } = req.body
    const session = await Session.findOne({ _id: req.params.id, user: req.user.id })
    if (!session) return res.status(404).json({ message: 'Session not found.' })

    const question = session.questions[questionIndex]
    if (!question) return res.status(400).json({ message: 'Invalid question index.' })

    // AI Evaluate
    const evaluation = await evaluateAnswer(question, answer)
    session.questions[questionIndex].answer     = answer
    session.questions[questionIndex].evaluation = evaluation
    session.currentIndex = questionIndex + 1

    // If last question — finalize
    const isLast = questionIndex + 1 >= session.questions.length
    if (isLast) {
      const report = await generateReport(session.role, session.level, session.questions)

      // Compute average sub-scores
      const keys = ['technical_accuracy', 'completeness', 'clarity', 'relevance', 'examples']
      const avg  = Object.fromEntries(keys.map(k => [
        k,
        Math.round(session.questions.reduce((acc, q) => acc + (q.evaluation?.scores?.[k] || 0), 0) / session.questions.length),
      ]))
      report.avg_scores = avg

      session.result = report
      session.status = 'completed'
    }

    session.markModified('questions')
    await session.save()

    res.json({
      evaluation,
      isComplete: isLast,
      nextIndex: session.currentIndex,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/sessions/analytics
export async function getAnalytics(req, res) {
  try {
    const sessions = await Session.find({ user: req.user.id, status: 'completed' }).sort({ createdAt: 1 })
    const analytics = await analyzeHistory(sessions)
    res.json(analytics)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
