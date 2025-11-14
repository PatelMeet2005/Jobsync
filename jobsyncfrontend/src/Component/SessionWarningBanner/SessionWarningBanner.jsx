import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SessionWarningBanner.css';

const SessionWarningBanner = ({ message, onClose }) => {
  const navigate = useNavigate();

  const handleRelogin = () => {
    // Clear all session data
    sessionStorage.clear();
    localStorage.clear();
    
    // Redirect to home/login
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="session-warning-banner">
      <div className="session-warning-content">
        <div className="session-warning-icon">⚠️</div>
        <div className="session-warning-text">
          <strong>Session Issue Detected</strong>
          <p>{message}</p>
        </div>
        <div className="session-warning-actions">
          <button className="session-warning-btn-relogin" onClick={handleRelogin}>
            Logout & Login Again
          </button>
          {onClose && (
            <button className="session-warning-btn-close" onClick={onClose}>
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionWarningBanner;
