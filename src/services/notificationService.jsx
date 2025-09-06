import { toast } from 'sonner'
import { Heart as HeartIcon, Clock as ClockIcon } from 'lucide-react'
import styled from 'styled-components'

export const NotificationService = {
  config: {
    emotionNotification: true,
    favoriteNotification: true,
  },
  timers: [],

  updateConfig(config) {
    this.config = { ...this.config, ...config }
    this.scheduleNotifications()
  },

  async requestPermission() {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  },

  showEmotionReminder() {
    if (!this.config.emotionNotification) return

    this.requestPermission().then((granted) => {
      if (granted) {
        new Notification('잠깐의 기록이 큰 힘이 돼요', {
          body: '지금 감정을 남겨보며 마음을 정돈해보세요',
          icon: '/icon-192.png',
          badge: '/badge-72.png',
          tag: 'emotion-reminder',
          requireInteraction: true,
        })
      }
    })

    toast.custom(() => (
      <ToastBox $border="#E3DDF3" $shadow="0 10px 30px rgba(138,121,186,0.18)">
        <IconCircle $bg="#8A79BA">
          <HeartIcon size={22} color="#ffffff" />
        </IconCircle>
        <Content>
          <Title>잠깐의 기록이 큰 힘이 돼요</Title>
          <Body>지금 감정을 남겨보며 마음을 정돈해보세요</Body>
        </Content>
      </ToastBox>
    ), { duration: 5000, position: 'top-center' })
  },

  showFavoriteActivityReminder(activityTitle) {
    if (!this.config.favoriteNotification) return

    const title = '찜한 활동 마감이 다가와요'
    const body = activityTitle
      ? `${activityTitle} 신청 마감이 다가와요!`
      : '아직 고민중이신가요? 곧 신청이 마감돼요!'

    this.requestPermission().then((granted) => {
      if (granted) {
        new Notification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/badge-72.png',
          tag: 'favorite-activity-reminder',
          requireInteraction: true,
        })
      }
    })

    toast.custom(() => (
      <ToastBox $border="#F1E3D0" $shadow="0 10px 30px rgba(255,182,92,0.2)">
        <IconCircle $bg="#FFB65C">
          <ClockIcon size={22} color="#ffffff" />
        </IconCircle>
        <Content>
          <Title>{title}</Title>
          <Body>{body}</Body>
        </Content>
      </ToastBox>
    ), { duration: 6000, position: 'top-center' })
  },

  scheduleNotifications() {
    this.timers.forEach((t) => clearTimeout(t))
    this.timers = []
    if (this.config.emotionNotification) this.scheduleEmotionReminders()
    if (this.config.favoriteNotification) this.scheduleFavoriteReminders()
  },

  scheduleEmotionReminders() {
    const demoTimer = setTimeout(() => this.showEmotionReminder(), 10000)
    this.timers.push(demoTimer)
  },

  scheduleFavoriteReminders() {
    const demoTimer = setTimeout(() => this.showFavoriteActivityReminder('자신감UP! 관계소통UP! 마음 성장 보드게임'), 15000)
    this.timers.push(demoTimer)
  },

  cleanup() {
    this.timers.forEach((t) => clearTimeout(t))
    this.timers = []
  },

  showTestEmotionNotification() { this.showEmotionReminder() },
  showTestFavoriteNotification() { this.showFavoriteActivityReminder() },
}

const ToastBox = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 1.2rem;
  background: #ffffff;
  border: 1px solid ${props => props.$border || '#E3DDF3'};
  border-radius: 1.6rem;
  box-shadow: ${props => props.$shadow || '0 10px 30px rgba(0,0,0,0.08)'};
  min-width: 32rem;
  max-width: 38rem;
  overflow: hidden;
  box-sizing: border-box;
`

const IconCircle = styled.div`
  width: 4.4rem;
  height: 4.4rem;
  border-radius: 999px;
  background: ${props => props.$bg || '#8A79BA'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const Content = styled.div`
  flex: 1;
  min-width: 0;
`

const Title = styled.div`
  color: #2F2F2F;
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 1.3;
`

const Body = styled.div`
  color: #666666;
  font-size: 1.3rem;
  line-height: 1.3;
  margin-top: 0.4rem;
`
