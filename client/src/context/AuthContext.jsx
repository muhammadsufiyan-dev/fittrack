import { createContext, useEffect, useState } from 'react'
import {
  getCurrentUser,
  googleLogin,
  loginUser,
  logoutUser,
  refreshUser,
  registerUser,
  updateProfile as saveProfile,
  verifyEmail,
} from '../services/authService'
import { loadSocial } from '../services/communityService'
import { loadSettings } from '../services/settingsService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser)

  useEffect(() => {
    if (!getCurrentUser()) return

    refreshUser().then(setUser).catch(() => {})
    loadSettings().catch(() => {})
    loadSocial().catch(() => {})
  }, [])

  useEffect(() => {
    const expire = () => {
      logoutUser()
      setUser(null)
    }

    window.addEventListener('ft-session-expired', expire)
    return () => window.removeEventListener('ft-session-expired', expire)
  }, [])

  const startSession = async (request) => {
    setUser(await request)
    loadSocial().catch(() => {})
  }

  const login = (credentials) => startSession(loginUser(credentials))
  const verify = (details) => startSession(verifyEmail(details))
  const google = (credential) => startSession(googleLogin(credential))
  const register = (details) => registerUser(details)

  const updateProfile = async (data) => {
    setUser(await saveProfile(user.id, data))
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, verify, google, register, updateProfile, logout }}>{children}</AuthContext.Provider>
  )
}