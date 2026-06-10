import React, { useMemo, useState } from 'react';
import { 
  X, Edit, Trash2, ShieldCheck, 
  MonitorPlay, LayoutGrid, Image as ImageIcon, Calendar, Loader 
} from 'lucide-react';
import ChassisCanvas from '../designer/ChassisCanvas';
import { BUS_AMENITIES } from '../../data/bus.constants';
import { busService } from '../../data/bus.service';

import { 
  formatBusTitle, 
  formatPlateNumber, 
  getBusClassColor 
} from '../../utils/bus.utils'; 

/**
 * BUS DETAIL VIEW (The Passport)
 * ------------------------------------------------------------------
 * Displays the full specification of a configured bus.
 * * * WORLD CLASS UPDATES:
 * 1. CLEAN TEXT: "Edit Blueprint" -> "Edit Configuration"
 * 2. SMART TITLES: Cleans technical DB names for display.
 * 3. VISUALS: Handles both Strings (DB) and Objects (Wizard).
 */

const BusDetailView = ({ config, onClose, onEdit }) => {
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!config) return null;

  // 1. SAFE DATA EXTRACTION
  const layout = config.layout_config || config.layout || {};
  const gallery = config.gallery || {};
  const amenityIds = config.amenities || [];

  // 2. IMAGE RESOLVER
  const getImageSrc = (imgSource) => {
    if (!imgSource) return null;
    if (typeof imgSource === 'string') return imgSource; 
    if (imgSource.preview) return imgSource.preview;     
    return null;
  };

  // 3. SMART TITLE LOGIC
  const displayTitle = formatBusTitle(config);
  const displayPlate = formatPlateNumber(config.plate_number);

  // 4. HELPER: AMENITIES
  const activeAmenities = useMemo(() => {
    return amenityIds
      .map(id => BUS_AMENITIES.find(a => a.id === id))
      .filter(Boolean);
  }, [amenityIds]);

  // 5. HELPER: COLORS
  const badgeColor = getBusClassColor(config.bus_class);

  // 6. ACTION: DELETE
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await busService.deleteBusConfig(config.id);
      window.dispatchEvent(new Event('citadel-bus-update')); 
      onClose(); 
    } catch (err) {
      console.error("Delete failed", err);
      alert("Could not delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Resolve Images
  const profileSrc = getImageSrc(gallery.profile);
  const galleryViews = (gallery.views || []).map(getImageSrc).filter(Boolean);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)' }}>
      
      {/* === HEADER === */}
      <div style={{ 
        padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', 
        background: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'start'
      }}>
        <div>
          {/* Identity & Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h2 className="text-heading" style={{ fontSize: '20px', margin: 0, lineHeight: '1.2' }}>
              {displayTitle}
            </h2>
            <span style={{ 
              fontSize: '11px', fontWeight: '800', 
              color: 'white', background: badgeColor,
              padding: '4px 10px', borderRadius: '12px'
            }}>
              {config.bus_class}
            </span>
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {displayPlate && (
              <>
                <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>{displayPlate}</span>
                <span>•</span>
              </>
            )}
            <span>{config.partners?.company_name || 'Unknown Operator'}</span>
          </div>
        </div>

        {/* Top Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          
          {/* === THE FIX: "Edit Configuration" === */}
          <button 
            onClick={() => onEdit(config)}
            className="citadel-btn-ghost"
            style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '700', color: 'var(--brand-primary)', border: '1px solid var(--brand-primary-subtle)' }}
          >
            <Edit size={14} style={{ marginRight: '6px' }} /> Edit Configuration
          </button>

          <button 
            onClick={onClose}
            className="citadel-btn-ghost"
            style={{ padding: '8px', color: 'var(--text-muted)' }}
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* === SCROLLABLE CONTENT === */}
      <div className="citadel-scroll-area" style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* SECTION A: THE SHOWROOM (Visuals) */}
        <section>
          <h4 className="text-muted" style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={14} /> Visual Profile
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', height: '240px' }}>
            {/* Main Profile Image */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', position: 'relative' }}>
              {profileSrc ? (
                <img src={profileSrc} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  No Cover Image
                </div>
              )}
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
                MAIN PROFILE
              </div>
            </div>

            {/* Side Gallery */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {galleryViews.slice(0, 2).map((src, i) => (
                <div key={i} style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}>
                  <img src={src} alt={`View ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
              {galleryViews.length === 0 && (
                 <div style={{ flex: 1, borderRadius: '12px', border: '1px dashed var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                   No Gallery
                 </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION B: THE CHASSIS (Seat Map) */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 className="text-muted" style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutGrid size={14} /> Chassis Configuration
            </h4>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
              {layout.total_rows} ROWS • {layout.total_seats || '~'} SEATS
            </span>
          </div>

          <div style={{ 
            background: 'var(--bg-canvas)', borderRadius: '16px', padding: '24px', 
            border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
              <ChassisCanvas layout={layout} />
            </div>
          </div>
        </section>

        {/* SECTION C: AMENITIES */}
        <section>
          <h4 className="text-muted" style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MonitorPlay size={14} /> On-Board Features
          </h4>

          {activeAmenities.length === 0 ? (
            <div style={{ padding: '20px', border: '1px dashed var(--border-subtle)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
              No specific amenities listed for this vehicle.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {activeAmenities.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} style={{ 
                    padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', 
                    background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', gap: '10px' 
                  }}>
                    <Icon size={16} color="var(--brand-primary)" />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)' }}>{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* FOOTER METADATA & DELETE */}
        <div style={{ 
          borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', marginTop: 'auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          
          <div style={{ display: 'flex', gap: '24px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={12} /> Created: {new Date(config.created_at || Date.now()).toLocaleDateString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={12} /> Status: {config.status}
            </div>
          </div>

          <div>
            {!showDeleteConfirm ? (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="citadel-btn-ghost"
                style={{ color: 'var(--status-danger)', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={14} /> Delete Configuration
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF2F2', padding: '4px 8px', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
                <span style={{ color: '#B91C1C', fontSize: '11px', fontWeight: '700' }}>Are you sure?</span>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  style={{ 
                    border: 'none', background: '#DC2626', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '700',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                >
                  {isDeleting ? <Loader size={10} className="animate-spin" /> : 'Yes, Delete'}
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ border: 'none', background: 'transparent', color: '#7F1D1D', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetailView;