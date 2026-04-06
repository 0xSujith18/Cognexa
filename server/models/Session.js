import mongoose from 'mongoose'

const scoreSchema = new mongoose.Schema({
  technical_accuracy: { type: Number, default: 0 },
  completeness:       { type: Number, default: 0 },
  clarity:            { type: Number, default: 0 },
  relevance:          { type: Number, default: 0 },
  examples:           { type: Number, default: 0 },
}, { _id: false })

const evaluationSchema = new mongoose.Schema({
  scores:        scoreSchema,
  overall_score: { type: Number, default: 0 },
  strengths:     [String],
  weaknesses:    [String],
  improvements:  [String],
}, { _id: false })

const questionSchema = new mongoose.Schema({
  question_id:        String,
  question_text:      String,
  type:               { type: String, enum: ['technical', 'behavioral', 'situational'] },
  difficulty:         { type: String, enum: ['easy', 'medium', 'hard'] },
  expected_keypoints: [String],
  ideal_answer:       String,
  hint:               String,
  answer:             { type: String, default: '' },
  evaluation:         evaluationSchema,
}, { _id: false })

const resultSchema = new mongoose.Schema({
  overall_score:     { type: Number, default: 0 },
  performance_level: { type: String, enum: ['Excellent', 'Good', 'Average', 'Needs Improvement'] },
  strengths:         [String],
  weaknesses:        [String],
  final_feedback:    String,
  hiring_decision:   { type: String, enum: ['Hire', 'Maybe', 'No Hire'] },
  avg_scores:        scoreSchema,
}, { _id: false })

const sessionSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role:         { type: String, required: true },
  level:        { type: String, required: true, enum: ['Fresher', 'Junior', 'Mid', 'Senior'] },
  techStack:    [String],
  questions:    [questionSchema],
  currentIndex: { type: Number, default: 0 },
  status:       { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'in-progress' },
  result:       resultSchema,
}, { timestamps: true })

export default mongoose.model('Session', sessionSchema)
