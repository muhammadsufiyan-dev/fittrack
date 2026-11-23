import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const signToken = (id) => jwt.sign({ id }, env.jwtSecret, { algorithm: 'HS256', expiresIn: '7d' })

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] })
