import { Router } from 'express'
import { chatWithAI, chatWithAIOpenRouter } from './ai.controller'

const router = Router()

router.post('/chat', chatWithAI)
router.post('/chat-open', chatWithAIOpenRouter)

export const aiRoutes = router