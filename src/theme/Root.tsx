import React from 'react';
import PasswordProtection from '../components/PasswordProtection';

// Custom Root component that wraps the entire app with password protection
export default function Root({children}) {
  return (
    <PasswordProtection>
      {children}
    </PasswordProtection>
  );
}