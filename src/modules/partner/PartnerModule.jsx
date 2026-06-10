import React, { useState, useEffect } from 'react';
import { 
    Network, ArrowLeft, Building2, Activity, 
    Flame, MessageSquare, Briefcase 
} from 'lucide-react';

// ========================================================================
// IMPORT LEVEL 4, 5, & 6 SOVEREIGN COMPONENTS
// ========================================================================
import PartnerMatrix from './components/roster/PartnerMatrix';
import YieldScorecard from './components/profile/YieldScorecard';
import AssetRegistry from './components/profile/AssetRegistry';
import PartnerFinancials from './components/profile/PartnerFinancials';
import DispatchCommLink from './components/comms/DispatchCommLink';
import ReviewAggregator from './components/comms/ReviewAggregator';
import DocumentVault from './components/compliance/DocumentVault';
import ResolutionDesk from './components/compliance/ResolutionDesk';
import SurgeExchange from './components/marketplace/SurgeExchange';
import LiquidityHub from './components/capital/LiquidityHub';

// IMPORT PRIMITIVES
import HealthBadge from './components/primitives/HealthBadge';
import TierShield from './components/primitives/TierShield';

/**
 * 👑 AYABUS PARTNER CENTRE (Level 7: The Master Orchestrator)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: PartnerModule.jsx
 * * DESCRIPTION:
 * The apex command center for the entire B2B Operator Ecosystem.
 * Orchestrates the fluid layout, global state, and contextual routing 
 * between Macro (Network) and Micro (Individual Partner) views.
 */

const PartnerModule = () => {

    // ========================================================================
    // 1. GLOBAL STATE MANAGEMENT
    // ========================================================================
    // Controls the overarching tabs when in "Macro" view
    const [activeMacroTab, setActiveMacroTab] = useState('ROSTER'); // 'ROSTER' | 'MARKETPLACE' | 'DISPATCH'
    
    // Controls the contextual transition into the "Micro" Dossier view
    const [selectedPartner, setSelectedPartner] = useState(null);
    
    // Global Filters (Passed down to child fetchers)
    const [globalFilters, setGlobalFilters] = useState({
        region: 'ALL',
        tier: 'ALL',
        status: 'ACTIVE'
    });

    // ========================================================================
    // 2. INTERACTION HANDLERS
    // ========================================================================
    const handlePartnerSelect = (partner) => {
        // Smoothly transition the OS from Macro Ecosystem to Micro Dossier
        setSelectedPartner(partner);
    };

    const handleReturnToEcosystem = () => {
        setSelectedPartner(null);
    };

    // ========================================================================
    // 3. RENDER ENGINE (The 100vw Sovereign Fluid Layout)
    // ========================================================================
    return (
        <div style={{ 
            display: 'flex', flexDirection: 'column', height: '100%', 
            background: 'var(--bg-canvas)', overflow: 'hidden', fontFamily: 'inherit'
        }}>
            
            {/* === A. THE GLOBAL COMMAND NAV BAR === */}
            <div style={{ 
                flexShrink: 0, padding: '16px 32px', background: 'var(--bg-surface)', 
                borderBottom: '1px solid var(--border-subtle)', zIndex: 50,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                {selectedPartner ? (
                    // DOSSIER BREADCRUMB HEADER
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <button 
                            onClick={handleReturnToEcosystem}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
                                background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', 
                                borderRadius: '12px', color: 'var(--text-main)', fontSize: '13px', 
                                fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s ease' 
                            }}
                        >
                            <ArrowLeft size={16} /> Back to Ecosystem
                        </button>
                        <div style={{ height: '24px', width: '1px', background: 'var(--border-subtle)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                                    {selectedPartner.companyName}
                                </h2>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                    FLEET CODE: {selectedPartner.fleetCode}
                                </span>
                            </div>
                            <TierShield tierId={selectedPartner.tier?.id} size="md" showLabel={false} />
                            <HealthBadge score={selectedPartner.healthScore} size="sm" />
                        </div>
                    </div>
                ) : (
                    // MACRO ECOSYSTEM HEADER & TABS
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'color-mix(in srgb, var(--brand-primary) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                                <Briefcase size={20} strokeWidth={2.5} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                                    Partner & Fleet Centre
                                </h1>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                                    Sovereign B2B Logistics Hub
                                </span>
                            </div>
                        </div>

                        {/* Top-Level Navigation Tabs */}
                        <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: '12px', padding: '6px', border: '1px solid var(--border-subtle)' }}>
                            <NavTab isActive={activeMacroTab === 'ROSTER'} onClick={() => setActiveMacroTab('ROSTER')} icon={Network} label="Network Roster" />
                            <NavTab isActive={activeMacroTab === 'MARKETPLACE'} onClick={() => setActiveMacroTab('MARKETPLACE')} icon={Flame} label="Capacity Exchange" color="var(--status-danger)" />
                            <NavTab isActive={activeMacroTab === 'DISPATCH'} onClick={() => setActiveMacroTab('DISPATCH')} icon={MessageSquare} label="Global Comm-Link" color="var(--brand-accent)" />
                        </div>
                    </>
                )}
            </div>

            {/* === B. THE PROTECTED SCROLL VIEWPORT === */}
            <div className="ayabus-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* ----------------------------------------------------------------- */}
                {/* STATE 1: THE MACRO ECOSYSTEM (No Partner Selected)                */}
                {/* ----------------------------------------------------------------- */}
                {!selectedPartner && (
                    <>
                        {activeMacroTab === 'ROSTER' && (
                            <section style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', minHeight: '800px' }}>
                                <PartnerMatrix filters={globalFilters} onPartnerSelect={handlePartnerSelect} />
                            </section>
                        )}
                        
                        {activeMacroTab === 'MARKETPLACE' && (
                            <section style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', minHeight: '800px' }}>
                                <SurgeExchange />
                            </section>
                        )}

                        {activeMacroTab === 'DISPATCH' && (
                            <section style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', minHeight: '800px' }}>
                                {/* Defaults to GLOBAL broadcast mode when no partner is selected */}
                                <DispatchCommLink activePartnerId="GLOBAL" />
                            </section>
                        )}
                    </>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* STATE 2: THE SOVEREIGN DOSSIER (Partner Deep Dive)                */}
                {/* ----------------------------------------------------------------- */}
                {selectedPartner && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        {/* ZONE 1: Yield & Financials (Fluid Wrap Architecture) */}
                        <section style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                            {/* Left: Operational Telemetry */}
                            <div style={{ flex: '1 1 500px' }}>
                                <YieldScorecard partner={selectedPartner} />
                            </div>
                            {/* Right: Embedded Treasury Queue */}
                            <div style={{ flex: '1 1 600px' }}>
                                <PartnerFinancials partner={selectedPartner} />
                            </div>
                        </section>

                        {/* ZONE 2: Physical Asset Base */}
                        <section>
                            <AssetRegistry partner={selectedPartner} />
                        </section>

                        {/* ZONE 3: Capital & Comm-Link (Fluid Wrap Architecture) */}
                        <section style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                            {/* Left: Embedded Finance Facility */}
                            <div style={{ flex: '1 1 500px' }}>
                                <LiquidityHub partner={selectedPartner} />
                            </div>
                            {/* Right: Direct 1-on-1 Dispatch Chat */}
                            <div style={{ flex: '1 1 600px' }}>
                                <DispatchCommLink activePartnerId={selectedPartner.id} />
                            </div>
                        </section>

                        {/* ZONE 4: Compliance Firewall (Fluid Wrap Architecture) */}
                        <section style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                            {/* Left: Ticket Triage Desk */}
                            <div style={{ flex: '2 1 600px' }}>
                                <ResolutionDesk partner={selectedPartner} />
                            </div>
                            {/* Right: Legal Document Vault */}
                            <div style={{ flex: '1 1 450px' }}>
                                <DocumentVault partner={selectedPartner} />
                            </div>
                        </section>

                        {/* ZONE 5: Sentiment Analysis */}
                        <section>
                            <ReviewAggregator partner={selectedPartner} />
                        </section>

                        {/* Aesthetic Spacer for comfortable scrolling */}
                        <div style={{ height: '60px' }} />
                    </div>
                )}

            </div>
        </div>
    );
};

// ========================================================================
// SUB-COMPONENTS
// ========================================================================

const NavTab = ({ isActive, onClick, icon: Icon, label, color = 'var(--brand-primary)' }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: isActive ? 'var(--bg-surface)' : 'transparent',
            color: isActive ? color : 'var(--text-muted)',
            fontWeight: isActive ? '900' : '700', fontSize: '13px', letterSpacing: '0.5px',
            boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s ease'
        }}
    >
        <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
        {label}
    </button>
);

export default PartnerModule;