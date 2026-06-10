import React from 'react';

/**
 * SEAT ICON COMPONENT (The Visual Atom)
 * ------------------------------------------------------------------
 * A smart, scalable SVG component that renders different seat types.
 * * * FEATURES:
 * 1. VECTOR GRAPHICS: Crisp on any screen size (Mobile to 4K).
 * 2. CONTEXT AWARE: Knows if it's a Driver, a Normal Seat, or the "M" Seat.
 * 3. HIGH CONTRAST: Fixed visibility issues for the "M" seat.
 */

const SeatIcon = ({ 
  type = 'STANDARD', // 'STANDARD', 'DRIVER', 'REAR_MIDDLE', 'AISLE'
  label = '', 
  size = 40
}) => {

  // 1. THE AISLE (Invisible Gap)
  if (type === 'AISLE') {
    return <div style={{ width: size, height: size }} />;
  }

  // 2. STYLE CONFIGURATION (The Visual Logic)
  const getSeatStyles = () => {
    switch (type) {
      case 'DRIVER':
        return { 
          fill: 'var(--text-main, #1F2937)', 
          stroke: 'none',
          strokeWidth: 0,
          opacity: 1 
        };
      case 'REAR_MIDDLE':
        // FIX 1: Added Stroke & Fallback Color. 
        // The "M" Seat is now Gold with a border, so it never disappears on white.
        return { 
          fill: 'var(--status-warning, #F59E0B)', 
          stroke: 'var(--status-warning, #F59E0B)', 
          strokeWidth: 2,
          opacity: 1 
        };
      default: // STANDARD
        return { 
          fill: 'var(--bg-hover, #F3F4F6)', 
          stroke: 'var(--border-subtle, #E5E7EB)', 
          strokeWidth: 2, 
          opacity: 1 
        };
    }
  };

  const style = getSeatStyles();
  
  // Dynamic font sizing based on container
  const fontSize = size * 0.35; 

  // FIX 2: Text Contrast Logic
  // If it's the "M" seat (Yellow/Gold), use BLACK text. White text was invisible.
  const textColor = type === 'REAR_MIDDLE' 
    ? '#000000' 
    : 'var(--text-muted, #9CA3AF)';

  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        cursor: 'default'
      }}
      title={type === 'DRIVER' ? 'Driver Seat' : `Seat ${label}`}
    >
      
      {/* A. THE SEAT SHAPE (SVG) */}
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
          // Subtle shadow for depth, simpler look for standard seats
          filter: type === 'STANDARD' ? 'none' : 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))' 
        }}
      >
        {type === 'DRIVER' ? (
          // DRIVER ICON (Seat + Steering Wheel)
          <>
            <path d="M20 30 C20 20 28 12 38 12 H62 C72 12 80 20 80 30 V80 C80 85 75 90 70 90 H30 C25 90 20 85 20 80 V30 Z" fill={style.fill} />
            {/* Steering Wheel Arc */}
            <path d="M25 60 Q50 90 75 60" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5" />
          </>
        ) : (
          // PASSENGER / REAR SEAT (Rounded Box with Armrests)
          <>
            {/* Main Cushion */}
            <rect x="10" y="15" width="80" height="75" rx="12" fill={style.fill} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            
            {/* Headrest Indentation (Visual Detail) */}
            <path d="M25 15 L25 25 Q50 30 75 25 L75 15" stroke={style.stroke} strokeWidth={style.strokeWidth} fill="none" opacity="0.3" />
            
            {/* Armrests */}
            <rect x="5" y="40" width="8" height="35" rx="4" fill={style.stroke} opacity="0.2" />
            <rect x="87" y="40" width="8" height="35" rx="4" fill={style.stroke} opacity="0.2" />
          </>
        )}
      </svg>

      {/* B. THE LABEL (e.g., "1A", "M") */}
      {type !== 'DRIVER' && (
        <span style={{ 
          position: 'absolute', 
          fontSize: `${fontSize}px`, 
          fontWeight: '800', 
          color: textColor,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          {label}
        </span>
      )}

      {/* C. DRIVER LABEL */}
      {/* FIX 3: Adjusted positioning to be snug under the icon */}
      {type === 'DRIVER' && (
        <span style={{ 
          position: 'absolute', 
          bottom: '-16px', // Nudge down slightly
          fontSize: '9px', 
          fontWeight: '800', 
          color: 'var(--text-muted, #9CA3AF)', 
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          DRVR
        </span>
      )}

    </div>
  );
};

export default SeatIcon;