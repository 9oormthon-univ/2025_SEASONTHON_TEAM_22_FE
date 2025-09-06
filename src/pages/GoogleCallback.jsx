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
        // URL 파라미터에서 토큰 정보 추출
        const accessToken = searchParams.get('accessToken')
        const memberId = searchParams.get('memberId')
        const success = searchParams.get('success')

        if (success === 'true' && accessToken && memberId) {
          // 사용자 정보를 가져오기 위해 API 호출
          try {
            const userData = await memberService.getMyInfo()
            
            // AuthContext의 login 함수가 토큰 저장과 상태 관리를 모두 처리
            login(userData, accessToken)
            
            toast.success('구글 로그인에 성공했습니다!')
            navigate('/')
          } catch (error) {
            console.error('사용자 정보 조회 실패:', error)
            toast.error('로그인 처리 중 오류가 발생했습니다.')
            navigate('/login')
          }
        } else {
          // 로그인 실패
          const error = searchParams.get('error') || '구글 로그인에 실패했습니다.'
          toast.error(error)
          navigate('/login')
        }
      } catch (error) {
        console.error('구글 로그인 콜백 처리 실패:', error)
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
