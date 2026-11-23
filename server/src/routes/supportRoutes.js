import { Router } from 'express'
import { createRequest, deleteRequest, listRequests } from '../controllers/supportController.js'
import protect from '../middleware/auth.js'
import { supportLimiter } from '../middleware/rateLimit.js'

const router = Router()

router.use(protect)
router.get('/', listRequests)
router.post('/', supportLimiter, createRequest)
router.delete('/:id', deleteRequest)

export default router
