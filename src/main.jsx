import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GlobalStyles } from './styles/globalstyles.jsx'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalStyles />
      <Toaster richColors />
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// 개발환경에서는 서비스워커 비활성화하여 캐시된 라우팅 이슈 방지
if (import.meta.env.PROD) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      // 새 버전 필요 시 바로 새로고침
      window.location.reload()
    },
    onOfflineReady() {
      // 오프라인 준비 완료 콜백
    },
  })
}
