import { Router } from 'express'
import { getAiStatus, analyzeThread, generateDraft } from '../controllers/aiController.js'

export const aiRouter = Router()

aiRouter.get('/status', getAiStatus)
aiRouter.post('/analyze-thread/:id', analyzeThread)
aiRouter.post('/generate-draft/:id', generateDraft)
