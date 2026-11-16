import { Router } from 'express'
import {
  getThreads,
  getThreadById,
  createThread,
  updateClassification,
  delegateThread,
  markHandled,
  replyToThread,
  resolveTakeover,
  resetSeed,
} from '../controllers/threadController.js'

export const threadRouter = Router()

threadRouter.get('/', getThreads)
threadRouter.get('/:id', getThreadById)
threadRouter.post('/', createThread)
threadRouter.patch('/:id/classify', updateClassification)
threadRouter.post('/:id/delegate', delegateThread)
threadRouter.post('/:id/handle', markHandled)
threadRouter.post('/:id/reply', replyToThread)
threadRouter.post('/:id/resolve-takeover', resolveTakeover)
threadRouter.post('/actions/reset-seed', resetSeed)
