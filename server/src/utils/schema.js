import mongoose from 'mongoose'

export const owner = { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }

export const options = {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      const { _id, __v, user, createdAt, updatedAt, ...rest } = ret
      return { id: String(_id), ...rest }
    },
  },
}

export const part = { _id: false, id: false }

export const datedOptions = {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      const { _id, __v, user, updatedAt, ...rest } = ret
      return { id: String(_id), ...rest }
    },
  },
}
