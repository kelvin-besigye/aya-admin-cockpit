/**
 * 👑 DISPATCH COMM-LINK (Level 5: The Nervous System - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: DispatchCommLink.jsx
 * * DESCRIPTION:
 * A high-performance, dual-pane communication matrix.
 * Handles both 1-on-1 Partner resolutions and Global Fleet Broadcasts.
 * * UPGRADES V2 (MAKER-CHECKER INTEGRATION):
 * - SOS INTERCEPTION: Actively polls the Supabase `partner_requests` vault. 
 * If a 'BREAKDOWN' ticket is detected, it violently overrides the standard 
 * chat UI, placing a critical action card directly in the Admin's line of sight.
 * - ONE-CLICK RESOLUTION: Admins can acknowledge the SOS directly from the chat 
 * interface without needing to navigate to the Resolution Desk.
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
    Radio, MessageSquare, Search, Send, 
    CheckCircle2, Info, AlertTriangle, Clock,
    Loader2, ShieldAlert
} from 'lucide-react';

// IMPORT LEVEL 1 & 2 DEPENDENCIES
import HealthBadge from '../primitives/HealthBadge';
import TierShield from '../primitives/TierShield';
import { partnerService } from '../../data/partner.service';

const DispatchCommLink = ({ 
    activePartnerId = null, 
    partners = [],          
    isLoading = false 
}) => {

    // ========================================================================
    // 1. STATE MANAGEMENT
    // ========================================================================
    const [activeThread, setActiveThread] = useState(activePartnerId || 'GLOBAL');
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    // 🚨 SOS Intercept State
    const [activeSOSAlerts, setActiveSOSAlerts] = useState([]);
    const [isResolvingSOS, setIsResolvingSOS] = useState(false);
    
    const messagesEndRef = useRef(null);

    // ========================================================================
    // 2. LIVE SOS TELEMETRY (The Interceptor)
    // ========================================================================
    const pollSOSTickets = useCallback(async () => {
        // Fetch all pending/processing tickets across the network
        const tickets = await partnerService.getResolutionTickets(null);
        
        // Filter strictly for CRITICAL SOS Breakdowns
        const breakdowns = tickets.filter(t => t.category === 'BREAKDOWN' && t.status !== 'RESOLVED' && t.status !== 'REJECTED');
        setActiveSOSAlerts(breakdowns);
    }, []);

    // Initial fetch and set up a 10-second polling loop for live radar
    useEffect(() => {
        pollSOSTickets();
        const intervalId = setInterval(pollSOSTickets, 10000);
        return () => clearInterval(intervalId);
    }, [pollSOSTickets]);

    // Derived State: Check if the currently active thread has an SOS
    const currentThreadSOS = useMemo(() => {
        if (activeThread === 'GLOBAL') return null;
        return activeSOSAlerts.find(sos => sos.partnerId === activeThread);
    }, [activeSOSAlerts, activeThread]);

    // ========================================================================
    // 3. SOS EXECUTION HANDLER
    // ========================================================================
    const handleSOSAcknowledge = async (ticketId) => {
        setIsResolvingSOS(true);
        
        // Execute the Maker-Checker resolution directly from the chat UI
        const response = await partnerService.resolveSupportTicket(
            ticketId, 
            'PROCESSING', 
            'L9 DISPATCH INTERCEPT: We have received your SOS. Dispatch is reviewing logistics and will respond via comms momentarily.'
        );

        if (response.success) {
            // Re-fetch to clear the alert
            await pollSOSTickets();
            // Optional: You could dynamically inject a chat message here saying "SOS Acknowledged"
        } else {
            console.error("SOS Intercept Failed:", response.error);
        }
        
        setIsResolvingSOS(false);
    };

    // ========================================================================
    // 4. LEGACY CHAT SIMULATOR (To be replaced by live Supabase comms later)
    // ========================================================================
    const [mockDatabase, setMockDatabase] = useState({
        'GLOBAL': [
            { id: 1, type: 'BROADCAST', author: 'L9 COMMAND', text: 'WEATHER ADVISORY: Heavy rainfall detected on Masaka vector. Reduce speed by 15%.', time: '08:00 AM' },
            { id: 2, type: 'BROADCAST', author: 'L9 COMMAND', text: 'SYSTEM: MoWT compliance checks begin next week. Ensure all PSV licenses are uploaded.', time: '09:30 AM' },
        ]
    });

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;

        const newMessage = {
            id: Date.now(),
            type: activeThread === 'GLOBAL' ? 'BROADCAST' : 'DIRECT',
            author: 'L9 DISPATCH',
            text: messageInput.trim(),
            time: new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date())
        };

        setMockDatabase(prev => ({
            ...prev,
            [activeThread]: [...(prev[activeThread] || []), newMessage]
        }));

        setMessageInput('');
    };

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mockDatabase, activeThread]);

    // ========================================================================
    // 5. RENDER ENGINE
    // ========================================================================
    const activeMessages = mockDatabase[activeThread] || [];
    const isGlobal = activeThread === 'GLOBAL';
    const activePartnerObj = partners.find(p => p.id === activeThread);

    return (
        <div className="comm-link-chassis">
            
            {/* =========================================================
                PANE 1: THE NETWORK THREAD ROSTER
            ========================================================= */}
            <div className="thread-pane">
                <div className="thread-header">
                    <h3>Dispatch Frequencies</h3>
                    <div className="search-box">
                        <Search size={14} className="text-muted" />
                        <input 
                            type="text" 
                            placeholder="Search operator callsigns..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="thread-list">
                    {/* GLOBAL BROADCAST CHANNEL */}
                    <button 
                        className={`thread-item global-thread ${activeThread === 'GLOBAL' ? 'active' : ''}`}
                        onClick={() => setActiveThread('GLOBAL')}
                    >
                        <div className="thread-icon-wrapper broadcast-icon">
                            <Radio size={16} />
                        </div>
                        <div className="thread-info">
                            <span className="thread-name">Global Fleet Broadcast</span>
                            <span className="thread-preview">Network-wide push notifications</span>
                        </div>
                        {activeSOSAlerts.length > 0 && (
                            <div className="global-sos-badge">
                                {activeSOSAlerts.length} SOS
                            </div>
                        )}
                    </button>

                    <div className="thread-divider">Active Direct Links</div>

                    {/* PARTNER CHANNELS */}
                    {isLoading ? (
                        <div className="loading-state">Syncing network links...</div>
                    ) : (
                        partners
                        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(partner => {
                            // Check if this specific partner has an active SOS
                            const hasActiveSOS = activeSOSAlerts.some(sos => sos.partnerId === partner.id);

                            return (
                                <button 
                                    key={partner.id}
                                    className={`thread-item ${activeThread === partner.id ? 'active' : ''} ${hasActiveSOS ? 'has-sos' : ''}`}
                                    onClick={() => setActiveThread(partner.id)}
                                >
                                    <div className="thread-icon-wrapper direct-icon">
                                        <MessageSquare size={16} />
                                    </div>
                                    <div className="thread-info">
                                        <span className="thread-name">{partner.code} - {partner.name}</span>
                                        <div className="thread-meta">
                                            <TierShield tierId={partner.metrics?.tier || 'STANDARD'} size="sm" />
                                            <span className="dot-sep">•</span>
                                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>L9 Linked</span>
                                        </div>
                                    </div>
                                    {hasActiveSOS && (
                                        <div className="sos-indicator pulse-sos">
                                            <ShieldAlert size={14} />
                                        </div>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* =========================================================
                PANE 2: THE ACTIVE MATRIX (Chat View)
            ========================================================= */}
            <div className="matrix-pane">
                
                {/* MATRIX HEADER */}
                <div className="matrix-header">
                    <div className="matrix-identity">
                        <div className={`matrix-icon-wrapper ${isGlobal ? 'broadcast-icon' : 'direct-icon'}`}>
                            {isGlobal ? <Radio size={20} /> : <MessageSquare size={20} />}
                        </div>
                        <div className="matrix-titles">
                            <h3>{isGlobal ? 'Global Fleet Broadcast' : `${activePartnerObj?.code || 'P'} - Secure Direct Link`}</h3>
                            <span>{isGlobal ? 'Transmit to all active operators' : activePartnerObj?.name || 'Authorized Partner'}</span>
                        </div>
                    </div>

                    {!isGlobal && activePartnerObj && (
                        <div className="matrix-telemetry">
                            <HealthBadge score={activePartnerObj.metrics?.healthScore || 0} />
                        </div>
                    )}
                </div>

                {/* MATRIX MESSAGE FEED */}
                <div className="matrix-feed">
                    {activeMessages.length === 0 ? (
                        <div className="empty-feed">
                            <Info size={32} className="text-muted" />
                            <p>Secure link established. No recent transmissions.</p>
                        </div>
                    ) : (
                        activeMessages.map(msg => (
                            <div key={msg.id} className={`message-bubble ${msg.author === 'L9 DISPATCH' || msg.author === 'L9 COMMAND' ? 'message-out' : 'message-in'}`}>
                                <div className="message-meta">
                                    <span className="msg-author">{msg.author}</span>
                                    <span className="msg-time">{msg.time}</span>
                                </div>
                                <div className={`message-payload ${msg.type === 'BROADCAST' ? 'payload-broadcast' : ''}`}>
                                    {msg.type === 'BROADCAST' && <Radio size={12} className="broadcast-indicator" />}
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* 🚨 THE OVERRIDE: CRITICAL SOS INTERCEPT CARD */}
                {currentThreadSOS && (
                    <div className="sos-intercept-vault">
                        <div className="sos-intercept-card">
                            <div className="sos-icon-lockup">
                                <AlertTriangle size={32} className="text-danger pulse-sos" />
                            </div>
                            <div className="sos-details">
                                <h4>CRITICAL SOS: FLEET BREAKDOWN</h4>
                                <p>{currentThreadSOS.description}</p>
                                <span className="sos-time"><Clock size={12} /> Logged: {new Date(currentThreadSOS.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className="sos-actions">
                                <button 
                                    className="sos-acknowledge-btn"
                                    onClick={() => handleSOSAcknowledge(currentThreadSOS.ticketId)}
                                    disabled={isResolvingSOS}
                                >
                                    {isResolvingSOS ? <Loader2 size={16} className="ayabus-spin" /> : <ShieldAlert size={16} />}
                                    Acknowledge Intercept
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MATRIX TRANSMISSION CONTROLS */}
                <div className="matrix-input-area">
                    <div className={`input-vault ${isGlobal ? 'vault-broadcast' : 'vault-direct'}`}>
                        <textarea 
                            placeholder={isGlobal ? "Broadcast a network-wide advisory..." : "Transmit direct secure message..."}
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                        <button 
                            className="transmit-btn"
                            disabled={!messageInput.trim()}
                            onClick={handleSendMessage}
                        >
                            <Send size={16} />
                            <span>Transmit</span>
                        </button>
                    </div>
                </div>

            </div>

            {/* ========================================================================
                WORLD-CLASS CSS PHYSICS
            ======================================================================== */}
            <style>{`
                .comm-link-chassis {
                    display: flex; height: calc(100vh - 120px); min-height: 600px;
                    background: var(--bg-surface); border: 1px solid var(--border-subtle);
                    border-radius: 16px; overflow: hidden;
                }

                /* --- PANE 1: THREAD ROSTER --- */
                .thread-pane { width: 340px; flex-shrink: 0; display: flex; flex-direction: column; border-right: 1px solid var(--border-subtle); background: var(--bg-canvas); }
                .thread-header { padding: 20px; border-bottom: 1px solid var(--border-subtle); }
                .thread-header h3 { margin: 0 0 16px 0; font-size: 16px; font-weight: 900; color: var(--text-main); }
                
                .search-box { display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: var(--bg-surface); border: 1px solid var(--border-strong); border-radius: 10px; transition: 0.2s; }
                .search-box:focus-within { border-color: var(--brand-primary); }
                .search-box input { flex: 1; border: none; background: transparent; color: var(--text-main); font-size: 13px; outline: none; }

                .thread-divider { padding: 12px 20px; font-size: 10px; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; background: color-mix(in srgb, var(--bg-surface) 50%, transparent); border-bottom: 1px solid var(--border-subtle); border-top: 1px solid var(--border-subtle); }

                .thread-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; padding: 12px; gap: 4px; }
                .thread-item { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid transparent; border-radius: 12px; background: transparent; cursor: pointer; text-align: left; transition: all 0.2s; }
                .thread-item:hover { background: var(--bg-surface); border-color: var(--border-subtle); }
                .thread-item.active { background: var(--bg-surface); border-color: var(--border-strong); box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
                
                .thread-icon-wrapper { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .broadcast-icon { background: rgba(239, 68, 68, 0.1); color: var(--status-danger); }
                .direct-icon { background: rgba(206, 172, 92, 0.1); color: var(--brand-primary); }

                .thread-info { display: flex; flex-direction: column; gap: 2px; flex: 1; overflow: hidden; }
                .thread-name { font-size: 13px; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .thread-preview { font-size: 11px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .thread-meta { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
                .dot-sep { color: var(--border-strong); font-size: 10px; }

                /* SOS Thread Indicators */
                .global-sos-badge { padding: 4px 8px; background: var(--status-danger); color: #FFF; font-size: 10px; font-weight: 900; border-radius: 100px; }
                .thread-item.has-sos { border-color: rgba(239, 68, 68, 0.3); background: linear-gradient(90deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%); }
                .sos-indicator { color: var(--status-danger); display: flex; align-items: center; justify-content: center; }

                /* --- PANE 2: THE MATRIX --- */
                .matrix-pane { flex: 1; display: flex; flex-direction: column; background: var(--bg-surface); position: relative; }
                
                .matrix-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border-subtle); background: var(--bg-canvas); }
                .matrix-identity { display: flex; align-items: center; gap: 16px; }
                .matrix-icon-wrapper { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .matrix-titles { display: flex; flex-direction: column; gap: 2px; }
                .matrix-titles h3 { margin: 0; font-size: 16px; font-weight: 900; color: var(--text-main); }
                .matrix-titles span { font-size: 12px; font-weight: 700; color: var(--text-muted); }

                /* Feed */
                .matrix-feed { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
                .empty-feed { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--text-muted); }
                .empty-feed p { margin-top: 12px; font-size: 13px; }

                .message-bubble { display: flex; flex-direction: column; max-width: 75%; }
                .message-in { align-self: flex-start; }
                .message-out { align-self: flex-end; }
                
                .message-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; padding: 0 4px; }
                .message-out .message-meta { justify-content: flex-end; }
                .msg-author { font-size: 10px; font-weight: 900; color: var(--text-main); text-transform: uppercase; }
                .msg-time { font-size: 9px; font-weight: 700; color: var(--text-muted); font-family: monospace; }

                .message-payload { padding: 14px 18px; border-radius: 16px; font-size: 14px; font-weight: 600; line-height: 1.5; }
                .message-in .message-payload { background: var(--bg-canvas); border: 1px solid var(--border-subtle); color: var(--text-main); border-top-left-radius: 4px; }
                .message-out .message-payload { background: var(--brand-primary); color: #FFF; border-top-right-radius: 4px; box-shadow: 0 4px 12px rgba(206, 172, 92, 0.2); }
                
                .payload-broadcast { background: var(--status-danger) !important; color: #FFF !important; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2) !important; border-top-right-radius: 4px; display: flex; gap: 8px; align-items: flex-start; }
                .payload-broadcast p { margin: 0; }
                .broadcast-indicator { margin-top: 4px; flex-shrink: 0; animation: pulseSos 2s infinite; }

                /* --- 🚨 SOS INTERCEPT OVERRIDE --- */
                .sos-intercept-vault {
                    position: absolute; bottom: 84px; left: 24px; right: 24px; z-index: 50;
                    animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .sos-intercept-card {
                    display: flex; align-items: center; gap: 20px; padding: 20px 24px;
                    background: var(--bg-surface); border: 2px solid var(--status-danger);
                    border-radius: 16px; box-shadow: 0 16px 40px rgba(0,0,0,0.2), 0 0 0 4px rgba(239, 68, 68, 0.1);
                }
                .sos-icon-lockup { width: 48px; height: 48px; border-radius: 12px; background: rgba(239, 68, 68, 0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .sos-details { flex: 1; display: flex; flex-direction: column; gap: 4px; }
                .sos-details h4 { margin: 0; font-size: 14px; font-weight: 900; color: var(--status-danger); letter-spacing: 0.5px; }
                .sos-details p { margin: 0; font-size: 13px; color: var(--text-main); font-weight: 600; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .sos-time { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: var(--text-muted); margin-top: 4px; }
                
                .sos-actions { flex-shrink: 0; }
                .sos-acknowledge-btn {
                    display: flex; align-items: center; gap: 8px; padding: 12px 20px;
                    background: var(--status-danger); color: #FFF; border: none; border-radius: 10px;
                    font-size: 13px; font-weight: 900; cursor: pointer; transition: 0.2s;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }
                .sos-acknowledge-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4); }
                .sos-acknowledge-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

                /* Controls */
                .matrix-input-area { padding: 20px 24px; background: var(--bg-canvas); border-top: 1px solid var(--border-subtle); z-index: 10; }
                .input-vault { display: flex; align-items: flex-end; gap: 16px; padding: 12px 16px; background: var(--bg-input); border-radius: 16px; border: 1px solid var(--border-subtle); transition: 0.2s; }
                .input-vault:focus-within { border-color: var(--border-strong); box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
                .vault-broadcast:focus-within { border-color: var(--status-danger); box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
                .vault-direct:focus-within { border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(206, 172, 92, 0.1); }
                
                .input-vault textarea {
                    flex: 1; background: transparent; border: none; outline: none; resize: none;
                    height: 44px; max-height: 120px; font-size: 14px; color: var(--text-main);
                    font-weight: 600; font-family: inherit; padding-top: 12px; line-height: 1.5;
                }
                
                .transmit-btn {
                    display: flex; align-items: center; gap: 8px; padding: 12px 20px;
                    border-radius: 12px; border: none; cursor: pointer; font-size: 13px; font-weight: 900;
                    color: #FFF; transition: all 0.2s; height: 44px;
                }
                .vault-direct .transmit-btn { background: var(--brand-primary); box-shadow: 0 4px 12px rgba(206, 172, 92, 0.3); }
                .vault-direct .transmit-btn:hover:not(:disabled) { background: color-mix(in srgb, var(--brand-primary) 80%, black); transform: translateY(-2px); }
                
                .vault-broadcast .transmit-btn { background: var(--status-danger); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
                .vault-broadcast .transmit-btn:hover:not(:disabled) { background: #DC2626; transform: translateY(-2px); }
                
                .transmit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

                /* Utils */
                .text-muted { color: var(--text-muted); }
                .text-danger { color: var(--status-danger); }
                .ayabus-spin { animation: spin 1s linear infinite; }
                .pulse-sos { animation: pulseSos 1.5s infinite; }
                .loading-state { padding: 20px; text-align: center; color: var(--text-muted); font-size: 12px; font-weight: 700; }
                
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes pulseSos { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
                @keyframes slideUpFade { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

                /* Custom Scrollbar */
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default DispatchCommLink;