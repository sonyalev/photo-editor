// frontend/src/components/ConfirmModal.js
import React from 'react';
import Modal from 'react-modal';
import '../styles/Global.css'; // Імпортуємо глобальні стилі

// Прив’язуємо react-modal до кореня програми для доступності
Modal.setAppElement('#root');

function ConfirmModal({ isOpen, onRequestClose, onConfirm, message }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          border: 'none',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Підтвердження</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button
          onClick={onConfirm}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Підтвердити
        </button>
        <button
          onClick={onRequestClose}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ccc',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Скасувати
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;