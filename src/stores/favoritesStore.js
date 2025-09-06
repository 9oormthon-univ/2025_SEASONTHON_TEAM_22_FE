import { create } from 'zustand'
import { likeActivity, unlikeActivity } from '../services/activityApi'
import { toast } from 'sonner'

// 개발 모드 설정 (API 서버가 없을 때 사용)
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'

const useFavoritesStore = create((set, get) => ({
      // 찜한 활동 목록
      favoriteActivities: [],
      
      // 찜한 활동 추가
      addFavorite: async (activity) => {
        try {
          if (!DEV_MODE) {
            await likeActivity(activity.id)
          }
          set((state) => ({
            favoriteActivities: [...state.favoriteActivities, {
              id: activity.id,
              title: activity.title,
              category: activity.category,
              image: activity.image,
              description: activity.description,
              duration: activity.duration,
              location: activity.location,
              maxParticipants: activity.maxParticipants,
              currentParticipants: activity.currentParticipants,
              date: activity.date,
              time: activity.time
            }]
          }))
          toast.success('활동을 찜했습니다!')
        } catch (error) {
          console.error('찜하기 실패:', error)
          if (DEV_MODE) {
            // 개발 모드에서는 에러를 무시하고 로컬에만 저장
            set((state) => ({
              favoriteActivities: [...state.favoriteActivities, {
                id: activity.id,
                title: activity.title,
                category: activity.category,
                image: activity.image,
                description: activity.description,
                duration: activity.duration,
                location: activity.location,
                maxParticipants: activity.maxParticipants,
                currentParticipants: activity.currentParticipants,
                date: activity.date,
                time: activity.time
              }]
            }))
            toast.success('활동을 찜했습니다! (개발 모드)')
          } else {
            if (error.message.includes('이미 찜한')) {
              toast.info('이미 찜한 활동입니다.')
            } else {
              toast.error('찜하기에 실패했습니다.')
            }
          }
        }
      },
      
      // 찜한 활동 제거
      removeFavorite: async (activityId) => {
        try {
          if (!DEV_MODE) {
            await unlikeActivity(activityId)
          }
          set((state) => ({
            favoriteActivities: state.favoriteActivities.filter(fav => fav.id !== activityId)
          }))
          toast.success('찜을 해제했습니다')
        } catch (error) {
          console.error('찜 해제 실패:', error)
          if (DEV_MODE) {
            // 개발 모드에서는 에러를 무시하고 로컬에서만 제거
            set((state) => ({
              favoriteActivities: state.favoriteActivities.filter(fav => fav.id !== activityId)
            }))
            toast.success('찜을 해제했습니다 (개발 모드)')
          } else {
            if (error.message.includes('찜하지 않은')) {
              toast.info('찜하지 않은 활동입니다.')
            } else {
              toast.error('찜 해제에 실패했습니다.')
            }
          }
        }
      },
      
      // 찜하기 토글
      toggleFavorite: async (activity) => {
        const { favoriteActivities } = get()
        const isFavorite = favoriteActivities.some(fav => fav.id === activity.id)
        
        if (isFavorite) {
          await get().removeFavorite(activity.id)
        } else {
          await get().addFavorite(activity)
        }
      },
      
      // 특정 활동이 찜되어 있는지 확인
      isFavorite: (activityId) => {
        const { favoriteActivities } = get()
        return favoriteActivities.some(fav => fav.id === activityId)
      },
      
      // 찜한 활동 개수
      getFavoriteCount: () => {
        const { favoriteActivities } = get()
        return favoriteActivities.length
      },
      
      // 찜한 활동 목록 초기화 (로그아웃 시 사용)
      clearFavorites: () => {
        set({ favoriteActivities: [] })
      }
    })
)

export default useFavoritesStore
