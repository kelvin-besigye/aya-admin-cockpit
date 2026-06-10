import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';

// --- 1. DATA & LOGIC ENGINES ---
import { reconciliationService } from './data/reconciliation.service';
import { ReconciliationPhysics } from './data/reconciliation.physics';

// --- 2. COMPONENTS ---
import ClearinghouseHud from './components/visuals/ClearinghouseHud';
import CustomerPayoutQueue from './components/liability/CustomerPayoutQueue';
import OperatorDebtMatrix from './components/clawback/OperatorDebtMatrix';
import VaultOffsetAction from './components/clawback/VaultOffsetAction';

/**
 * 👑 AYABUS RECONCILIATION MODULE (Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Reconciliation & Debt Clearinghouse
 * File: ReconciliationModule.jsx
 * * DESCRIPTION:
 * The Master Orchestrator. Fetches live data, handles the 60/40 layout 
 * split, and securely wires the UI components to the Database Engine.
 */

const ReconciliationModule = ({ systemSettings = [] }) => {
    
    // ========================================================================
    // A. MASTER STATE
    // ========================================================================
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Data States
    const [pendingTickets, setPendingTickets] = useState([]);
    const [hudMetrics, setHudMetrics] = useState({
        pendingLiability: 0,
        activeClawbacks: 0,
        netYield: 0
    });

    // Selection & Preview States
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [calculationPreview, setCalculationPreview] = useState(null);

    // ========================================================================
    // B. INITIALIZATION & DATA FETCHING
    // ========================================================================
    const loadClearinghouseData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch both Pending (Triage) and Approved (HUD) data simultaneously
            const [pendingRes, approvedRes] = await Promise.all([
                reconciliationService.fetchPendingCancellations(),
                reconciliationService.fetchApprovedLiabilities()
            ]);

            if (!pendingRes.success) throw new Error(pendingRes.error);
            if (!approvedRes.success) throw new Error(approvedRes.error);

            setPendingTickets(pendingRes.data);

            // --- CALCULATE HUD METRICS ---
            // 1. Pending Liability (Money requested but not yet processed)
            const liability = pendingRes.data.reduce((acc, t) => acc + Number(t.price_ticket || t.base_fare || 0), 0);
            
            // 2. Active Clawbacks (Money approved, waiting for Treasury Vault execution)
            const clawbacks = approvedRes.data.reduce((acc, t) => acc + Number(t.refund_amount_paid || 0), 0);
            
            // 3. Net Yield (Mock calculation for currently settled profit, ideally fetched from Treasury)
            const yieldProfit = 0; // In production, query the `transactions` table for 'PENALTY_COMPENSATION'

            setHudMetrics({
                pendingLiability: liability,
                activeClawbacks: clawbacks,
                netYield: yieldProfit
            });

        } catch (error) {
            console.error("Clearinghouse Sync Failed:", error);
            // In a real app, trigger a toast notification here
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadClearinghouseData();
    }, [loadClearinghouseData]);

    // ========================================================================
    // C. WORKFLOW HANDLERS
    // ========================================================================
    
    /**
     * Triggered when an L1 Admin clicks a ticket in the Left Panel.
     * Uses Zero-Latency Local Physics to instantly generate the math preview.
     */
    const handleSelectTicket = (ticket) => {
        setSelectedTicket(ticket);
        
        // INSTANT MATH PREVIEW: Run the physics engine locally so the UI doesn't lag
        const mathResult = ReconciliationPhysics.calculateSettlement(ticket, systemSettings);
        setCalculationPreview(mathResult);
    };

    /**
     * Triggered when an Admin clicks "Submit to L9" in the Right Panel.
     * Sends the locked math to the database and queues it for Approvals.
     */
    const handleSubmitToApprovals = async (ticket, mathResult) => {
        if (!ticket || !mathResult || mathResult.status !== 'VALID') return;

        if (window.confirm("Lock this calculation and send to Level 9 Finance for Approval?")) {
            setIsProcessing(true);
            try {
                // Execute Database Wire
                const response = await reconciliationService.initiateRefundRequest(ticket, systemSettings);
                
                if (response.success) {
                    // Optimistically remove from queue to keep workflow kinetic
                    setPendingTickets(prev => prev.filter(t => t.id !== ticket.id));
                    setSelectedTicket(null);
                    setCalculationPreview(null);
                    
                    // Refresh HUD metrics in the background
                    loadClearinghouseData();
                } else {
                    alert("Submission Failed: " + response.error);
                }
            } catch (error) {
                alert("Execution Error: " + error.message);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    // ========================================================================
    // D. RENDER ENGINE
    // ========================================================================
    return (
        <div style={{ 
            padding: '32px', 
            maxWidth: '1600px', 
            margin: '0 auto',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        }}>
            
            {/* 1. ELITE COMMAND HEADER */}
            <header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-end',
                borderBottom: '2px solid var(--border-subtle)',
                paddingBottom: '24px',
                flexShrink: 0
            }}>
                <div>
                    <span style={{ 
                        fontSize: '12px', 
                        fontWeight: '900', 
                        color: 'var(--status-danger)', 
                        letterSpacing: '2px', 
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <ShieldCheck size={14} /> Global Clearinghouse
                    </span>
                    <h1 style={{ 
                        margin: '4px 0 0 0', 
                        fontSize: '32px', 
                        fontWeight: '900', 
                        color: 'var(--text-main)', 
                        letterSpacing: '-1.5px' 
                    }}>
                        RECONCILIATION & DEBT
                    </h1>
                </div>
                
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
                    Standard Settlement Buffer: <span style={{ color: 'var(--text-main)' }}>4 Business Days</span>
                </div>
            </header>

            {/* 2. THE HEADS-UP DISPLAY (KPIs) */}
            <div style={{ flexShrink: 0 }}>
                <ClearinghouseHud metrics={hudMetrics} isLoading={isLoading} />
            </div>

            {/* 3. THE 60/40 KINETIC WORKSPACE */}
            <div style={{ 
                flex: 1, 
                display: 'grid', 
                gridTemplateColumns: '1.5fr 1fr', // 60/40 Split
                gap: '24px',
                minHeight: '500px', // Ensures it doesn't collapse on small screens
                overflow: 'hidden' // Keeps scrollbars inside the components
            }}>
                
                {/* LEFT PANEL: The Triage Queue (60%) */}
                <CustomerPayoutQueue 
                    tickets={pendingTickets}
                    selectedTicket={selectedTicket}
                    onSelectTicket={handleSelectTicket}
                    isLoading={isLoading}
                />

                {/* RIGHT PANEL: The Action Vault (40%) */}
                {/* We stack the Matrix and Action modules tightly to form one cohesive sidebar */}
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '24px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                    overflow: 'hidden' // Clips the bottom action radius perfectly
                }}>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <OperatorDebtMatrix 
                            selectedTicket={selectedTicket}
                            calculationResult={calculationPreview}
                            // Note: Action removed from Matrix and passed to VaultOffsetAction below
                        />
                    </div>
                    
                    <VaultOffsetAction 
                        selectedTicket={selectedTicket}
                        calculationResult={calculationPreview}
                        onProcessAction={handleSubmitToApprovals}
                        isProcessing={isProcessing}
                    />
                </div>

            </div>

            {/* WINDOWS 10 & SCROLLBAR PERFORMANCE OVERRIDES */}
            <style>{`
                .ayabus-scroll-area::-webkit-scrollbar {
                    width: 6px;
                }
                .ayabus-scroll-area::-webkit-scrollbar-track {
                    background: transparent;
                }
                .ayabus-scroll-area::-webkit-scrollbar-thumb {
                    background: var(--border-subtle);
                    border-radius: 10px;
                }
                .ayabus-scroll-area::-webkit-scrollbar-thumb:hover {
                    background: var(--text-muted);
                }
            `}</style>
        </div>
    );
};

export default ReconciliationModule;