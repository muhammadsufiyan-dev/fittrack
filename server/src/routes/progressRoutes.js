import { Router } from 'express'
import { makeRouter } from '../controllers/crud.js'
import progressCrud from '../controllers/progressController.js'
import protect from '../middleware/auth.js'

export default makeRouter(Router, protect, progressCrud)
