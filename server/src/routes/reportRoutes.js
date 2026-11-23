import { Router } from 'express'
import { getReport, getReportCsv } from '../controllers/reportController.js'
import protect from '../middleware/auth.js'

const router = Router()

router.use(protect)
router.get('/', getReport)
router.get('/csv', getReportCsv)

export default router
