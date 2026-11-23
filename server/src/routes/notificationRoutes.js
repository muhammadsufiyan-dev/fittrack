import { Router } from 'express'
import { dismiss, getState, markRead } from '../controllers/notificationController.js'
import protect from '../middleware/auth.js'

const router = Router()

router.use(protect)
router.get('/', getState)
router.post('/read', markRead)
router.post('/dismiss', dismiss)

export default router
