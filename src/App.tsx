import { Routes, Route } from 'react-router-dom'
import { ScrollToTop } from './components/shared'
import { Landing } from './pages/Landing'
import { Docs } from './pages/Docs'
import { Assets } from './pages/Assets'
import { Editor } from './pages/Editor'
import { Showcase } from './pages/Showcase'
import './styles/index.css'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/docs/:section" element={<Docs />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </>
  )
}

export default App
