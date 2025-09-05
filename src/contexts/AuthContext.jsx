import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/memberService'

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

  const logout = async () => {
    try {
      // 서버에 로그아웃 요청
      await authService.logout()
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error)
      // API 호출이 실패해도 로컬 로그아웃은 진행
    } finally {
      // 로컬 스토리지 정리
      localStorage.removeItem('currentUser')
      localStorage.removeItem('accessToken')
      setCurrentUser(null)
      setIsAuthenticated(false)
    }
  }

  // 토큰 갱신 함수
  const refreshToken = async () => {
    try {
      const response = await authService.refresh()
      if (response.success && response.data) {
        // 새로운 토큰을 localStorage에 저장
        localStorage.setItem('accessToken', response.data)
        return true
      }
      return false
    } catch (error) {
      console.error('토큰 갱신 실패:', error)
      // 토큰 갱신 실패 시 로그아웃
      logout()
      return false
    }
  }

  // 구글 로그인 콜백 처리 함수
  const handleGoogleLoginCallback = async () => {
    try {
      const response = await authService.googleLogin()
      if (response.success && response.data) {
        // 구글 로그인 성공 시 사용자 정보와 토큰 저장
        const { member, accessToken } = response.data
        login(member, accessToken)
        return { success: true, user: member }
      }
      return { success: false, error: '구글 로그인에 실패했습니다.' }
    } catch (error) {
      console.error('구글 로그인 콜백 처리 실패:', error)
      return { success: false, error: error.message }
    }
  }

  const value = {
    isAuthenticated,
    currentUser,
    isLoading,
    login,
    logout,
    refreshToken,
    handleGoogleLoginCallback
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
