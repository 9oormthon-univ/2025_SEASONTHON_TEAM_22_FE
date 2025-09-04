import styled from 'styled-components'
import { IoArrowBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, showBack = true, onBack }) {
  const navigate = useNavigate()
  
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <Header>
      {showBack && (
        <BackButton onClick={handleBack}>
          <IoArrowBack />
        </BackButton>
      )}
      <Title>{title}</Title>
    </Header>
  )
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  margin-bottom: 0;
  padding: 2rem 1.6rem;
  min-height: 6.8rem;
  background: #ffffff;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  width: 100vw; /* 컨테이너 패딩/가로제한과 무관하게 전체 폭 */
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  z-index: 100;
`

const BackButton = styled.button`
  background: transparent;
  border: none;
  font-size: 2rem;
  color: var(--foreground);
  padding: 0.4rem;
  cursor: pointer;
  position: absolute;
  left: 1.6rem;
`

const Title = styled.h1`
  margin: 0;
  color: #111111;
  font-size: 1.8rem;
`
