import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, CheckCircle, ShieldCheck, Landmark, AlertTriangle, Wallet, Lock } from 'lucide-react';
import { createDefaultFinancial } from '../../../data/fleet.models';
import { BANK_LIST } from '../../../data/fleet.constants';

const Step3_Financials = ({ data, onChange }) => {
  // LOGIC: Is this the first account being added?
  const isFirstAccount = (!data.financials || data.financials.length === 0);
  
  // STATE: The active form data
  const [currentAccount, setCurrentAccount] = useState(createDefaultFinancial(isFirstAccount));
  
  // STATE: Touch feedback for validation
  const [touched, setTouched] = useState(false);

  // UPDATERS
  const updateCurrent = (field, value) => {
    setCurrentAccount(prev => ({ ...prev, [field]: value }));
  };

  const commitAccount = () => {
    if (!currentAccount.institutionCode || !currentAccount.accountName || !currentAccount.accountNumber) return;
    if (currentAccount.accountNumber !== currentAccount.confirmAccountNumber) return;

    const updatedList = [...(data.financials || []), currentAccount];
    onChange({ ...data, financials: updatedList });
    
    // Reset for next entry (Next one is NOT primary by default)
    setCurrentAccount(createDefaultFinancial(false));
    setTouched(false);
  };

  const removeAccount = (id) => {
    const updatedList = data.financials.filter(a => a.id !== id);
    onChange({ ...data, financials: updatedList });
  };

  // VALIDATION HELPERS
  const numbersMatch = currentAccount.accountNumber && currentAccount.accountNumber === currentAccount.confirmAccountNumber;
  const numbersMismatch = touched && currentAccount.confirmAccountNumber && !numbersMatch;
  const isValid = currentAccount.institutionCode && currentAccount.accountName && numbersMatch;

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
          <Wallet size={28} color="var(--brand-primary)" />
        </div>
        <h3 className="text-heading" style={{ fontSize: '24px', marginBottom: '8px' }}>
          Banking Details
        </h3>
        <p className="text-muted" style={{ fontSize: '14px', maxWidth: '480px', margin: '0 auto', lineHeight: '1.6' }}>
          Configure where ticket revenue will be settled. You must add at least one <strong>Primary Account</strong> (Bank or Mobile Money).
        </p>
      </div>

      {/* 2. ACTIVE ACCOUNTS LIST */}
      {data.financials && data.financials.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h4 className="text-muted" style={{ fontSize: '12px', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Active Accounts ({data.financials.length})
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {data.financials.map((acc) => {
              const bankInfo = BANK_LIST.find(b => b.code === acc.institutionCode);
              return (
                <div key={acc.id} className="citadel-card" style={{ padding: '24px', position: 'relative', borderLeft: acc.isPrimary ? '4px solid var(--brand-primary)' : '1px solid var(--border-subtle)' }}>
                  {/* Badge */}
                  <div style={{ 
                    position: 'absolute', top: '20px', right: '20px', 
                    fontSize: '11px', fontWeight: '800', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: '20px',
                    background: acc.isPrimary ? 'var(--brand-primary)' : 'var(--bg-canvas)',
                    color: acc.isPrimary ? 'var(--text-inverse)' : 'var(--text-muted)'
                  }}>
                    {acc.isPrimary ? 'Primary' : 'Backup'}
                  </div>

                  {/* Bank Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ background: 'var(--bg-canvas)', padding: '8px', borderRadius: '8px' }}>
                        <Landmark size={20} color="var(--text-muted)" />
                    </div>
                    <div>
                        <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-main)' }}>
                        {bankInfo?.name || acc.institutionCode}
                        </div>
                        <div className="text-muted" style={{ fontSize: '12px' }}>Corporate Account</div>
                    </div>
                  </div>
                  
                  {/* Account Details */}
                  <div style={{ background: 'var(--bg-canvas)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <div className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>
                        Account Holder
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
                        {acc.accountName}
                      </div>

                      <div className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>
                        Account Number
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '14px', letterSpacing: '1px', color: 'var(--text-main)' }}>
                        •••• {acc.accountNumber.slice(-4)}
                      </div>
                  </div>

                  {/* Remove Button */}
                  {!acc.isPrimary && (
                    <button 
                      onClick={() => removeAccount(acc.id)}
                      style={{ 
                        position: 'absolute', bottom: '24px', right: '24px', 
                        background: 'none', border: 'none', color: 'var(--status-error)', 
                        cursor: 'pointer', padding: '4px'
                      }}
                      title="Remove Account"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. THE WORKSPACE (Split-Panel Architecture) */}
      <div className="citadel-card" style={{ padding: '0', overflow: 'hidden', borderTop: '4px solid var(--brand-primary)' }}>
        
        {/* Header Bar */}
        <div style={{ 
          padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--brand-primary)', borderRadius: '50%', padding: '6px', display: 'flex' }}>
              <Plus size={16} color="var(--text-inverse)" />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-main)' }}>
              {data.financials?.length === 0 ? "Add Primary Account" : "Add Backup Account"}
            </span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
             STEP 3 OF 4
          </div>
        </div>

        {/* THE SPLIT GRID: LEFT (Bank Info) | RIGHT (Security) */}
        <div className="citadel-grid-2" style={{ gap: '0' }}>
          
          {/* === LEFT PANEL: BANK DETAILS === */}
          <div style={{ padding: '32px', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* A. Bank Selector */}
            <div>
              <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                Bank Name
              </label>
              <div style={{ position: 'relative' }}>
                <select 
                    className="citadel-input"
                    value={currentAccount.institutionCode}
                    onChange={(e) => updateCurrent('institutionCode', e.target.value)}
                    style={{ appearance: 'none', cursor: 'pointer', fontWeight: '600', height: '50px' }}
                >
                    <option value="" disabled>Select Bank...</option>
                    {BANK_LIST.map(bank => (
                    <option key={bank.code} value={bank.code}>{bank.name}</option>
                    ))}
                </select>
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Landmark size={18} color="var(--text-muted)" />
                </div>
              </div>
            </div>

            {/* B. Account Name */}
            <div>
              <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                Account Holder Name
              </label>
              <input 
                type="text" 
                className="citadel-input" 
                placeholder="e.g. GATEWAY BUS SERVICES LTD"
                value={currentAccount.accountName} 
                onChange={(e) => updateCurrent('accountName', e.target.value.toUpperCase())} 
                style={{ fontWeight: '600', height: '50px' }}
              />
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Must match the legal entity name exactly.
              </div>
            </div>

          </div>

          {/* === RIGHT PANEL: SECURITY & NUMBERS === */}
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', background: 'var(--bg-surface)' }}>
            
            {/* C. Account Number */}
            <div>
              <label className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                <Lock size={12} /> Account Number
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="citadel-input" 
                  placeholder="0000 0000 0000"
                  value={currentAccount.accountNumber} 
                  onChange={(e) => updateCurrent('accountNumber', e.target.value.replace(/\D/g, ''))} 
                  onBlur={() => setTouched(true)}
                  style={{ fontFamily: 'monospace', letterSpacing: '1px', height: '50px', background: 'var(--bg-input)' }}
                />
                <CreditCard size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* D. Confirm Number */}
            <div>
              <label className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                <CheckCircle size={12} /> Confirm Number
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="citadel-input" 
                  placeholder="Repeat Number"
                  value={currentAccount.confirmAccountNumber} 
                  onChange={(e) => updateCurrent('confirmAccountNumber', e.target.value.replace(/\D/g, ''))}
                  style={{ 
                    fontFamily: 'monospace', letterSpacing: '1px', height: '50px',
                    borderColor: numbersMismatch ? 'var(--status-error)' : (numbersMatch ? 'var(--status-success)' : 'var(--border-subtle)'),
                    background: numbersMismatch ? 'rgba(220, 38, 38, 0.05)' : (numbersMatch ? 'rgba(22, 163, 74, 0.05)' : 'var(--bg-input)'),
                    transition: 'all 0.2s ease'
                  }}
                />
                {numbersMatch && (
                  <ShieldCheck size={18} color="var(--status-success)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                )}
                {numbersMismatch && (
                  <AlertTriangle size={18} color="var(--status-error)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                )}
              </div>
            </div>

            {/* Action Button */}
            <button 
              className="citadel-btn citadel-btn-ghost"
              style={{ 
                width: '100%', borderStyle: 'dashed', marginTop: 'auto',
                color: isValid ? 'var(--brand-primary)' : 'var(--text-muted)', 
                borderColor: isValid ? 'var(--brand-primary)' : 'var(--border-subtle)',
                background: isValid ? 'rgba(30, 64, 175, 0.05)' : 'transparent',
                height: '56px'
              }}
              onClick={commitAccount}
              disabled={!isValid}
            >
              <Plus size={20} />
              ADD TO SECURE VAULT
            </button>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Step3_Financials;