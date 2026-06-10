import React from 'react';
import { 
  MapPin, Clock, CreditCard, ArrowRight, Building2, 
  Bus, Calendar, Wallet, AlertCircle, TrendingUp 
} from 'lucide-react';

/**
 * VERIFY ROUTE (The Forensic Inspector)
 * ------------------------------------------------------------------
 * Read-only display of a Route Definition for compliance vetting.
 * * * WORLD CLASS FEATURES:
 * 1. VISUAL FLOW: Clear Origin -> Destination typography.
 * 2. FINANCIAL X-RAY: Explicitly shows the split between Operator & Platform.
 * 3. LOGIC CHECK: Highlights Duration and Departure to catch scheduling errors.
 */

const VerifyRoute = ({ data }) => {
  if (!data) return null;

  // 1. FORMATTERS
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-UG', { 
      style: 'currency', currency: 'UGX', maximumFractionDigits: 0 
    }).format(amount || 0);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '00:00';
    const [h, m] = timeString.split(':');
    const hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${m} ${period}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // 2. DATA CALCULATIONS
  const ticketPrice = parseFloat(data.price_ticket) || 0;
  const taxPrice = parseFloat(data.price_tax) || 0;
  const totalPrice = ticketPrice + taxPrice;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6">
      
      {/* === SECTION A: THE JOURNEY (Visual Header) === */}
      <section style={{ 
        background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', 
        borderRadius: '12px', padding: '24px' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
             <MapPin size={14} /> Proposed Trajectory
          </div>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px' }}>
            ID: {data.id.substring(0, 8).toUpperCase()}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-main)' }}>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>{data.origin_city}</div>
          <ArrowRight size={24} style={{ color: 'var(--text-muted)' }} />
          <div style={{ fontSize: '24px', fontWeight: '800' }}>{data.destination_city}</div>
        </div>

        <div style={{ display: 'flex', gap: '24px', marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed var(--border-subtle)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '8px' }}>
              <Clock size={18} />
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>DEPARTURE</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>{formatTime(data.departure_time)}</div>
            </div>
          </div>

          <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: 'var(--bg-surface)', color: 'var(--text-muted)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <TrendingUp size={18} />
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>DURATION</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                {data.duration_hours}h {data.duration_minutes}m
                <span style={{ fontSize: '10px', fontWeight: '400', color: 'var(--text-muted)', marginLeft: '4px' }}>(Approx)</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* === SECTION B: FINANCIAL FORENSICS (The Wiring) === */}
      <section style={{ 
        background: 'linear-gradient(to bottom right, #f8fafc, #fff)', 
        border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '24px' 
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
          <CreditCard size={16} /> REVENUE WIRING
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* 1. OPERATOR SHARE */}
          <div style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Base Ticket Price</div>
            <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-main)' }}>
              {formatMoney(ticketPrice)}
            </div>
            <div style={{ fontSize: '10px', marginTop: '8px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
              <Wallet size={10} /> Credited to Operator
            </div>
          </div>

          {/* PLUS SYMBOL */}
          <div style={{ fontSize: '20px', fontWeight: '300', color: 'var(--text-muted)' }}>+</div>

          {/* 2. PLATFORM SHARE */}
          <div style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Service Tax</div>
            <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-main)' }}>
              {formatMoney(taxPrice)}
            </div>
            <div style={{ fontSize: '10px', marginTop: '8px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
              <Building2 size={10} /> Credited to Platform
            </div>
          </div>

          {/* EQUALS SYMBOL */}
          <div style={{ fontSize: '20px', fontWeight: '300', color: 'var(--text-muted)' }}>=</div>

          {/* 3. CUSTOMER TOTAL */}
          <div style={{ flex: 1.2, background: '#eff6ff', padding: '16px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '11px', color: '#1e40af', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase' }}>Customer Pays</div>
            <div style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'monospace', color: '#1e3a8a' }}>
              {formatMoney(totalPrice)}
            </div>
             <div style={{ fontSize: '10px', marginTop: '8px', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Displayed on App
            </div>
          </div>

        </div>
      </section>


      {/* === SECTION C: OPERATIONAL CONTEXT === */}
      <section style={{ 
        background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', 
        borderRadius: '12px', padding: '24px' 
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
          <Building2 size={16} /> OPERATOR CONTEXT
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* PARTNER */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Bus Operator
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'white', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={16} color="var(--brand-primary)" />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
                  {data.partners?.company_name || 'Unknown Partner'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Registered Entity
                </div>
              </div>
            </div>
          </div>

          {/* VEHICLE CONFIG */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Service Class Assignment
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'white', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bus size={16} color="var(--brand-primary)" />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
                  {data.bus_configs?.bus_class || 'Standard Config'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Seating Layout Linked
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* === SECTION D: SYSTEM METADATA === */}
      <div style={{ display: 'flex', gap: '24px', padding: '0 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
           <Calendar size={14} /> Submitted: <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{formatDate(data.created_at)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
           <MapPin size={14} /> Departure Park: <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{data.departure_park || 'Main Terminal'}</span>
        </div>
        {(!data.departure_park) && (
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--status-warning)' }}>
             <AlertCircle size={14} /> Missing Park Data
           </div>
        )}
      </div>

    </div>
  );
};

export default VerifyRoute;