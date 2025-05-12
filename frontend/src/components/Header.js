// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

function Header({ isLoggedIn, onLogout }) {
  return (
    <header style={styles.header}>
      <h1><Link to="/" style={styles.title}>ФотоРедактор</Link></h1>
      <nav>
        {isLoggedIn ? (
          <>
            <Link to="/editor"><button style={styles.button}>Редактор</button></Link>
            <button onClick={onLogout} style={styles.button}>Вийти</button>
          </>
        ) : (
          <>
            <Link to="/login"><button style={styles.button}>Увійти</button></Link>
            <Link to="/register"><button style={styles.button}>Зареєструватись</button></Link>
          </>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    background: '#eee',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  button: {
    marginLeft: '10px'
  },
  title: {
    textDecoration: 'none',
    color: 'black'
  }
};

export default Header;
