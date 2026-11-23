import { Router } from 'express'
import { follow, getAlerts, getCommunityStats, getContributors, getFollowers, getFollowing, getMemberStats, getPeople, unfollow } from '../controllers/memberController.js'
import { addReply, createPost, deletePost, listPosts, toggleLike } from '../controllers/postController.js'
import protect from '../middleware/auth.js'

const router = Router()

router.use(protect)
router.route('/posts').get(listPosts).post(createPost)
router.post('/posts/:id/like', toggleLike)
router.post('/posts/:id/replies', addReply)
router.delete('/posts/:id', deletePost)
router.get('/people', getPeople)
router.get('/stats', getCommunityStats)
router.get('/contributors', getContributors)
router.get('/alerts', getAlerts)
router.get('/following', getFollowing)
router.get('/followers', getFollowers)
router.route('/follow/:id').post(follow).delete(unfollow)
router.get('/members/:id/stats', getMemberStats)

export default router
