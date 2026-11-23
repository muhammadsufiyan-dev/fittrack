import { Router } from 'express'
import { makeRouter } from '../controllers/crud.js'
import goalCrud from '../controllers/goalController.js'
import protect from '../middleware/auth.js'

export default makeRouter(Router, protect, goalCrud)
