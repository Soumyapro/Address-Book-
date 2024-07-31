import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/SignupPage" element={<SignupPage />} />
          <Route path="/HomePage" element={<HomePage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
