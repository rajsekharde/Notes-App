import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import NotesTemp from './pages/NotesTemp'
import Notes from './pages/Notes'
import { isLoggedIn } from './auth/auth'
import Login from './pages/Login'
import { Navigate } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/notes"
          element={isLoggedIn() ? <Notes /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
