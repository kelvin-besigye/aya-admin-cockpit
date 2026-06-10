  import React, { useMemo } from 'react';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, 
    PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from 'recharts';
import { Target, AlertTriangle, TrendingDown, CheckCircle2, DollarSign } from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { formatCurrency, formatCompactCurrency } from '../../data/partner.utils'; // Assuming generic utils are exported here or from treasury
import HealthBadge from '../primitives/HealthBadge';

/**
 * 👑 YIELD SCORECARD (Level 5: The Micro Yield View - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: YieldScorecard.jsx
 * * DESCRIPTION:
 * A high-performance profile widget that maps an Operator's telemetry onto a Radar chart,
 * and translates their operational failures into exact "Yield Leakage" (Lost UGX).
 * * UPGRADES:
 * - Fluid Macro-Wrap: Gracefully stacks the chart and ledger on narrow screens.
 * - Dynamic Theme Injection: Radar chart polygon automatically inherits the Partner's tier color.
 * - Glassmorphism Tooltips: Recharts tooltip overhauled to use CSS color-mix for Dark Mode safety.
 */

const YieldScorecard = ({ 
    partner, 
    isLoading = false,
    activeCurrency = 'UGX',
    exchangeRate = 1
}) => {

    // ========================================================================
    // 1. DATA SAFEGUARDS & TRANSFORMATION
    // ========================================================================
    const { radarData, leakage, metrics, tier, isPerfect } = useMemo(() => {
        if (!partner || !partner.performance) return { radarData: [], leakage: null, metrics: null, tier: null, isPerfect: true };

        const m = partner.performance;
        const l = partner.yieldLeakage;

        // Map the raw percentages onto a strict 0-100 positive scale for the Radar
        const chartData = [
            { subject: 'Punctuality (On-Time)', value: m.onTimePct, fullMark: 100 },
            { subject: 'Reliability (Completion)', value: Math.max(0, 100 - m.cancellationPct), fullMark: 100 },
            { subject: 'Satisfaction (Reviews)', value: (m.passengerRating / 5) * 100, fullMark: 100 },
            { subject: 'Integrity (Disputes)', value: Math.max(0, 100 - m.disputePct), fullMark: 100 }
        ];

        return { 
            radarData: chartData, 
            leakage: l, 
            metrics: m, 
            tier: partner.tier,
            isPerfect: l.totalLeakage === 0 
        };
    }, [partner]);

    // ========================================================================
    // 2. THE CUSTOM GLASSMORPHISM TOOLTIP
    // ========================================================================
    const CustomRadarTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    background: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px', padding: '12px 16px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(12px)', minWidth: '160px'
                }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        {data.subject}
                    </span>
                    <span style={{ fontSize: '16px', fontWeight: '900', fontFamily: 'monospace', color: tier.color }}>
                        {data.value.toFixed(1)} / 100
                    </span>
                </div>
            );
        }
        return null;
    };

    // ========================================================================
    // 3. RENDER ENGINE
    // ========================================================================
    return (
        <div className="citadel-card" style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: '24px', padding: '32px',
            display: 'flex', flexDirection: 'column', height: '100%', minHeight: '420px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
        }}>
            
            {/* === A. MASTER HEADER === */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
                        <Target size={20} color={tier?.color || 'var(--brand-primary)'} />
                        Yield & Telemetry Scorecard
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Forensic breakdown of operational limits vs financial impact.
                    </p>
                </div>

                {/* Live Health Injection */}
                {!isLoading && partner && (
                    <HealthBadge score={partner.healthScore} size="md" />
                )}
            </div>

            {/* === B. THE FLUID MACRO-WRAP BODY === */}
            <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '40px', position: 'relative' }}>
                
                {/* State: Loading Skeleton */}
                {isLoading && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', gap: '40px' }}>
                        <div className="animate-pulse" style={{ flex: 1, background: 'var(--bg-input)', borderRadius: '50%', maxWidth: '300px' }} />
                        <div className="animate-pulse" style={{ flex: 1, background: 'var(--bg-input)', borderRadius: '16px' }} />
                    </div>
                )}

                {/* State: Empty Data */}
                {!isLoading && !partner && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700' }}>No telemetry data loaded for this operator.</span>
                    </div>
                )}

                {/* 1. THE RADAR CHART (Left Column) */}
                {/* flex: '1 1 300px' allows it to shrink slightly but wraps if the screen is too narrow */}
                {!isLoading && partner && (
                    <div style={{ flex: '1 1 300px', minHeight: '280px', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                <PolarGrid stroke="var(--border-subtle)" strokeDasharray="3 3" />
                                <PolarAngleAxis 
                                    dataKey="subject" 
                                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }} 
                                />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Tooltip content={<CustomRadarTooltip />} />
                                <Radar 
                                    name="Operational Metric" 
                                    dataKey="value" 
                                    stroke={tier.color} 
                                    strokeWidth={3}
                                    fill={tier.color} 
                                    fillOpacity={0.15} // Creates the glowing web effect
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* 2. THE YIELD LEAKAGE LEDGER (Right Column) */}
                {!isLoading && partner && (
                    <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        
                        {/* Wrapper for the Financial Readout */}
                        <div style={{
                            background: isPerfect ? 'color-mix(in srgb, var(--status-success) 5%, transparent)' : 'color-mix(in srgb, var(--status-danger) 5%, transparent)',
                            border: `1px solid ${isPerfect ? 'color-mix(in srgb, var(--status-success) 20%, transparent)' : 'color-mix(in srgb, var(--status-danger) 20%, transparent)'}`,
                            borderRadius: '16px', padding: '24px',
                            display: 'flex', flexDirection: 'column', gap: '16px'
                        }}>
                            
                            {/* The "Money Left on the Table" Header */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ 
                                        width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: isPerfect ? 'color-mix(in srgb, var(--status-success) 15%, transparent)' : 'color-mix(in srgb, var(--status-danger) 15%, transparent)',
                                        color: isPerfect ? 'var(--status-success)' : 'var(--status-danger)'
                                    }}>
                                        {isPerfect ? <CheckCircle2 size={18} /> : <TrendingDown size={18} />}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>
                                            Yield Leakage
                                        </span>
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>
                                            {isPerfect ? 'Flawless Operation' : 'Lost Revenue from Penalties'}
                                        </span>
                                    </div>
                                </div>
                                {/* The Big Number */}
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ 
                                        fontSize: '20px', fontWeight: '900', fontFamily: 'monospace', letterSpacing: '-0.5px',
                                        color: isPerfect ? 'var(--status-success)' : 'var(--status-danger)' 
                                    }}>
                                        {formatCompactCurrency(leakage.totalLeakage, activeCurrency, exchangeRate)}
                                    </span>
                                </div>
                            </div>

                            {/* The Breakdown Rows (Only shows if leakage exists) */}
                            {!isPerfect && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', borderTop: '1px dashed var(--border-subtle)', paddingTop: '16px' }}>
                                    
                                    {/* Cancellation Loss Row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                            Lost Ticket Sales ({metrics.cancelledTickets} cancels)
                                        </span>
                                        <span style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: '800', color: 'var(--text-main)' }}>
                                            {formatCurrency(leakage.breakdown.cancellations, activeCurrency, exchangeRate)}
                                        </span>
                                    </div>

                                    {/* Chargeback Penalty Row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <AlertTriangle size={12} color="var(--status-warning)" />
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                Chargeback Fines ({metrics.chargebacks} disputes)
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: '800', color: 'var(--text-main)' }}>
                                            {formatCurrency(leakage.breakdown.penalties, activeCurrency, exchangeRate)}
                                        </span>
                                    </div>

                                </div>
                            )}

                        </div>

                        {/* Motivational Insight Box */}
                        <div style={{ 
                            marginTop: '16px', padding: '12px 16px', borderRadius: '12px', 
                            background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
                            fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', lineHeight: '1.6'
                        }}>
                            <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>System Insight: </span>
                            {leakage.insightMessage}
                        </div>

                    </div>
                )}
            </div>

        </div>
    );
};

export default YieldScorecard;