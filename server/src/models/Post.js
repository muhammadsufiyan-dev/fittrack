import mongoose from 'mongoose'

export const topics = ['workouts', 'nutrition', 'progress', 'motivation', 'questions']

const ref = { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

const replySchema = new mongoose.Schema(
  {
    author: ref,
    text: { type: String, required: true, trim: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
  }
)

const postSchema = new mongoose.Schema(
  {
    author: { ...ref, index: true },
    topic: { type: String, enum: topics, required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [replySchema],
  },
  { timestamps: true }
)

postSchema.index({ createdAt: -1 })

export default mongoose.model('Post', postSchema)
