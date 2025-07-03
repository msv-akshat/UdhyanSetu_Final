// src/contexts/AuthContext.js
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const status = localStorage.getItem('isLoggedIn') === 'true';
    const savedRole = localStorage.getItem('role');
    const savedUsername = localStorage.getItem('username');

    setIsLoggedIn(status);
    if (savedRole) setRole(savedRole);
    if (savedUsername) setUsername(savedUsername);
  }, []);

  const login = (userRole,userName) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', userRole);
    localStorage.setItem('username', userName);
    setIsLoggedIn(true);
    setRole(userRole);
    setUsername(userName);
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    setUsername(null);
    window.location.href = '/'; // 👈 Force redirect
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
