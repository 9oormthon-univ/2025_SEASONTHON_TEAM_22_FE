import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Home, Star, Users, BookOpen, Heart } from 'lucide-react'

const Bar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 48rem; /* 480px */
  height: 7.2rem;  /* 72px */
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  background: #ffffff;
  border-top: 1px solid var(--border);
  z-index: 10;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`

const Icon = styled.div`
  font-size: 2rem;
  color: var(--muted-foreground);
`

const Text = styled.span`
  font-size: 1.2rem;
  color: var(--muted-foreground);
  font-weight: var(--font-weight-normal);
`

const Item = styled(NavLink)`
  text-align: center;
  text-decoration: none;
  padding: 1.2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;

  &.active {
    color: var(--primary);
    ${Icon} { color: var(--primary); }
    ${Text} { color: var(--primary); }
  }
`

export default function MenuBar() {
  return (
    <Bar>
      <Item to="/">
        <Icon><Home size={20} /></Icon>
        <Text>홈</Text>
      </Item>
      <Item to="/recommend">
        <Icon><Star size={20} /></Icon>
        <Text>활동 추천</Text>
      </Item>
      <Item to="/community">
        <Icon><Users size={20} /></Icon>
        <Text>커뮤니티</Text>
      </Item>
      <Item to="/training">
        <Icon><BookOpen size={20} /></Icon>
        <Text>마음 훈련</Text>
      </Item>
      <Item to="/mypage">
        <Icon><Heart size={20} /></Icon>
        <Text>내 마음</Text>
      </Item>
    </Bar>
  )
}


