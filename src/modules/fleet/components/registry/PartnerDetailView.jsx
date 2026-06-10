import React, { useState } from 'react';
import { 
  X, MapPin, CreditCard, Users, ShieldCheck, 
  Clock, Phone, Globe, Building, Wallet, AlertTriangle,
  LayoutGrid, Activity
} from 'lucide-react';

/**
 * PARTNER DETAIL VIEW (Production)
 * ------------------------------------------------
 * Displays the full profile of a selected fleet partner.
 * * * WORLD CLASS UPDATES:
 * 1. "SUITCASE" UNPACKING: Safely grabs nested arrays from 'partner.details'.
 * 2. TABS: Organizes content into Overview, Operations, and Financials.
 * 3. NULL SAFETY: Prevents crashes on empty fields.
 */

const PartnerDetailView = ({ partner, onClose }) => {
  if (!partner) return null;

  // 1. "THE SUITCASE" (Safe Unpacking)
  // We grab the arrays from the special 'details' object the Service creates.
  const parks = partner.details?.parks || [];
  const financials = partner.details?.financials || [];
  const contacts = partner.details?.contacts || [];

  // 2. TABS STATE
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  // 3. HELPER: Status Badge Styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACTIVE': return { bg: 'rgba(22, 163, 74, 0.1)', color: 'var(--status-success)', icon: ShieldCheck };
      case 'PENDING_APPROVAL': return { bg: 'rgba(234, 179, 8, 0.1)', color: 'var(--status-warning)', icon: Clock };
      case 'SUSPENDED': return { bg: 'rgba(220, 38, 38, 0.1)', color: 'var(--status-danger)', icon: AlertTriangle };
      default: return { bg: 'var(--bg-canvas)', color: 'var(--text-muted)', icon: ShieldCheck };
    }
  };

  const statusStyle = getStatusStyle(partner.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)' }}>
      
      {/* === HEADER === */}
      <div style={{ 
        padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', 
        background: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'start'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
           {/* Logo Avatar */}
           <div style={{ 
              width: '56px', height: '56px', borderRadius: '12px', background: 'var(--brand-primary)', 
              color: 'var(--text-inverse)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: '800', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
            }}>
              {partner.company_name?.charAt(0) || 'F'}
            </div>

            <div>
              <h2 className="text-heading" style={{ fontSize: '20px', margin: 0, lineHeight: '1.2', marginBottom: '6px' }}>
                {partner.company_name}
              </h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 {/* Status Badge */}
                <div style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '6px', 
                  padding: '4px 10px', borderRadius: '20px', 
                  background: statusStyle.bg, color: statusStyle.color,
                  fontSize: '10px', fontWeight: '700', textTransform: 'uppercase'
                }}>
                  <StatusIcon size={12} /> {(partner.status || 'UNKNOWN').replace('_', ' ')}
                </div>
                
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                  ID: {partner.partner_id}
                </span>
              </div>
            </div>
        </div>

        {/* Close Action */}
        <button 
          onClick={onClose}
          className="citadel-btn-ghost"
          style={{ padding: '8px', color: 'var(--text-muted)' }}
        >
          <X size={24} />
        </button>
      </div>

      {/* === TABS NAVIGATION === */}
      <div style={{ padding: '0 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '24px' }}>
        {['OVERVIEW', 'OPERATIONS', 'FINANCIALS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '16px 0',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--brand-primary)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--brand-primary)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* === SCROLLABLE CONTENT === */}
      <div className="citadel-scroll-area" style={{ flex: 1, padding: '32px' }}>

        {/* TAB 1: OVERVIEW (Stats & Contacts) */}
        {activeTab === 'OVERVIEW' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
               <div className="citadel-card" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--brand-primary)' }}>{parks.length}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Active Terminals</div>
               </div>
               <div className="citadel-card" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--status-success)' }}>{financials.length}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Bank Accounts</div>
               </div>
               <div className="citadel-card" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>{contacts.length}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Key Staff</div>
               </div>
            </div>

            {/* Personnel List */}
            <section>
              <h4 className="text-muted" style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={14} /> Key Personnel
              </h4>
              {contacts.length === 0 ? (
                <div style={{ padding: '20px', border: '1px dashed var(--border-subtle)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>No personnel registered.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                  {contacts.map((contact, i) => (
                    <div key={i} className="citadel-card" style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                      <div style={{ padding: '8px', height: 'fit-content', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%' }}>
                          <Users size={14} color="#3b82f6" />
                      </div>
                      <div>
                          <div style={{ fontSize: '13px', fontWeight: '700' }}>{contact.full_name}</div>
                          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--brand-primary)', marginBottom: '4px' }}>{contact.role}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={10} /> {contact.phone_primary}
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: OPERATIONS (Parks) */}
        {activeTab === 'OPERATIONS' && (
           <section>
            <h4 className="text-muted" style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={14} /> Bus Park Network
            </h4>
            
            {parks.length === 0 ? (
              <div style={{ padding: '40px', border: '1px dashed var(--border-subtle)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
                 <MapPin size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                 <p>No terminals registered for this partner.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {parks.map((park, i) => (
                  <div key={i} className="citadel-card" style={{ padding: '16px', borderLeft: '3px solid var(--brand-primary)' }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>{park.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '6px', marginBottom: '12px' }}>
                      <MapPin size={12} /> {park.address}
                    </div>
                    <div style={{ background: 'var(--bg-canvas)', padding: '8px', borderRadius: '6px', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                      <span className="text-muted">Manager:</span>
                      <strong>{park.contact_name}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: FINANCIALS */}
        {activeTab === 'FINANCIALS' && (
           <section>
            <h4 className="text-muted" style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wallet size={14} /> Settlement Accounts
            </h4>

            {financials.length === 0 ? (
              <div style={{ padding: '40px', border: '1px dashed var(--border-subtle)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
                 <CreditCard size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                 <p>No financial accounts configured.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {financials.map((fin, i) => (
                  <div key={i} className="citadel-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '8px', background: 'var(--bg-canvas)', borderRadius: '6px' }}>
                        <Building size={16} color="var(--text-muted)" />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700' }}>{fin.account_name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {fin.institution_code} •••• {fin.account_number ? fin.account_number.slice(-4) : '****'}
                        </div>
                      </div>
                    </div>
                    {fin.is_primary && (
                      <span style={{ fontSize: '10px', fontWeight: '700', background: 'var(--brand-primary)', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>PRIMARY</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
};

export default PartnerDetailView;