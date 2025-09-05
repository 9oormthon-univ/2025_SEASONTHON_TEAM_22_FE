import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import AppLayout from './layouts/AppLayout'
import Recommend from './pages/Recommend'
import Community from './pages/Community'
import Training from './pages/Training'
import MyPage from './pages/MyPage'
import Meditation from './pages/Meditation'
import Walking from './pages/Walking'
import Journaling from './pages/Journaling'
import Music from './pages/Music'
import ActivityDetail from './pages/ActivityDetail'
import WritePost from './pages/WritePost'
import PostDetail from './pages/PostDetail'
import ReviewDetail from './pages/ReviewDetail'
import MoodRecord from './pages/MoodRecord'
import TrainingRecord from './pages/TrainingRecord'
import TrainingDetail from './pages/TrainingDetail'
import ActivityCompletion from './pages/ActivityCompletion'

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#F2F2FC'
      }}>
        <div style={{ 
          fontSize: '1.6rem', 
          color: '#7E6BB5',
          fontWeight: '500'
        }}>
          로딩 중...
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} 
      />
      <Route 
        element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
      >
        <Route path="/" element={<Home />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/meditation" element={<Meditation />} />
        <Route path="/walking" element={<Walking />} />
        <Route path="/journaling" element={<Journaling />} />
        <Route path="/music" element={<Music />} />
        <Route path="/activity/:id" element={<ActivityDetail />} />
        <Route path="/write" element={<WritePost />} />
        <Route path="/community" element={<Community />} />
        <Route path="/moods" element={<MoodRecord />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/review/:id" element={<ReviewDetail />} />
        <Route path="/training" element={<Training />} />
        <Route path="/training-record" element={<TrainingRecord />} />
        <Route path="/training-detail" element={<TrainingDetail />} />
        <Route path="/activity-completion" element={<ActivityCompletion />} />
        <Route path="/mypage" element={<MyPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
