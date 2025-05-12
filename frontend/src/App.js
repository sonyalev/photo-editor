// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import Register from './components/Register';
import Login from './pages/Login';
import EditorLoggedIn from './pages/EditorLoggedIn';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/editor" element={<EditorLoggedIn />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/editor" element={<EditorLoggedIn />} />
      </Routes>
    </Router>
  );
}

export default App;




