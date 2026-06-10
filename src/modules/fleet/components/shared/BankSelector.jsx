import React from 'react';
import { Landmark } from 'lucide-react';
import { BANK_LIST } from '../../data/fleet.constants';

/**
 * SHARED BANK SELECTOR
 * A specialized dropdown for financial institutions.
 * * "Twice as Good" Rule:
 * - Automatically groups options by Category (Mobile Money vs Banks).
 * - Reusable across the entire Admin Cockpit (not just Fleet).
 */

const BankSelector = ({ value, onChange, error }) => {
  
  // Helper: Group the flat list into categories
  const groupedBanks = BANK_LIST.reduce((acc, bank) => {
    const key = bank.category === 'MOBILE_MONEY' ? 'Mobile Money Wallets' : 'Commercial Banks';
    if (!acc[key]) acc[key] = [];
    acc[key].push(bank);
    return acc;
  }, {});

  return (
    <div className="input-group">
      <label>FINANCIAL INSTITUTION</label>
      <div className="input-wrapper" style={{ borderColor: error ? '#ef4444' : undefined }}>
        <Landmark size={16} className="input-icon" />
        <select 
          className="neon-input"
          style={{ 
            width: '100%', 
            padding: '10px 10px 10px 38px', 
            background: 'var(--bg-muted)', 
            border: 'none', 
            color: 'var(--text-body)',
            outline: 'none',
            appearance: 'none', // Remove default arrow for custom styling if needed
            fontSize: '11px',
            cursor: 'pointer'
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select Institution...</option>
          
          {Object.entries(groupedBanks).map(([category, banks]) => (
            <optgroup key={category} label={category}>
              {banks.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </optgroup>
          ))}
          
        </select>
        
        {/* Custom Arrow Indicator */}
        <div style={{ position: 'absolute', right: '10px', pointerEvents: 'none', color: 'var(--text-muted)', fontSize: '10px' }}>
          ▼
        </div>
      </div>
      {error && <p className="input-error">{error}</p>}
    </div>
  );
};

export default BankSelector;