/**
 * 👑 RESOLUTION DESK (Level 5: The Triage & Compliance Hub - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: ResolutionDesk.jsx
 * * DESCRIPTION:
 * The apex "Checker" workspace for the Maker-Checker support workflow.
 * Admins use this interface to review Partner requests (Routes, Fleet, Breakdowns),
 * inspect attached regulatory documents, and officially approve or decline them.
 * * WORLD-CLASS PHYSICS:
 * 1. LIVE SUPABASE HYDRATION: Automatically fetches pending and processing 
 * tickets from the `partner_requests` vault via `partner.service.js`.
 * 2. THE DOCUMENT INJECTOR: Dynamically detects `documentUrl` and renders 
 * a secure "View Attached Document" portal for physical verification.
 * 3. ATOMIC EXECUTION: The dual-action execution footer (Approve vs Reject) 
 * instantly mutates the database and beams the `adminResponse` back to the 
 * Partner Portal's Active Tickets Board.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, Filter, ShieldAlert, CheckCircle2, 
    AlertTriangle, Clock, MessageSquare, Paperclip,
    FileText, Loader2, XCircle, Check
} from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { partnerService } from '../../data/partner.service';
import { RESOLUTION_CATEGORIES, TICKET_STATUSES } from '../../data/partner.constants';

const ResolutionDesk = ({ partner }) => {

    // ========================================================================
    // 1. STATE MANAGEMENT
    // ========================================================================
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL');
    
    // Workspace State
    const [activeTicket, setActiveTicket] = useState(null);
    const [adminResponse, setAdminResponse] = useState('');
    const [isResolving, setIsResolving] = useState(false);
    const [resolutionSuccess, setResolutionSuccess] = useState(false);

    // ========================================================================
    // 2. LIVE DATA SYNCHRONIZATION
    // ========================================================================
    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        // If `partner` is passed, it only fetches for that specific partner.
        // If null, it fetches the global queue.
        const data = await partnerService.getResolutionTickets(partner?.id);
        setTickets(data || []);
        setIsLoading(false);
    }, [partner?.id]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    // Format EAT Timestamp
    const formatTime = (isoString) => {
        if (!isoString) return '';
        return new Intl.DateTimeFormat('en-GB', { 
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        }).format(new Date(isoString));
    };

    // ========================================================================
    // 3. THE EXECUTION ENGINE (Maker-Checker Authorization)
    // ========================================================================
    const handleResolution = async (finalStatus) => {
        if (!activeTicket || !adminResponse.trim()) return;

        setIsResolving(true);

        const response = await partnerService.resolveSupportTicket(
            activeTicket.ticketId, 
            finalStatus, 
            adminResponse.trim()
        );

        if (response.success) {
            setResolutionSuccess(true);
            
            // Remove the ticket from the local queue so the Admin can move to the next one
            setTickets(prev => prev.filter(t => t.ticketId !== activeTicket.ticketId));

            // Auto-close workspace after showing the success state
            setTimeout(() => {
                setResolutionSuccess(false);
                setActiveTicket(null);
                setAdminResponse('');
                setIsResolving(false);
            }, 2000);
        } else {
            console.error("Resolution Failed:", response.error);
            setIsResolving(false);
        }
    };

    // ========================================================================
    // 4. KINETIC FILTERING
    // ========================================================================
    const filteredTickets = tickets.filter(ticket => {
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'CRITICAL') return ticket.priority === 'CRITICAL';
        return ticket.category === activeFilter;
    });

    // ========================================================================
    // 5. RENDER ENGINE
    // ========================================================================
    return (
        <div className="resolution-desk-chassis">
            
            {/* =========================================================
                PANE 1: THE DISPATCH QUEUE
            ========================================================= */}
            <div className="queue-pane">
                <div className="pane-header">
                    <div className="header-titles">
                        <h3>Operational Queue</h3>
                        <span>{filteredTickets.length} Actionable Requests</span>
                    </div>
                    <div className="search-box">
                        <Search size={14} className="text-muted" />
                        <input type="text" placeholder="Search ticket ID..." />
                    </div>
                </div>

                <div className="filter-ribbon">
                    <button className={`filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`} onClick={() => setActiveFilter('ALL')}>All</button>
                    <button className={`filter-btn ${activeFilter === 'CRITICAL' ? 'active' : ''}`} onClick={() => setActiveFilter('CRITICAL')}>SOS Alerts</button>
                    <button className={`filter-btn ${activeFilter === 'ROUTE_ADD' ? 'active' : ''}`} onClick={() => setActiveFilter('ROUTE_ADD')}>Routes</button>
                    <button className={`filter-btn ${activeFilter === 'FLEET_ADD' ? 'active' : ''}`} onClick={() => setActiveFilter('FLEET_ADD')}>Fleet</button>
                </div>

                <div className="ticket-list">
                    {isLoading ? (
                        <div className="loading-state"><Loader2 size={24} className="ayabus-spin text-brand" /></div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="empty-state">
                            <ShieldAlert size={32} className="text-muted" />
                            <p>Queue is empty. Operations are nominal.</p>
                        </div>
                    ) : (
                        filteredTickets.map(ticket => {
                            const isActive = activeTicket?.ticketId === ticket.ticketId;
                            const catConfig = RESOLUTION_CATEGORIES[ticket.category] || RESOLUTION_CATEGORIES['GENERAL'];
                            const isCritical = ticket.priority === 'CRITICAL';

                            return (
                                <div 
                                    key={ticket.ticketId} 
                                    className={`ticket-card ${isActive ? 'active' : ''} ${isCritical ? 'critical-pulse' : ''}`}
                                    onClick={() => {
                                        setActiveTicket(ticket);
                                        setAdminResponse(''); // Reset form
                                        setResolutionSuccess(false);
                                    }}
                                >
                                    <div className="ticket-card-header">
                                        <div className="category-badge" style={{ backgroundColor: `color-mix(in srgb, ${catConfig.color} 10%, transparent)`, color: catConfig.color }}>
                                            {catConfig.label}
                                        </div>
                                        <span className="time-meta">{formatTime(ticket.date)}</span>
                                    </div>
                                    <div className="ticket-card-body">
                                        <span className="ticket-id">{ticket.ticketId.split('-')[0]}-{ticket.ticketId.substring(0, 8)}</span>
                                        <p className="ticket-preview">{ticket.description}</p>
                                    </div>
                                    {isCritical && (
                                        <div className="critical-warning-bar">
                                            <AlertTriangle size={12} /> IMMEDIATE ACTION REQUIRED
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* =========================================================
                PANE 2: THE MAKER-CHECKER WORKSPACE
            ========================================================= */}
            <div className="workspace-pane">
                {!activeTicket ? (
                    <div className="workspace-empty">
                        <FileText size={48} className="text-muted" strokeWidth={1} />
                        <h3>Select a Request</h3>
                        <p>Open a ticket from the queue to review and execute resolution.</p>
                    </div>
                ) : resolutionSuccess ? (
                    <div className="workspace-success">
                        <div className="success-ring"><CheckCircle2 size={48} /></div>
                        <h2>Resolution Executed</h2>
                        <p>The partner's dashboard has been instantly updated with your authorization.</p>
                    </div>
                ) : (
                    <div className="workspace-active">
                        
                        {/* 1. Request Context Header */}
                        <div className="workspace-header">
                            <div className="context-tags">
                                <span className="id-tag">TCK-{activeTicket.ticketId.substring(0,8)}</span>
                                <span className="status-tag processing">In Review</span>
                            </div>
                            <h2>{RESOLUTION_CATEGORIES[activeTicket.category]?.label || 'Partner Request'}</h2>
                            <div className="meta-row">
                                <Clock size={14} className="text-muted" />
                                <span>Submitted: {formatTime(activeTicket.date)}</span>
                            </div>
                        </div>

                        {/* 2. The Partner Payload */}
                        <div className="workspace-payload">
                            <h4 className="section-title">Partner Description</h4>
                            <div className="payload-box">
                                <p>{activeTicket.description}</p>
                            </div>

                            {/* 🚀 THE DOCUMENT VIEWER INJECTION */}
                            {activeTicket.documentUrl && (
                                <div className="document-vault-section">
                                    <h4 className="section-title">Attached Regulatory Documents</h4>
                                    <a 
                                        href={activeTicket.documentUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="document-viewer-btn"
                                    >
                                        <div className="doc-icon"><Paperclip size={18} /></div>
                                        <div className="doc-text">
                                            <span className="doc-title">View Official Attachment</span>
                                            <span className="doc-meta">Opens in secure external viewer</span>
                                        </div>
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* 3. The Resolution Execution Form */}
                        <div className="workspace-execution">
                            <h4 className="section-title">L9 Dispatch Resolution</h4>
                            
                            <div className="execution-form">
                                <label className="form-label">
                                    <MessageSquare size={14} />
                                    <span>Official Response (Partner will see this)</span>
                                </label>
                                <textarea 
                                    className="execution-textarea"
                                    placeholder="Enter your authorization notes, reasons for rejection, or further instructions..."
                                    value={adminResponse}
                                    onChange={(e) => setAdminResponse(e.target.value)}
                                    disabled={isResolving}
                                />
                            </div>

                            <div className="execution-actions">
                                <button 
                                    className="reject-btn"
                                    disabled={!adminResponse.trim() || isResolving}
                                    onClick={() => handleResolution('REJECTED')}
                                >
                                    {isResolving ? <Loader2 size={16} className="ayabus-spin" /> : <XCircle size={16} />}
                                    Decline Request
                                </button>
                                
                                <button 
                                    className="approve-btn"
                                    disabled={!adminResponse.trim() || isResolving}
                                    onClick={() => handleResolution('RESOLVED')}
                                >
                                    {isResolving ? <Loader2 size={16} className="ayabus-spin" /> : <Check size={16} strokeWidth={3} />}
                                    Approve & Resolve
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* ========================================================================
                WORLD-CLASS CSS PHYSICS
            ======================================================================== */}
            <style>{`
                .resolution-desk-chassis {
                    display: flex; height: calc(100vh - 120px); min-height: 600px;
                    background: var(--bg-surface); border: 1px solid var(--border-subtle);
                    border-radius: 16px; overflow: hidden;
                }

                /* --- PANE 1: QUEUE --- */
                .queue-pane {
                    width: 380px; flex-shrink: 0; display: flex; flex-direction: column;
                    border-right: 1px solid var(--border-subtle); background: var(--bg-canvas);
                }
                .pane-header { padding: 20px; border-bottom: 1px solid var(--border-subtle); }
                .header-titles h3 { margin: 0 0 4px 0; font-size: 16px; font-weight: 900; color: var(--text-main); }
                .header-titles span { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
                
                .search-box {
                    display: flex; align-items: center; gap: 8px; margin-top: 16px;
                    padding: 10px 12px; background: var(--bg-surface); border: 1px solid var(--border-strong);
                    border-radius: 10px; transition: border-color 0.2s;
                }
                .search-box:focus-within { border-color: var(--brand-primary); }
                .search-box input { flex: 1; border: none; background: transparent; color: var(--text-main); font-size: 13px; font-weight: 600; outline: none; }

                .filter-ribbon { display: flex; gap: 8px; padding: 12px 20px; overflow-x: auto; border-bottom: 1px solid var(--border-subtle); }
                .filter-ribbon::-webkit-scrollbar { display: none; }
                .filter-btn { padding: 6px 12px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 100px; font-size: 11px; font-weight: 800; color: var(--text-muted); cursor: pointer; white-space: nowrap; transition: 0.2s; }
                .filter-btn:hover, .filter-btn.active { background: var(--text-main); color: var(--bg-surface); border-color: var(--text-main); }

                /* Queue Tickets */
                .ticket-list { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
                .ticket-card {
                    padding: 16px; background: var(--bg-surface); border: 1px solid var(--border-subtle);
                    border-radius: 12px; cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .ticket-card:hover { border-color: var(--border-strong); transform: translateY(-1px); }
                .ticket-card.active { border-color: var(--brand-primary); background: color-mix(in srgb, var(--brand-primary) 5%, transparent); box-shadow: 0 4px 12px rgba(206,172,92,0.1); }
                
                .ticket-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
                .category-badge { padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; }
                .time-meta { font-size: 11px; font-weight: 700; color: var(--text-muted); }
                
                .ticket-id { font-family: monospace; font-size: 12px; font-weight: 800; color: var(--text-main); display: block; margin-bottom: 4px; }
                .ticket-preview { margin: 0; font-size: 13px; color: var(--text-muted); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                
                .critical-pulse { border-color: rgba(239, 68, 68, 0.4); }
                .critical-warning-bar { margin-top: 12px; padding: 6px; background: rgba(239, 68, 68, 0.1); color: var(--status-danger); font-size: 10px; font-weight: 900; text-transform: uppercase; border-radius: 6px; display: flex; align-items: center; gap: 6px; justify-content: center; }

                /* --- PANE 2: WORKSPACE --- */
                .workspace-pane { flex: 1; display: flex; flex-direction: column; background: var(--bg-surface); position: relative; overflow-y: auto; }
                
                /* Empty / Success States */
                .workspace-empty, .workspace-success { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--text-muted); animation: fadeIn 0.4s ease; }
                .workspace-empty h3 { color: var(--text-main); margin: 16px 0 8px 0; }
                .workspace-success h2 { color: var(--text-main); margin: 0 0 12px 0; }
                .success-ring { width: 80px; height: 80px; border-radius: 50%; background: rgba(34, 197, 94, 0.1); border: 2px solid var(--status-success); color: var(--status-success); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }

                /* Active Workspace */
                .workspace-active { display: flex; flex-direction: column; height: 100%; animation: fadeIn 0.3s ease; }
                
                .workspace-header { padding: 32px 40px; border-bottom: 1px solid var(--border-subtle); background: var(--bg-canvas); }
                .context-tags { display: flex; gap: 12px; margin-bottom: 16px; }
                .id-tag { font-family: monospace; font-size: 12px; font-weight: 800; color: var(--text-muted); background: var(--bg-input); padding: 4px 8px; border-radius: 6px; }
                .status-tag { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 100px; }
                .status-tag.processing { background: rgba(206, 172, 92, 0.1); color: var(--brand-primary); }
                .workspace-header h2 { margin: 0 0 12px 0; font-size: 24px; font-weight: 900; color: var(--text-main); letter-spacing: -0.5px; }
                .meta-row { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-muted); }

                .workspace-payload { padding: 32px 40px; flex: 1; display: flex; flex-direction: column; gap: 24px; }
                .section-title { margin: 0 0 12px 0; font-size: 12px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
                
                .payload-box { padding: 20px; background: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: 12px; }
                .payload-box p { margin: 0; font-size: 15px; color: var(--text-main); line-height: 1.6; white-space: pre-wrap; }

                /* Document Injector */
                .document-viewer-btn {
                    display: flex; align-items: center; gap: 16px; padding: 16px 20px;
                    background: var(--bg-canvas); border: 1px solid var(--brand-primary);
                    border-radius: 12px; text-decoration: none; cursor: pointer;
                    transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(206,172,92,0.05);
                }
                .document-viewer-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(206,172,92,0.1); background: color-mix(in srgb, var(--brand-primary) 5%, transparent); }
                .doc-icon { width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, var(--brand-primary) 10%, transparent); color: var(--brand-primary); display: flex; align-items: center; justify-content: center; }
                .doc-text { display: flex; flex-direction: column; gap: 2px; }
                .doc-title { font-size: 14px; font-weight: 800; color: var(--text-main); }
                .doc-meta { font-size: 12px; font-weight: 600; color: var(--text-muted); }

                /* Execution Form */
                .workspace-execution { padding: 32px 40px; border-top: 1px solid var(--border-subtle); background: var(--bg-canvas); }
                .form-label { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 13px; font-weight: 800; color: var(--text-main); }
                
                .execution-textarea {
                    width: 100%; min-height: 120px; padding: 16px; background: var(--bg-surface);
                    border: 1px solid var(--border-strong); border-radius: 12px; margin-bottom: 24px;
                    color: var(--text-main); font-size: 14px; font-weight: 600; font-family: inherit;
                    resize: vertical; transition: 0.2s; line-height: 1.5;
                }
                .execution-textarea:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(206,172,92,0.1); }

                .execution-actions { display: flex; gap: 16px; }
                .execution-actions button {
                    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
                    padding: 16px; border: none; border-radius: 12px; font-size: 14px; font-weight: 900;
                    cursor: pointer; transition: all 0.2s ease; color: #FFF;
                }
                .execution-actions button:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
                
                .reject-btn { background: var(--status-danger); }
                .reject-btn:hover:not(:disabled) { background: #DC2626; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(239, 68, 68, 0.2); }
                
                .approve-btn { background: var(--status-success); }
                .approve-btn:hover:not(:disabled) { background: #16A34A; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(34, 197, 94, 0.2); }

                /* Utils */
                .text-muted { color: var(--text-muted); }
                .text-main { color: var(--text-main); }
                .text-brand { color: var(--brand-primary); }
                .ayabus-spin { animation: spin 1s linear infinite; }
                .loading-state { display: flex; justify-content: center; padding: 40px; }
                
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }

                /* Custom Scrollbar */
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default ResolutionDesk;