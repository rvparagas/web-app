import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Entries from './pages/Entries'
import Detail from './pages/Detail'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/entries" element={<Entries />} />
          <Route path="/entries/:id" element={<Detail />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
