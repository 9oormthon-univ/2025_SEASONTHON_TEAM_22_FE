import { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'
import { login as loginApi } from '../services/memberApi'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username.trim() || !formData.password.trim()) {
      toast.error('아이디와 비밀번호를 입력해주세요.')
      return
    }
    
    setIsLoading(true)
    
    try {
      // API를 사용한 로그인
      const response = await loginApi({
        loginId: formData.username,
        password: formData.password
      })
      
      // 로그인 성공
      if (response.data && response.data.success) {
        login(response.data.data.member)
        toast.success(`${response.data.data.member.nickname}님, 환영합니다!`)
        navigate('/')
      } else {
        throw new Error('로그인 응답이 올바르지 않습니다.')
      }
    } catch (error) {
      console.error('로그인 실패:', error)
      
        // HTTP 상태 코드를 직접 비교하여 안정적인 에러 처리
      const status = error.response?.status
      
      if (status === 401) {
        toast.error('아이디 또는 비밀번호가 올바르지 않습니다.')
      } else if (status === 400) {
        toast.error('입력 정보를 확인해주세요.')
      } else if (status >= 500) {
        toast.error('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
      } else if (!navigator.onLine) {
        toast.error('인터넷 연결을 확인해주세요.')
      } else {
        toast.error('로그인에 실패했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // 구글 OAuth2 인증 페이지로 리다이렉트
    window.location.href = import.meta.env.VITE_GOOGLE_OAUTH_URL
  }

  const handleDevLogin = () => {
    // 개발용 로그인 - 임시 사용자로 자동 로그인
    const devUser = {
      id: 'dev-user-001',
      username: '개발자',
      email: 'dev@slowmind.com'
    }
    
    login(devUser)
    toast.success('개발용 로그인으로 접속했습니다.')
    navigate('/')
  }

  return (
    <Container>
      {/* Header */}
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </BackButton>
      </Header>

      {/* Logo Section */}
      <LogoSection>
        <Logo src="/logo.png" alt="SlowMind" />
      </LogoSection>

      <Content>
        <LoginCard>
          <form onSubmit={handleSubmit}>
            <FormField>
              <Label>아이디</Label>
              <Input
                type="text"
                placeholder="아이디를 입력해주세요"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </FormField>

            <FormField>
              <Label>비밀번호</Label>
              <Input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </FormField>

            <RememberMeField>
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <CheckboxLabel htmlFor="rememberMe">로그인 상태 유지</CheckboxLabel>
              </CheckboxContainer>
            </RememberMeField>

            <LoginButton type="submit" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인하기'}
            </LoginButton>
          </form>
        </LoginCard>

        <SignupPrompt>
          <span>아직 계정이 없으신가요?</span>
          <SignupLink onClick={() => navigate('/signup')}>
            회원가입
          </SignupLink>
        </SignupPrompt>

        <Divider>
          <DividerText>간편 로그인</DividerText>
        </Divider>

        <GoogleButton type="button" onClick={handleGoogleLogin}>
          <GoogleIcon>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </GoogleIcon>
          구글로 로그인
        </GoogleButton>

        {/* 개발용 로그인 버튼 - 개발 환경에서만 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <DevLoginButton type="button" onClick={handleDevLogin}>
            <DevIcon>🔧</DevIcon>
            개발용 로그인
          </DevLoginButton>
        )}

        <TermsText>
          로그인하시면 <TermsLink>서비스 이용약관</TermsLink>과 <TermsLink>개인정보 처리방침</TermsLink>에<br />
          동의하는 것으로 간주됩니다
        </TermsText>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  min-height: 100vh;
  background: #F2F2FC;
  display: flex;
  flex-direction: column;
  padding: 0 1.6rem;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 0;
  margin-bottom: 1.2rem;
`

const BackButton = styled.button`
  padding: 0.8rem;
  color: #333333;
  background: none;
  border: none;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #7E6BB5;
    background: rgba(255, 255, 255, 0.5);
  }
`

const LogoSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5rem;
`

const Logo = styled.img`
  height: 28rem;
  width: auto;
  max-width: 100%;
  
  @media (max-width: 480px) {
    height: 22rem;
  }
  
  @media (min-width: 768px) {
    height: 34rem;
  }
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-width: 40rem;
  margin: 0 auto;
  width: 100%;
  margin-top: 2rem;
`

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 1.6rem;
  padding: 2.4rem;
  border: 1px solid #E0D9F0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.6rem;
`

const FormField = styled.div`
  margin-bottom: 2.4rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const Label = styled.label`
  display: block;
  color: #333333;
  font-weight: 500;
  margin-bottom: 0.8rem;
  font-size: 1.4rem;
`

const Input = styled.input`
  width: 100%;
  height: 5.6rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #E0D9F0;
  border-radius: 1.6rem;
  padding: 0 1.6rem;
  color: #333333;
  font-size: 1.4rem;
  transition: all 0.2s;
  
  &::placeholder {
    color: #AAAAAA;
  }
  
  &:focus {
    outline: none;
    border-color: #7E6BB5;
    box-shadow: 0 0 0 4px rgba(126, 107, 181, 0.1);
  }
`

const LoginButton = styled.button`
  width: 100%;
  height: 5.6rem;
  background: #7E6BB5;
  color: white;
  border: none;
  border-radius: 1.6rem;
  font-weight: 500;
  font-size: 1.6rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(126, 107, 181, 0.3);
  
  &:hover:not(:disabled) {
    background: #6B5A9E;
    box-shadow: 0 6px 16px rgba(126, 107, 181, 0.4);
    transform: scale(1.01);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`


const Divider = styled.div`
  position: relative;
  margin: 1.6rem 0;
  text-align: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #E0D9F0;
  }
`

const DividerText = styled.span`
  background: #F2F2FC;
  padding: 0 2.4rem;
  color: #666666;
  font-weight: 500;
  font-size: 1.4rem;
`

const GoogleButton = styled.button`
  width: 100%;
  height: 5.6rem;
  border: 2px solid #E0D9F0;
  background: rgba(255, 255, 255, 0.8);
  color: #333333;
  border-radius: 1.6rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  
  &:hover {
    background: white;
    border-color: #7E6BB5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const GoogleIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const DevLoginButton = styled.button`
  width: 100%;
  height: 5.6rem;
  border: 2px solid #FF6B35;
  background: rgba(255, 107, 53, 0.1);
  color: #FF6B35;
  border-radius: 1.6rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  
  &:hover {
    background: rgba(255, 107, 53, 0.2);
    border-color: #E55A2B;
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
  }
`

const DevIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
`

const SignupPrompt = styled.div`
  text-align: center;
  font-size: 1.4rem;
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
`

const SignupLink = styled.button`
  color: #7E6BB5;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #6B5A9E;
    text-decoration: underline;
  }
`

const RememberMeField = styled.div`
  margin-bottom: 2.4rem;
`

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`

const Checkbox = styled.input`
  width: 2rem;
  height: 2rem;
  border: 2px solid #E0D9F0;
  border-radius: 0.4rem;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s;
  
  &:checked {
    background: #7E6BB5;
    border-color: #7E6BB5;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(126, 107, 181, 0.1);
  }
`

const CheckboxLabel = styled.label`
  color: #333333;
  font-size: 1.4rem;
  font-weight: 400;
  cursor: pointer;
`

const TermsText = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #999999;
  line-height: 1.6;
  margin-top: 1.6rem;
`

const TermsLink = styled.span`
  color: #7E6BB5;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`