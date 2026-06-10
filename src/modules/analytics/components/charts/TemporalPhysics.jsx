import React, { useMemo } from 'react';
import { Clock, Timer, AlertCircle, CalendarClock, TrendingUp } from 'lucide-react';

/**
 * 👑 AYABUS TEMPORAL PHYSICS (Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Analytics & Intelligence Centre
 * File: TemporalPhysics.jsx
 * * DESCRIPTION:
 * Zone 3: Visualizes time-based behavioral data.
 * Features native CSS-based charts to ensure perfect Light/Dark mode 
 * compliance and absolute rendering speed without external libraries.
 */

const TemporalPhysics = ({ behavioralData, delayData = [], isLoading = false }) => {

    // ========================================================================
    // 1. DATA NORMALIZATION (For Native Chart Rendering)
    // ========================================================================
    const leadTimeBuckets = useMemo(() => {
        const data = behavioralData || { '< 2 Hours': 0, '2-12 Hours': 0, '12-24 Hours': 0, '24+ Hours': 0 };
        const keys = Object.keys(data);
        const maxVal = Math.max(...Object.values(data), 1); // Prevent division by zero
        const total = Object.values(data).reduce((a, b) => a + b, 0);

        return keys.map(key => ({
            label: key,
            value: data[key],
            percentage: total > 0 ? Math.round((data[key] / total) * 100) : 0,
            height: `${(data[key] / maxVal) * 100}%` // Scales bar relative to the highest peak
        }));
    }, [behavioralData]);

    const sortedDelays = useMemo(() => {
        // Fallback safety if the physics engine hasn't populated this yet
        return [...delayData].sort((a, b) => b.delayMinutes - a.delayMinutes).slice(0, 5);
    }, [delayData]);

    // ========================================================================
    // 2. SKELETON LOADER
    // ========================================================================
    if (isLoading) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: '100%' }}>
                {[1, 2].map(i => (
                    <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '24px' }}>
                        <div style={{ width: '40%', height: '24px', background: 'var(--bg-input)', borderRadius: '8px', animation: 'pulse 1.5s infinite', opacity: 0.5, marginBottom: '32px' }} />
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px' }}>
                            {[1, 2, 3, 4].map(bar => (
                                <div key={bar} style={{ width: '15%', height: `${Math.random() * 80 + 20}%`, background: 'var(--bg-input)', borderRadius: '8px 8px 0 0', animation: 'pulse 1.5s infinite', opacity: 0.3 }} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // ========================================================================
    // 3. MAIN RENDER ENGINE
    // ========================================================================
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            
            {/* =========================================================
                CHART A: THE BOOKING LEAD-TIME CURVE
                Shows when users buy tickets relative to departure.
                ========================================================= */}
            <div className="citadel-card" style={{ 
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', 
                borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CalendarClock size={18} color="var(--brand-primary)" />
                            Booking Velocity (Lead Time)
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                            Time delta between purchase and scheduled departure.
                        </p>
                    </div>
                    <div style={{ padding: '8px', background: 'var(--brand-primary-subtle)', borderRadius: '8px', color: 'var(--brand-primary)' }}>
                        <TrendingUp size={16} />
                    </div>
                </div>

                {/* Custom Native Bar Chart */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', minHeight: '220px', paddingBottom: '16px', borderBottom: '2px solid var(--border-subtle)' }}>
                    {leadTimeBuckets.map((bucket, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1, height: '100%', justifyContent: 'flex-end', group: 'true' }}>
                            
                            {/* Data Label (Percentage) */}
                            <div style={{ fontSize: '12px', fontWeight: '800', color: bucket.percentage > 0 ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                {bucket.percentage}%
                            </div>
                            
                            {/* The Bar */}
                            <div style={{ 
                                width: '100%', maxWidth: '60px', height: bucket.percentage > 0 ? bucket.height : '4px', 
                                background: bucket.percentage === Math.max(...leadTimeBuckets.map(b => b.percentage)) 
                                    ? 'var(--brand-primary)' // Highlight the peak booking window
                                    : 'var(--bg-input)',
                                borderRadius: '8px 8px 0 0',
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                cursor: 'pointer',
                                border: bucket.percentage > 0 ? 'none' : '1px dashed var(--border-subtle)',
                                position: 'relative'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'scaleY(1.02)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.style.transform = 'scaleY(1)'; }}
                            >
                                {/* Raw Volume Tooltip (visible on hover) */}
                                <div className="bar-tooltip" style={{
                                    position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)',
                                    background: 'var(--text-main)', color: 'var(--bg-canvas)', padding: '4px 8px',
                                    borderRadius: '6px', fontSize: '10px', fontWeight: '800', opacity: 0, pointerEvents: 'none',
                                    transition: 'opacity 0.2s', whiteSpace: 'nowrap'
                                }}>
                                    {new Intl.NumberFormat().format(bucket.value)} Tickets
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* X-Axis Labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', gap: '16px' }}>
                    {leadTimeBuckets.map((bucket, index) => (
                        <div key={index} style={{ flex: 1, textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            {bucket.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* =========================================================
                CHART B: PUNCTUALITY DEVIATION (Departure Delays)
                Shows which operators consistently miss their schedules.
                ========================================================= */}
            <div className="citadel-card" style={{ 
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', 
                borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Timer size={18} color="var(--status-warning)" />
                            Departure Punctuality
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                            Average delay beyond scheduled departure time.
                        </p>
                    </div>
                </div>

                {sortedDelays.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '12px', border: '1px dashed var(--border-subtle)', borderRadius: '16px' }}>
                        <Clock size={32} style={{ opacity: 0.3 }} />
                        <div style={{ fontSize: '12px', fontWeight: '600' }}>Insufficient Punctuality Data</div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {sortedDelays.map((operator, index) => {
                            // Logic: <15 mins is OK, 15-45 is Warning, >45 is Danger
                            const isDanger = operator.delayMinutes > 45;
                            const isWarning = operator.delayMinutes > 15 && !isDanger;
                            const color = isDanger ? 'var(--status-danger)' : (isWarning ? 'var(--status-warning)' : 'var(--status-success)');
                            
                            // Visual bar width cap at 120 minutes for scaling
                            const maxScaleMins = 120; 
                            const widthPercent = Math.min((operator.delayMinutes / maxScaleMins) * 100, 100);

                            return (
                                <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>
                                            {operator.operatorName || 'Unknown Operator'}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '900', color: color }}>
                                            {isDanger && <AlertCircle size={12} />}
                                            +{operator.delayMinutes} Mins
                                        </div>
                                    </div>
                                    
                                    {/* Horizontal Gauge */}
                                    <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ 
                                            height: '100%', width: `${widthPercent}%`, 
                                            background: color, borderRadius: '4px',
                                            transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Injected CSS for the custom bar tooltips */}
            <style>{`
                .citadel-card:hover .bar-tooltip { opacity: 1 !important; }
            `}</style>
        </div>
    );
};

export default TemporalPhysics;