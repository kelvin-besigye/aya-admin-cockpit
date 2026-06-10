import React, { useState, useMemo } from 'react';
import { 
    BarChart3, Star, TrendingUp, TrendingDown, 
    MessageSquare, AlertTriangle, ShieldCheck, 
    Filter, Download, Megaphone, Map, MapPin
} from 'lucide-react';

// IMPORT LEVEL 2 PRIMITIVES
import SentimentTag from '../primitives/SentimentTag';
import LTVBadge from '../primitives/LTVBadge';

/**
 * 👑 NPS & SENTIMENT DASHBOARD (Level 5: Outreach Module - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: NPSDashboard.jsx
 * * DESCRIPTION:
 * A live analytics engine that aggregates passenger ratings, calculates 
 * network Net Promoter Scores, and extracts NLP sentiment to hold Partners accountable.
 * * UPGRADES:
 * - Outside-the-Box Layout: Abandoned the rigid table for a fluid, responsive Card Grid.
 * - Social-Proof Formatting: Reviews read like premium social feeds rather than data logs.
 * - Deep Contextual Action: Resolve buttons embedded directly into detractor cards.
 * - Flexbox Physics: Flawless vertical scrolling with zero horizontal lock-in.
 */

const NPSDashboard = () => {
    // ========================================================================
    // 1. STATE & FILTERS
    // ========================================================================
    const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'PROMOTERS' | 'DETRACTORS'

    // ========================================================================
    // 2. HIGH-FIDELITY MOCK ENGINE (Pre-Backend Simulator)
    // ========================================================================
    const rawFeedback = useMemo(() => [
        { id: 'FB-992', date: 'Today, 10:15', passengerName: 'Kato Paul', ltvTier: 'SOVEREIGN', rating: 5, text: 'Absolutely flawless trip to Gulu. The new Sovereign class buses are a game changer.', tags: ['comfortable', 'on time', 'clean'], route: 'Kampala → Gulu', operator: 'Nile Star Buses', asset: 'UBL-882A' },
        { id: 'FB-991', date: 'Today, 09:30', passengerName: 'Auma Grace', ltvTier: 'STANDARD', rating: 1, text: 'Driver was speeding the entire time near Karuma. Very unsafe. I felt like we were going to crash at any moment.', tags: ['speeding', 'reckless', 'unsafe'], route: 'Kampala → Mbarara', operator: 'Global Coaches', asset: 'UBM-104K' },
        { id: 'FB-990', date: 'Yesterday', passengerName: 'Ochieng David', ltvTier: 'GOLD', rating: 3, text: 'The bus was okay, but the AC was broken for the last 2 hours. It gets incredibly hot in the afternoon sun.', tags: ['ac broken', 'hot'], route: 'Mbale → Kampala', operator: 'YY Coaches', asset: 'UBA-445Y' },
        { id: 'FB-989', date: 'Yesterday', passengerName: 'Nalubega Sarah', ltvTier: 'PLATINUM', rating: 5, text: 'Very professional driver, left exactly on time. Loved the WiFi availability.', tags: ['on time', 'professional', 'safe'], route: 'Entebbe → Kampala', operator: 'Gateway Transport', asset: 'UBJ-990C' },
        { id: 'FB-988', date: 'Oct 12', passengerName: 'Mugisha Brian', ltvTier: 'STANDARD', rating: 2, text: 'Bus broke down in Luwero. We waited 3 hours for a replacement. Completely ruined my schedule.', tags: ['breakdown', 'late'], route: 'Kampala → Fort Portal', operator: 'Link Bus Services', asset: 'UBF-332D' },
        { id: 'FB-987', date: 'Oct 12', passengerName: 'Opio John', ltvTier: 'STANDARD', rating: 4, text: 'Good trip, seats were a bit cramped though.', tags: ['cramped'], route: 'Gulu → Kampala', operator: 'Nile Star Buses', asset: 'UBH-771X' },
        { id: 'FB-986', date: 'Oct 11', passengerName: 'Akello Mary', ltvTier: 'GOLD', rating: 1, text: 'Conductor was extremely rude and tried to charge extra for my bag even though it was under the weight limit.', tags: ['rude', 'bribe'], route: 'Kampala → Mbale', operator: 'YY Coaches', asset: 'UBX-112L' },
        { id: 'FB-985', date: 'Oct 10', passengerName: 'Ssematimba Peter', ltvTier: 'PLATINUM', rating: 2, text: 'Speeding again on the Masaka road. Please monitor these drivers before someone gets hurt.', tags: ['speeding', 'unsafe'], route: 'Kampala → Mbarara', operator: 'Global Coaches', asset: 'UBM-104K' }
    ], []);

    // ========================================================================
    // 3. ANALYTICS & MATH ENGINE
    // ========================================================================
    const metrics = useMemo(() => {
        const total = rawFeedback.length;
        if (total === 0) return { nps: 0, promoters: 0, passives: 0, detractors: 0, pPct: 0, dPct: 0, passPct: 0, avgRating: 0 };

        const promoters = rawFeedback.filter(f => f.rating === 5).length;
        const passives = rawFeedback.filter(f => f.rating === 4).length;
        const detractors = rawFeedback.filter(f => f.rating <= 3).length;

        const pPct = (promoters / total) * 100;
        const dPct = (detractors / total) * 100;
        const npsScore = Math.round(pPct - dPct);

        const avgRating = (rawFeedback.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1);

        return { total, promoters, passives, detractors, pPct, dPct, passPct: (passives/total)*100, npsScore, avgRating };
    }, [rawFeedback]);

    // NLP Tag Aggregation (Heat-Mapped)
    const topIssues = useMemo(() => {
        const issues = {};
        rawFeedback.filter(f => f.rating <= 3).forEach(fb => {
            fb.tags.forEach(tag => { issues[tag] = (issues[tag] || 0) + 1; });
        });
        return Object.entries(issues).sort((a, b) => b[1] - a[1]).slice(0, 6); 
    }, [rawFeedback]);

    // Filter Logic
    const filteredFeedback = useMemo(() => {
        if (activeFilter === 'ALL') return rawFeedback;
        if (activeFilter === 'PROMOTERS') return rawFeedback.filter(f => f.rating === 5);
        if (activeFilter === 'DETRACTORS') return rawFeedback.filter(f => f.rating <= 3);
        return rawFeedback;
    }, [rawFeedback, activeFilter]);

    // ========================================================================
    // 4. RENDER ENGINE
    // ========================================================================
    return (
        <div className="citadel-card" style={{
            background: 'var(--bg-canvas)', display: 'flex', flexDirection: 'column',
            flex: 1, minHeight: 0, // CRITICAL FIX: Allows flawless inner scrolling
            overflow: 'hidden'
        }}>
            
            {/* === A. MASTER HEADER === */}
            <div style={{ 
                padding: '32px 40px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '24px', background: 'var(--bg-surface)', flexShrink: 0
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.5px' }}>
                        <BarChart3 size={28} color="var(--brand-primary)" />
                        Sentiment & NPS Engine
                    </h3>
                    <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Live Net Promoter Score algorithms and NLP anomaly extraction.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: '13px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-input)'}>
                        <Download size={16} /> Export CSV
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px', background: 'var(--brand-primary)', color: '#fff', border: 'none', fontSize: '13px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 24px color-mix(in srgb, var(--brand-primary) 30%, transparent)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <Megaphone size={16} /> Trigger Mass Blast
                    </button>
                </div>
            </div>

            {/* === SCROLLABLE VIEWPORT (KPIs + Cards) === */}
            <div className="ayabus-scroll-area" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                
                {/* === B. THE MACRO SCORECARD ZONE === */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', padding: '40px', flexShrink: 0 }}>
                    
                    {/* KPI 1: The NPS Score */}
                    <div style={{ 
                        padding: '32px', background: 'var(--bg-surface)', borderRadius: '24px', 
                        border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '24px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                                <TrendingUp size={18} />
                                <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Net Promoter Score</span>
                            </div>
                            <TrendBadge value="+12" label="vs Last Month" isPositive={true} />
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                            <span style={{ fontSize: '56px', fontWeight: '900', color: metrics.npsScore >= 30 ? 'var(--status-success)' : metrics.npsScore >= 0 ? 'var(--brand-accent)' : 'var(--status-danger)', letterSpacing: '-2px', lineHeight: '1' }}>
                                {metrics.npsScore > 0 ? '+' : ''}{metrics.npsScore}
                            </span>
                        </div>
                        
                        <div style={{ marginTop: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800', marginBottom: '12px' }}>
                                <span style={{ color: 'var(--status-danger)' }}>Detractors ({metrics.dPct.toFixed(0)}%)</span>
                                <span style={{ color: 'var(--text-muted)' }}>Passives ({metrics.passPct.toFixed(0)}%)</span>
                                <span style={{ color: 'var(--status-success)' }}>Promoters ({metrics.pPct.toFixed(0)}%)</span>
                            </div>
                            <div style={{ width: '100%', height: '12px', borderRadius: '6px', display: 'flex', overflow: 'hidden', background: 'var(--bg-input)' }}>
                                <div style={{ width: `${metrics.dPct}%`, background: 'var(--status-danger)', transition: 'width 1s ease-out' }} />
                                <div style={{ width: `${metrics.passPct}%`, background: 'var(--border-subtle)', transition: 'width 1s ease-out' }} />
                                <div style={{ width: `${metrics.pPct}%`, background: 'var(--status-success)', transition: 'width 1s ease-out' }} />
                            </div>
                        </div>
                    </div>

                    {/* KPI 2: Average Rating */}
                    <div style={{ 
                        padding: '32px', background: 'var(--bg-surface)', borderRadius: '24px', 
                        border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '24px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                                <Star size={18} />
                                <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average Rating</span>
                            </div>
                            <TrendBadge value="-0.2" label="vs Last Month" isPositive={false} />
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                            <span style={{ fontSize: '56px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: '1' }}>
                                {metrics.avgRating}
                            </span>
                            <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--brand-accent)' }}>/ 5.0</span>
                        </div>
                        
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={16} color="var(--brand-primary)" /> Based on {metrics.total} verified trips.
                        </span>
                    </div>

                    {/* KPI 3: AI Threat Radar */}
                    <div style={{ 
                        padding: '32px', background: 'var(--bg-surface)', borderRadius: '24px', 
                        border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '24px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--status-danger)' }}>
                            <AlertTriangle size={18} strokeWidth={2.5} />
                            <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Top AI-Flagged Threats</span>
                        </div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {topIssues.map(([tag, count]) => {
                                const heatIntensity = Math.min(count * 5, 20); 
                                return (
                                    <div key={tag} style={{ 
                                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', 
                                        background: `color-mix(in srgb, var(--status-danger) ${heatIntensity}%, var(--bg-canvas))`, 
                                        border: '1px solid var(--border-subtle)', borderRadius: '12px' 
                                    }}>
                                        <SentimentTag tag={tag} size="sm" />
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)', width: '24px', height: '24px', borderRadius: '50%', fontSize: '11px', fontWeight: '900', color: 'var(--text-main)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                            {count}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginTop: 'auto' }}>
                            These tags are actively degrading Partner Health Scores.
                        </span>
                    </div>
                </div>

                {/* === C. THE FEEDBACK GRID (The Outside-The-Box Layout) === */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px' }}>
                    
                    {/* Floating Filters Strip */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <FilterTab label={`All Insights (${metrics.total})`} isActive={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} />
                            <FilterTab label={`Promoters (5★)`} isActive={activeFilter === 'PROMOTERS'} onClick={() => setActiveFilter('PROMOTERS')} color="var(--status-success)" />
                            <FilterTab label={`Detractors (1-3★)`} isActive={activeFilter === 'DETRACTORS'} onClick={() => setActiveFilter('DETRACTORS')} color="var(--status-danger)" />
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Filter size={14} /> Showing latest feedback
                        </div>
                    </div>

                    {/* The Masonry-Style Card Grid */}
                    {filteredFeedback.length === 0 ? (
                        <div style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)', background: 'var(--bg-surface)', borderRadius: '24px', border: '1px dashed var(--border-subtle)' }}>
                            <Filter size={40} style={{ opacity: 0.3, marginBottom: '16px' }} />
                            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>No Feedback Found</div>
                            <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>Try adjusting your segment filters.</div>
                        </div>
                    ) : (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', 
                            gap: '24px', alignItems: 'start' 
                        }}>
                            {filteredFeedback.map(fb => (
                                <SentimentCard key={fb.id} feedback={fb} />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

// ========================================================================
// SUB-COMPONENTS
// ========================================================================

const TrendBadge = ({ value, label, isPositive }) => {
    const color = isPositive ? 'var(--status-success)' : 'var(--status-danger)';
    const Icon = isPositive ? TrendingUp : TrendingDown;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: `color-mix(in srgb, ${color} 10%, transparent)`, borderRadius: '100px', border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}>
            <Icon size={14} color={color} strokeWidth={3} />
            <span style={{ fontSize: '11px', fontWeight: '900', color: color }}>{value}</span>
            <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>{label}</span>
        </div>
    );
};

// The NEW Feedback Paradigm (Card instead of Row)
const SentimentCard = ({ feedback }) => {
    const isPromoter = feedback.rating === 5;
    const isDetractor = feedback.rating <= 3;
    const ratingColor = isPromoter ? 'var(--status-success)' : isDetractor ? 'var(--status-danger)' : 'var(--brand-accent)';

    return (
        <div style={{
            background: 'var(--bg-surface)', borderRadius: '20px', 
            border: `1px solid ${isDetractor ? 'color-mix(in srgb, var(--status-danger) 30%, transparent)' : 'var(--border-subtle)'}`,
            padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
            boxShadow: isDetractor ? '0 10px 30px color-mix(in srgb, var(--status-danger) 10%, transparent)' : '0 10px 30px rgba(0,0,0,0.02)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease', position: 'relative', overflow: 'hidden'
        }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = isDetractor ? '0 20px 40px color-mix(in srgb, var(--status-danger) 15%, transparent)' : '0 20px 40px rgba(0,0,0,0.06)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isDetractor ? '0 10px 30px color-mix(in srgb, var(--status-danger) 10%, transparent)' : '0 10px 30px rgba(0,0,0,0.02)'; }}>
            
            {/* Subtle Top Accent Bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: ratingColor }} />

            {/* Header: Passenger Identity & Trip Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.3px' }}>{feedback.passengerName}</span>
                        <LTVBadge tierId={feedback.ltvTier} size="sm" showIcon={false} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>{feedback.date}</span>
                </div>
                
                {/* Visual Trip Context */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800', color: 'var(--text-main)' }}>
                        {feedback.route} <MapPin size={14} color="var(--brand-primary)" />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{feedback.operator} [{feedback.asset}]</span>
                </div>
            </div>

            {/* Body: Rating & Verbatim Text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={16} fill={star <= feedback.rating ? ratingColor : 'transparent'} color={star <= feedback.rating ? ratingColor : 'var(--border-subtle)'} />
                    ))}
                </div>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', lineHeight: '1.6' }}>
                    "{feedback.text}"
                </p>
            </div>

            {/* Footer: AI Tags & Resolution Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1, paddingRight: '16px' }}>
                    {feedback.tags.map(tag => <SentimentTag key={tag} tag={tag} size="sm" />)}
                </div>

                {isDetractor ? (
                    <button style={{ padding: '10px 16px', borderRadius: '10px', background: 'color-mix(in srgb, var(--status-danger) 10%, transparent)', color: 'var(--status-danger)', border: '1px solid color-mix(in srgb, var(--status-danger) 30%, transparent)', fontSize: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', transition: 'all 0.2s ease', flexShrink: 0 }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--status-danger)'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.background = 'color-mix(in srgb, var(--status-danger) 10%, transparent)'; e.currentTarget.style.color = 'var(--status-danger)'; }}>
                        <MessageSquare size={16} /> Resolve Issue
                    </button>
                ) : (
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-input)', color: 'var(--status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ShieldCheck size={18} />
                    </div>
                )}
            </div>

        </div>
    );
};

const FilterTab = ({ label, isActive, onClick, color = 'var(--text-main)' }) => (
    <button onClick={onClick} style={{
        padding: '10px 24px', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s ease',
        background: isActive ? `color-mix(in srgb, ${color} 10%, transparent)` : 'var(--bg-surface)',
        border: `1px solid ${isActive ? `color-mix(in srgb, ${color} 30%, transparent)` : 'var(--border-subtle)'}`,
        color: isActive ? color : 'var(--text-muted)', fontSize: '12px', fontWeight: isActive ? '900' : '700',
        letterSpacing: '0.5px', textTransform: 'uppercase', boxShadow: isActive ? `0 4px 12px color-mix(in srgb, ${color} 15%, transparent)` : 'none'
    }} onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--text-muted) 50%, transparent)'; }} onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
        {label}
    </button>
);

export default NPSDashboard;