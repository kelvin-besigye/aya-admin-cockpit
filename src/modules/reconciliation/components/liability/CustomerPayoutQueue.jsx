import React, { useState } from 'react';
import { Search, Ticket, MapPin, Clock, ChevronRight, AlertCircle, User } from 'lucide-react';

/**
 * 👑 AYABUS CUSTOMER PAYOUT QUEUE (Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Reconciliation & Debt
 * File: CustomerPayoutQueue.jsx
 * * DESCRIPTION:
 * The Left-Panel Triage feed. Displays all tickets marked as 
 * 'CANCELLATION_REQUESTED'. Acts as the selection engine that feeds
 * data into the Physics Engine and the Right-Panel Action Vault.
 */

const CustomerPayoutQueue = ({ 
    tickets = [], 
    selectedTicket, 
    onSelectTicket, 
    isLoading = false 
}) => {
    // Local Search State for rapid triage filtering
    const [searchTerm, setSearchTerm] = useState('');

    // --- FILTER ENGINE ---
    const filteredTickets = tickets.filter(ticket => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (ticket.passenger_name || '').toLowerCase().includes(searchLower) ||
            (ticket.ticket_hash || '').toLowerCase().includes(searchLower)
        );
    });

    // --- SKELETON LOADER ---
    if (isLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '24px', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ height: '24px', width: '150px', background: 'var(--bg-input)', borderRadius: '4px', animation: 'pulse 1.5s infinite', opacity: 0.5, marginBottom: '16px' }} />
                    <div style={{ height: '40px', width: '100%', background: 'var(--bg-input)', borderRadius: '12px', animation: 'pulse 1.5s infinite', opacity: 0.5 }} />
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ height: '100px', width: '100%', background: 'var(--bg-input)', borderRadius: '16px', animation: 'pulse 1.5s infinite', opacity: 0.3 }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%', // Inherits flex: 1 from parent 60/40 grid
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '24px', 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
            
            {/* =========================================================
                HEADER & SEARCH ZONE
                ========================================================= */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                            Triage Queue
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                            {tickets.length} Actionable Cancellations
                        </p>
                    </div>
                    {/* Visual Pulse for actionable items */}
                    {tickets.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-danger)', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
                            <div style={{ width: '6px', height: '6px', background: 'var(--status-danger)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                            ACTION REQUIRED
                        </div>
                    )}
                </div>

                {/* SEARCH INPUT */}
                <div style={{ position: 'relative' }}>
                    <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                        type="text" 
                        placeholder="Search by passenger name or ticket ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ 
                            width: '100%', padding: '14px 16px 14px 44px', 
                            background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', 
                            borderRadius: '12px', color: 'var(--text-main)', fontSize: '13px', 
                            fontWeight: '600', outline: 'none', transition: 'all 0.2s ease' 
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                </div>
            </div>

            {/* =========================================================
                SCROLLABLE LIST ZONE
                ========================================================= */}
            <div className="ayabus-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-canvas)' }}>
                
                {filteredTickets.length === 0 ? (
                    /* EMPTY STATE */
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'var(--bg-surface)', border: '1px dashed var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                            <AlertCircle size={28} color="var(--border-subtle)" />
                        </div>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>Queue is Clear</h4>
                        <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', maxWidth: '250px' }}>There are no pending cancellations requiring your attention at this time.</p>
                    </div>
                ) : (
                    /* TICKETS FEED */
                    filteredTickets.map((ticket) => {
                        const isSelected = selectedTicket?.id === ticket.id;
                        
                        // Failsafe extraction for deep nested data
                        const origin = ticket.routes?.origin_city || ticket.meta?.origin || 'Unknown Origin';
                        const destination = ticket.routes?.destination_city || ticket.meta?.destination || 'Unknown Destination';
                        
                        return (
                            <div 
                                key={ticket.id}
                                onClick={() => onSelectTicket(ticket)}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '20px', cursor: 'pointer', borderRadius: '16px',
                                    background: isSelected ? 'var(--brand-surface)' : 'var(--bg-surface)',
                                    border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                                    boxShadow: isSelected ? '0 8px 20px var(--brand-subtle)' : 'none',
                                    transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                    position: 'relative', overflow: 'hidden'
                                }}
                            >
                                {/* Active State Blue Indicator Bar */}
                                {isSelected && (
                                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--brand-primary)' }} />
                                )}

                                {/* Left: Passenger & Route Data */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isSelected ? 'var(--brand-primary)' : 'var(--bg-input)', color: isSelected ? '#FFF' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                                        <User size={20} />
                                    </div>
                                    
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>{ticket.passenger_name || 'Unknown Passenger'}</span>
                                            <span style={{ fontSize: '11px', background: 'var(--bg-input)', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: '6px', fontFamily: 'monospace', fontWeight: '700' }}>
                                                {ticket.ticket_hash}
                                            </span>
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <MapPin size={12} /> {origin} ➜ {destination}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={12} /> Departs: {ticket.travel_date || 'N/A'} {ticket.departure_time || ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Action Chevron */}
                                <div style={{ 
                                    width: '32px', height: '32px', borderRadius: '50%', 
                                    background: isSelected ? 'var(--brand-primary)' : 'transparent', 
                                    color: isSelected ? '#FFF' : 'var(--border-subtle)', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s', transform: isSelected ? 'translateX(0)' : 'translateX(-4px)'
                                }}>
                                    <ChevronRight size={18} strokeWidth={isSelected ? 3 : 2} />
                                </div>

                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CustomerPayoutQueue;