import React, { useEffect, useState } from 'react';
import { Building2, CreditCard, CheckCircle2 } from 'lucide-react';
import { fleetService } from '../../../../fleet/data/fleet.service'; 
import { BUS_CLASSES } from '../../../../bus-config/data/bus.constants';

/**
 * WIZARD STEP 1: CLASSIFICATION (Clean & Minimalist)
 * ------------------------------------------------------------------
 * 1. LINKS the bus to a specific Partner.
 * 2. DEFINES the Service Level (Plain names only).
 * 3. STYLE: Centered, high-contrast selection cards.
 */

const Step1_Class = ({ data, onChange }) => {
  
  // 1. STATE: PARTNER LIST
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. EFFECT: LOAD PARTNERS
  useEffect(() => {
    const loadPartners = async () => {
      try {
        const allPartners = await fleetService.fetchPartners();
        const activePartners = allPartners.filter(p => p.status === 'ACTIVE');
        setPartners(activePartners);
      } catch (err) {
        console.error("Failed to load fleet partners", err);
      } finally {
        setLoading(false);
      }
    };
    loadPartners();
  }, []);

  // 3. HANDLERS
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  // 4. UTILITY: Label Sanitizer
  // Ensures we only show "Standard", "VIP" even if data has "Standard (2+2)"
  const getCleanLabel = (label) => {
    if (!label) return '';
    return label.replace(/\s*\(.*?\)/g, '').replace(/\s*\d\+\d.*/g, '').trim();
  };

  // 5. SMART VALUE RESOLVERS
  const activePartnerId = data.partnerId || data.partner_id || '';
  const activeBusClass = data.busClass || data.bus_class || '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>

      {/* SECTION A: THE OPERATOR */}
      <section>
        <h3 className="text-heading" style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.5px' }}>
          <Building2 size={16} /> OPERATOR
        </h3>
        
        {loading ? (
          <div style={{ padding: '16px', background: 'var(--bg-input)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}>
            Syncing Registry...
          </div>
        ) : partners.length === 0 ? (
          <div style={{ padding: '16px', border: '1px solid var(--status-warning)', borderRadius: '12px', color: 'var(--status-warning)', fontSize: '13px', background: 'rgba(234, 179, 8, 0.1)' }}>
             No Active Partners found.
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <select
              value={activePartnerId}
              onChange={(e) => handleChange('partnerId', e.target.value)}
              style={{
                width: '100%', padding: '18px', borderRadius: '16px',
                border: '1px solid var(--border-subtle)', background: 'var(--bg-input)',
                fontSize: '15px', fontWeight: '600', color: 'var(--text-main)',
                outline: 'none', cursor: 'pointer', appearance: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <option value="" disabled>Select Bus Company...</option>
              {partners.map(p => (
                <option key={p.id} value={p.id}>
                  {p.companyName || p.company_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      {/* SECTION B: SERVICE CLASS (Clean Cards) */}
      <section>
        <h3 className="text-heading" style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.5px' }}>
          <CreditCard size={16} /> SERVICE CLASS
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          {BUS_CLASSES.map((cls) => {
            const isSelected = activeBusClass === cls.id;
            const cleanLabel = getCleanLabel(cls.label);

            return (
              <div 
                key={cls.id}
                onClick={() => handleChange('busClass', cls.id)}
                className="citadel-card"
                style={{
                  padding: '24px 16px', cursor: 'pointer',
                  border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--bg-surface)' : 'var(--bg-input)',
                  position: 'relative', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minHeight: '80px', borderRadius: '16px',
                  boxShadow: isSelected ? '0 8px 20px -4px var(--brand-glow)' : 'none',
                  transform: isSelected ? 'translateY(-2px)' : 'none'
                }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', color: 'var(--brand-primary)' }}>
                    <CheckCircle2 size={18} fill="var(--bg-surface)" />
                  </div>
                )}
                
                {/* The Label is now the Hero */}
                <div style={{ 
                  fontWeight: '700', fontSize: '15px', 
                  color: isSelected ? 'var(--brand-primary)' : 'var(--text-main)',
                  textAlign: 'center'
                }}>
                  {cleanLabel}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Step1_Class;