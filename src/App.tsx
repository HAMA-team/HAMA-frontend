import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChatInterface } from '@/components/chat'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
      </Routes>
    </Router>
  )
}

export default App
