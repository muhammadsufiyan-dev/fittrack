import { Router } from 'express'
import { makeRouter } from '../controllers/crud.js'
import nutritionCrud from '../controllers/nutritionController.js'
import protect from '../middleware/auth.js'

export default makeRouter(Router, protect, nutritionCrud)
