import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

/**
 * 🛡️ THE GATEKEEPER (Protected Route Wrapper)
 * ------------------------------------------------------------------
 * Intercepts traffic. If a user does not have a valid Supabase JWT, 
 * they are instantly bounced back to the login terminal.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

/**
 * 👑 THE APPLICATION ROOT (AyaBus Citadel)
 * ------------------------------------------------------------------
 * Engineered for Zero-Trust Security and modular scalability.
 * Wraps the entire ecosystem in the Authentication Provider.
 */
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* PUBLIC ROUTE: The Login Terminal */}
          <Route path="/login" element={<LoginPage />} />

          {/* PRIVATE ROUTE: The Secure Dashboard */}
          {/* The /* ensures that any nested routes inside HomePage work perfectly */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;