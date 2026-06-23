import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, AlertCircle, Sun, Moon, ShieldCheck, 
  ArrowRight, Eye, EyeOff, Loader2 
} from 'lucide-react';

/**
 * AYABUS ADMIN COCKPIT - LOGIN (Level 9: The Gatekeeper)
 * ------------------------------------------------------------------
 * The secure entry point for the AyaBus Sovereign ecosystem.
 * Fully wired to real Supabase Authentication via AuthContext.
 */

const LoginPage = () => {
  // --- AUTHENTICATION WIRES ---
  const { login, authError, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // --- FORM STATE ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- THEME ENGINE ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('ayabus-admin-theme');
    return savedTheme === 'dark'; 
  });

  useEffect(() => {
    localStorage.setItem('ayabus-admin-theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleThemeToggle = () => setIsDarkMode(!isDarkMode);

  // --- REDIRECT ENGINE ---
  // If the user is already logged in (checked by Context), push them straight to the Citadel
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    clearError(); // Clear any previous errors

    // Fire the real Supabase Auth request
    const success = await login(email, password);
    
    if (success) {
      // Navigate to the dashboard on success
      navigate('/', { replace: true });
    } else {
      // Re-enable the button if it failed (AuthContext handles setting the error message)
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)',
      color: 'var(--text-main)', padding: '24px', transition: 'all 0.3s ease'
    }}>
      
      {/* THEME TOGGLE */}
      <div style={{ position: 'absolute', top: '32px', right: '32px' }}>
        <button 
          onClick={handleThemeToggle}
          style={{ 
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', 
            color: 'var(--text-main)', padding: '12px', borderRadius: '50%', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'all 0.3s ease'
          }}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div style={{ 
        width: '100%', maxWidth: '420px', background: 'var(--bg-surface)',
        borderRadius: '24px', border: '1px solid var(--border-subtle)',
        boxShadow: isDarkMode ? '0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.05)',
        padding: '48px 40px', position: 'relative', overflow: 'hidden'
      }}>
        
        {/* A. HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '64px', height: '64px', borderRadius: '16px', background: 'var(--brand-primary)',
            color: '#000', marginBottom: '24px', boxShadow: '0 10px 20px rgba(206, 172, 92, 0.3)'
          }}>
            <ShieldCheck size={32} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px', margin: '0 0 8px 0' }}>
            AyaBus Admin
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0, fontWeight: '500' }}>
            Enter your credentials to access the secure administrative terminal.
          </p>
        </div>

        {/* B. FORM ENGINE */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* DYNAMIC ERROR ALERTS (Fed directly from Supabase via AuthContext) */}
          {authError && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-error)',
              padding: '16px', borderRadius: '12px', fontSize: '13px', fontWeight: '800',
              display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <AlertCircle size={18} /> {authError}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Terminal Clearance ID (Email)
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ayabus.com"
              style={{ 
                width: '100%', padding: '16px', borderRadius: '12px',
                background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)', fontSize: '15px', outline: 'none',
                transition: 'all 0.2s ease', fontWeight: '500'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Encryption Key (Password)
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ 
                  width: '100%', padding: '16px 48px 16px 16px', borderRadius: '12px',
                  background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)', fontSize: '15px', outline: 'none',
                  transition: 'all 0.2s ease', letterSpacing: showPassword ? 'normal' : '2px', fontWeight: '800'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
              width: '100%', padding: '16px', borderRadius: '14px',
              background: 'var(--brand-primary)', color: isDarkMode ? '#000' : '#FFF',
              border: 'none', fontWeight: '900', fontSize: '14px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', gap: '12px', transition: 'all 0.3s ease',
              boxShadow: '0 10px 20px rgba(206, 172, 92, 0.3)'
            }}
          >
            {isSubmitting ? (
              <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> INITIALIZING TERMINAL...</>
            ) : (
              <>INITIALIZE SYSTEM <ArrowRight size={18} /></>
            )}
          </button>

        </form>

        {/* C. FOOTER */}
        <div style={{ 
          marginTop: '40px', textAlign: 'center', borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px'
        }}>
          <div style={{ 
            fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', 
            letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', gap: '8px' 
          }}>
            <Lock size={12} /> SECURED BY AYABUS L9 PROTOCOLS
          </div>
        </div>

      </div>
      
      {/* CSS Animation for the loader */}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LoginPage;