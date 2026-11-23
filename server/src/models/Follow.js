import mongoose from 'mongoose'

const ref = { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

const followSchema = new mongoose.Schema({ follower: ref, following: ref }, { timestamps: true })

followSchema.index({ follower: 1, following: 1 }, { unique: true })
followSchema.index({ following: 1 })

export default mongoose.model('Follow', followSchema)
