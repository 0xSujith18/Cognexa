import express from 'express'
import {
  createSession,
  getSession,
  getMySessions,
  submitAnswer,
  getAnalytics,
} from '../controllers/sessionController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

// All session routes require authentication
router.use(protect)

router.post('/create',       createSession)
router.get('/my',            getMySessions)
router.get('/analytics',     getAnalytics)
router.get('/:id',           getSession)
router.post('/:id/answer',   submitAnswer)

export default router
