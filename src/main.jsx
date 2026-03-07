import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Admin from './Admin.jsx'
import Kontakt from './Kontakt.jsx'
import Podminky from './Podminky.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/podminky" element={<Podminky />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
