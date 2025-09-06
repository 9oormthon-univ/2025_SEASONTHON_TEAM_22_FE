import { create } from 'zustand'
import { applyActivity, cancelActivity } from '../services/activityApi'
import { toast } from 'sonner'

// 개발 모드 설정 (API 서버가 없을 때 사용)
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'

const useApplicationsStore = create((set, get) => ({
      // 신청한 활동 목록 (더미 데이터)
      appliedActivities: [
        {
          id: 1,
          title: '청년직업역량개발 [도전! 디자이너!] 프로그램',
          category: '직업역량',
          image: 'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjB3b3Jrc2hvcCUyMGNyZWF0aXZlfGVufDF8fHx8MTc1NjcwNDY3M3ww&ixlib=rb-4.0.3&q=80&w=1080&utm_source=figma&utm_medium=referral',
          description: '청년들의 디자인 역량을 개발하고 창의적 사고를 기를 수 있는 프로그램입니다.',
          duration: '8주',
          location: '서울시 강남구',
          maxParticipants: 20,
          currentParticipants: 15,
          date: '2024.08.26 - 2024.09.09',
          time: '15:00 - 17:00',
          recruitStatus: 'OPEN',
          appliedAt: '2024-08-20T10:30:00.000Z'
        }
      ],
      
      // 활동 신청
      applyActivity: async (activity) => {
        try {
          if (!DEV_MODE) {
            await applyActivity(activity.id)
          }
          set((state) => ({
            appliedActivities: [...state.appliedActivities, {
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
              time: activity.time,
              appliedAt: new Date().toISOString()
            }]
          }))
          toast.success('활동에 신청했습니다!')
        } catch (error) {
          console.error('활동 신청 실패:', error)
          if (DEV_MODE) {
            // 개발 모드에서는 에러를 무시하고 로컬에만 저장
            set((state) => ({
              appliedActivities: [...state.appliedActivities, {
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
                time: activity.time,
                appliedAt: new Date().toISOString()
              }]
            }))
            toast.success('활동에 신청했습니다! (개발 모드)')
          } else {
            if (error.message.includes('이미 신청한')) {
              toast.info('이미 신청한 활동입니다.')
            } else if (error.message.includes('마감된')) {
              toast.error('신청이 마감된 활동입니다.')
            } else {
              toast.error('활동 신청에 실패했습니다.')
            }
          }
        }
      },
      
      // 활동 신청 취소
      cancelApplication: async (activityId) => {
        try {
          if (!DEV_MODE) {
            await cancelActivity(activityId)
          }
          set((state) => ({
            appliedActivities: state.appliedActivities.filter(app => app.id !== activityId)
          }))
          toast.success('신청을 취소했습니다')
        } catch (error) {
          console.error('신청 취소 실패:', error)
          if (DEV_MODE) {
            // 개발 모드에서는 에러를 무시하고 로컬에서만 제거
            set((state) => ({
              appliedActivities: state.appliedActivities.filter(app => app.id !== activityId)
            }))
            toast.success('신청을 취소했습니다 (개발 모드)')
          } else {
            if (error.message.includes('신청하지 않은')) {
              toast.info('신청하지 않은 활동입니다.')
            } else {
              toast.error('신청 취소에 실패했습니다.')
            }
          }
        }
      },
      
      // 특정 활동에 신청했는지 확인
      isApplied: (activityId) => {
        const { appliedActivities } = get()
        return appliedActivities.some(app => app.id === activityId)
      },
      
      // 신청한 활동 개수
      getApplicationCount: () => {
        const { appliedActivities } = get()
        return appliedActivities.length
      },
      
      // 신청한 활동 목록 초기화 (로그아웃 시 사용)
      clearApplications: () => {
        set({ appliedActivities: [] })
      }
    })
)

export default useApplicationsStore
