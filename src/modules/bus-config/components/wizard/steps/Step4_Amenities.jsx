import React from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { BUS_AMENITIES } from '../../../data/bus.constants';

/**
 * WIZARD STEP 4: AMENITIES
 * ------------------------------------------------------------------
 * The "Features" Step.
 * 1. SELECTION GRID: Displays all available perks defined in constants.
 * 2. TOGGLE LOGIC: Adds/Removes IDs from the 'data.amenities' array.
 * 3. SUMMARY: Shows a clean text list of selected items for verification.
 */

const Step4_Amenities = ({ data, onChange }) => {

  // 1. SAFE ACCESS
  // Ensure amenities array exists
  const selectedIds = data.amenities || [];

  // 2. TOGGLE HANDLER
  const toggleAmenity = (id) => {
    let newSelection;
    if (selectedIds.includes(id)) {
      // Remove
      newSelection = selectedIds.filter(item => item !== id);
    } else {
      // Add
      newSelection = [...selectedIds, id];
    }
    onChange({ ...data, amenities: newSelection });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '32px' }}>
      
      {/* HEADER */}
      <div>
        <h3 className="text-heading" style={{ fontSize: '16px', margin: '0 0 8px 0' }}>On-Board Features</h3>
        <p className="text-muted" style={{ fontSize: '13px' }}>
          What makes this bus special? Selected features will appear on the ticket.
        </p>
      </div>

      {/* === SECTION A: THE SELECTION GRID === */}
      <div className="citadel-scroll-area" style={{ flex: 1, padding: '4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
          
          {BUS_AMENITIES.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const Icon = item.icon;

            return (
              <div 
                key={item.id}
                onClick={() => toggleAmenity(item.id)}
                className="citadel-card"
                style={{
                  padding: '16px', cursor: 'pointer',
                  border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-surface)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  transition: 'all 0.2s ease', position: 'relative'
                }}
              >
                {/* CHECK BADGE */}
                {isSelected && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', color: 'var(--brand-primary)' }}>
                    <CheckCircle2 size={16} fill="var(--bg-surface)" />
                  </div>
                )}

                {/* ICON */}
                <div style={{ 
                  padding: '12px', borderRadius: '50%', 
                  background: isSelected ? 'var(--brand-primary)' : 'var(--bg-input)',
                  color: isSelected ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.2s ease'
                }}>
                  <Icon size={24} />
                </div>

                {/* LABEL */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: isSelected ? 'var(--brand-primary)' : 'var(--text-main)' }}>
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* === SECTION B: THE MANIFEST (CONFIRMATION) === */}
      <div style={{ 
        borderTop: '1px solid var(--border-subtle)', paddingTop: '24px',
        display: 'flex', flexDirection: 'column', gap: '12px'
      }}>
        <h4 style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>
          Confirmation Manifest ({selectedIds.length} Selected)
        </h4>

        {selectedIds.length === 0 ? (
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No amenities selected. This will be shown as a "Standard" service.
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selectedIds.map(id => {
              const amenity = BUS_AMENITIES.find(a => a.id === id);
              return (
                <span key={id} style={{ 
                  fontSize: '12px', fontWeight: '600', color: 'var(--brand-primary)',
                  background: 'rgba(59, 130, 246, 0.1)', padding: '4px 10px', borderRadius: '6px',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <Check size={10} strokeWidth={4} /> {amenity?.label}
                </span>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default Step4_Amenities;