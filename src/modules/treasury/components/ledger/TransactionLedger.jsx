import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ListFilter, Loader2, Database } from 'lucide-react';

// IMPORT LEVEL 1 & 2 & 5 DEPENDENCIES
import { treasuryService } from '../../data/treasury.service';
import EmptyState from '../primitives/EmptyState';
import LedgerRow from './LedgerRow';

/**
 * 👑 TRANSACTION LEDGER (Level 5: The Ground Truth - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Treasury
 * File: TransactionLedger.jsx
 * * DESCRIPTION:
 * The high-performance, infinite-scroll table for settled transactions.
 * * UPGRADES (Phase 2):
 * - Bi-Directional Viewport: Safely houses the 1050px strict-width rows 
 * with horizontal scrolling on smaller displays.
 * - Sticky Header: Table headers remain pinned to the top during vertical scroll.
 * - Grid Sync: 'GRID_TEMPLATE' mathematically synced with LedgerRow (2.5fr context).
 */

const TransactionLedger = ({ 
  filters, 
  activeCurrency = 'UGX', 
  exchangeRate = 1,
  onRowClick 
}) => {

  // ========================================================================
  // 1. STATE: DATA & PAGINATION
  // ========================================================================
  const [transactions, setTransactions] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef(null);
  const PAGE_LIMIT = 50;

  // ========================================================================
  // 2. DATA ENGINE: FETCH FUNCTION
  // ========================================================================
  const fetchLedgerData = async (currentPage, isReset = false) => {
    try {
      if (isReset) setIsLoading(true);
      else setIsFetchingNextPage(true);

      const response = await treasuryService.getLedgerTransactions(filters, currentPage, PAGE_LIMIT);
      
      if (isReset) {
        setTransactions(response.data || []);
      } else {
        setTransactions(prev => [...prev, ...(response.data || [])]);
      }

      setTotalRecords(response.total || 0);
      setHasMore(currentPage < response.totalPages);

    } catch (error) {
      console.error("Ledger Fetch Error:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  };

  // ========================================================================
  // 3. LIFECYCLE: FILTER CHANGES & OBSERVER
  // ========================================================================
  useEffect(() => {
    setPage(1);
    fetchLedgerData(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); 

  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !isLoading && !isFetchingNextPage) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchLedgerData(nextPage, false);
        return nextPage;
      });
    }
  }, [hasMore, isLoading, isFetchingNextPage, filters]);

  useEffect(() => {
    const element = observerTarget.current;
    const option = { threshold: 0.1, rootMargin: '100px' }; 
    const observer = new IntersectionObserver(handleObserver, option);
    
    if (element) observer.observe(element);
    return () => { if (element) observer.unobserve(element); };
  }, [handleObserver]);

  // ========================================================================
  // 4. CSS GRID DEFINITION
  // ========================================================================
  // STRICT SYNC: Must perfectly match the gridTemplateColumns in LedgerRow.jsx
  const GRID_TEMPLATE = '1.5fr 2.5fr 1.5fr 1.5fr 1fr 40px';

  // ========================================================================
  // 5. RENDER ENGINE
  // ========================================================================
  return (
    <div className="citadel-card" style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: '24px', display: 'flex', flexDirection: 'column',
      height: '100%', minHeight: '600px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
      overflow: 'hidden' // Keeps children bound to the 24px border radius
    }}>
      
      {/* === A. STATIC MASTER HEADER === */}
      {/* This top bar never scrolls; it anchors the module component */}
      <div style={{ 
        padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--bg-surface)', zIndex: 20
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.5px' }}>
            <Database size={20} color="var(--brand-primary)" />
            Settled Transactions
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
            Chronological ledger of successfully processed liquidity.
          </p>
        </div>

        {!isLoading && (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', 
            background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-subtle)' 
          }}>
            <ListFilter size={14} color="var(--brand-primary)" />
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>
              {new Intl.NumberFormat('en-US').format(totalRecords)}
            </span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Records</span>
          </div>
        )}
      </div>

      {/* === B. BI-DIRECTIONAL SCROLL VIEWPORT === */}
      <div style={{ flex: 1, overflow: 'auto' }} className="ayabus-scroll-area">
        
        {/* The 1050px Anchor: Forces horizontal scroll if screen is too small */}
        <div style={{ minWidth: '1050px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
          
          {/* --- THE STICKY GRID HEADER --- */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 10, // Pins to the top of the scroll area
            display: 'grid', gridTemplateColumns: GRID_TEMPLATE, alignItems: 'center',
            padding: '12px 24px', background: 'var(--bg-input)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '1px',
            backdropFilter: 'blur(8px)' // Premium glassmorphism effect
          }}>
            <span style={{ paddingRight: '16px' }}>Timestamp & ID</span>
            <span style={{ paddingRight: '24px' }}>Context (Operator & Route)</span>
            <span style={{ paddingRight: '16px' }}>Payment Gateway</span>
            <span style={{ textAlign: 'right', paddingRight: '32px' }}>Gross & Yield</span>
            <span>Status</span>
            <span>{/* Action Column */}</span>
          </div>

          {/* --- THE SCROLLABLE DATA ROWS --- */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
            {isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="animate-pulse" style={{ height: '24px', background: 'var(--bg-input)', borderRadius: '8px', width: '100%' }} />
                  </div>
                ))}
              </div>
            )}

            {!isLoading && transactions.length === 0 && (
              <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}>
                <EmptyState 
                  title="No Settled Transactions"
                  description="Adjust your Omni-Filter parameters to broaden the search."
                  layout="expansive"
                />
              </div>
            )}

            {!isLoading && transactions.length > 0 && (
              <>
                {transactions.map(tx => (
                  <LedgerRow 
                    key={tx.id} 
                    transaction={tx} 
                    activeCurrency={activeCurrency}
                    exchangeRate={exchangeRate}
                    onClick={onRowClick} 
                  />
                ))}
                
                {/* Intersection Observer Target */}
                <div ref={observerTarget} style={{ height: '20px', width: '100%' }} />
                
                {isFetchingNextPage && (
                  <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                )}
                
                {!hasMore && transactions.length > 0 && (
                  <div style={{ padding: '40px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    — End of Ledger —
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionLedger;