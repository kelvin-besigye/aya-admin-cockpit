import React, { useState } from 'react';
import { User, Phone, Briefcase, Plus, Trash2, ShieldAlert, Users, Smartphone, MessageSquare, BadgeCheck } from 'lucide-react';

// DATA MODELS
import { CONTACT_ROLES } from '../../../data/fleet.constants';
import { createDefaultContact } from '../../../data/fleet.models';

const Step4_Contacts = ({ data, onChange }) => {
  // STATE: Active Form Data
  const [currentContact, setCurrentContact] = useState(createDefaultContact());

  // UPDATERS
  const updateCurrent = (field, value) => {
    setCurrentContact(prev => ({ ...prev, [field]: value }));
  };

  const commitContact = () => {
    if (!currentContact.fullName || !currentContact.role || !currentContact.phonePrimary) return;
    
    const updatedList = [...(data.contacts || []), currentContact];
    onChange({ ...data, contacts: updatedList });
    
    // Reset Form
    setCurrentContact(createDefaultContact());
  };

  const removeContact = (id) => {
    const updatedList = data.contacts.filter(c => c.id !== id);
    onChange({ ...data, contacts: updatedList });
  };

  // VALIDATION
  const isValid = currentContact.fullName && currentContact.role && currentContact.phonePrimary;

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
          <Users size={28} color="var(--brand-primary)" />
        </div>
        <h3 className="text-heading" style={{ fontSize: '24px', marginBottom: '8px' }}>
          Staff & Operations
        </h3>
        <p className="text-muted" style={{ fontSize: '14px', maxWidth: '480px', margin: '0 auto', lineHeight: '1.6' }}>
          Who should we call in an emergency? Add key personnel like the <strong>Operations Manager</strong> or <strong>Head Dispatcher</strong>.
        </p>
      </div>

      {/* 2. REGISTERED STAFF LIST */}
      {data.contacts && data.contacts.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h4 className="text-muted" style={{ fontSize: '12px', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Registered Staff ({data.contacts.length})
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {data.contacts.map((contact) => {
              const roleInfo = CONTACT_ROLES.find(r => r.value === contact.role);
              return (
                <div key={contact.id} className="citadel-card" style={{ padding: '24px', position: 'relative', borderLeft: '4px solid var(--brand-primary)' }}>
                  
                  {/* Header: Name & Role */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-main)' }}>
                        {contact.fullName}
                      </div>
                      <div style={{ 
                        fontSize: '11px', textTransform: 'uppercase', fontWeight: '700',
                        color: 'var(--brand-primary)', marginTop: '4px', letterSpacing: '0.5px'
                      }}>
                        {roleInfo?.label || contact.role}
                      </div>
                    </div>
                    
                    {/* Icon Badge */}
                    <div style={{ background: 'var(--bg-canvas)', padding: '8px', borderRadius: '50%', border: '1px solid var(--border-subtle)' }}>
                      <User size={16} color="var(--text-muted)" />
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Smartphone size={14} /> 
                      <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{contact.phonePrimary}</span>
                    </div>
                    {contact.phoneAlt && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.8 }}>
                        <MessageSquare size={14} /> {contact.phoneAlt}
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeContact(contact.id)}
                    style={{ 
                      position: 'absolute', bottom: '24px', right: '24px', 
                      background: 'none', border: 'none', color: 'var(--status-error)', 
                      cursor: 'pointer', padding: '4px'
                    }}
                    title="Remove Person"
                  >
                    <Trash2 size={18} />
                  </button>
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
              Add New Staff Member
            </span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
             STEP 4 OF 4
          </div>
        </div>

        {/* THE SPLIT GRID: LEFT (Identity) | RIGHT (Contact) */}
        <div className="citadel-grid-2" style={{ gap: '0' }}>
          
          {/* === LEFT PANEL: IDENTITY === */}
          <div style={{ padding: '32px', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* A. Full Name */}
            <div>
              <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="citadel-input"
                  placeholder="e.g. JOHN MUKASA"
                  value={currentContact.fullName}
                  onChange={(e) => updateCurrent('fullName', e.target.value.toUpperCase())}
                  style={{ fontWeight: '600', height: '50px' }}
                />
                <User size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* B. Job Title */}
            <div>
              <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                Job Title / Position
              </label>
              <div style={{ position: 'relative' }}>
                <select 
                  className="citadel-input"
                  value={currentContact.role}
                  onChange={(e) => updateCurrent('role', e.target.value)}
                  style={{ appearance: 'none', cursor: 'pointer', fontWeight: '600', height: '50px' }}
                >
                  <option value="">Select Job Title...</option>
                  {CONTACT_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                <Briefcase size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

          </div>

          {/* === RIGHT PANEL: CONTACT CHANNELS === */}
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', background: 'var(--bg-surface)' }}>
            
            {/* C. Mobile Number */}
            <div>
              <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                Mobile Number (MTN/Airtel)
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="citadel-input"
                  placeholder="077..."
                  value={currentContact.phonePrimary}
                  onChange={(e) => updateCurrent('phonePrimary', e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '14px', letterSpacing: '0.5px', height: '50px', background: 'var(--bg-input)' }}
                />
                <Smartphone size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* D. WhatsApp / Alt */}
            <div>
              <label className="text-muted" style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                WhatsApp / Second Line
              </label>
               <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="citadel-input"
                  placeholder="Optional"
                  value={currentContact.phoneAlt}
                  onChange={(e) => updateCurrent('phoneAlt', e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '14px', letterSpacing: '0.5px', height: '50px', background: 'var(--bg-input)' }}
                />
                <MessageSquare size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Action Button */}
            <button 
              className="citadel-btn citadel-btn-ghost"
              style={{ 
                width: '100%', borderStyle: 'dashed', marginTop: 'auto', height: '56px',
                color: isValid ? 'var(--brand-primary)' : 'var(--text-muted)', 
                borderColor: isValid ? 'var(--brand-primary)' : 'var(--border-subtle)',
                background: isValid ? 'rgba(30, 64, 175, 0.05)' : 'transparent'
              }}
              onClick={commitContact}
              disabled={!isValid}
            >
              <BadgeCheck size={20} />
              CONFIRM STAFF MEMBER
            </button>
          </div>

        </div>
      </div>

      {/* 4. PRE-FLIGHT CHECK */}
      <div style={{ 
        marginTop: '32px', padding: '16px', 
        background: 'rgba(59, 130, 246, 0.05)', 
        border: '1px solid rgba(59, 130, 246, 0.2)', 
        borderRadius: 'var(--radius-md)', 
        display: 'flex', gap: '16px', alignItems: 'start' 
      }}>
        <div style={{ background: '#3b82f6', padding: '6px', borderRadius: '50%', marginTop: '2px', display: 'flex' }}>
          <ShieldAlert size={16} color="white" />
        </div>
        <div>
          <strong style={{ fontSize: '12px', textTransform: 'uppercase', color: '#3b82f6', display: 'block', marginBottom: '4px' }}>
            Maker-Checker Protocol Active
          </strong>
          <div className="text-muted" style={{ fontSize: '12px', lineHeight: '1.5' }}>
            By proceeding, you certify that all numbers have been verified. This entry will be locked for editing until Super Admin approval.
          </div>
        </div>
      </div>

    </div>
  );
};

export default Step4_Contacts;
