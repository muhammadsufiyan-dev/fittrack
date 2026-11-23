import mongoose from 'mongoose'
import { datedOptions, owner } from '../utils/schema.js'

export const supportTypes = ['question', 'issue', 'feedback']

const supportSchema = new mongoose.Schema(
  {
    user: owner,
    type: { type: String, enum: supportTypes, required: true },
    subject: { type: String, required: true, trim: true, maxlength: 100 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, default: 'Received' },
  },
  datedOptions
)

export default mongoose.model('Support', supportSchema)
