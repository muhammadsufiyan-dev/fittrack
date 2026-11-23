import { createContext, useEffect, useState } from 'react'
import { getCurrentUser, loginUser, logoutUser, refreshUser, registerUser, updateProfile as saveProfile } from '../services/authService'
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

  const login = async (credentials) => {
    setUser(await loginUser(credentials))
    loadSocial().catch(() => {})
  }

  const register = async (details) => {
    setUser(await registerUser(details))
    loadSocial().catch(() => {})
  }

  const updateProfile = async (data) => {
    setUser(await saveProfile(user.id, data))
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout }}>{children}</AuthContext.Provider>
  )
}
