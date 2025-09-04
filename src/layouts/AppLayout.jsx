import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import MenuBar from '../components/MenuBar'

export default function AppLayout() {
  return (
    <Shell>
      <Main>
        <Outlet />
      </Main>
      <MenuBar />
    </Shell>
  )
}

// 반응형 컨테이너: 모바일 우선, 가운데 정렬, 최대 폭 제한
const Shell = styled.div`
  min-height: 100dvh;
  background: var(--background);
  color: var(--foreground);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Main = styled.main`
  width: 100%;
  max-width: 48rem; /* 480px */
  flex: 1 1 auto;
  padding: 0 1.6rem 8.8rem; /* 헤더가 상단을 꽉 채우도록 상단 패딩 제거 */

  @media (min-width: 60rem) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`


