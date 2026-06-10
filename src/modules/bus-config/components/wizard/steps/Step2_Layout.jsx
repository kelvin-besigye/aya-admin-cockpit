import React from 'react';
import { 
  ArrowUp, ArrowDown, Armchair, Layers, LayoutGrid, 
  Minus, Plus, Info 
} from 'lucide-react';
import ChassisCanvas from '../../designer/ChassisCanvas';
import { CHASSIS_CONSTRAINTS } from '../../../data/bus.constants';

/**
 * WIZARD STEP 2: CHASSIS LAYOUT
 * ------------------------------------------------------------------
 * The Interactive Designer.
 * 1. CONTROLS: Steppers for Rows/Cols and Toggle for Rear Bench.
 * 2. PREVIEW: Renders the ChassisCanvas to show real-time changes.
 * 3. LOGIC: Enforces physical constraints (Min/Max limits).
 */

const Step2_Layout = ({ data, onChange }) => {

  // 1. SAFE ACCESS TO DATA
  // We ensure 'layout' exists to prevent crashes
  const layout = data.layout || {
    total_rows: 11, cols_left: 2, cols_right: 2, has_rear_bench: true
  };

  // 2. UPDATE HANDLER (With Constraints)
  const updateLayout = (field, delta) => {
    const currentValue = layout[field];
    let newValue = currentValue;

    // A. Handle Boolean Toggles (Rear Bench)
    if (typeof delta === 'boolean') {
      newValue = delta;
    } 
    // B. Handle Numeric Steppers
    else {
      newValue = currentValue + delta;
      
      // Apply Safety Rails from Constants
      if (field === 'total_rows') {
        if (newValue < CHASSIS_CONSTRAINTS.MIN_ROWS) return;
        if (newValue > CHASSIS_CONSTRAINTS.MAX_ROWS) return;
      }
      if (field === 'cols_left' || field === 'cols_right') {
        if (newValue < CHASSIS_CONSTRAINTS.MIN_COLS) return;
        if (newValue > CHASSIS_CONSTRAINTS.MAX_COLS) return;
      }
    }

    // C. Commit Change
    // We update the 'layout' object inside the main data object
    onChange({
      ...data,
      layout: { ...layout, [field]: newValue }
    });
  };

  // 3. REUSABLE STEPPER COMPONENT
  const ControlStepper = ({ label, value, field, icon: Icon }) => (
    <div className="citadel-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ padding: '10px', background: 'var(--bg-input)', borderRadius: '8px' }}>
          <Icon size={18} color="var(--brand-primary)" />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>{label}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Current: <span style={{ fontFamily: 'monospace', fontWeight: '800' }}>{value}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-canvas)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <button 
          onClick={() => updateLayout(field, -1)}
          className="citadel-btn-icon"
          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'var(--bg-surface)', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
        >
          <Minus size={14} />
        </button>
        <span style={{ width: '24px', textAlign: 'center', fontSize: '14px', fontWeight: '700' }}>{value}</span>
        <button 
          onClick={() => updateLayout(field, 1)}
          className="citadel-btn-icon"
          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'var(--bg-surface)', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px', height: '100%' }}>

      {/* === LEFT PANEL: THE CONTROLS === */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* HEADER */}
        <div>
          <h3 className="text-heading" style={{ fontSize: '16px', margin: '0 0 8px 0' }}>Chassis Configuration</h3>
          <p className="text-muted" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            Adjust the seating matrix to match the physical bus. Driver position is fixed to Right (Uganda Standard).
          </p>
        </div>

        {/* A. DIMENSIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Dimensions
          </label>
          
          <ControlStepper 
            label="Total Rows" 
            value={layout.total_rows} 
            field="total_rows" 
            icon={Layers} 
          />
        </div>

        {/* B. COLUMNS CONFIG */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Seating Columns
          </label>
          
          <ControlStepper 
            label="Left Side (Door)" 
            value={layout.cols_left} 
            field="cols_left" 
            icon={ArrowUp} 
          />
          
          <ControlStepper 
            label="Right Side (Driver)" 
            value={layout.cols_right} 
            field="cols_right" 
            icon={ArrowDown} 
          />
        </div>

        {/* C. REAR BENCH TOGGLE */}
        <div className="citadel-card" 
          onClick={() => updateLayout('has_rear_bench', !layout.has_rear_bench)}
          style={{ 
            padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            cursor: 'pointer', border: layout.has_rear_bench ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: layout.has_rear_bench ? 'var(--brand-primary)' : 'var(--bg-input)', borderRadius: '8px', transition: 'background 0.2s ease' }}>
              <LayoutGrid size={18} color={layout.has_rear_bench ? 'white' : 'var(--text-muted)'} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Rear Bench Seat</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {layout.has_rear_bench ? 'Enabled (Includes "M" Seat)' : 'Disabled (Standard Aisle)'}
              </div>
            </div>
          </div>
          
          {/* VISUAL TOGGLE SWITCH */}
          <div style={{ width: '40px', height: '22px', background: layout.has_rear_bench ? 'var(--brand-primary)' : 'var(--border-subtle)', borderRadius: '20px', position: 'relative', transition: 'background 0.2s ease' }}>
            <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: layout.has_rear_bench ? '21px' : '3px', transition: 'left 0.2s var(--ease-spring)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
          </div>
        </div>

        {/* INFO BOX */}
        <div style={{ marginTop: 'auto', padding: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', display: 'flex', gap: '10px' }}>
          <Info size={16} color="var(--brand-primary)" style={{ marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '11px', color: 'var(--brand-primary)', lineHeight: '1.5' }}>
            <strong>Note:</strong> Columns are labelled alphabetically (A, B...) skipping I and O to avoid confusion. Rows are numbered numerically (1, 2...).
          </p>
        </div>

      </div>

      {/* === RIGHT PANEL: LIVE PREVIEW === */}
      <div style={{ background: 'var(--bg-input)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-subtle)' }}>
        <div style={{ marginBottom: '16px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          LIVE CHASSIS PREVIEW
        </div>
        <ChassisCanvas layout={layout} />
      </div>

    </div>
  );
};

export default Step2_Layout;