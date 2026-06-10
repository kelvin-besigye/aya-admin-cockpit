import React, { useState, useEffect, useMemo } from 'react';
import { 
    Search, Filter, Clock, AlertTriangle, 
    Smartphone, Globe, MessageCircle, MoreVertical, 
    BusFront, ShieldAlert 
} from 'lucide-react';

// IMPORT LEVEL 1 & 2 DEPENDENCIES
import { clientService } from '../../data/clients.service';
import LTVBadge from '../primitives/LTVBadge';
import SentimentTag from '../primitives/SentimentTag';

/**
 * 👑 OMNI INBOX (Level 5: Support Helpdesk - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: OmniInbox.jsx
 * * DESCRIPTION:
 * The intelligent left-sidebar routing queue. Actively sorts incoming 
 * omnichannel messages by Lifetime Value (LTV), SLA urgency, and AI Sentiment.
 * * UPGRADES:
 * - Cognitive Routing: Automatically surfaces VIPs and emergencies to the top.
 * - SLA Pulse: CSS keyframe animations trigger when response times are critical.
 * - Telemetry Badging: Instantly shows if the complaining user is currently on a bus.
 */

const OmniInbox = ({ 
    activeTicketId, 
    onSelectTicket 
}) => {
    // ========================================================================
    // 1. STATE MANAGEMENT
    // ========================================================================
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'VIP'

    // ========================================================================
    // 2. OMNISCIENT DATA FETCHING
    // ========================================================================
    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        // The service autonomously sorts the payload before handing it to the UI
        clientService.getOmniInboxTickets()
            .then(data => {
                if (isMounted) {
                    setTickets(data);
                    // Auto-select the highest priority ticket if none is active
                    if (!activeTicketId && data.length > 0 && onSelectTicket) {
                        onSelectTicket(data[0]);
                    }
                }
            })
            .catch(err => console.error("Inbox Fetch Error:", err))
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, []);

    // ========================================================================
    // 3. FILTERING ENGINE
    // ========================================================================
    const filteredTickets = useMemo(() => {
        return tickets.filter(t => {
            const matchesSearch = 
                t.passenger.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.subject.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = 
                activeFilter === 'ALL' || 
                (activeFilter === 'CRITICAL' && (t.slaTracker.status === 'BREACHED' || t.slaTracker.status === 'CRITICAL' || t.urgency.effectivePriority === 'CRITICAL')) ||
                (activeFilter === 'VIP' && (t.passenger.ltvTier.id === 'SOVEREIGN' || t.passenger.ltvTier.id === 'PLATINUM'));

            return matchesSearch && matchesFilter;
        });
    }, [tickets, searchQuery, activeFilter]);

    // ========================================================================
    // 4. RENDER ENGINE
    // ========================================================================
    return (
        <div style={{ 
            width: '380px', flexShrink: 0, borderRight: '1px solid var(--border-subtle)',
            display: 'flex', flexDirection: 'column', background: 'var(--bg-canvas)',
            height: '100%', position: 'relative', zIndex: 10
        }}>
            {/* Inject Global Keyframe for SLA Blinking */}
            <style>
                {`
                    @keyframes slaBlink {
                        0% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.5; transform: scale(0.95); }
                        100% { opacity: 1; transform: scale(1); }
                    }
                `}
            </style>

            {/* === A. INBOX HEADER & SEARCH === */}
            <div style={{ padding: '24px 24px 16px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', zIndex: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
                        <MessageCircle size={20} color="var(--brand-primary)" />
                        Omni-Queue
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '100px' }}>
                        {tickets.length} Active
                    </div>
                </div>

                {/* Micro Search Bar */}
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
                    background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-subtle)'
                }}>
                    <Search size={14} color="var(--text-muted)" />
                    <input 
                        type="text" 
                        placeholder="Search IDs, names, subjects..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px', color: 'var(--text-main)', fontWeight: '600' }}
                    />
                </div>

                {/* Quick Triage Filters */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <FilterTab label="All" isActive={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} />
                    <FilterTab label="Critical SLA" isActive={activeFilter === 'CRITICAL'} onClick={() => setActiveFilter('CRITICAL')} color="var(--status-danger)" />
                    <FilterTab label="VIPs" isActive={activeFilter === 'VIP'} onClick={() => setActiveFilter('VIP')} color="var(--brand-accent)" />
                </div>
            </div>

            {/* === B. SCROLLABLE QUEUE VIEWPORT === */}
            <div className="ayabus-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                
                {isLoading && [1,2,3,4].map(i => (
                    <div key={i} className="animate-pulse" style={{ height: '120px', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }} />
                ))}

                {!isLoading && filteredTickets.length === 0 && (
                    <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <ShieldAlert size={32} style={{ opacity: 0.2, marginBottom: '12px' }} />
                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>Inbox Zero</div>
                        <div style={{ fontSize: '12px', fontWeight: '600' }}>All queries resolved matching this filter.</div>
                    </div>
                )}

                {!isLoading && filteredTickets.map(ticket => (
                    <InboxItem 
                        key={ticket.id} 
                        ticket={ticket} 
                        isActive={activeTicketId === ticket.id}
                        onClick={() => onSelectTicket(ticket)}
                    />
                ))}

            </div>
        </div>
    );
};

// ========================================================================
// 5. SUB-COMPONENT: INBOX ITEM (The Dense Telemetry Node)
// ========================================================================
const InboxItem = ({ ticket, isActive, onClick }) => {
    
    // Icon Mapping for the source channel
    const getChannelIcon = (channel) => {
        switch(channel) {
            case 'APP_SOS': return <AlertTriangle size={12} color="var(--status-danger)" />;
            case 'APP': return <Smartphone size={12} />;
            case 'WHATSAPP': return <MessageCircle size={12} color="#25D366" />;
            case 'WEB':
            default: return <Globe size={12} />;
        }
    };

    return (
        <div 
            onClick={onClick}
            style={{
                display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px',
                borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative',
                background: isActive ? 'var(--bg-surface)' : 'var(--bg-canvas)',
                border: `1px solid ${isActive ? 'var(--border-subtle)' : 'transparent'}`,
                boxShadow: isActive ? '0 10px 30px rgba(0,0,0,0.05)' : 'none',
                // Left Border Highlight driven by Urgency Color
                borderLeft: `4px solid ${isActive ? ticket.urgency.color : 'transparent'}`
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)' }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-canvas)' }}
        >
            
            {/* Top Row: Identity, LTV, and Channel */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, paddingRight: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ticket.passenger.name}
                        </span>
                        {ticket.passenger.isMoving && (
                            <div title="Currently in transit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', borderRadius: '4px', background: 'color-mix(in srgb, var(--brand-primary) 15%, transparent)', color: 'var(--brand-primary)' }}>
                                <BusFront size={10} strokeWidth={3} />
                            </div>
                        )}
                    </div>
                    {/* Level 2 Visual Primitive Injection */}
                    <div style={{ display: 'flex' }}>
                        <LTVBadge tierId={ticket.passenger.ltvTier.id} size="sm" showIcon={true} showLabel={true} />
                    </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
                        {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {getChannelIcon(ticket.channel)} {ticket.channel.replace('_', ' ')}
                    </div>
                </div>
            </div>

            {/* Middle Row: Subject Line */}
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {ticket.subject}
            </div>

            {/* Bottom Row: SLA Tracker & AI Sentiment */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Intelligent AI Tagging (Only shows the highest severity tag if flagged) */}
                    {ticket.sentiment.isFlagged && ticket.sentiment.tags.length > 0 && (
                        <SentimentTag tag={ticket.sentiment.tags[0]} size="sm" />
                    )}
                    
                    {/* Escalation Tag */}
                    {ticket.urgency.isVipEscalated && (
                        <span style={{ fontSize: '9px', fontWeight: '900', color: '#fff', background: 'var(--brand-accent)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            VIP Escalated
                        </span>
                    )}
                </div>

                {/* The Autonomous SLA Tracker */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '6px',
                    background: `color-mix(in srgb, ${ticket.slaTracker.color} 10%, transparent)`,
                    color: ticket.slaTracker.color, fontSize: '11px', fontWeight: '900', fontFamily: 'monospace',
                    border: `1px solid color-mix(in srgb, ${ticket.slaTracker.color} 25%, transparent)`,
                    // Pulse CSS injected dynamically based on math from Level 1
                    animation: ticket.slaTracker.isBlinking ? 'slaBlink 1s infinite ease-in-out' : 'none'
                }}>
                    <Clock size={12} strokeWidth={2.5} /> 
                    {ticket.slaTracker.status === 'BREACHED' ? 'BREACHED ' : ''}{ticket.slaTracker.text}
                </div>

            </div>

        </div>
    );
};

// ========================================================================
// HELPER COMPONENT
// ========================================================================
const FilterTab = ({ label, isActive, onClick, color = 'var(--text-main)' }) => (
    <button onClick={onClick} style={{
        flex: 1, padding: '6px 0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
        background: isActive ? `color-mix(in srgb, ${color} 10%, transparent)` : 'transparent',
        border: `1px solid ${isActive ? `color-mix(in srgb, ${color} 30%, transparent)` : 'transparent'}`,
        color: isActive ? color : 'var(--text-muted)', fontSize: '11px', fontWeight: isActive ? '900' : '700',
        display: 'flex', alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase', letterSpacing: '0.5px'
    }}>
        {label}
    </button>
);

export default OmniInbox;