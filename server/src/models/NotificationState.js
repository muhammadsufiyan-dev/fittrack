import mongoose from 'mongoose'

const stateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  read: [String],
  hidden: [String],
})

export default mongoose.model('NotificationState', stateSchema)
