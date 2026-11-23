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

export const registerUser = async ({ name, email, password, photo = '' }) => {
  const data = await api.post('/auth/register', { name: name.trim(), email: email.trim(), password, photo, consent: true })
  return signIn(data)
}

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
