import React, { useState } from 'react';
import { 
  Edit3, Trash2, MapPin, Clock, Building2, Bus, 
  CreditCard, ArrowRight, X, Calendar, ShieldCheck,
  TrendingUp, AlertTriangle
} from 'lucide-react';
import { routesService } from '../../data/routes.service';

/**
 * ROUTE DETAIL (Visual Masterpiece Edition - Fixed)
 * ------------------------------------------------------------------
 * The Read-Only Inspector Panel.
 * * * FIX:
 * 1. RESTORED VARIABLES: Added back ticketPrice, serviceTax, and total calculations.
 * 2. INLINE STYLING: Guarantees the look regardless of CSS framework issues.
 * 3. FINANCIAL EQUATION: A visual card showing (Price + Tax = Total).
 */

const RouteDetail = ({ route, onEdit, onClose }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // --- HELPERS ---
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

  const getArrivalTime = () => {
    if (!route?.departure_time) return '--:--';
    const [h, m] = route.departure_time.split(':').map(Number);
    const durationH = route.duration_hours || 0;
    const durationM = route.duration_minutes || 0;

    let arrivalH = h + durationH;
    let arrivalM = m + durationM;

    if (arrivalM >= 60) {
      arrivalH += Math.floor(arrivalM / 60);
      arrivalM = arrivalM % 60;
    }
    arrivalH = arrivalH % 24;
    
    const period = arrivalH >= 12 ? 'PM' : 'AM';
    const displayH = arrivalH > 12 ? arrivalH - 12 : (arrivalH === 0 ? 12 : arrivalH);
    const displayM = arrivalM.toString().padStart(2, '0');

    return `${displayH}:${displayM} ${period}`;
  };

  // --- ACTIONS ---
  const handleDelete = async () => {
    if (!window.confirm("CRITICAL: Are you sure you want to delete this route schedule?")) return;
    
    setIsDeleting(true);
    try {
      const result = await routesService.deleteRoute(route.id);
      if (result.success) {
        window.dispatchEvent(new Event('citadel-routes-update'));
        onClose(); 
      } else {
        alert("Delete Failed: " + result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!route) return null;

  // --- CALCULATIONS (Restored) ---
  const ticketPrice = parseFloat(route.price_ticket) || 0;
  const serviceTax = parseFloat(route.price_tax) || 0;
  const total = ticketPrice + serviceTax;

  // --- STYLES ---
  const cardStyle = {
    background: 'white',
    borderRadius: '16px',
    border: '1px solid var(--border-subtle)',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
    marginBottom: '24px'
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: '800',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
    marginBottom: '6px',
    display: 'flex', alignItems: 'center', gap: '6px'
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-canvas)' }}>
      
      {/* === A. HEADER === */}
      <div style={{ padding: '32px', background: 'white', borderBottom: '1px solid var(--border-subtle)' }}>
        
        {/* Top Row: Status & Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ 
            padding: '6px 12px', borderRadius: '20px', 
            background: route.status === 'ACTIVE' ? '#DCFCE7' : '#FEF3C7', 
            color: route.status === 'ACTIVE' ? '#166534' : '#B45309',
            fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            {route.status === 'PENDING_APPROVAL' ? 'Pending Review' : route.status}
          </div>
          <button 
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Route Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-main)' }}>{route.origin_city}</span>
          <ArrowRight size={24} color="var(--text-muted)" />
          <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-main)' }}>{route.destination_city}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
          <Building2 size={16} />
          <span>Operated by</span>
          <strong style={{ color: 'var(--brand-primary)' }}>{route.partners?.company_name}</strong>
        </div>
      </div>

      {/* === B. BODY (Scrollable) === */}
      <div className="citadel-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        
        {/* 1. SCHEDULE CARD */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={labelStyle}><Clock size={14} /> SCHEDULE LOGISTICS</div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--brand-primary)', background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '6px' }}>
              Daily Service
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Departure */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Departing</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)' }}>{formatTime(route.departure_time)}</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '4px' }}>{route.departure_park}</div>
            </div>

            {/* Visual Line */}
            <div style={{ flex: 1, margin: '0 32px', position: 'relative', height: '40px', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%', height: '2px', background: 'var(--border-subtle)', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '0', top: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                <div style={{ position: 'absolute', right: '0', top: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }} />
              </div>
              <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-input)', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', color: 'var(--text-main)' }}>
                {route.duration_hours}h {route.duration_minutes}m
              </div>
            </div>

            {/* Arrival */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Arriving (Est)</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)' }}>{getArrivalTime()}</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '4px' }}>{route.destination_city}</div>
            </div>

          </div>
        </div>

        {/* 2. FINANCIAL BREAKDOWN */}
        <div style={cardStyle}>
          <div style={labelStyle}><CreditCard size={14} /> FINANCIAL STRUCTURE</div>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            
            {/* Operator Share */}
            <div style={{ flex: 1, padding: '16px', border: '1px dashed var(--border-subtle)', borderRadius: '12px', background: 'var(--bg-surface)' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Operator Fare</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>{formatMoney(ticketPrice)}</div>
            </div>

            {/* Icon */}
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
              <TrendingUp size={20} />
            </div>

            {/* Tax */}
            <div style={{ flex: 1, padding: '16px', border: '1px dashed var(--border-subtle)', borderRadius: '12px', background: 'var(--bg-surface)' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Service Tax</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>{formatMoney(serviceTax)}</div>
            </div>

            {/* Equals */}
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontWeight: '900', fontSize: '20px' }}>=</div>

            {/* Total */}
            <div style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'var(--text-main)', color: 'white', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textTransform: 'uppercase' }}>Customer Pays</div>
              <div style={{ fontSize: '20px', fontWeight: '900' }}>{formatMoney(total)}</div>
            </div>

          </div>
        </div>

        {/* 3. META INFO */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ ...cardStyle, marginBottom: 0 }}>
            <div style={labelStyle}>SERVICE CLASS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
              <div style={{ padding: '10px', background: 'var(--bg-input)', borderRadius: '8px', color: 'var(--brand-primary)' }}>
                <Bus size={20} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
                {route.bus_configs?.bus_class || 'Standard'}
              </div>
            </div>
          </div>

          <div style={{ ...cardStyle, marginBottom: 0 }}>
            <div style={labelStyle}>SYSTEM ID</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
              <div style={{ padding: '10px', background: 'var(--bg-input)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                <ShieldCheck size={20} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                {route.route_code || '---'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* === C. FOOTER === */}
      <div style={{ padding: '24px 32px', background: 'white', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', 
            borderRadius: '12px', border: '1px solid #FECACA', background: '#FEF2F2',
            color: '#B91C1C', fontSize: '13px', fontWeight: '700', cursor: isDeleting ? 'not-allowed' : 'pointer', opacity: isDeleting ? 0.6 : 1
          }}
        >
          <Trash2 size={16} /> {isDeleting ? 'Removing...' : 'Delete Route'}
        </button>

        <button 
          onClick={onEdit}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px', 
            borderRadius: '12px', border: 'none', background: 'var(--text-main)',
            color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <Edit3 size={16} /> Edit Configuration
        </button>

      </div>

    </div>
  );
};

export default RouteDetail;