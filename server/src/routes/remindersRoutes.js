import { Router } from 'express'
import { makeRouter } from '../controllers/crud.js'
import reminderCrud from '../controllers/reminderController.js'
import protect from '../middleware/auth.js'

export default makeRouter(Router, protect, reminderCrud)
