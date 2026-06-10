import React, { useState } from 'react';
import { Briefcase, Hash, Eye, EyeOff, ShieldCheck, Info, CheckCircle, AlertTriangle, BusFront, Lock, Key, Building2, FileText } from 'lucide-react';

const Step1_Credentials = ({ data, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  // HELPER: Updates parent state
  const updateField = (field, value) => {
    onChange({ [field]: value });
  };

  // VALIDATION LOGIC
  const passwordsMatch = data.password && data.confirmPassword && data.password === data.confirmPassword;
  const passwordMismatch = data.confirmPassword && data.password !== data.confirmPassword;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* 1. HEADER CONTEXT */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ 
          width: '56px', height: '56px', margin: '0 auto 16px', 
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
        }}>
          <BusFront size={28} color="var(--brand-primary)" />
        </div>
        <h3 className="text-heading" style={{ fontSize: '24px', marginBottom: '8px' }}>
          Bus Service Details
        </h3>
        <p className="text-muted" style={{ fontSize: '14px', maxWidth: '480px', margin: '0 auto', lineHeight: '1.6' }}>
          Let's register the Transport Operator. This information creates their dedicated portal and sets up their ticketing system prefix.
        </p>
      </div>

      {/* 2. THE SPLIT-PANEL CARD (Zero-Gap Architecture) */}
      <div className="citadel-card" style={{ padding: '0', overflow: 'hidden', borderTop: '4px solid var(--brand-primary)' }}>
        
        {/* Header Bar */}
        <div style={{ 
          padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--brand-primary)', borderRadius: '50%', padding: '6px', display: 'flex' }}>
              <Briefcase size={16} color="var(--text-inverse)" />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-main)' }}>
              Operator Profile
            </span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
             STEP 1 OF 4
          </div>
        </div>

        {/* THE SPLIT GRID: LEFT (Identity) | RIGHT (Security) */}
        <div className="citadel-grid-2" style={{ gap: '0' }}>
          
          {/* === LEFT PANEL: IDENTITY === */}
          <div style={{ padding: '32px', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* A. Bus Company Name */}
            <div>
              <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                Bus Company Name (Legal Entity)
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="citadel-input"
                  placeholder="e.g. Gateway Coaches Ltd"
                  value={data.companyName || ''} 
                  onChange={(e) => updateField('companyName', e.target.value)} 
                  autoFocus
                  style={{ fontWeight: '600', fontSize: '15px' }}
                />
                <Building2 size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* B. Company ID (Integrated Helper) */}
            <div>
              <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                Company ID (Short Code)
              </label>
              
              <div style={{ 
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', 
                overflow: 'hidden', transition: 'all 0.2s' 
              }}>
                {/* Input Area */}
                <div style={{ position: 'relative', background: 'var(--bg-input)' }}>
                  <input 
                    type="text" 
                    placeholder="e.g. GWAY"
                    maxLength={8}
                    value={data.partnerId || ''} 
                    onChange={(e) => updateField('partnerId', e.target.value.toUpperCase())} 
                    style={{ 
                      width: '100%', height: '50px', padding: '0 16px', border: 'none', outline: 'none',
                      textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'monospace', fontWeight: '700', fontSize: '16px', background: 'transparent', color: 'var(--text-main)'
                    }}
                  />
                  <Hash size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>

                {/* Integrated Helper Footer */}
                <div style={{ 
                  background: 'var(--bg-canvas)', padding: '10px 16px', borderTop: '1px solid var(--border-subtle)',
                  display: 'flex', gap: '10px', alignItems: 'center'
                }}>
                  <Info size={14} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    Used for ticket IDs: <strong>{data.partnerId || 'GWAY'}-001</strong>. Max 8 chars.
                  </span>
                </div>
              </div>
            </div>

            {/* C. Legal & Tax (TIN + Type) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>Entity Type</label>
                <select 
                   className="citadel-input" 
                   value={data.businessType || 'LTD'} 
                   onChange={(e) => updateField('businessType', e.target.value)}
                >
                   <option value="LTD">Ltd Company</option>
                   <option value="SACCO">SACCO</option>
                   <option value="SOLE">Sole Prop.</option>
                </select>
              </div>
              <div>
                <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>TIN Number</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="citadel-input"
                    placeholder="10 Digits"
                    value={data.tinNumber || ''}
                    onChange={(e) => updateField('tinNumber', e.target.value)}
                  />
                  <FileText size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
            </div>

          </div>

          {/* === RIGHT PANEL: SECURITY === */}
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', background: 'var(--bg-surface)' }}>
            
            {/* D. Admin Password */}
            <div>
              <label className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                <Key size={12} /> {data.id ? 'Reset Password' : 'Admin Password'}
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="citadel-input"
                  placeholder={data.id ? "Leave empty to keep current" : "Create strong password"}
                  value={data.password || ''} 
                  onChange={(e) => updateField('password', e.target.value)} 
                  style={{ background: 'var(--bg-input)' }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' 
                  }}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* E. Confirm Password */}
            <div>
              <label className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                <Lock size={12} /> Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="citadel-input"
                  placeholder="Repeat password"
                  value={data.confirmPassword || ''} 
                  onChange={(e) => updateField('confirmPassword', e.target.value)} 
                  style={{ 
                    borderColor: passwordMismatch ? 'var(--status-error)' : (passwordsMatch ? 'var(--status-success)' : 'var(--border-subtle)'),
                    background: passwordMismatch ? 'rgba(220, 38, 38, 0.05)' : (passwordsMatch ? 'rgba(22, 163, 74, 0.05)' : 'var(--bg-input)'),
                    transition: 'all 0.2s ease'
                  }}
                />
                {passwordsMatch && (
                  <CheckCircle size={18} color="var(--status-success)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                )}
                {passwordMismatch && (
                  <AlertTriangle size={18} color="var(--status-error)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                )}
              </div>
              
              {/* Feedback Area */}
              <div style={{ height: '20px', marginTop: '6px', textAlign: 'right' }}>
                {passwordMismatch && (
                  <span style={{ fontSize: '11px', color: 'var(--status-error)', fontWeight: '700' }}>KEYS DO NOT MATCH</span>
                )}
                {passwordsMatch && (
                  <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: '700' }}>SECURE & MATCHED</span>
                )}
              </div>
            </div>

            {/* Encryption Badge */}
            <div style={{ 
              marginTop: 'auto', padding: '12px', borderRadius: '8px', 
              background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <ShieldCheck size={16} color="var(--brand-primary)" />
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)' }}>END-TO-END ENCRYPTED</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Credentials are hashed before storage.</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Step1_Credentials;