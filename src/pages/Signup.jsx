import { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'
import { memberService } from '../services/memberService'

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isUsernameChecked, setIsUsernameChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (currentStep < 2) {
      // 각 단계별 유효성 검사
      if (currentStep === 1) {
        if (!formData.username.trim()) {
          toast.error('아이디를 입력해주세요.')
          return
        }
        if (!isUsernameChecked) {
          toast.error('아이디 중복확인을 해주세요.')
          return
        }
        if (!formData.email.trim()) {
          toast.error('이메일을 입력해주세요.')
          return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast.error('올바른 이메일 형식을 입력해주세요.')
          return
        }
      }
      setCurrentStep(currentStep + 1)
    } else {
      // 최종 회원가입 처리
      if (!formData.password.trim() || !formData.confirmPassword.trim()) {
        toast.error('비밀번호를 입력해주세요.')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('비밀번호가 일치하지 않습니다.')
        return
      }
      if (!validatePassword(formData.password)) {
        toast.error('비밀번호 조건을 만족하지 않습니다.')
        return
      }
      
      await handleSignup()
    }
  }

  const handleSignup = async () => {
    setIsLoading(true)
    
    try {
      // API를 통한 회원가입
      const response = await memberService.signup({
        loginId: formData.username,
        email: formData.email,
        password: formData.password,
        nickname: formData.username // 기본값으로 username 사용
      })
      
      // 회원가입 성공 후 자동 로그인
      login(response.member, response.accessToken)
      
      toast.success('회원가입이 완료되었습니다!')
      navigate('/')
      
    } catch (error) {
      console.error('회원가입 실패:', error)
      
      // 에러 메시지 처리
      if (error.message.includes('409')) {
        toast.error('이미 존재하는 아이디 또는 이메일입니다.')
      } else if (error.message.includes('400')) {
        toast.error('입력 정보를 확인해주세요.')
      } else {
        toast.error('회원가입에 실패했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate('/login')
    }
  }

  const handleUsernameCheck = async () => {
    if (!formData.username.trim()) {
      toast.error('아이디를 입력해주세요.')
      return
    }
    
    if (formData.username.length < 4 || formData.username.length > 12) {
      toast.error('아이디는 4~12자로 입력해주세요.')
      return
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      toast.error('아이디는 영문과 숫자만 사용할 수 있습니다.')
      return
    }
    
    try {
      // 로컬스토리지에서 중복 확인
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const isDuplicate = existingUsers.some(user => user.username === formData.username)
      
      if (isDuplicate) {
        toast.error('이미 사용 중인 아이디입니다.')
        setIsUsernameChecked(false)
      } else {
        toast.success('사용 가능한 아이디입니다.')
        setIsUsernameChecked(true)
      }
    } catch (error) {
      console.error('아이디 중복확인 실패:', error)
      toast.error('중복확인에 실패했습니다.')
    }
  }


  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasMinLength = password.length >= 8
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasMinLength
  }

  const renderStepIndicator = () => (
    <StepIndicator>
      {[1, 2].map((step, index) => (
        <StepItem key={step}>
          <StepCircle 
            className={`
              ${step === currentStep ? 'active' : ''} 
              ${step < currentStep ? 'completed' : ''}
            `}
          >
            {step < currentStep ? '✓' : step}
          </StepCircle>
          {index < 1 && (
            <StepLine 
              className={step < currentStep ? 'completed' : ''}
            />
          )}
        </StepItem>
      ))}
    </StepIndicator>
  )

  const renderStep1 = () => (
    <FormCard>
      <FormHeader>
        <FormTitle>계정 만들기</FormTitle>
        <FormSubtitle>슬로우마인드와 함께 감정 여행을 시작해보세요</FormSubtitle>
      </FormHeader>
      
      <FormField>
        <Label>아이디</Label>
        <InputRow>
          <Input
            type="text"
            placeholder="영문, 숫자 조합 (4~12자)"
            value={formData.username}
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value })
              setIsUsernameChecked(false)
            }}
          />
          <CheckButton 
            type="button"
            onClick={handleUsernameCheck}
            disabled={!formData.username.trim()}
          >
            중복확인
          </CheckButton>
        </InputRow>
        <HintText>다른 사용자들에게 보여질 아이디입니다</HintText>
      </FormField>

      <FormField>
        <Label>이메일 주소</Label>
        <Input
          type="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <HintText>비밀번호 찾기 시 사용됩니다</HintText>
      </FormField>
    </FormCard>
  )

  const renderStep2 = () => (
    <FormCard>
      <FormHeader>
        <FormTitle>비밀번호 설정</FormTitle>
        <FormSubtitle>안전한 비밀번호로 계정을 보호하세요</FormSubtitle>
      </FormHeader>
      
      <FormField>
        <Label>비밀번호</Label>
        <Input
          type="password"
          placeholder="영문, 숫자, 특수문자 포함 8자 이상"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <PasswordRequirements>
          <RequirementItem>
            <RequirementDot />
            <span>영문 대소문자 포함</span>
          </RequirementItem>
          <RequirementItem>
            <RequirementDot />
            <span>숫자 포함</span>
          </RequirementItem>
          <RequirementItem>
            <RequirementDot />
            <span>8자 이상</span>
          </RequirementItem>
        </PasswordRequirements>
      </FormField>
      
      <FormField>
        <Label>비밀번호 확인</Label>
        <Input
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <ErrorText>비밀번호가 일치하지 않습니다</ErrorText>
        )}
      </FormField>
    </FormCard>
  )


  return (
    <Container>
      {/* Header */}
      <Header>
        <BackButton onClick={handleBack}>
          <ChevronLeft size={24} />
        </BackButton>
        <Logo src="/logo.png" alt="SlowMind" />
      </Header>

      <Content>
        {renderStepIndicator()}

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}

          <SubmitButton 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : (currentStep === 2 ? '계정 만들기' : '다음 단계')}
          </SubmitButton>
        </form>

        {/* Google Sign up option */}
        {currentStep === 1 && (
          <>
            <Divider>
              <DividerText>간편 가입</DividerText>
            </Divider>

            <GoogleButton type="button">
              <GoogleIcon>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </GoogleIcon>
              구글로 가입하기
            </GoogleButton>
          </>
        )}

        {/* Terms and conditions */}
        {currentStep === 2 && (
          <TermsText>
            가입하시면{' '}
            <TermsLink>서비스 이용약관</TermsLink>과{' '}
            <TermsLink>개인정보 처리방침</TermsLink>에<br />
            동의하는 것으로 간주됩니다
          </TermsText>
        )}
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
  justify-content: center;
  padding: 1.6rem 0;
  margin-bottom: 1rem;
  position: relative;
`

const BackButton = styled.button`
  position: absolute;
  left: 0;
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


const Logo = styled.img`
  height: 12.5rem;
  width: auto;
  max-width: 100%;
  
  @media (max-width: 480px) {
    height: 9.5rem;
  }
  
  @media (min-width: 768px) {
    height: 15.5rem;
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

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 3.2rem;
`

const StepItem = styled.div`
  display: flex;
  align-items: center;
`

const StepCircle = styled.div`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 500;
  transition: all 0.3s;
  background: #E0D9F0;
  color: #999999;
  
  &.active {
    background: #7E6BB5;
    color: white;
    box-shadow: 0 4px 12px rgba(126, 107, 181, 0.3);
    transform: scale(1.1);
  }
  
  &.completed {
    background: #7E6BB5;
    color: white;
  }
`

const StepLine = styled.div`
  width: 3.2rem;
  height: 0.2rem;
  margin: 0 0.4rem;
  background: #E0D9F0;
  transition: all 0.3s;
  
  &.completed {
    background: #7E6BB5;
  }
`

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 1.6rem;
  padding: 2.4rem;
  border: 1px solid #E0D9F0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 3.2rem;
`

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2.4rem;
`

const FormTitle = styled.h2`
  font-size: 2rem;
  color: #333333;
  font-weight: 500;
  margin: 0 0 0.8rem 0;
`

const FormSubtitle = styled.p`
  color: #666666;
  font-size: 1.4rem;
  margin: 0;
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

const InputRow = styled.div`
  display: flex;
  gap: 1.2rem;
`

const Input = styled.input`
  flex: 1;
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

const CheckButton = styled.button`
  height: 5.6rem;
  padding: 0 1.6rem;
  border: 2px solid #E0D9F0;
  background: rgba(255, 255, 255, 0.8);
  color: #333333;
  border-radius: 1.6rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: white;
    border-color: #7E6BB5;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const HintText = styled.p`
  font-size: 1.2rem;
  color: #999999;
  margin: 0.8rem 0 0 0.4rem;
`


const PasswordRequirements = styled.div`
  margin-top: 1.2rem;
  padding: 0 0.4rem;
`

const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
  font-size: 1.4rem;
  color: #999999;
`

const RequirementDot = styled.div`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: #E0D9F0;
`

const ErrorText = styled.p`
  font-size: 1.4rem;
  color: #FF4757;
  margin: 0.8rem 0 0 0.4rem;
`

const SubmitButton = styled.button`
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
  margin: 2.4rem 0;
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
