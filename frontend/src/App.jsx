// App.jsx
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Notes from './pages/Notes'
import Login from './pages/Login'
import { fetchMe } from './auth/auth'

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading"); // "loading" | "authed" | "guest"

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        await fetchMe();
        if (isMounted) setStatus("authed");
      } catch {
        if (isMounted) setStatus("guest");
      }
    }

    checkAuth();
    return () => { isMounted = false; };
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "guest") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
