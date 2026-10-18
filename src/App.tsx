import { Link, Navigate, Route, Routes } from 'react-router'
import SongListPage from './pages/SongListPage'
import SongPage from './pages/SongPage'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-brand">
          Chords
        </Link>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<SongListPage />} />
          <Route path="/songs/:songId" element={<SongPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
