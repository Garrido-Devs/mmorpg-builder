import { Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Docs } from './pages/Docs'
import { Assets } from './pages/Assets'
import { Editor } from './pages/Editor'
import './styles/index.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/docs/:section" element={<Docs />} />
      <Route path="/assets" element={<Assets />} />
      <Route path="/editor" element={<Editor />} />
    </Routes>
  )
}

export default App
