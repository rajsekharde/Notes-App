import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import NotesTemp from './pages/NotesTemp'
import Notes from './pages/Notes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/notesTemp' element={<NotesTemp />} />
        <Route path='/notes' element={<Notes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
