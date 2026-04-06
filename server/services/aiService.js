import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ── Fallback question bank (used when OpenAI is unavailable) ─────────────────
const FALLBACK_QUESTIONS = (role, level, stack) => [
  {
    question_id: 'fb_1',
    question_text: `Tell me about yourself and why you're interested in the ${role} role.`,
    type: 'behavioral', difficulty: 'easy',
    expected_keypoints: ['background', 'motivation', 'relevant skills'],
    ideal_answer: 'A concise, structured answer covering background, skills, and motivation.',
    hint: 'Use the STAR method: Situation, Task, Action, Result.',
  },
  {
    question_id: 'fb_2',
    question_text: `What are the core responsibilities of a ${role}?`,
    type: 'technical', difficulty: 'easy',
    expected_keypoints: ['key responsibilities', 'domain knowledge'],
    ideal_answer: `A ${role} is responsible for designing, building, and maintaining software solutions.`,
    hint: 'Think about daily tasks in this role.',
  },
  {
    question_id: 'fb_3',
    question_text: 'Describe a challenging technical problem you solved.',
    type: 'situational', difficulty: 'medium',
    expected_keypoints: ['problem definition', 'approach', 'outcome'],
    ideal_answer: 'Use STAR method to describe a real technical challenge.',
    hint: 'Focus on your thought process, not just the solution.',
  },
]

// ── Generate Questions ─────────────────────────────────────────────────────
export async function generateQuestions(role, level, techStack = []) {
  const stackStr = techStack.length ? `Tech stack focus: ${techStack.join(', ')}.` : ''
  const difficultyMap = {
    Fresher: 'fundamentals and basic concepts',
    Junior:  'applied concepts and practical problem-solving',
    Mid:     'real-world scenarios, debugging, system behaviour',
    Senior:  'system design, architecture decisions, tradeoffs',
  }

  const systemPrompt = `You are COGNEXA, an expert technical interviewer. Generate realistic, role-specific interview questions.
Always return valid JSON only — no markdown, no explanation.`

  const userPrompt = `Generate exactly 10 interview questions for a ${role} at ${level} experience level.
${stackStr}
Difficulty focus: ${difficultyMap[level] || 'general interview readiness'}.

Distribution:
- 6 technical questions
- 2 behavioral questions
- 2 situational questions

Increase complexity gradually. Questions must match real interview standards.

Return a JSON array with exactly this structure for each question:
{
  "question_id": "q_<number>",
  "question_text": "<question>",
  "type": "technical" | "behavioral" | "situational",
  "difficulty": "easy" | "medium" | "hard",
  "expected_keypoints": ["<key point>"],
  "ideal_answer": "<comprehensive ideal answer>",
  "hint": "<one sentence hint>"
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })
    const raw = completion.choices[0].message.content
    const parsed = JSON.parse(raw)
    // Handle both { questions: [...] } and bare array
    const questions = Array.isArray(parsed) ? parsed : (parsed.questions || Object.values(parsed)[0])
    return questions.slice(0, 10)
  } catch (err) {
    console.error('OpenAI question generation failed, using fallback:', err.message)
    return FALLBACK_QUESTIONS(role, level, techStack)
  }
}

// ── Evaluate Answer ────────────────────────────────────────────────────────
export async function evaluateAnswer(question, userAnswer) {
  const systemPrompt = `You are COGNEXA, a strict but fair interview evaluator.
Score answers objectively across 5 dimensions. Return valid JSON only.`

  const userPrompt = `Evaluate this interview answer.

Question: ${question.question_text}
Expected Keypoints: ${question.expected_keypoints?.join(', ') || 'N/A'}
Ideal Answer: ${question.ideal_answer || 'N/A'}
Candidate Answer: ${userAnswer}

Score each dimension from 0 to 10:
1. Technical Accuracy (weight: 30%) — correctness of technical content
2. Completeness (weight: 25%) — covers all important aspects
3. Clarity (weight: 20%) — well-structured and easy to follow
4. Relevance (weight: 15%) — stays on topic
5. Examples (weight: 10%) — uses real examples or analogies

Calculate: overall_score = (technical*3 + completeness*2.5 + clarity*2 + relevance*1.5 + examples*1) / 1  [0-100 scale]

Return JSON:
{
  "scores": {
    "technical_accuracy": <0-10>,
    "completeness": <0-10>,
    "clarity": <0-10>,
    "relevance": <0-10>,
    "examples": <0-10>
  },
  "overall_score": <0-100>,
  "strengths": ["<strength>"],
  "weaknesses": ["<weakness>"],
  "improvements": ["<actionable improvement>"]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })
    return JSON.parse(completion.choices[0].message.content)
  } catch (err) {
    console.error('OpenAI evaluation failed, using fallback:', err.message)
    // Fallback evaluation
    const words = userAnswer.split(' ').length
    const base  = Math.min(10, Math.max(2, Math.floor(words / 15)))
    return {
      scores: { technical_accuracy: base, completeness: base, clarity: base, relevance: base, examples: Math.max(1, base - 2) },
      overall_score: base * 10,
      strengths:    ['Answer provided'],
      weaknesses:   ['Could not fully evaluate — AI service temporarily unavailable'],
      improvements: ['Ensure your answer covers key technical concepts thoroughly'],
    }
  }
}

// ── Generate Final Report ──────────────────────────────────────────────────
export async function generateReport(role, level, questionEvaluations) {
  const systemPrompt = `You are COGNEXA. Generate a professional, realistic final interview report as valid JSON only.`

  const summaryData = questionEvaluations.map((q, i) => ({
    question: q.question_text,
    type: q.type,
    score: q.evaluation?.overall_score || 0,
  }))

  const avgScore = summaryData.reduce((a, b) => a + b.score, 0) / (summaryData.length || 1)

  const userPrompt = `Generate a final interview report for a ${role} (${level}) candidate.

Question scores: ${JSON.stringify(summaryData)}
Average score: ${avgScore.toFixed(1)}

Return JSON:
{
  "overall_score": <0-100 weighted average>,
  "performance_level": "Excellent" | "Good" | "Average" | "Needs Improvement",
  "strengths": ["<strength>"],
  "weaknesses": ["<weakness>"],
  "final_feedback": "<2-3 sentence honest professional feedback>",
  "hiring_decision": "Hire" | "Maybe" | "No Hire"
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
      temperature: 0.4,
      response_format: { type: 'json_object' },
    })
    return JSON.parse(completion.choices[0].message.content)
  } catch (err) {
    console.error('OpenAI report generation failed, using fallback:', err.message)
    const score = Math.round(avgScore)
    return {
      overall_score: score,
      performance_level: score >= 75 ? 'Good' : score >= 50 ? 'Average' : 'Needs Improvement',
      strengths:  ['Completed the interview session'],
      weaknesses: ['AI evaluation temporarily unavailable for detailed analysis'],
      final_feedback: `You completed the ${role} interview at ${level} level with an average score of ${score}/100. Review each question for improvement opportunities.`,
      hiring_decision: score >= 70 ? 'Maybe' : 'No Hire',
    }
  }
}

// ── Analyze History ────────────────────────────────────────────────────────
export async function analyzeHistory(sessions) {
  if (!sessions.length) {
    return { average_score: 0, trend: 'Stable', strongest_skill: 'N/A', weakest_skill: 'N/A', recommendations: ['Complete your first interview to get personalized insights.'] }
  }
  const scores   = sessions.map(s => s.result?.overall_score || 0)
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length

  let trend = 'Stable'
  if (scores.length >= 3) {
    const recent = scores.slice(-3).reduce((a, b) => a + b, 0) / 3
    const older  = scores.slice(0, -3).reduce((a, b) => a + b, 0) / Math.max(1, scores.length - 3)
    if (recent > older + 5) trend = 'Improving'
    else if (recent < older - 5) trend = 'Declining'
  }

  const systemPrompt = `You are COGNEXA. Analyze performance data and return valid JSON only.`
  const userPrompt = `Analyze this candidate's interview history.
Scores: ${JSON.stringify(scores)}
Average: ${avgScore.toFixed(1)}
Trend: ${trend}

Return JSON:
{
  "average_score": ${Math.round(avgScore)},
  "trend": "${trend}",
  "strongest_skill": "<skill>",
  "weakest_skill": "<skill>",
  "recommendations": ["<actionable recommendation>"]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
      temperature: 0.4,
      response_format: { type: 'json_object' },
    })
    return JSON.parse(completion.choices[0].message.content)
  } catch {
    return {
      average_score: Math.round(avgScore),
      trend,
      strongest_skill: 'Communication',
      weakest_skill: 'Technical Depth',
      recommendations: [
        'Practice explaining technical concepts clearly.',
        'Work on concrete examples for behavioral questions.',
        'Study system design patterns for senior-level roles.',
      ],
    }
  }
}
