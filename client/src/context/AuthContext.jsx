import { createContext, useState } from 'react'
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser)

  const login = async (credentials) => {
    const loggedIn = await loginUser(credentials)
    setUser(loggedIn)
  }

  const register = async (details) => {
    const created = await registerUser(details)
    setUser(created)
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}