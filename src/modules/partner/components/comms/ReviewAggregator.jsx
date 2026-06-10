import React, { useState, useMemo } from 'react';
import { 
    MessageSquare, Star, Search, Filter, 
    AlertTriangle, CheckCircle2, ShieldAlert, Ticket
} from 'lucide-react';

/**
 * 👑 REVIEW AGGREGATOR (Level 5: Sentiment & Resolution Hub - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: ReviewAggregator.jsx
 * * DESCRIPTION:
 * A high-density, analytical viewport for passenger feedback.
 * Combines macro-sentiment distribution with a micro-resolution ledger.
 * * UPGRADES:
 * - Anti-Squish Viewport: 900px minimum width lock protects the text hierarchy.
 * - Auto-Sentiment Tagging: Visually categorizes feedback (Safety vs Comfort).
 * - Actionable Intelligence: 1-star reviews feature "Escalate to Ticket" workflows.
 */

const ReviewAggregator = ({ 
    partner, 
    isLoading = false 
}) => {

    // ========================================================================
    // 1. STATE & FILTERS
    // ========================================================================
    const [searchQuery, setSearchQuery] = useState('');
    const [activeRatingFilter, setActiveRatingFilter] = useState('ALL'); // 'ALL' | 5 | 4 | 3 | 2 | 1

    // ========================================================================
    // 2. HIGH-FIDELITY MOCK ENGINE (Pre-Backend)
    // Ugandan Context Passenger Reviews
    // ========================================================================
    const { reviews, analytics } = useMemo(() => {
        if (!partner) return { reviews: [], analytics: null };

        const mockReviews = [
            { id: 'RV-8821', passenger: 'Kizito Emmanuel', route: 'Kampala → Gulu', date: 'Today, 10:15', rating: 5, text: 'Very smooth ride. The AC was working perfectly and the driver was professional. Left exactly on time.', tags: ['Punctual', 'Comfortable', 'Safe'], status: 'ACKNOWLEDGED' },
            { id: 'RV-8819', passenger: 'Sarah Namukasa', route: 'Kampala → Mbarara', date: 'Yesterday', rating: 4, text: 'Good trip overall, but the boarding process at the terminal was a bit chaotic. Bus itself was clean.', tags: ['Clean', 'Boarding Delay'], status: 'UNREAD' },
            { id: 'RV-8790', passenger: 'Mugisha Brian', route: 'Gulu → Kampala', date: '3 Days Ago', rating: 1, text: 'Terrible experience. The driver was speeding recklessly near Karuma bridge. I felt completely unsafe. Never using this operator again.', tags: ['Reckless Driving', 'Safety Hazard'], status: 'ACTION_REQUIRED' },
            { id: 'RV-8755', passenger: 'Auma Grace', route: 'Kampala → Lira', date: 'Last Week', rating: 2, text: 'Bus broke down for 2 hours. No communication from the conductor on what was happening. We missed our connections.', tags: ['Breakdown', 'Poor Communication'], status: 'RESOLVED' },
            { id: 'RV-8710', passenger: 'David Ochieng', route: 'Kampala → Gulu', date: 'Last Week', rating: 5, text: 'Best service on this route. The VIP seating actually has legroom.', tags: ['VIP Config', 'Comfortable'], status: 'ACKNOWLEDGED' }
        ];

        // Calculate Analytics Distribution
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let totalScore = 0;
        mockReviews.forEach(r => {
            dist[r.rating] += 1;
            totalScore += r.rating;
        });

        return { 
            reviews: mockReviews, 
            analytics: {
                average: (totalScore / mockReviews.length).toFixed(1),
                total: mockReviews.length,
                distribution: dist
            }
        };
    }, [partner]);

    // ========================================================================
    // 3. FILTERING ENGINE
    // ========================================================================
    const filteredReviews = useMemo(() => {
        return reviews.filter(r => {
            const matchesSearch = r.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  r.passenger.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  r.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesRating = activeRatingFilter === 'ALL' || r.rating === activeRatingFilter;
            return matchesSearch && matchesRating;
        });
    }, [reviews, searchQuery, activeRatingFilter]);

    // ========================================================================
    // 4. CSS GRID DEFINITION (The Review Ledger)
    // ========================================================================
    const GRID_TEMPLATE = '1.5fr 3fr 1.5fr 150px';

    // ========================================================================
    // 5. RENDER ENGINE
    // ========================================================================
    return (
        <div className="citadel-card" style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: '24px', display: 'flex', flexDirection: 'column',
            height: '100%', minHeight: '600px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
            overflow: 'hidden'
        }}>
            
            {/* === A. MASTER HEADER === */}
            <div style={{ 
                padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                flexWrap: 'wrap', gap: '20px', background: 'var(--bg-surface)', zIndex: 20
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
                        <MessageSquare size={20} color="var(--brand-primary)" />
                        Passenger Sentiment & Reviews
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Verified post-trip feedback for {partner?.companyName || 'this operator'}.
                    </p>
                </div>

                {/* Filter Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                        background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border-subtle)'
                    }}>
                        <Search size={14} color="var(--text-muted)" />
                        <input 
                            type="text" 
                            placeholder="Search keywords or tags..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '200px', fontSize: '13px', color: 'var(--text-main)' }}
                        />
                    </div>
                </div>
            </div>

            {/* === B. ANALYTICS DASHBOARD (The Distribution Strip) === */}
            {!isLoading && analytics && (
                <div style={{ 
                    display: 'flex', flexWrap: 'wrap', gap: '32px', padding: '24px 32px', 
                    background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-subtle)'
                }}>
                    {/* The Big Score */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '120px' }}>
                        <span style={{ fontSize: '48px', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-main)', lineHeight: '1' }}>
                            {analytics.average}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '8px 0 4px 0' }}>
                            {[1,2,3,4,5].map(star => (
                                <Star key={star} size={14} fill={star <= Math.round(analytics.average) ? '#F59E0B' : 'var(--bg-input)'} color={star <= Math.round(analytics.average) ? '#F59E0B' : 'var(--border-subtle)'} />
                            ))}
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {analytics.total} Verified Reviews
                        </span>
                    </div>

                    {/* The Distribution Bars */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '300px' }}>
                        {[5,4,3,2,1].map(rating => {
                            const count = analytics.distribution[rating];
                            const pct = analytics.total > 0 ? (count / analytics.total) * 100 : 0;
                            const isActive = activeRatingFilter === rating;
                            // Color mapping: 5/4 = Green, 3 = Gray, 2/1 = Red
                            const barColor = rating >= 4 ? 'var(--status-success)' : rating === 3 ? 'var(--text-muted)' : 'var(--status-danger)';

                            return (
                                <div 
                                    key={rating} 
                                    onClick={() => setActiveRatingFilter(isActive ? 'ALL' : rating)}
                                    style={{ 
                                        display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                                        opacity: activeRatingFilter === 'ALL' || isActive ? 1 : 0.4,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', width: '40px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {rating} <Star size={10} fill="currentColor" />
                                    </span>
                                    {/* Physical Bar */}
                                    <div style={{ flex: 1, height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: '4px', transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                                    </div>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', width: '30px', textAlign: 'right', fontFamily: 'monospace' }}>
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* === C. BI-DIRECTIONAL LEDGER VIEWPORT === */}
            <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-surface)' }} className="ayabus-scroll-area">
                
                {/* The 900px Anchor: Prevents UI crush on mobile */}
                <div style={{ minWidth: '900px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                    
                    {/* Sticky Ledger Header */}
                    <div style={{
                        position: 'sticky', top: 0, zIndex: 10,
                        display: 'grid', gridTemplateColumns: GRID_TEMPLATE, alignItems: 'center',
                        padding: '12px 32px', background: 'color-mix(in srgb, var(--bg-surface) 85%, transparent)',
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '1px',
                        backdropFilter: 'blur(12px)'
                    }}>
                        <span style={{ paddingRight: '16px' }}>Trip Context</span>
                        <span style={{ paddingRight: '24px' }}>Passenger Feedback</span>
                        <span style={{ paddingRight: '16px' }}>Algorithmic Tags</span>
                        <span style={{ textAlign: 'right' }}>Resolution Status</span>
                    </div>

                    {/* Scrollable Review Ledger */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {isLoading && [1,2,3].map(i => (
                            <div key={i} style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)' }}>
                                <div className="animate-pulse" style={{ height: '48px', background: 'var(--bg-input)', borderRadius: '12px' }} />
                            </div>
                        ))}

                        {!isLoading && filteredReviews.length === 0 && (
                            <div style={{ padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                <Filter size={40} style={{ opacity: 0.2, marginBottom: '12px' }} />
                                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>No Reviews Match Filters</span>
                            </div>
                        )}

                        {!isLoading && filteredReviews.map(review => (
                            <ReviewRow key={review.id} review={review} gridTemplate={GRID_TEMPLATE} />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

// ========================================================================
// 6. SUB-COMPONENT: REVIEW ROW (The Uncrushable Grid Atom)
// ========================================================================
const ReviewRow = ({ review, gridTemplate }) => {
    
    // Status Resolution Logic
    const getStatusConfig = (status) => {
        switch(status) {
            case 'ACTION_REQUIRED': return { label: 'Action Required', color: 'var(--status-danger)', icon: ShieldAlert, bg: 'color-mix(in srgb, var(--status-danger) 10%, transparent)' };
            case 'UNREAD': return { label: 'Unread', color: 'var(--brand-primary)', icon: MessageSquare, bg: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)' };
            case 'ACKNOWLEDGED': return { label: 'Acknowledged', color: 'var(--text-muted)', icon: CheckCircle2, bg: 'var(--bg-input)' };
            case 'RESOLVED': return { label: 'Resolved', color: 'var(--status-success)', icon: CheckCircle2, bg: 'color-mix(in srgb, var(--status-success) 10%, transparent)' };
            default: return { label: status, color: 'var(--text-muted)', icon: CheckCircle2, bg: 'var(--bg-input)' };
        }
    };

    const statusConfig = getStatusConfig(review.status);
    const StatusIcon = statusConfig.icon;
    const isCritical = review.rating <= 2;

    return (
        <div style={{
            display: 'grid', gridTemplateColumns: gridTemplate, alignItems: 'flex-start',
            padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)',
            background: review.status === 'ACTION_REQUIRED' ? 'color-mix(in srgb, var(--status-danger) 2%, transparent)' : 'transparent',
            transition: 'background 0.2s ease', position: 'relative'
        }}>
            {/* Critical Edge Highlight */}
            {isCritical && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--status-danger)' }} />
            )}

            {/* Col 1: Trip Context */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0, paddingRight: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {review.passenger}
                </span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {review.route}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--border-subtle)', fontFamily: 'monospace', marginTop: '4px' }}>
                    {review.id} • {review.date}
                </span>
            </div>

            {/* Col 2: Feedback Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0, paddingRight: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {[1,2,3,4,5].map(star => (
                        <Star key={star} size={12} fill={star <= review.rating ? (isCritical ? 'var(--status-danger)' : '#F59E0B') : 'transparent'} color={star <= review.rating ? (isCritical ? 'var(--status-danger)' : '#F59E0B') : 'var(--border-subtle)'} />
                    ))}
                </div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', lineHeight: '1.6' }}>
                    "{review.text}"
                </p>
            </div>

            {/* Col 3: Algorithmic Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minWidth: 0, paddingRight: '16px', alignContent: 'flex-start' }}>
                {review.tags.map(tag => {
                    // Primitive auto-coloring logic for tags based on keywords
                    const isBad = tag.toLowerCase().includes('reckless') || tag.toLowerCase().includes('breakdown') || tag.toLowerCase().includes('poor') || tag.toLowerCase().includes('hazard');
                    const isGood = tag.toLowerCase().includes('punctual') || tag.toLowerCase().includes('clean') || tag.toLowerCase().includes('comfortable');
                    
                    const bg = isBad ? 'color-mix(in srgb, var(--status-danger) 10%, transparent)' : isGood ? 'color-mix(in srgb, var(--status-success) 10%, transparent)' : 'var(--bg-input)';
                    const color = isBad ? 'var(--status-danger)' : isGood ? 'var(--status-success)' : 'var(--text-muted)';
                    const border = isBad ? 'color-mix(in srgb, var(--status-danger) 20%, transparent)' : isGood ? 'color-mix(in srgb, var(--status-success) 20%, transparent)' : 'var(--border-subtle)';

                    return (
                        <span key={tag} style={{
                            padding: '4px 8px', borderRadius: '6px', background: bg, border: `1px solid ${border}`,
                            color: color, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px'
                        }}>
                            {tag}
                        </span>
                    );
                })}
            </div>

            {/* Col 4: Status & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '100px',
                    background: statusConfig.bg, color: statusConfig.color, border: `1px solid color-mix(in srgb, ${statusConfig.color} 20%, transparent)`,
                    fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>
                    <StatusIcon size={12} strokeWidth={2.5} />
                    {statusConfig.label}
                </div>
                
                {/* Resolution Workflow Trigger for Bad Reviews */}
                {review.status === 'ACTION_REQUIRED' && (
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px',
                        background: 'transparent', border: '1px solid var(--status-danger)', color: 'var(--status-danger)',
                        fontSize: '11px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
                    }}>
                        <Ticket size={12} strokeWidth={2.5} />
                        Open Ticket
                    </button>
                )}
            </div>

        </div>
    );
};

export default ReviewAggregator;