import { Router } from 'express'
import { makeRouter } from '../controllers/crud.js'
import workoutCrud from '../controllers/workoutController.js'
import protect from '../middleware/auth.js'

export default makeRouter(Router, protect, workoutCrud)
