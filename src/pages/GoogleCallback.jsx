import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'
import { memberService } from '../services/memberService'

export default function GoogleCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // URL 파라미터에서 'code' 추출 (OAuth2 인증 코드)
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
          // OAuth 에러가 있는 경우
          console.error('OAuth 에러:', error)
          toast.error('구글 로그인에 실패했습니다.')
          navigate('/login')
          return
        }

        if (code) {
          try {
            // 백엔드에 코드를 보내고 토큰을 받아옴
            const loginResponse = await memberService.loginWithGoogle(code)
            
            if (loginResponse && loginResponse.accessToken) {
              const { accessToken } = loginResponse;
              
              // 토큰을 localStorage에 저장 (API 클라이언트가 자동으로 사용)
              localStorage.setItem('accessToken', accessToken)
              
              // 사용자 정보 가져오기
              const userData = await memberService.getMyInfo()
              
              // AuthContext의 login 함수로 최종 로그인 처리
              login(userData, accessToken)
              
              toast.success('구글 로그인에 성공했습니다!')
              navigate('/')
            } else {
              throw new Error('토큰을 받지 못했습니다.')
            }
          } catch (error) {
            console.error('백엔드 토큰 교환 또는 사용자 정보 조회 실패:', error)
            toast.error('로그인 처리 중 오류가 발생했습니다.')
            navigate('/login')
          }
        } else {
          // URL에 'code' 파라미터가 없는 경우
          console.error('인증 코드가 없습니다.')
          toast.error('구글 인증에 실패했습니다.')
          navigate('/login')
        }
      } catch (error) {
        console.error('구글 로그인 콜백 처리 중 알 수 없는 오류:', error)
        toast.error('로그인 처리 중 오류가 발생했습니다.')
        navigate('/login')
      }
    }

    handleGoogleCallback()
  }, [searchParams, navigate, login])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#F2F2FC',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{
        fontSize: '1.6rem',
        color: '#7E6BB5',
        fontWeight: '500'
      }}>
        로그인 처리 중...
      </div>
      <div style={{
        fontSize: '1.2rem',
        color: '#666666'
      }}>
        잠시만 기다려주세요
      </div>
    </div>
  )
}
