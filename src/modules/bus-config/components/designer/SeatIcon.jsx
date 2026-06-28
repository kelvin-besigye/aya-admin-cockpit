import React from 'react';

/**
 * SEAT ICON (The 3D Animated Atom) — Chassis Grammar v2
 * ------------------------------------------------------------------
 * Renders different seat/slot types as lively, pseudo-3D SVGs with
 * depth (gradient layers + drop shadow + perspective tilt + breathing
 * idle animation). Supports:
 *
 *   STANDARD      — bookable passenger seat (3D cushion + headrest)
 *   DRIVER        — driver position with 3D steering wheel
 *   CONDUCTOR     — staff seat (SS1, SS2 ...)
 *   INVALID       — accessible / reserved "1X" seat
 *   ENTRY         — animated door zone ("ENTRY")
 *   REAR_MIDDLE   — gold rear bench "M" seat
 *   AISLE         — invisible gap (passthrough)
 *
 * All visual properties use CSS custom properties so the seat inherits
 * the host app's design tokens.
 */

const sizeFor = (size) => Math.max(20, size ?? 44);

const SeatIcon = ({ type = 'STANDARD', label = '', size = 44, state = 'IDLE' }) => {
  const px = sizeFor(size);

  // ── AISLE (transparent gap) ─────────────────────────────────────
  if (type === 'AISLE') {
    return <div style={{ width: px, height: px }} aria-hidden />;
  }

  // ── ENTRY (animated door zone) ──────────────────────────────────
  if (type === 'ENTRY') {
    return (
      <div
        style={{
          width: px,
          height: px,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          background: 'rgba(34,197,94,0.06)',
          border: '2px dashed rgba(34,197,94,0.55)',
          borderLeftWidth: 4,
          overflow: 'hidden',
        }}
        title="Passenger Entrance / Door"
      >
        {/* Animated arrow flow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, transparent 0%, transparent 40%, rgba(34,197,94,0.18) 50%, transparent 60%, transparent 100%)',
            backgroundSize: '100% 200%',
            animation: 'entryFlow 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <svg
          width={px * 0.42}
          height={px * 0.42}
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--status-success, #22C55E)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <path d="M13 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: px * 0.2,
            fontWeight: 900,
            color: 'var(--status-success, #22C55E)',
            letterSpacing: '1px',
            marginTop: 2,
          }}
        >
          ENTRY
        </span>
        <style>{`
          @keyframes entryFlow {
            0%   { background-position: 0% -100%; }
            100% { background-position: 0% 100%; }
          }
        `}</style>
      </div>
    );
  }

  // ── CONDUCTOR (staff seat — dark with SS label) ─────────────────
  if (type === 'CONDUCTOR') {
    return (
      <div
        style={{
          width: px,
          height: px,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          background: 'linear-gradient(160deg, #1F2937 0%, #0F172A 100%)',
          boxShadow:
            'inset 0 2px 3px rgba(255,255,255,0.10), inset 0 -2px 4px rgba(0,0,0,0.35), 0 3px 6px rgba(0,0,0,0.20)',
          transform: 'perspective(400px) rotateX(4deg)',
        }}
        title={`Conductor Seat ${label}`}
      >
        <span
          style={{
            fontSize: px * 0.28,
            fontWeight: 900,
            color: '#F8FAFC',
            letterSpacing: '-0.5px',
            zIndex: 1,
            textShadow: '0 1px 0 rgba(0,0,0,0.5)',
          }}
        >
          {label}
        </span>
        {/* Headrest line for depth */}
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '18%',
            right: '18%',
            height: '8%',
            borderRadius: 3,
            background: 'rgba(255,255,255,0.10)',
          }}
        />
      </div>
    );
  }

  // ── INVALID / WHEELCHAIR (1X) ───────────────────────────────────
  if (type === 'INVALID') {
    return (
      <div
        style={{
          width: px,
          height: px,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          background: 'linear-gradient(160deg, #FEF3C7 0%, #FDE68A 100%)',
          border: '2px solid #F59E0B',
          boxShadow:
            'inset 0 2px 3px rgba(255,255,255,0.55), inset 0 -2px 4px rgba(245,158,11,0.25), 0 3px 6px rgba(245,158,11,0.20)',
          transform: 'perspective(400px) rotateX(4deg)',
        }}
        title="Invalid / Wheelchair Accessible"
      >
        {/* Wheelchair SVG */}
        <svg
          width={px * 0.55}
          height={px * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#92400E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="4" r="2" />
          <path d="M19 13a7 7 0 1 1-14 0" />
          <line x1="12" y1="6" x2="12" y2="13" />
          <line x1="12" y1="13" x2="17" y2="13" />
          <circle cx="12" cy="17" r="1.5" fill="#92400E" />
        </svg>
        <span
          style={{
            position: 'absolute',
            bottom: 2,
            right: 4,
            fontSize: px * 0.18,
            fontWeight: 900,
            color: '#92400E',
          }}
        >
          {label || '1X'}
        </span>
      </div>
    );
  }

  // ── DRIVER (3D steering wheel) ──────────────────────────────────
  if (type === 'DRIVER') {
    return (
      <div
        style={{
          width: px,
          height: px,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          background: 'linear-gradient(160deg, #1E3A8A 0%, #1E40AF 100%)',
          boxShadow:
            'inset 0 2px 3px rgba(255,255,255,0.18), inset 0 -2px 4px rgba(0,0,0,0.35), 0 3px 6px rgba(30,58,138,0.30)',
          transform: 'perspective(400px) rotateX(4deg)',
        }}
        title="Driver (Captain)"
      >
        <svg
          width={px * 0.62}
          height={px * 0.62}
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Steering wheel outer ring */}
          <circle cx="50" cy="50" r="36" stroke="rgba(255,255,255,0.85)" strokeWidth="6" fill="none" />
          {/* Steering wheel inner ring */}
          <circle cx="50" cy="50" r="10" fill="rgba(255,255,255,0.85)" />
          {/* Spokes */}
          <line x1="50" y1="14" x2="50" y2="40" stroke="rgba(255,255,255,0.85)" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="60" x2="50" y2="86" stroke="rgba(255,255,255,0.85)" strokeWidth="4" strokeLinecap="round" />
          <line x1="14" y1="50" x2="40" y2="50" stroke="rgba(255,255,255,0.85)" strokeWidth="4" strokeLinecap="round" />
          <line x1="60" y1="50" x2="86" y2="50" stroke="rgba(255,255,255,0.85)" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <span
          style={{
            position: 'absolute',
            bottom: -16,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 9,
            fontWeight: 900,
            color: 'var(--text-muted, #9CA3AF)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
          }}
        >
          DRIVER
        </span>
      </div>
    );
  }

  // ── REAR MIDDLE (gold "M" bench seat) ──────────────────────────
  if (type === 'REAR_MIDDLE') {
    return (
      <div
        style={{
          width: px,
          height: px,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          background: 'linear-gradient(160deg, #FCD34D 0%, #F59E0B 100%)',
          boxShadow:
            'inset 0 2px 3px rgba(255,255,255,0.45), inset 0 -2px 4px rgba(146,64,14,0.30), 0 4px 8px rgba(245,158,11,0.30)',
          transform: 'perspective(400px) rotateX(4deg)',
        }}
        title="Rear Bench Seat (M)"
      >
        <span
          style={{
            fontSize: px * 0.42,
            fontWeight: 900,
            color: '#451A03',
            letterSpacing: '-1px',
            zIndex: 1,
            textShadow: '0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          {label || 'M'}
        </span>
        {/* Headrest line for depth */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '18%',
            right: '18%',
            height: '8%',
            borderRadius: 3,
            background: 'rgba(0,0,0,0.10)',
          }}
        />
      </div>
    );
  }

  // ── STANDARD (bookable passenger seat with 3D depth) ───────────
  const isSelected  = state === 'SELECTED';
  const isBlocked   = state === 'BLOCKED';
  const isAvailable = !isSelected && !isBlocked;

  return (
    <div
      style={{
        width: px,
        height: px,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        background: isSelected
          ? 'linear-gradient(160deg, var(--brand-primary-light, #FCD34D) 0%, var(--brand-primary, #CEAC5C) 100%)'
          : isBlocked
            ? 'linear-gradient(160deg, #E5E7EB 0%, #D1D5DB 100%)'
            : 'linear-gradient(160deg, #F9FAFB 0%, #E5E7EB 100%)',
        border: isSelected
          ? '2px solid var(--brand-primary, #CEAC5C)'
          : isBlocked
            ? '2px dashed var(--text-muted, #9CA3AF)'
            : '2px solid var(--border-subtle, #E5E7EB)',
        boxShadow: isSelected
          ? 'inset 0 2px 3px rgba(255,255,255,0.55), inset 0 -2px 4px rgba(0,0,0,0.20), 0 0 0 3px rgba(206,172,92,0.25), 0 6px 14px rgba(206,172,92,0.35)'
          : 'inset 0 2px 3px rgba(255,255,255,0.55), inset 0 -2px 4px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.10)',
        transform: 'perspective(400px) rotateX(4deg)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        animation: isAvailable ? 'seatBreathing 4s ease-in-out infinite' : 'none',
        cursor: 'default',
      }}
      title={`Seat ${label}${isSelected ? ' — Selected' : isBlocked ? ' — Blocked' : ''}`}
    >
      {/* Headrest line for depth */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '18%',
          right: '18%',
          height: '8%',
          borderRadius: 3,
          background: isSelected ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.06)',
        }}
      />
      {/* Label */}
      <span
        style={{
          fontSize: px * 0.32,
          fontWeight: 900,
          color: isSelected
            ? '#FFFFFF'
            : isBlocked
              ? 'var(--text-muted, #9CA3AF)'
              : 'var(--text-main, #1F2937)',
          letterSpacing: '-0.5px',
          zIndex: 1,
          textShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.25)' : 'none',
        }}
      >
        {label}
      </span>
      <style>{`
        @keyframes seatBreathing {
          0%, 100% { transform: perspective(400px) rotateX(4deg) scale(1); }
          50%      { transform: perspective(400px) rotateX(4deg) scale(1.025); }
        }
      `}</style>
    </div>
  );
};

export default SeatIcon;