import styled from 'styled-components'

export default function Header() {
  return (
    <Bar>
      <Title>SlowMind</Title>
    </Bar>
  )
}

const Bar = styled.header`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 48rem; /* 480px */
  height: 8.8rem;  /* 88px */
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background);
  border-bottom: 1px solid var(--border);
  z-index: 10;
  backdrop-filter: blur(6px);
`

const Title = styled.h1`
  color: var(--foreground);
`


