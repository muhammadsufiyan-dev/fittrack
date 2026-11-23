import AppError from '../utils/AppError.js'
import asyncHandler from '../utils/asyncHandler.js'

export const makeCrud = ({ Model, one, many, sort, clean, filter = () => ({}), present }) => {
  const show = async (docs, req) => (present ? present(docs, req) : docs)

  const find = async (req) => {
    const doc = await Model.findOne({ _id: req.params.id, user: req.user.id })
    if (!doc) throw new AppError('Not found', 404)
    return doc
  }

  return {
    list: asyncHandler(async (req, res) => {
      const docs = await Model.find({ user: req.user.id, ...filter(req.query) }).sort(sort)
      res.json({ [many]: await show(docs, req) })
    }),

    get: asyncHandler(async (req, res) => {
      const [item] = await show([await find(req)], req)
      res.json({ [one]: item })
    }),

    create: asyncHandler(async (req, res) => {
      const doc = await Model.create({ ...clean(req.body), user: req.user.id })
      const [item] = await show([doc], req)
      res.status(201).json({ [one]: item })
    }),

    update: asyncHandler(async (req, res) => {
      const doc = await find(req)
      doc.set(clean({ ...doc.toObject(), ...req.body }))
      await doc.save()
      const [item] = await show([doc], req)
      res.json({ [one]: item })
    }),

    remove: asyncHandler(async (req, res) => {
      const doc = await find(req)
      await doc.deleteOne()
      res.status(204).end()
    }),
  }
}

export const makeRouter = (Router, protect, crud) => {
  const router = Router()
  router.use(protect)
  router.route('/').get(crud.list).post(crud.create)
  router.route('/:id').get(crud.get).put(crud.update).delete(crud.remove)
  return router
}


