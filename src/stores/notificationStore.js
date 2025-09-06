import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  // 알림 설정 상태
  notificationSettings: {
    emotionRecord: true,
    favoriteActivity: true
  },
  
  // 알림 설정 토글
  toggleNotification: (type) => {
    set((state) => ({
      notificationSettings: {
        ...state.notificationSettings,
        [type]: !state.notificationSettings[type]
      }
    }))
  },
  
  // 알림 설정 초기화
  resetNotificationSettings: () => {
    set({
      notificationSettings: {
        emotionRecord: true,
        favoriteActivity: true
      }
    })
  },
  
  // 특정 알림 설정 가져오기
  getNotificationSetting: (type) => {
    return useNotificationStore.getState().notificationSettings[type]
  }
}))

export default useNotificationStore
