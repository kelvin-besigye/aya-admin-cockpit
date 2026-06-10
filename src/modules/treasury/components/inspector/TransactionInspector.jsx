import React, { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, Code, FileText, Share2, ClipboardCheck, ShieldCheck, History } from 'lucide-react';

// IMPORT LEVEL 5 & 6 SUB-COMPONENTS
import ReceiptBreakdown from './ReceiptBreakdown';
import RefundAction from './RefundAction';
import SecurityLog from '../reports/SecurityLog'; // Linked from Reports per our tree

// IMPORT UTILS
import { formatCurrency } from '../../data/treasury.utils';

/**
 * TRANSACTION INSPECTOR (Level 5: The Microscope)
 * ------------------------------------------------------------------
 * The master slide-out detail pane. 
 * Orchestrates: Receipts, Refunds, and Security Logs.
 */

const TransactionInspector = ({ 
  transaction, 
  isOpen, 
  onClose,
  activeCurrency = 'UGX',
  exchangeRate = 1,
  onUpdate // Triggers parent refresh after refund
}) => {
  const [activeTab, setActiveTab] = useState('INSIGHTS'); // INSIGHTS | RAW
  const [copiedId, setCopiedId] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);

  // 1. CLIPBOARD HANDLERS
  const copyToClipboard = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  // Prevent background scroll for better UX on Windows 10
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !transaction) return null;

  return (
    <>
      {/* 1. BACKDROP OVERLAY */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* 2. THE DRAWER */}
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0,
        width: '100%', maxWidth: '520px', zIndex: 1001,
        background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-subtle)',
        boxShadow: '-20px 0 50px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column',
        animation: 'citadelSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* A. HEADER SECTION */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <button 
              onClick={onClose} 
              style={{ 
                padding: '10px', borderRadius: '10px', border: '1px solid var(--border-subtle)', 
                background: 'var(--bg-input)', cursor: 'pointer', color: 'var(--text-main)',
                display: 'flex', alignItems: 'center'
              }}
            >
              <X size={20} />
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => copyToClipboard(transaction.id, setCopiedId)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', 
                  borderRadius: '10px', border: '1px solid var(--border-subtle)', 
                  background: 'var(--bg-surface)', fontSize: '12px', fontWeight: '800', 
                  color: 'var(--text-main)', cursor: 'pointer' 
                }}
              >
                {copiedId ? <ClipboardCheck size={14} color="var(--status-success)" /> : <Copy size={14} />}
                {copiedId ? 'COPIED' : 'COPY ID'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              Entry Details
            </h2>
            <div style={{ 
              padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '900',
              background: transaction.status === 'SETTLED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: transaction.status === 'SETTLED' ? 'var(--status-success)' : 'var(--status-danger)',
              textTransform: 'uppercase', border: `1px solid ${transaction.status === 'SETTLED' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
            }}>
              {transaction.status}
            </div>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            REF: {transaction.gateway_ref || 'PENDING_GATEWAY_SYNC'}
          </p>
        </div>

        {/* B. NAVIGATION TABS */}
        <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid var(--border-subtle)', gap: '32px' }}>
          <TabButton active={activeTab === 'INSIGHTS'} onClick={() => setActiveTab('INSIGHTS')} icon={FileText} label="FORENSIC VIEW" />
          <TabButton active={activeTab === 'RAW'} onClick={() => setActiveTab('RAW')} icon={Code} label="GATEWAY PAYLOAD" />
        </div>

        {/* C. CONTENT AREA */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }} className="citadel-hide-scrollbar">
          
          {activeTab === 'INSIGHTS' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* 1. PRIMARY METRIC CARD */}
              <div style={{ 
                background: 'var(--brand-primary)', borderRadius: '16px', padding: '24px', 
                color: '#fff', boxShadow: '0 10px 20px -5px rgba(14, 165, 233, 0.3)' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Settled Gross</span>
                    <div style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'monospace', margin: '4px 0' }}>
                      {formatCurrency(transaction.gross_amount, activeCurrency, exchangeRate)}
                    </div>
                  </div>
                  <ShieldCheck size={32} style={{ opacity: 0.2 }} />
                </div>
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ExternalLink size={14} />
                  Operator: {transaction.partners?.company_name || 'Direct Sale'}
                </div>
              </div>

              {/* 2. THE RECEIPT WATERFALL */}
              <ReceiptBreakdown 
                transaction={transaction} 
                activeCurrency={activeCurrency} 
                exchangeRate={exchangeRate} 
              />

              {/* 3. SECURITY & AUDIT LOG (THE WIRING) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <History size={16} color="var(--text-muted)" />
                  <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Activity History</span>
                </div>
                <SecurityLog logs={transaction.audit_logs || []} />
              </div>

              {/* 4. DANGER ZONE: REFUND CONTROL */}
              {transaction.status === 'SETTLED' && (
                <div style={{ marginTop: '12px' }}>
                  <RefundAction 
                    transaction={transaction} 
                    activeCurrency={activeCurrency} 
                    exchangeRate={exchangeRate} 
                    onSuccess={onUpdate}
                  />
                </div>
              )}

            </div>
          ) : (
            /* RAW PAYLOAD VIEW */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>DATABASE OBJECT</span>
                <button 
                  onClick={() => copyToClipboard(JSON.stringify(transaction, null, 2), setCopiedRaw)}
                  style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {copiedRaw ? 'COPIED!' : 'COPY JSON'}
                </button>
              </div>
              <pre style={{
                margin: 0, padding: '20px', borderRadius: '12px',
                background: 'var(--bg-input)', color: 'var(--text-main)',
                fontSize: '12px', fontFamily: 'monospace', overflowX: 'auto',
                border: '1px solid var(--border-subtle)', lineHeight: '1.7'
              }}>
                {JSON.stringify(transaction, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* D. FOOTER ACTIONS */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}>
          <button style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)', fontWeight: '900', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            cursor: 'pointer', transition: 'transform 0.1s active'
          }}>
            <Share2 size={18} />
            Generate Internal Audit PDF
          </button>
        </div>

      </div>

      <style>{`
        @keyframes citadelSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    style={{
      padding: '20px 0', border: 'none', background: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '10px',
      color: active ? 'var(--brand-primary)' : 'var(--text-muted)',
      fontWeight: '900', fontSize: '11px', letterSpacing: '1px',
      borderBottom: active ? '3px solid var(--brand-primary)' : '3px solid transparent',
      transition: 'all 0.2s ease'
    }}
  >
    <Icon size={16} />
    {label}
  </button>
);

export default TransactionInspector;