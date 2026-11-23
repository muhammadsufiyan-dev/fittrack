import { Router } from 'express'
import { clearData, exportData } from '../controllers/dataController.js'
import protect from '../middleware/auth.js'

const router = Router()

router.use(protect)
router.get('/export', exportData)
router.delete('/', clearData)

export default router
