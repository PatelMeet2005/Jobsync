import { useState, useEffect } from 'react';

/**
 * Hook to validate if the user's JWT token is valid and complete
 * Returns: { isValid, needsRelogin, message }
 */
export const useTokenValidation = () => {
  const [validation, setValidation] = useState({
    isValid: true,
    needsRelogin: false,
    message: ''
  });

  useEffect(() => {
    const validateToken = () => {
      try {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const userId = sessionStorage.getItem('userId') || sessionStorage.getItem('_id');
        
        // No token = not logged in (valid state)
        if (!token) {
          setValidation({ isValid: true, needsRelogin: false, message: '' });
          return;
        }

        // Has token but no userId = needs re-login
        if (!userId) {
          setValidation({
            isValid: false,
            needsRelogin: true,
            message: '⚠️ Your session is outdated. Please logout and login again to continue using all features.'
          });
          return;
        }

        // Decode JWT to verify structure
        const parts = token.split('.');
        if (parts.length !== 3) {
          setValidation({
            isValid: false,
            needsRelogin: true,
            message: '⚠️ Invalid token format. Please logout and login again.'
          });
          return;
        }

        try {
          const payload = JSON.parse(window.atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          
          // Check if token has expired
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            setValidation({
              isValid: false,
              needsRelogin: true,
              message: '⚠️ Your session has expired. Please login again.'
            });
            return;
          }

          // Check if token has user ID
          const tokenHasId = payload.id || payload._id || payload.userId || payload.uid || payload.sub;
          if (!tokenHasId) {
            setValidation({
              isValid: false,
              needsRelogin: true,
              message: '⚠️ Your session is incomplete. Please logout and login again.'
            });
            return;
          }

          // All checks passed
          setValidation({ isValid: true, needsRelogin: false, message: '' });
        } catch (decodeErr) {
          setValidation({
            isValid: false,
            needsRelogin: true,
            message: '⚠️ Could not validate your session. Please logout and login again.'
          });
        }
      } catch (err) {
        console.error('Token validation error', err);
        setValidation({ isValid: true, needsRelogin: false, message: '' });
      }
    };

    validateToken();
  }, []);

  return validation;
};
