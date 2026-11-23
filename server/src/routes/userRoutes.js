import { Router } from 'express'
import { deleteMe, getUser, updateMe } from '../controllers/userController.js'
import protect from '../middleware/auth.js'

const router = Router()

router.use(protect)
router.put('/me', updateMe)
router.delete('/me', deleteMe)
router.get('/:id', getUser)

export default router
