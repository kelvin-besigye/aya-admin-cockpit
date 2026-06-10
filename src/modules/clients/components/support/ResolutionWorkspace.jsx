import React, { useState, useEffect, useRef } from 'react';
import { 
    Send, Paperclip, CheckCircle2, AlertTriangle, 
    Banknote, ShieldCheck, Clock, MessageSquare, 
    MoreVertical, Wallet, RefreshCcw, Smartphone
} from 'lucide-react';

// IMPORT LEVEL 1 & 2 DEPENDENCIES
import { AGENT_REFUND_LIMITS } from '../../data/clients.constants';
import SentimentTag from '../primitives/SentimentTag';

/**
 * 👑 RESOLUTION WORKSPACE (Level 5: Support Helpdesk - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: ResolutionWorkspace.jsx
 * * DESCRIPTION:
 * The central chat and resolution interface. Features omnichannel timeline
 * rendering and the 1-Click Treasury Reversal engine for instant capital deployment.
 * * UPGRADES:
 * - Treasury Bridge: Integrated refund UI directly inside the chat composer.
 * - System Audit Trail: Renders automated bot actions and financial logs inline.
 * - Auto-Scroll Physics: Always snaps to the newest message seamlessly.
 */

// Local formatter to guarantee zero compilation crashes
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0);
};

const ResolutionWorkspace = ({ activeTicket }) => {
    // ========================================================================
    // 1. STATE MANAGEMENT
    // ========================================================================
    const [replyText, setReplyText] = useState('');
    const [isTreasuryOpen, setIsTreasuryOpen] = useState(false);
    const scrollRef = useRef(null);

    // ========================================================================
    // 2. AUTO-SCROLL PHYSICS
    // ========================================================================
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeTicket]);

    // ========================================================================
    // 3. RENDER ENGINE (Empty State)
    // ========================================================================
    if (!activeTicket) {
        return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)', color: 'var(--text-muted)' }}>
                <MessageSquare size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)' }}>No Active Thread</h3>
                <p style={{ fontSize: '13px', fontWeight: '600', maxWidth: '300px', textAlign: 'center' }}>Select a ticket from the Omni-Queue to begin resolution and telemetry tracking.</p>
            </div>
        );
    }

    const { passenger, urgency, slaTracker, messages } = activeTicket;

    // ========================================================================
    // 4. RENDER ENGINE (Active Workspace)
    // ========================================================================
    return (
        <div style={{ 
            flex: 1, display: 'flex', flexDirection: 'column', 
            background: 'var(--bg-surface)', position: 'relative',
            minWidth: '400px' // Anti-squish lock
        }}>
            
            {/* === A. THE STICKY CONTEXT HEADER === */}
            <div style={{ 
                padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', 
                background: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)', backdropFilter: 'blur(12px)',
                position: 'sticky', top: 0, zIndex: 20, display: 'flex', flexDirection: 'column', gap: '16px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                            <span style={{ color: urgency.color }}>{urgency.shortLabel}</span>
                            <span>•</span>
                            <span>{activeTicket.id}</span>
                            <span>•</span>
                            <span style={{ color: 'var(--text-main)' }}>{activeTicket.channel.replace('_', ' ')}</span>
                        </div>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px', lineHeight: '1.3' }}>
                            {activeTicket.subject}
                        </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Status Toggle */}
                        <div style={{ 
                            display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '100px',
                            background: activeTicket.status === 'OPEN' ? 'color-mix(in srgb, var(--status-warning) 15%, transparent)' : 'color-mix(in srgb, var(--status-success) 15%, transparent)',
                            color: activeTicket.status === 'OPEN' ? 'var(--status-warning)' : 'var(--status-success)',
                            fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px'
                        }}>
                            {activeTicket.status === 'OPEN' ? <AlertTriangle size={14} strokeWidth={2.5}/> : <CheckCircle2 size={14} strokeWidth={2.5}/>}
                            {activeTicket.status.replace('_', ' ')}
                        </div>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>

                {/* AI Sentiment Analysis Readout */}
                {activeTicket.sentiment?.isFlagged && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '8px', background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                        <ShieldCheck size={16} color="var(--brand-accent)" />
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>AI Systems flagged this thread for:</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {activeTicket.sentiment.tags.map(tag => <SentimentTag key={tag} tag={tag} size="sm" />)}
                        </div>
                    </div>
                )}
            </div>

            {/* === B. THE OMNICHANNEL TIMELINE === */}
            <div ref={scrollRef} className="ayabus-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg} passengerName={passenger.name} />
                ))}
            </div>

            {/* === C. THE TREASURY & COMPOSER ENGINE === */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-canvas)', position: 'relative' }}>
                
                {/* 1-Click Treasury Reversal Panel (Slide Up) */}
                {isTreasuryOpen && (
                    <div style={{ 
                        padding: '24px 32px', background: 'color-mix(in srgb, var(--brand-primary) 5%, transparent)',
                        borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '16px',
                        animation: 'slideUp 0.2s ease-out'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-primary)' }}>
                                <Banknote size={18} strokeWidth={2.5} />
                                <span style={{ fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Capital Deployment Engine</span>
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>L9 Authorization Active</span>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <TreasuryAction 
                                icon={Wallet} title="100% Wallet Refund" subtitle="Instant Credit (UGX 45,000)" 
                                color="var(--brand-primary)" onClick={() => setIsTreasuryOpen(false)} 
                            />
                            <TreasuryAction 
                                icon={RefreshCcw} title="MoMo Reversal" subtitle="T+1 Settlement (UGX 45,000)" 
                                color="var(--status-warning)" onClick={() => setIsTreasuryOpen(false)} 
                            />
                            <TreasuryAction 
                                icon={Banknote} title="Courtesy Credit" subtitle="Custom Amount (+ UGX 10,000)" 
                                color="var(--status-success)" onClick={() => setIsTreasuryOpen(false)} 
                            />
                        </div>
                    </div>
                )}

                {/* The Chat Composer */}
                <div style={{ padding: '24px 32px' }}>
                    <div style={{ 
                        background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)',
                        padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '12px',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                        <textarea 
                            placeholder={`Reply to ${passenger.name} or type / for macros...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            style={{ 
                                width: '100%', background: 'transparent', border: 'none', outline: 'none', 
                                resize: 'none', height: '60px', fontSize: '14px', color: 'var(--text-main)', 
                                fontWeight: '600', fontFamily: 'inherit', lineHeight: '1.5'
                            }}
                        />
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                                    <Paperclip size={18} />
                                </button>
                                
                                {/* The Treasury Toggle Button */}
                                {urgency.requiresL9 && (
                                    <button 
                                        onClick={() => setIsTreasuryOpen(!isTreasuryOpen)}
                                        style={{ 
                                            display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', 
                                            borderRadius: '8px', border: `1px solid ${isTreasuryOpen ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                                            background: isTreasuryOpen ? 'color-mix(in srgb, var(--brand-primary) 10%, transparent)' : 'transparent',
                                            color: isTreasuryOpen ? 'var(--brand-primary)' : 'var(--text-muted)',
                                            fontSize: '11px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Banknote size={14} /> {isTreasuryOpen ? 'Close Treasury' : 'Access Treasury'}
                                    </button>
                                )}
                            </div>

                            <button style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', 
                                background: replyText.trim() ? 'var(--brand-primary)' : 'var(--bg-input)', 
                                color: replyText.trim() ? '#fff' : 'var(--text-muted)', 
                                borderRadius: '10px', border: 'none', cursor: replyText.trim() ? 'pointer' : 'not-allowed', 
                                fontSize: '13px', fontWeight: '900', transition: 'all 0.2s ease',
                                boxShadow: replyText.trim() ? '0 4px 12px color-mix(in srgb, var(--brand-primary) 40%, transparent)' : 'none'
                            }}>
                                <Send size={16} strokeWidth={2.5} /> Send Reply
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Micro-Animations */}
            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

// ========================================================================
// SUB-COMPONENTS
// ========================================================================

const ChatMessage = ({ message, passengerName }) => {
    const isClient = message.sender === 'CLIENT';
    const isSystem = message.sender === 'SYSTEM';
    
    // System Log Alignment (Centered Audit Trail)
    if (isSystem) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px',
                    background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)',
                    fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)'
                }}>
                    <ShieldCheck size={14} />
                    {message.text}
                    <span style={{ fontFamily: 'monospace', marginLeft: '8px' }}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        );
    }

    // Client/Agent Chat Bubbles
    return (
        <div style={{ 
            display: 'flex', flexDirection: 'column', gap: '4px',
            alignItems: isClient ? 'flex-start' : 'flex-end',
            width: '100%'
        }}>
            {/* Sender Identification */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>
                    {isClient ? passengerName : 'AyaBus Support (L9)'}
                </span>
                <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {/* The Bubble */}
            <div style={{ 
                maxWidth: '80%', padding: '16px 20px', borderRadius: '16px',
                borderTopLeftRadius: isClient ? '4px' : '16px',
                borderTopRightRadius: isClient ? '16px' : '4px',
                background: isClient ? 'var(--bg-input)' : 'color-mix(in srgb, var(--brand-primary) 10%, transparent)',
                border: `1px solid ${isClient ? 'var(--border-subtle)' : 'color-mix(in srgb, var(--brand-primary) 20%, transparent)'}`,
                color: isClient ? 'var(--text-main)' : 'var(--brand-primary)',
                fontSize: '14px', fontWeight: '600', lineHeight: '1.6'
            }}>
                {message.text}
            </div>
        </div>
    );
};

const TreasuryAction = ({ icon: Icon, title, subtitle, color, onClick }) => (
    <button 
        onClick={onClick}
        style={{
            flex: 1, padding: '16px', borderRadius: '12px', background: 'var(--bg-surface)',
            border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px',
            transition: 'all 0.2s ease', textAlign: 'left'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `color-mix(in srgb, ${color} 5%, transparent)`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: `color-mix(in srgb, ${color} 15%, transparent)`, color: color }}>
            <Icon size={16} strokeWidth={2.5} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>{title}</span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>{subtitle}</span>
        </div>
    </button>
);

export default ResolutionWorkspace;