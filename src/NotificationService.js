import { toast } from 'sonner'

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

    toast(
      (
        <div className="flex items-center space-x-3 p-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#8A79BA] to-[#9B8BC7] rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[#333333] text-sm">잠깐의 기록이 큰 힘이 돼요</p>
            <p className="text-xs text-[#666666] mt-0.5">지금 감정을 남겨보며 마음을 정돈해보세요</p>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: 'top-center',
        style: {
          background: 'white',
          border: '1px solid #E0D9F0',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(138, 121, 186, 0.15)',
          minWidth: '300px',
        },
      }
    )
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

    toast(
      (
        <div className="flex items-center space-x-3 p-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF9F43] to-[#FECA57] rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[#333333] text-sm">{title}</p>
            <p className="text-xs text-[#666666] mt-0.5">{body}</p>
          </div>
        </div>
      ),
      {
        duration: 6000,
        position: 'top-center',
        style: {
          background: 'white',
          border: '1px solid #E0D9F0',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(255, 159, 67, 0.15)',
          minWidth: '300px',
        },
      }
    )
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


