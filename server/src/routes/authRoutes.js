import { Router } from 'express'
import {
  changePassword,
  forgotPassword,
  googleLogin,
  login,
  me,
  register,
  resendVerification,
  resetPassword,
  verifyEmail,
} from '../controllers/authController.js'
import protect from '../middleware/auth.js'
import { authLimiter, forgotLimiter } from '../middleware/rateLimit.js'

const router = Router()

router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.post('/google', authLimiter, googleLogin)
router.post('/verify-email', authLimiter, verifyEmail)
router.post('/resend-verification', forgotLimiter, resendVerification)
router.post('/forgot-password', forgotLimiter, forgotPassword)
router.post('/reset-password', authLimiter, resetPassword)
router.put('/password', protect, authLimiter, changePassword)
router.get('/me', protect, me)

export default router