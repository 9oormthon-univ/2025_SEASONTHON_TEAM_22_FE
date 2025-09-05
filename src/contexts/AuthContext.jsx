import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 로컬스토리지에서 로그인 상태 확인
    const user = localStorage.getItem('currentUser')
    const token = localStorage.getItem('accessToken')
    
    if (user && token) {
      setCurrentUser(JSON.parse(user))
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('currentUser', JSON.stringify(userData))
    if (token) {
      localStorage.setItem('accessToken', token)
    }
    setCurrentUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('accessToken')
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    isAuthenticated,
    currentUser,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
