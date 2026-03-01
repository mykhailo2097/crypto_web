import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import AESPage from './pages/AESPage'
import AffinePage from './pages/AffinePage'
import BenchmarkPage from './pages/BenchmarkPage'

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-dark-base text-gray-100 font-sans">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/aes" replace />} />
          <Route path="/aes" element={<AESPage />} />
          <Route path="/affine" element={<AffinePage />} />
          <Route path="/benchmark" element={<BenchmarkPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
