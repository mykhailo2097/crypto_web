import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/navbar'
import { Home } from './pages/home'
// import reactLogo from './assets/react.svg'
// <img src={reactLogo} className="logo react" alt="React logo" />

function App() {
  return (
    <div className="flex bg-[#050813]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
