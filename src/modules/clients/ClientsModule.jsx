import React, { useState } from 'react';
import { 
    Users, MessageSquare, BarChart3, 
    ChevronRight, ArrowLeft, ShieldCheck 
} from 'lucide-react';

// ========================================================================
// IMPORT LEVEL 4 & 5 COMPONENTS (The Sovereign Hubs)
// ========================================================================
// Directory Zone
import PassengerMatrix from './components/directory/PassengerMatrix';
// Profile Zone
import PassengerDossier from './components/profile/PassengerDossier';
import BookingLedger from './components/profile/BookingLedger';
import WalletCard from './components/profile/WalletCard';
// Helpdesk Zone
import OmniInbox from './components/support/OmniInbox';
import ResolutionWorkspace from './components/support/ResolutionWorkspace';
import TelemetryRadar from './components/support/TelemetryRadar';
// Outreach Zone
import NPSDashboard from './components/outreach/NPSDashboard';
import BlastComposer from './components/outreach/BlastComposer';

/**
 * 👑 CLIENTS MODULE (Level 7: The Master Orchestrator - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: ClientModule.jsx
 * * DESCRIPTION:
 * The apex routing shell for the Passenger CRM ecosystem. 
 * Manages the fluid transitions between the Macro Directory, Micro Profiles, 
 * Omnichannel Helpdesk, and Proactive Outreach hubs.
 * * UPGRADES:
 * - Sovereign Ribbon Navigation: Context-aware breadcrumbs and tab routing.
 * - Viewport Delegation: Uses strict flex/hidden physics to let children scroll.
 * - Flexbox Physics Chain: Enforces `minHeight: 0` on ALL wrappers to stop bottom-clipping.
 */

const ClientModule = () => {
    // ========================================================================
    // 1. GLOBAL MODULE STATE
    // ========================================================================
    // Views: 'DIRECTORY' | 'PROFILE' | 'HELPDESK' | 'OUTREACH'
    const [activeView, setActiveView] = useState('DIRECTORY');
    
    // Cross-Component Context
    const [selectedPassenger, setSelectedPassenger] = useState(null);
    const [activeTicket, setActiveTicket] = useState(null);
    const [outreachTab, setOutreachTab] = useState('NPS'); // 'NPS' | 'BLAST'

    // ========================================================================
    // 2. LIVE WIRE EVENT HANDLERS
    // ========================================================================
    
    // Fired when an Admin clicks a row in the PassengerMatrix
    const handlePassengerSelect = (passenger) => {
        setSelectedPassenger(passenger);
        setActiveView('PROFILE');
    };

    // Fired when an Admin clicks "Direct Connect" in the PassengerDossier
    const handleOpenChat = (passengerData) => {
        setActiveView('HELPDESK');
        // Note: In a fully wired backend, we would pass passengerData.id to the OmniInbox 
        // to auto-filter or create a new ticket.
    };

    // Fired when an Admin clicks a chat in the OmniInbox
    const handleTicketSelect = (ticket) => {
        setActiveTicket(ticket);
    };

    // ========================================================================
    // 3. RENDER ENGINES (The Sub-Views)
    // ========================================================================

    const renderDirectory = () => (
        // CRITICAL FIX: Added minHeight: 0 to enforce strict flex boundary
        <div style={{ flex: 1, padding: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <PassengerMatrix onPassengerSelect={handlePassengerSelect} />
        </div>
    );

    const renderProfile = () => {
        if (!selectedPassenger) return null;
        
        return (
            // CRITICAL FIX: Added minHeight: 0 here as well
            <div className="ayabus-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--bg-canvas)', minHeight: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1600px', margin: '0 auto' }}>
                    
                    {/* Context Back Button */}
                    <button 
                        onClick={() => { setActiveView('DIRECTORY'); setSelectedPassenger(null); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '800', cursor: 'pointer', alignSelf: 'flex-start', transition: 'color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                        <ArrowLeft size={16} /> Return to Master Registry
                    </button>

                    <PassengerDossier 
                        passengerId={selectedPassenger.id} 
                        onOpenChat={handleOpenChat} 
                    />
                    
                    {/* The Ledger & Wallet Stack */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <WalletCard passengerId={selectedPassenger.id} />
                        <BookingLedger passengerId={selectedPassenger.id} />
                    </div>
                </div>
            </div>
        );
    };

    const renderHelpdesk = () => (
        // CRITICAL FIX: Added minHeight: 0
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: 'var(--bg-canvas)', minHeight: 0 }}>
            {/* Left Pane: Priority Routing */}
            <OmniInbox 
                activeTicketId={activeTicket?.id} 
                onSelectTicket={handleTicketSelect} 
            />
            {/* Center Pane: Capital & Chat */}
            <ResolutionWorkspace 
                activeTicket={activeTicket} 
            />
            {/* Right Pane: Live Telemetry HUD */}
            <TelemetryRadar 
                activeTicket={activeTicket} 
            />
        </div>
    );

    const renderOutreach = () => (
        // CRITICAL FIX: Added minHeight: 0 to the outer flex wrapper
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-canvas)', minHeight: 0 }}>
            
            {/* Internal Outreach Tabs */}
            <div style={{ display: 'flex', gap: '8px', padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <SubTab label="NPS & Sentiment Dashboard" isActive={outreachTab === 'NPS'} onClick={() => setOutreachTab('NPS')} />
                <SubTab label="Pre-Emptive Blast Engine" isActive={outreachTab === 'BLAST'} onClick={() => setOutreachTab('BLAST')} />
            </div>
            
            {/* CRITICAL FIX: Added minHeight: 0 to the inner flex wrapper containing the components */}
            <div style={{ flex: 1, padding: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                {outreachTab === 'NPS' ? <NPSDashboard /> : <BlastComposer />}
            </div>
        </div>
    );

    // ========================================================================
    // 4. MASTER SHELL RENDER
    // ========================================================================
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden', background: 'var(--bg-canvas)' }}>
            
            {/* === THE SOVEREIGN MODULE RIBBON === */}
            <header style={{ 
                height: '56px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0
            }}>
                {/* Left: Module Breadcrumbs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-primary)', fontWeight: '900', fontSize: '14px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        <ShieldCheck size={18} strokeWidth={2.5} /> B2C Client Centre
                    </div>
                    
                    {activeView === 'PROFILE' && selectedPassenger && (
                        <>
                            <ChevronRight size={16} color="var(--border-subtle)" />
                            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>{selectedPassenger.name}</span>
                        </>
                    )}
                </div>

                {/* Right: Master Navigation Tabs */}
                <div style={{ display: 'flex', gap: '4px' }}>
                    <NavTab 
                        icon={Users} label="Master Registry" 
                        isActive={activeView === 'DIRECTORY' || activeView === 'PROFILE'} 
                        onClick={() => setActiveView('DIRECTORY')} 
                    />
                    <NavTab 
                        icon={MessageSquare} label="Omni Helpdesk" 
                        isActive={activeView === 'HELPDESK'} 
                        onClick={() => setActiveView('HELPDESK')} 
                    />
                    <NavTab 
                        icon={BarChart3} label="Analytics & Outreach" 
                        isActive={activeView === 'OUTREACH'} 
                        onClick={() => setActiveView('OUTREACH')} 
                    />
                </div>
            </header>

            {/* === THE PROTECTED VIEWPORT === */}
            {/* CRITICAL FIX: minHeight: 0 added to the master <main> container */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', minHeight: 0 }}>
                {activeView === 'DIRECTORY' && renderDirectory()}
                {activeView === 'PROFILE' && renderProfile()}
                {activeView === 'HELPDESK' && renderHelpdesk()}
                {activeView === 'OUTREACH' && renderOutreach()}
            </main>

        </div>
    );
};

// ========================================================================
// SUB-COMPONENTS (Navigation Atoms)
// ========================================================================

const NavTab = ({ icon: Icon, label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px',
            background: isActive ? 'var(--bg-input)' : 'transparent', border: 'none', cursor: 'pointer',
            color: isActive ? 'var(--text-main)' : 'var(--text-muted)', fontSize: '12px', fontWeight: '800',
            transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-main)' }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)' }}
    >
        <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
        {label}
    </button>
);

const SubTab = ({ label, isActive, onClick }) => (
    <button onClick={onClick} style={{
        padding: '8px 16px', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s ease',
        background: isActive ? 'var(--text-main)' : 'transparent',
        border: `1px solid ${isActive ? 'transparent' : 'var(--border-subtle)'}`,
        color: isActive ? 'var(--bg-canvas)' : 'var(--text-muted)', fontSize: '12px', fontWeight: isActive ? '900' : '700',
        letterSpacing: '0.5px'
    }}>
        {label}
    </button>
);

export default ClientModule;