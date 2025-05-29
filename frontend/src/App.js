import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Profile from './pages/Profile';
import Header from './components/Header';
import Home from './pages/Home';
import Register from './components/Register';
import Login from './pages/Login';
import EditorLoggedIn from './pages/EditorLoggedIn';
import SavedImagesPage from './pages/SavedImagesPage';
import EditorPage from './pages/EditorPage';
import Contact from './pages/Contact';
import About from './pages/About';
import './styles/Global.css';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 



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
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {/* Тут дві версії редактора — для залогінених і звичайний */}
        <Route path="/editor" element={<EditorLoggedIn />} />
        {/* Сторінка зі збереженими фото з можливістю їх перегляду */}
        <Route path="/saved-images" element={<SavedImagesPage />} />
        {/* Редактор для редагування конкретного фото */}
        <Route path="/edit-image/:imageId" element={<EditorPage />} />
        <Route path="/profile" element={<Profile userId={1} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;












