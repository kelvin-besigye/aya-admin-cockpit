import React, { useMemo } from 'react';
import SeatIcon from './SeatIcon';

/**
 * CHASSIS CANVAS (The Visual Engine)
 * ------------------------------------------------------------------
 * Renders the actual bus layout based on mathematical inputs.
 * * * "REAL WORLD" LOGIC:
 * 1. RHD STANDARD: Driver is forced to the Right (Uganda).
 * 2. DYNAMIC AISLE: Calculates where the gap goes based on columns.
 * 3. REAR BENCH: Merges the last row into a full bench if toggled.
 * 4. CSS GRID: Uses modern layouts for perfect alignment.
 */

const ChassisCanvas = ({ 
  layout, // { total_rows, cols_left, cols_right, has_rear_bench }
  onSeatClick // Optional: for future interactivity (e.g. blocking a seat)
}) => {
  
  // 1. GRID MATH CALCULATOR
  // We memorize this so it doesn't recalculate on every hover.
  const { gridTemplate, seats } = useMemo(() => {
    
    // A. SETUP
    const rows = [];
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Skip I/O to avoid confusion with 1/0
    // Ensure we have numbers to work with (fallback to defaults if undefined)
    const cLeft = layout.cols_left || 2;
    const cRight = layout.cols_right || 2;
    const tRows = layout.total_rows || 11;
    
    // B. GENERATE DRIVER ROW (ROW 0)
    // In Uganda (RHD), Driver is on the RIGHT. Entrance is on the LEFT.
    rows.push({
      id: 'row-driver',
      isDriverRow: true,
      items: [] // Handled manually in render
    });

    // C. GENERATE PASSENGER ROWS
    let charIndex = 0; // Tracks A, B, C... across the row
    
    for (let r = 1; r <= tRows; r++) {
      const isLastRow = r === tRows;
      const isBench = isLastRow && layout.has_rear_bench;
      
      const rowItems = [];
      charIndex = 0; // Reset for each row if we want A, B... to restart? 
      // Actually, standard bus numbering usually goes 1A, 1B... 2A, 2B. 
      // So we reset charIndex for each row.

      // LEFT SIDE SEATS
      for (let c = 0; c < cLeft; c++) {
        rowItems.push({
          type: 'STANDARD',
          label: `${r}${alphabet[charIndex] || '?'}`,
          id: `${r}-${alphabet[charIndex]}`
        });
        charIndex++;
      }

      // THE AISLE (Or Middle Seat if Bench)
      if (isBench) {
        // The "M" Seat (Golden Seat)
        rowItems.push({
          type: 'REAR_MIDDLE',
          label: 'M',
          id: `${r}-M`
        });
      } else {
        // The Empty Walkway
        rowItems.push({ type: 'AISLE' });
      }

      // RIGHT SIDE SEATS
      for (let c = 0; c < cRight; c++) {
        rowItems.push({
          type: 'STANDARD',
          label: `${r}${alphabet[charIndex] || '?'}`,
          id: `${r}-${alphabet[charIndex]}`
        });
        charIndex++;
      }

      rows.push({ id: `row-${r}`, items: rowItems });
    }

    // D. CALCULATE CSS GRID TEMPLATE
    // e.g., "1fr 1fr 50px 1fr 1fr" (Left Cols + Aisle + Right Cols)
    const fr = '1fr ';
    const template = `${fr.repeat(cLeft)} 50px ${fr.repeat(cRight)}`;

    return { gridTemplate: template, seats: rows };

  }, [layout]);

  // 2. RENDERER
  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      padding: '40px', background: 'var(--bg-canvas)', borderRadius: '16px',
      border: '1px solid var(--border-subtle)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)',
      minHeight: '500px', overflowY: 'auto'
    }}>
      
      {/* THE BUS BODY (Visual Shell) */}
      <div style={{ 
        width: '100%', maxWidth: '400px', 
        background: 'white', 
        borderRadius: '40px 40px 12px 12px', // Aerodynamic Front
        border: '4px solid var(--text-main)', 
        padding: '30px 20px',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
      }}>
        
        {/* WINDSHIELD EFFECT */}
        <div style={{ 
          position: 'absolute', top: '10px', left: '20px', right: '20px', height: '15px', 
          background: 'linear-gradient(180deg, rgba(200,230,255,0.4), transparent)', 
          borderRadius: '20px' 
        }} />

        {/* THE GRID */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {seats.map((row) => {
            
            // === DRIVER ROW (FIXED SPACING) ===
            if (row.isDriverRow) {
              return (
                <div key={row.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-end', 
                  // height: '60px', // REMOVED: Let it grow naturally
                  paddingBottom: '24px', // ADDED: Breathing room for "DRVR" label
                  borderBottom: '2px dashed var(--border-subtle)', 
                  marginBottom: '10px' 
                }}>
                  {/* Entrance Step */}
                  <div style={{ 
                    width: '40px', height: '50px', 
                    borderLeft: '4px solid var(--status-success)', 
                    display: 'flex', alignItems: 'center', paddingLeft: '8px', 
                    fontSize: '9px', fontWeight: '800', 
                    color: 'var(--status-success)', 
                    writingMode: 'vertical-rl', transform: 'rotate(180deg)' 
                  }}>
                    ENTRANCE
                  </div>
                  
                  {/* Driver Seat */}
                  <SeatIcon type="DRIVER" size={44} />
                </div>
              );
            }

            // === STANDARD ROW RENDER ===
            return (
              <div key={row.id} style={{ 
                display: 'grid', 
                gridTemplateColumns: gridTemplate, 
                gap: '8px', 
                alignItems: 'center' 
              }}>
                {row.items.map((seat, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                    {seat.type === 'AISLE' ? (
                      // The Walkway
                      <div style={{ width: '2px', height: '100%', background: 'var(--border-subtle)', opacity: 0.3 }} />
                    ) : (
                      // The Atom
                      <SeatIcon 
                        type={seat.type} 
                        label={seat.label} 
                        size={40} 
                        // Pass click handler if needed in future
                      />
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

      </div>

      {/* FOOTER STATS */}
      <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'monospace' }}>
        FRONT (NORTH) <br/> ▲
      </div>

    </div>
  );
};

export default ChassisCanvas;
