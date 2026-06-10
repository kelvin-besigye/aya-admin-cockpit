import React, { useState } from 'react';
import { X, FileText, Table, Download, ShieldCheck, Loader2, Info } from 'lucide-react';

// IMPORT LEVEL 6 LOGIC
import { generateTreasuryStatement } from './PdfBuilder';
import { downloadTreasuryCsv } from './CsvBuilder';

/**
 * STATEMENT GENERATOR (Level 6: The Microscope)
 * ------------------------------------------------------------------
 * A high-end configuration modal for exporting financial data.
 * Bridges the UI to the heavy-duty PDF/CSV generation engines.
 */

const StatementGenerator = ({ 
  isOpen, 
  onClose, 
  ledgerData, 
  summary, 
  filters, 
  activeCurrency = 'UGX' 
}) => {
  const [format, setFormat] = useState('PDF'); // PDF | CSV
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  // 1. EXPORT HANDLER
  const handleExport = async () => {
    setIsGenerating(true);
    
    // Artificial "Audit Delay" for premium UX feel (800ms)
    setTimeout(() => {
      try {
        if (format === 'PDF') {
          generateTreasuryStatement(ledgerData, summary, filters, activeCurrency);
        } else {
          downloadTreasuryCsv(ledgerData, filters);
        }
      } catch (error) {
        console.error("Export Protocol Failure:", error);
      } finally {
        setIsGenerating(false);
        onClose();
      }
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, 
          background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease'
        }} 
      />

      {/* Modal Card */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: '440px',
        background: 'var(--bg-surface)', borderRadius: '20px',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden', animation: 'citadelPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* A. HEADER */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)' }}>Export Statement</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Configure your official audit document.</p>
          </div>
          <button onClick={onClose} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'var(--bg-input)', cursor: 'pointer', color: 'var(--text-main)' }}>
            <X size={18} />
          </button>
        </div>

        {/* B. FORMAT SELECTION */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-input)', padding: '6px', borderRadius: '12px' }}>
            <FormatOption 
              active={format === 'PDF'} 
              onClick={() => setFormat('PDF')} 
              icon={FileText} label="Official PDF" 
            />
            <FormatOption 
              active={format === 'CSV'} 
              onClick={() => setFormat('CSV')} 
              icon={Table} label="Raw CSV" 
            />
          </div>

          {/* C. FORMAT CONTEXT */}
          <div style={{ 
            padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)', display: 'flex', gap: '12px' 
          }}>
            <Info size={20} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {format === 'PDF' ? (
                <><strong>PDF Statement:</strong> Best for financial reporting and archiving. Includes branding, summary charts, and digital audit stamps.</>
              ) : (
                <><strong>CSV Export:</strong> Best for deep analysis in Excel or Google Sheets. Features raw data flattening for pivot table compatibility.</>
              )}
            </div>
          </div>

          {/* D. DATA SNAPSHOT */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700' }}>
            <span style={{ color: 'var(--text-muted)' }}>RECORDS INCLUDED:</span>
            <span style={{ color: 'var(--text-main)' }}>{ledgerData.length} Transactions</span>
          </div>

        </div>

        {/* E. ACTION FOOTER */}
        <div style={{ padding: '24px', background: 'var(--bg-input)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={handleExport}
            disabled={isGenerating || ledgerData.length === 0}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
              background: 'var(--brand-primary)', color: '#fff', 
              fontWeight: '900', fontSize: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'all 0.2s ease', opacity: (isGenerating || ledgerData.length === 0) ? 0.6 : 1
            }}
          >
            {isGenerating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {isGenerating ? 'GENERATING...' : `DOWNLOAD ${format}`}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="var(--status-success)" />
            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              End-to-End Encrypted Audit
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes citadelPop {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

// --- SUB-COMPONENT: FORMAT OPTION ---
const FormatOption = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    style={{
      padding: '12px', borderRadius: '8px', border: 'none',
      background: active ? 'var(--bg-surface)' : 'transparent',
      color: active ? 'var(--brand-primary)' : 'var(--text-muted)',
      fontWeight: '800', fontSize: '13px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      boxShadow: active ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
      transition: 'all 0.2s ease'
    }}
  >
    <Icon size={16} />
    {label}
  </button>
);

export default StatementGenerator;