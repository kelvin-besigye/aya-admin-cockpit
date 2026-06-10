import React, { useMemo } from 'react';
import { 
  Building2, Calendar, LayoutGrid, Users, 
  MapPin, Image as ImageIcon, MonitorPlay, Info 
} from 'lucide-react';

// IMPORT SHARED RESOURCES
import ChassisCanvas from '../../../bus-config/components/designer/ChassisCanvas';
import { BUS_AMENITIES } from '../../../bus-config/data/bus.constants';

/**
 * VERIFY BUS (The Microscope)
 * ------------------------------------------------------------------
 * The Read-Only Inspector for Bus Blueprints.
 * * * WORLD CLASS FIX:
 * 1. SMART IMAGE RESOLVER: Handles both DB Strings (Production) 
 * and UI Objects (Drafts). No more broken images.
 */

const VerifyBus = ({ data }) => {
  if (!data) return null;

  // 1. DATA EXTRACTION & SAFETY
  const partner = data.partners || {}; 
  const layout = data.layout_config || data.layout || {};
  const gallery = data.gallery || {};
  const amenityIds = data.amenities || [];

  // 2. HELPER: SMART IMAGE RESOLVER (The Fix)
  // This function automatically detects the format
  const getImgSrc = (img) => {
    if (!img) return null;
    // If it has a .preview property, it's a Wizard Object.
    // If it's a string, it's a Production URL.
    return img.preview || img;
  };

  // 3. HELPER: AMENITY RESOLVER
  const activeAmenities = useMemo(() => {
    return amenityIds
      .map(id => BUS_AMENITIES.find(a => a.id === id))
      .filter(Boolean);
  }, [amenityIds]);

  // 4. HELPER: DATES
  const submissionDate = new Date(data.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // Get resolved profile image once
  const profileSrc = getImgSrc(gallery.profile);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* === SECTION A: COMPLIANCE HEADER === */}
      <section style={{ 
        background: 'var(--bg-canvas)', padding: '24px', 
        borderRadius: '12px', border: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          
          {/* 1. OPERATOR BADGE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '8px', 
              background: 'white', border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Building2 size={24} color="var(--brand-primary)" />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                APPLICANT
              </div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                {partner.company_name || 'Unknown Operator'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                ID: {partner.partner_id || 'N/A'}
              </div>
            </div>
          </div>

          <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }} />

          {/* 2. SUBMISSION INFO */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              SUBMISSION DATE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginTop: '2px' }}>
              <Calendar size={14} color="var(--text-muted)" />
              {submissionDate}
            </div>
          </div>
        </div>

        {/* 3. CLASS BADGE */}
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              PROPOSED CLASS
            </div>
           <div style={{ 
             display: 'inline-block', marginTop: '4px',
             padding: '4px 12px', borderRadius: '12px', 
             background: 'var(--brand-primary)', color: 'white', 
             fontSize: '12px', fontWeight: '800'
           }}>
             {data.bus_class}
           </div>
        </div>
      </section>


      {/* === SECTION B: VISUAL EVIDENCE === */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
          <ImageIcon size={16} /> VISUAL EVIDENCE
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', height: '220px' }}>
          
          {/* MAIN PROFILE */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', position: 'relative' }}>
            {profileSrc ? (
              <img src={profileSrc} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                Missing Profile Photo
              </div>
            )}
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
              MARKETING PROFILE
            </div>
          </div>

          {/* INSPECTION SHOTS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(gallery.views || []).slice(0, 2).map((img, i) => {
              const viewSrc = getImgSrc(img);
              return (
                <div key={i} style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-input)', position: 'relative' }}>
                   {viewSrc ? (
                     <img src={viewSrc} alt={`Inspection ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   ) : null}
                </div>
              );
            })}
            
            {(!gallery.views || gallery.views.length === 0) && (
              <div style={{ flex: 1, border: '1px dashed var(--border-subtle)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                No Additional Photos
              </div>
            )}
          </div>
        </div>
      </section>


      {/* === SECTION C: CHASSIS & CAPACITY === */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <LayoutGrid size={16} /> PHYSICAL CONFIGURATION
          </h3>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'var(--bg-canvas)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
               <Users size={14} color="var(--brand-primary)" /> 
               <strong>{layout.total_seats || '0'}</strong> Seats
             </span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'var(--bg-canvas)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
               <LayoutGrid size={14} color="var(--brand-primary)" /> 
               <strong>{layout.total_rows || '0'}</strong> Rows
             </span>
          </div>
        </div>

        <div style={{ 
          background: 'var(--bg-canvas)', borderRadius: '16px', padding: '32px', 
          border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'center' 
        }}>
          {/* Reuse the Designer Canvas in Read-Only Mode */}
          <div style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
            <ChassisCanvas layout={layout} />
          </div>
        </div>
      </section>


      {/* === SECTION D: AMENITY MANIFEST === */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
          <MonitorPlay size={16} /> DECLARED AMENITIES
        </h3>

        {activeAmenities.length === 0 ? (
          <div style={{ padding: '20px', border: '1px dashed var(--border-subtle)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Info size={16} /> No special amenities declared for this configuration.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {activeAmenities.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} style={{ 
                  padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', 
                  background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', gap: '12px' 
                }}>
                  <div style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: '50%', color: 'var(--brand-primary)' }}>
                    <Icon size={16} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};

export default VerifyBus;