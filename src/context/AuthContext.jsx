import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * 👑 AYABUS ADMIN COCKPIT (Sovereign Auth Engine)
 * ------------------------------------------------------------------
 * Module: Authentication Context
 * File: AuthContext.jsx
 * * DESCRIPTION:
 * The Zero-Trust gatekeeper for the Admin Cockpit. Handles real JWT 
 * session tracking, persistent logins, and secure communication with 
 * the Supabase Auth firewall.
 * * WORLD-CLASS FEATURES:
 * 1. PERSISTENT SESSIONS: Survives browser refreshes using secure local storage tokens.
 * 2. REAL-TIME LISTENER: Instantly boots users if their session expires or is revoked remotely.
 * 3. GRACEFUL ERROR HANDLING: Translates cryptic database errors into human-readable UI alerts.
 */

// 1. Initialize the Context
const AuthContext = createContext({});

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Blocks rendering until session is verified
  const [authError, setAuthError] = useState(null);

  // --- INITIALIZATION & LISTENER ---
  useEffect(() => {
    let mounted = true;

    // A. Check for an existing session on first load
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          setSession(session);
          setUser(session?.user || null);
        }
      } catch (error) {
        console.error("Auth Initialization Error:", error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // B. Set up the Real-Time Auth Listener (Watches for logouts/expirations)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          setLoading(false);
        }
      }
    );

    // C. Cleanup memory leaks when app unmounts
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // --- AUTHENTICATION METHODS ---

  /**
   * Secure Login via Supabase
   * @param {string} email 
   * @param {string} password 
   * @returns {boolean} Success status to the UI
   */
  const login = async (email, password) => {
    try {
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Translate Supabase errors to UI-friendly text
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('ACCESS DENIED: Invalid email or encryption key.');
        }
        throw new Error(`AUTHENTICATION FAILED: ${error.message}`);
      }

      // Note: We don't need to manually set the user here because 
      // the onAuthStateChange listener above will catch it automatically.
      return true;

    } catch (error) {
      setAuthError(error.message);
      return false;
    }
  };

  /**
   * Secure Logout & Token Destruction
   */
  const logout = async () => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // State is cleared automatically by the listener
    } catch (error) {
      console.error("Logout Integrity Error:", error.message);
      setAuthError("Failed to securely terminate session.");
    }
  };

  /**
   * Utility: Clears the error state (used when user starts typing again)
   */
  const clearError = () => setAuthError(null);

  // --- RENDER ---
  // If we are still checking the local storage for a token, show nothing or a spinner.
  // This prevents the "Login screen flash" when a logged-in user refreshes the page.
  if (loading) {
    return (
      <div style={{ 
        height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', background: 'var(--bg-canvas)', color: 'var(--brand-primary)' 
      }}>
        <div style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Initializing Sovereign Protocols...
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated: !!user,
      authError,
      login,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create the Custom Hook for easy access inside components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};