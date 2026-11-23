import { storage } from '../utils/storage'
import { api, clearToken, getToken, setToken } from './api'
import { loadSettings } from './settingsService'

const SESSION_KEY = 'ft_session'

const startSession = (user) => {
  storage.set(SESSION_KEY, JSON.stringify(user))
  return user
}

const endSession = () => {
  storage.remove(SESSION_KEY)
  storage.remove('ft_settings')
  clearToken()
}

const signIn = async ({ token, user }) => {
  setToken(token)
  try {
    await loadSettings()
  } catch {
    storage.remove('ft_settings')
  }
  return startSession(user)
}

export const registerUser = ({ name, email, password, photo = '' }) =>
  api.post('/auth/register', { name: name.trim(), email: email.trim(), password, photo, consent: true })

export const loginUser = async ({ email, password }) => {
  const data = await api.post('/auth/login', { email: email.trim(), password })
  return signIn(data)
}

export const logoutUser = () => {
  endSession()
}

export const getCurrentUser = () => {
  if (!getToken()) return null

  try {
    return JSON.parse(storage.get(SESSION_KEY))
  } catch {
    return null
  }
}

export const refreshUser = async () => {
  const { user } = await api.get('/auth/me')
  return startSession(user)
}

export const updateProfile = async (id, data) => {
  const { user } = await api.put('/users/me', data)
  return startSession(user)
}

export const removeUser = async () => {
  await api.remove('/users/me')
  endSession()
}

export const changePassword = async (currentPassword, newPassword) => {
  const data = await api.put('/auth/password', { currentPassword, newPassword })
  setToken(data.token)
  return startSession(data.user)
}

export const forgotPassword = (email) => api.post('/auth/forgot-password', { email: email.trim() })

export const resetPassword = ({ email, token, password }) => api.post('/auth/reset-password', { email, token, password })

export const verifyEmail = async ({ email, token }) => signIn(await api.post('/auth/verify-email', { email, token }))

export const resendVerification = (email) => api.post('/auth/resend-verification', { email: email.trim() })

export const googleLogin = async (credential) => signIn(await api.post('/auth/google', { credential }))