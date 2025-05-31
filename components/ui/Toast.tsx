import React from 'react';

interface ToastProps {
  message: string | null;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 60,
        right: 20,
        background: 'white',
        color: 'black',
        padding: '12px 24px',
        borderRadius: 6,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
};

export default Toast;