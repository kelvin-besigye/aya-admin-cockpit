import React from 'react';
import { Building2, MapPin, Globe, Phone, Mail, CreditCard, Hash, Copy, Check } from 'lucide-react';

/**
 * VERIFY PARTNER (The Forensic View)
 * ------------------------------------------------------------------
 * Read-only display of a Partner's application data.
 * * * FEATURES:
 * 1. SECTIONED LAYOUT: Identity, Operations, Finance.
 * 2. COPY UTILITY: Click-to-copy for critical IDs (TIN, Bank).
 * 3. GRACEFUL FALLBACKS: Handles missing data without crashing.
 */

const VerifyPartner = ({ data }) => {
  if (!data) return null;

  // 1. DATA EXTRACTION (Safely)
  const financial = data.partner_financials?.[0] || {};
  const contact = data.partner_contacts?.[0] || {};
  const parkCount = data.partner_parks?.length || 0;

  // 2. HELPER: COPY TO CLIPBOARD
  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      // In a real app, we'd trigger a tiny toast notification here
    }
  };

  // 3. HELPER: FIELD RENDERER
  const Field = ({ label, value, icon: Icon, isCopyable }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
        {Icon && <Icon size={12} color="var(--brand-primary)" />}
        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '500' }}>
          {value || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not Provided</span>}
        </span>
        {isCopyable && value && (
          <button 
            onClick={() => copyToClipboard(value)}
            title="Copy to clipboard"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
          >
            <Copy size={12} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* SECTION A: CORPORATE IDENTITY */}
      <section style={{ background: 'var(--bg-canvas)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={16} /> CORPORATE IDENTITY
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Registered Name" value={data.company_name} isCopyable />
          <Field label="System ID" value={data.partner_id} isCopyable />
          <Field label="Tax ID (TIN)" value={data.tin_number} icon={Hash} isCopyable />
          <Field label="Website" value={data.website} icon={Globe} />
          <Field label="HQ Address" value={data.address} icon={MapPin} />
          <Field label="Date of Incorporation" value={data.incorporation_date} />
        </div>
      </section>

      {/* SECTION B: KEY PERSONNEL */}
      <section style={{ background: 'var(--bg-canvas)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UsersIcon size={16} /> PRIMARY CONTACT
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Contact Person" value={contact.name} />
          <Field label="Role / Title" value={contact.title} />
          <Field label="Email Address" value={contact.email} icon={Mail} isCopyable />
          <Field label="Phone Number" value={contact.phone} icon={Phone} isCopyable />
        </div>
      </section>

      {/* SECTION C: FINANCIAL PROFILE */}
      <section style={{ background: 'var(--bg-canvas)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CreditCard size={16} /> BANKING DETAILS
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Bank Name" value={financial.bank_name} />
          <Field label="Account Name" value={financial.account_name} />
          <Field label="Account Number" value={financial.account_number} icon={Hash} isCopyable />
          <Field label="Currency" value={financial.currency || 'UGX'} />
        </div>
      </section>

      {/* SECTION D: OPERATIONAL SCOPE */}
      <section style={{ background: 'var(--bg-canvas)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} /> OPERATIONAL SCOPE
        </h3>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          This partner has declared <strong style={{ color: 'var(--text-main)' }}>{parkCount}</strong> loading stages/parks under their management.
          {parkCount > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {data.partner_parks?.map((park, i) => (
                <span key={i} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', padding: '4px 10px', borderRadius: '4px' }}>
                  {park.park_name}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

// Helper Icon for the Personnel Section
const UsersIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default VerifyPartner;