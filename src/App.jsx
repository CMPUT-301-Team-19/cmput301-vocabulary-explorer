import { Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './AppContext'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import TopicPage from './pages/TopicPage'
import RelatedPage from './pages/RelatedPage'
import DetailsPage from './pages/DetailsPage'
import SavedPage from './pages/SavedPage'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/topic/:topicId" element={<TopicPage />} />
        <Route path="/related/:wordId" element={<RelatedPage />} />
        <Route path="/details/:wordId" element={<DetailsPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  )
}
