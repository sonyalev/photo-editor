import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  return (
    <div className="nav-container">
      <div className="nav-left">
        <Link to="/contact" className="nav-link">
          Контактна інформація
        </Link>
        <Link to="/about" className="nav-link">
          Про проект
        </Link>
      </div>
      <div className="nav-right">
        <Link to="/register" className="nav-button">
          Зареєструватись
        </Link>
        <Link to="/login" className="nav-button">
          Увійти
        </Link>
      </div>
    </div>
  );
}

export default Header;