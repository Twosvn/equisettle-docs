import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface PasswordProtectionProps {
  children: React.ReactNode;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Password for accessing the documentation
  const CORRECT_PASSWORD = 'u*rqyc4rI';

  useEffect(() => {
    // Check if user is already authenticated (stored in sessionStorage)
    const authStatus = sessionStorage.getItem('equisettle-docs-auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('equisettle-docs-auth', 'authenticated');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('equisettle-docs-auth');
    setPassword('');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.passwordContainer}>
        <div className={styles.passwordBox}>
          <div className={styles.logo}>
            <h1>ÉquiSettle</h1>
            <p>Technical Documentation</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.passwordForm}>
            <h2>Access Protected Content</h2>
            <p>Please enter the password to access the documentation.</p>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={styles.passwordInput}
                autoFocus
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.submitButton}>
              Access Documentation
            </button>
          </form>

          <div className={styles.footer}>
            <p>&copy; 2024 ÉquiSettle by Twosvn Agency</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.authenticatedHeader}>
        <div className={styles.userInfo}>
          <span>✅ Authenticated</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default PasswordProtection;