import styled from 'styled-components'

export default function Tabs({ tabs = [], activeValue, onChange }) {
  return (
    <Wrap>
      <Sticky>
        <Container>
          {tabs.map((tab) => (
            <Button
              key={tab.value || tab.label}
              active={(tab.value || tab.label) === activeValue}
              label={tab.label}
              onClick={() => onChange?.(tab.value || tab.label)}
              type="button"
            >
              {tab.label}
            </Button>
          ))}
        </Container>
      </Sticky>
    </Wrap>
  )
}

const Wrap = styled.div`
  background: #ffffff;
  border-bottom: 1px solid var(--border);
  width: 100vw; /* 페이지 헤더와 동일하게 전체 폭 */
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding: 0.8rem 1.6rem 1.2rem; /* 상단 여백 살짝 증가 */
  margin-bottom: 1.6rem; /* 다른 컴포넌트들과 동일한 간격 */
`

const Sticky = styled.div`
  position: sticky;
  top: 0;
  z-index: 9;
  padding: 0.2rem 0 0.4rem; /* 상단 여백 축소 */
  background: transparent; /* 상위 랩 배경 활용 */
`

const Container = styled.div`
  display: flex;
  gap: 0.4rem;
  background: var(--muted);
  border-radius: 0.8rem;
  padding: 0.4rem;
  width: 100%;
  max-width: 44rem; /* 살짝 좁게 */
  margin: 0 auto; /* 가운데 정렬 */
  justify-content: center;
`

const Button = styled.button`
  flex: 1;
  padding: 0.8rem 1.2rem;
  border-radius: 0.8rem;
  border: none;
  background: ${p => {
    if (p.active) {
      // "함께하기" 탭은 원래 primary 색상 사용
      return p.label === '함께하기' ? 'var(--primary)' : '#ffffff'
    }
    return 'transparent'
  }};
  color: ${p => {
    if (p.active) {
      // "함께하기" 탭은 원래 primary-foreground 색상 사용
      return p.label === '함께하기' ? 'var(--primary-foreground)' : 'var(--primary)'
    }
    return 'var(--muted-foreground)'
  }};
  font-size: 1.5rem;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${p => p.active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'};
  
  &:hover {
    background: ${p => {
      if (p.active) {
        return p.label === '함께하기' ? 'var(--primary)' : '#ffffff'
      }
      return 'rgba(255,255,255,0.5)'
    }};
  }
`


