import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    photo: { type: String, default: '', maxlength: 400000 },
    phone: { type: String, default: '', trim: true, maxlength: 20 },
    city: { type: String, default: '', trim: true, maxlength: 60 },
    bio: { type: String, default: '', trim: true, maxlength: 200 },
    discoverable: { type: Boolean, default: true },
    consentAcceptedAt: { type: Date, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.password
        return ret
      },
    },
  }
)

export default mongoose.model('User', userSchema)
