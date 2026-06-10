import React, { useState, useMemo } from 'react';
import { 
    Wallet, ArrowDownRight, ArrowUpRight, 
    Gift, ShieldCheck, PlusCircle, 
    Clock, Smartphone, Ticket, History
} from 'lucide-react';

/**
 * 👑 WALLET CARD (Level 5: Passenger Dossier Module - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: WalletCard.jsx
 * * DESCRIPTION:
 * A fintech-grade digital wallet interface for the passenger.
 * Displays stored value, enables L9 Admins to issue instant courtesy credits,
 * and maintains an immutable ledger of all wallet inflows and outflows.
 * * UPGRADES:
 * - Sovereign Card UI: Advanced CSS gradients mimicking a physical smart-card.
 * - Cognitive Transaction Routing: Inflows (Credits) and Outflows (Debits) are 
 * visually segregated using color theory and iconography.
 * - Anti-Squish Ledger: 700px strict minimum width for the transaction history.
 */

// Local formatter for absolute stability
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', { 
        style: 'currency', 
        currency: 'UGX', 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
    }).format(amount || 0);
};

const WalletCard = ({ passengerId }) => {
    // ========================================================================
    // 1. STATE & FILTERS
    // ========================================================================
    const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'CREDIT' | 'DEBIT'

    // ========================================================================
    // 2. HIGH-FIDELITY MOCK ENGINE (Pre-Backend Simulator)
    // ========================================================================
    const { walletState, transactions } = useMemo(() => {
        if (!passengerId) return { walletState: { balance: 0 }, transactions: [] };

        // Simulated Fintech Payload
        const mockBalance = 55000;
        const mockTransactions = [
            { id: 'TX-WL-9921', date: 'Today, 09:15', type: 'CREDIT', amount: 15000, context: 'Courtesy Credit: Delay Apology', ref: 'TCK-CX-103', source: 'L9_ADMIN' },
            { id: 'TX-WL-8810', date: 'Sep 28, 2025', type: 'CREDIT', amount: 35000, context: 'Refund: Cancelled Trip', ref: 'TKT-8655-B', source: 'SYSTEM_AUTO' },
            { id: 'TX-WL-8704', date: 'Sep 15, 2025', type: 'DEBIT', amount: 45000, context: 'Ticket Purchase: Kampala → Gulu', ref: 'TKT-8109-Z', source: 'WALLET_PAY' },
            { id: 'TX-WL-8550', date: 'Aug 01, 2025', type: 'CREDIT', amount: 50000, context: 'Wallet Top-Up via MTN MoMo', ref: 'MOMO-772X', source: 'USER_DEPOSIT' }
        ];

        return { walletState: { balance: mockBalance }, transactions: mockTransactions };
    }, [passengerId]);

    // ========================================================================
    // 3. FILTERING ENGINE
    // ========================================================================
    const filteredTransactions = useMemo(() => {
        if (activeFilter === 'ALL') return transactions;
        return transactions.filter(t => t.type === activeFilter);
    }, [transactions, activeFilter]);

    // ========================================================================
    // 4. CSS GRID DEFINITION (Transaction Ledger)
    // ========================================================================
    const GRID_TEMPLATE = '1fr 1.5fr 2fr 1fr 1fr';

    // ========================================================================
    // 5. RENDER ENGINE
    // ========================================================================
    return (
        <div className="citadel-card" style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: '24px', display: 'flex', flexDirection: 'column',
            height: '100%', minHeight: '500px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
            overflow: 'hidden'
        }}>
            
            {/* === A. HEADER SECTION === */}
            <div style={{ 
                padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '20px', background: 'var(--bg-surface)'
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
                        <Wallet size={20} color="var(--brand-accent)" />
                        Digital Wallet & Credits
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Stored value ledger for 1-click refunds and loyalty credits.
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', flex: 1 }}>
                
                {/* === B. LEFT PANE: THE SOVEREIGN CARD UI & ACTIONS === */}
                <div style={{ 
                    flex: '1 1 350px', padding: '32px', borderRight: '1px solid var(--border-subtle)',
                    display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--bg-canvas)'
                }}>
                    
                    {/* The Physical Card Representation */}
                    <div style={{
                        width: '100%', height: '200px', borderRadius: '20px', padding: '24px',
                        background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent) 100%)',
                        boxShadow: '0 20px 40px color-mix(in srgb, var(--brand-primary) 30%, transparent)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        {/* Decorative Background Elements */}
                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(20px)' }} />
                        <div style={{ position: 'absolute', bottom: '-30px', left: '-20px', width: '100px', height: '100px', background: 'rgba(0,0,0,0.1)', borderRadius: '50%', filter: 'blur(10px)' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)' }}>
                                <ShieldCheck size={18} />
                                <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>AyaBus Stored Value</span>
                            </div>
                            <Wallet size={24} color="rgba(255,255,255,0.5)" />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                                Available Balance
                            </span>
                            <span style={{ fontSize: '36px', fontWeight: '900', fontFamily: 'monospace', color: '#FFF', letterSpacing: '-1px', lineHeight: '1' }}>
                                {formatCurrency(walletState.balance)}
                            </span>
                        </div>
                    </div>

                    {/* L9 Admin Action Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                        <button style={{
                            width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--brand-primary)',
                            color: '#fff', fontSize: '13px', fontWeight: '900', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            boxShadow: '0 4px 12px color-mix(in srgb, var(--brand-primary) 40%, transparent)',
                            transition: 'all 0.2s ease'
                        }}>
                            <PlusCircle size={16} strokeWidth={2.5} /> Issue Courtesy Credit
                        </button>
                        <button style={{
                            width: '100%', padding: '14px', borderRadius: '12px', background: 'transparent',
                            color: 'var(--text-main)', fontSize: '13px', fontWeight: '800', border: '1px solid var(--border-subtle)', 
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: 'all 0.2s ease'
                        }}>
                            <Gift size={16} /> Generate Promo Code
                        </button>
                    </div>

                </div>

                {/* === C. RIGHT PANE: THE TRANSACTION LEDGER === */}
                <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    
                    {/* Ledger Filters */}
                    <div style={{ display: 'flex', gap: '8px', padding: '16px 32px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                        <FilterButton label="All History" isActive={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} icon={History} />
                        <FilterButton label="Inflows (Credits)" isActive={activeFilter === 'CREDIT'} onClick={() => setActiveFilter('CREDIT')} color="var(--status-success)" icon={ArrowDownRight} />
                        <FilterButton label="Outflows (Debits)" isActive={activeFilter === 'DEBIT'} onClick={() => setActiveFilter('DEBIT')} color="var(--text-main)" icon={ArrowUpRight} />
                    </div>

                    {/* Scrollable Ledger Area */}
                    <div className="ayabus-scroll-area" style={{ flex: 1, overflow: 'auto', background: 'var(--bg-surface)' }}>
                        
                        {/* 700px Anchor */}
                        <div style={{ minWidth: '700px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                            
                            {/* Sticky Header */}
                            <div style={{
                                position: 'sticky', top: 0, zIndex: 10, display: 'grid', gridTemplateColumns: GRID_TEMPLATE, 
                                alignItems: 'center', padding: '12px 32px', background: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)',
                                borderBottom: '1px solid var(--border-subtle)', backdropFilter: 'blur(12px)',
                                fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px'
                            }}>
                                <span style={{ paddingRight: '16px' }}>TX ID</span>
                                <span style={{ paddingRight: '16px' }}>Date & Time</span>
                                <span style={{ paddingRight: '16px' }}>Context & Reference</span>
                                <span style={{ paddingRight: '16px' }}>Source</span>
                                <span style={{ textAlign: 'right' }}>Amount</span>
                            </div>

                            {/* Data Rows */}
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {filteredTransactions.length === 0 ? (
                                    <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <History size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>No Transactions</div>
                                        <div style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>Wallet history is empty for this filter.</div>
                                    </div>
                                ) : (
                                    filteredTransactions.map(tx => (
                                        <TransactionRow key={tx.id} tx={tx} gridTemplate={GRID_TEMPLATE} />
                                    ))
                                )}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// ========================================================================
// SUB-COMPONENTS
// ========================================================================

const TransactionRow = ({ tx, gridTemplate }) => {
    const isCredit = tx.type === 'CREDIT';
    const amountColor = isCredit ? 'var(--status-success)' : 'var(--text-main)';
    const Icon = isCredit ? ArrowDownRight : ArrowUpRight; // Down = Into Wallet, Up = Out of Wallet

    // Visual Source Mapper
    const getSourceConfig = (source) => {
        switch(source) {
            case 'L9_ADMIN': return { label: 'Admin Action', icon: ShieldCheck, color: 'var(--brand-accent)' };
            case 'SYSTEM_AUTO': return { label: 'System Auto', icon: Clock, color: 'var(--text-muted)' };
            case 'USER_DEPOSIT': return { label: 'MoMo Deposit', icon: Smartphone, color: 'var(--status-warning)' };
            case 'WALLET_PAY': return { label: 'Ticket Payment', icon: Ticket, color: 'var(--brand-primary)' };
            default: return { label: source, icon: Wallet, color: 'var(--text-muted)' };
        }
    };
    const sourceConfig = getSourceConfig(tx.source);
    const SourceIcon = sourceConfig.icon;

    return (
        <div style={{
            display: 'grid', gridTemplateColumns: gridTemplate, alignItems: 'center',
            padding: '20px 32px', borderBottom: '1px solid var(--border-subtle)',
            background: 'transparent', transition: 'background 0.2s ease'
        }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            
            {/* Col 1: TX ID */}
            <div style={{ fontSize: '12px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-muted)', paddingRight: '16px' }}>
                {tx.id}
            </div>

            {/* Col 2: Date */}
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', paddingRight: '16px' }}>
                {tx.date}
            </div>

            {/* Col 3: Context & Ref */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, paddingRight: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tx.context}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    Ref: {tx.ref}
                </span>
            </div>

            {/* Col 4: Source */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, paddingRight: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '6px', background: `color-mix(in srgb, ${sourceConfig.color} 15%, transparent)`, color: sourceConfig.color }}>
                    <SourceIcon size={12} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {sourceConfig.label}
                </span>
            </div>

            {/* Col 5: Amount */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: '900', fontFamily: 'monospace', color: amountColor }}>
                    {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                <div style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', 
                    background: `color-mix(in srgb, ${amountColor} 10%, transparent)`, color: amountColor 
                }}>
                    <Icon size={14} strokeWidth={3} />
                </div>
            </div>

        </div>
    );
};

const FilterButton = ({ label, isActive, onClick, color = 'var(--text-main)', icon: Icon }) => (
    <button onClick={onClick} style={{
        padding: '8px 16px', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s ease',
        background: isActive ? `color-mix(in srgb, ${color} 10%, transparent)` : 'transparent',
        border: `1px solid ${isActive ? `color-mix(in srgb, ${color} 30%, transparent)` : 'transparent'}`,
        color: isActive ? color : 'var(--text-muted)', fontSize: '11px', fontWeight: isActive ? '900' : '700',
        display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px', textTransform: 'uppercase'
    }}>
        {Icon && <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />}
        {label}
    </button>
);

export default WalletCard;