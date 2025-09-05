import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: 백엔드 연동 시 실제 로그인 처리
    navigate('/')
  }

  return (
    <Container>
      <Top>
        <Logo src="/logo.png" alt="logo" />
        {/* <Title>SlowMind</Title> */}
        <Subtitle>
          차근차근, 천천히
          <br />
          마음을 기록해보세요
        </Subtitle>
      </Top>
      <Card onSubmit={handleSubmit}>

        <Field>
          <Label htmlFor="username">아이디</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디를 입력해주세요"
          />
        </Field>

        <Field>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
          />
        </Field>

        <Remember>
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label htmlFor="remember">로그인 상태 유지</label>
        </Remember>

        <LoginButton type="submit">로그인하기</LoginButton>
      </Card>

      <SignupRow>
        아직 계정이 없으신가요? <SignupButton type="button" onClick={() => navigate('/signup')}>회원가입</SignupButton>
      </SignupRow>

      <Divider>
        <span>간편 로그인</span>
      </Divider>

      <GoogleButton type="button">
        <GoogleIcon viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </GoogleIcon>
        구글로 로그인
      </GoogleButton>

      <BottomText>
        로그인하시면 <LinkText>서비스 이용약관</LinkText>과 <LinkText>개인정보 처리방침</LinkText>에
        <br />
        동의하는 것으로 간주됩니다
      </BottomText>
    </Container>
  )
}

export default Login

// styled-components
const Container = styled.div`
  min-height: 100dvh;
  background: #F2F2FC;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.4rem 1.6rem;
  color: #333333;
`

const Top = styled.div`
  text-align: center;
`

const Logo = styled.img`
  width: 30rem;
  height: auto;
  margin: 0 auto 1.6rem;
  display: block;
  object-fit: contain;
`

const Card = styled.form`
  width: 100%;
  max-width: 42rem;
  background: rgba(255,255,255,.6);
  border: 0.2rem solid #E0D9F0;
  border-radius: 2rem;
  padding: 2.4rem;
  box-shadow: 0 0.6rem 1.6rem rgba(0,0,0,0.06);
`

const Title = styled.h1`
  text-align: center;
  margin-top: 0.8rem;
  margin-bottom: 0.8rem;
`

const Subtitle = styled.p`
  text-align: center;
  color: var(--muted-foreground);
  margin-bottom: 1.6rem;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`

const Label = styled.label`
  color: #333333;
`

const Input = styled.input`
  height: 4.8rem;
  border-radius: var(--radius-xl);
  border: 0.2rem solid #E0D9F0;
  padding: 0 1.4rem;
  background: rgba(255,255,255,.8);
  color: #333333;
  outline: none;
  transition: border-color .2s ease, box-shadow .2s ease;

  &::placeholder { color: #aaa; }
  &:focus {
    border-color: #7E6BB5;
    box-shadow: 0 0 0 0.3rem rgba(126,107,181,.2);
  }
`

const Remember = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.8rem;

  input { width: 1.6rem; height: 1.6rem; }
`

const LoginButton = styled.button`
  width: 100%;
  height: 5.2rem;
  margin-top: 1.2rem;
  border-radius: var(--radius-xl);
  background: #7E6BB5;
  color: #ffffff;
  border: 0;
  cursor: pointer;
  box-shadow: 0 0.8rem 1.6rem rgba(126,107,181,.22);
  transition: transform .1s ease, box-shadow .2s ease, background .2s ease;

  &:hover { background: #6B5A9E; box-shadow: 0 1rem 1.8rem rgba(126,107,181,.28); }
  &:active { transform: translateY(1px); }
`

const SignupRow = styled.p`
  text-align: center;
  color: #666666;
  margin-top: 1.2rem;
`

const SignupButton = styled.button`
  color: #7E6BB5;
  background: transparent;
  border: 0;
  cursor: pointer;
`

const Divider = styled.div`
  position: relative;
  width: 100%;
  max-width: 42rem;
  padding: 2.4rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &::before{
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 0.1rem;
    background: #E0D9F0;
  }
  span{
    position: relative;
    background: #F2F2FC;
    padding: 0 .8rem;
    color: #666666;
    z-index: 1;
  }
`

const GoogleButton = styled.button`
  width: 100%;
  max-width: 42rem;
  height: 5.2rem;
  border-radius: 2rem;
  border: 0.2rem solid #E0D9F0;
  background: rgba(255,255,255,.8);
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  cursor: pointer;
  transition: box-shadow .2s ease, border-color .2s ease, background .2s ease;
  &:hover{ background: #ffffff; border-color: #7E6BB5; box-shadow: 0 .6rem 1.2rem rgba(0,0,0,.06); }
`

const GoogleIcon = styled.svg`
  width: 2rem; height: 2rem;
`

const BottomText = styled.p`
  text-align: center;
  color: #999999;
  margin-top: 1.2rem;
  font-size: 1.2rem;
  line-height: 1.6;
`

const LinkText = styled.span`
  color: #7E6BB5;
  cursor: pointer;
  &:hover{ text-decoration: underline; }
`


