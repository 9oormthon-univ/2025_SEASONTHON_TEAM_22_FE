import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
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

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/meditation" element={<Meditation />} />
        <Route path="/walking" element={<Walking />} />
        <Route path="/journaling" element={<Journaling />} />
        <Route path="/music" element={<Music />} />
        <Route path="/activity" element={<ActivityDetail />} />
        <Route path="/write" element={<WritePost />} />
        <Route path="/community" element={<Community />} />
        <Route path="/moods" element={<MoodRecord />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/review/:id" element={<ReviewDetail />} />
        <Route path="/training" element={<Training />} />
        <Route path="/training-record" element={<TrainingRecord />} />
        <Route path="/mypage" element={<MyPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
