import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ListFilter, Loader2, ShieldAlert } from 'lucide-react';

// IMPORT LEVEL 1 & 2 & 5 DEPENDENCIES
import { treasuryService } from '../../data/treasury.service';
import EmptyState from '../primitives/EmptyState';
import AnomalyRow from './AnomalyRow';

/**
 * 👑 ANOMALIES LEDGER (Level 5: The Ground Truth - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Treasury
 * File: AnomaliesLedger.jsx
 * * DESCRIPTION:
 * The high-performance, infinite-scroll table for disputes and failures.
 * * UPGRADES (Phase 2):
 * - Bi-Directional Viewport: Safely houses the 1050px strict-width rows.
 * - Sticky Header: Table headers remain pinned to the top during vertical scroll.
 * - Danger Semantics: Retains strict red-tinted color theory for forensic auditing.
 */

const AnomaliesLedger = ({ 
  filters, 
  activeCurrency = 'UGX', 
  exchangeRate = 1,
  onRowClick 
}) => {

  // ========================================================================
  // 1. STATE: DATA & PAGINATION
  // ========================================================================
  const [anomalies, setAnomalies] = useState([]);
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
  const fetchAnomalyData = async (currentPage, isReset = false) => {
    try {
      if (isReset) setIsLoading(true);
      else setIsFetchingNextPage(true);

      const response = await treasuryService.getAnomalyLedger(filters, currentPage, PAGE_LIMIT);
      
      if (isReset) {
        setAnomalies(response.data || []);
      } else {
        setAnomalies(prev => [...prev, ...(response.data || [])]);
      }

      setTotalRecords(response.total || 0);
      setHasMore(currentPage < response.totalPages);

    } catch (error) {
      console.error("Anomalies Ledger Fetch Error:", error);
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
    fetchAnomalyData(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); 

  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !isLoading && !isFetchingNextPage) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchAnomalyData(nextPage, false);
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
  // STRICT SYNC: Must precisely match the columns inside AnomalyRow.jsx
  const GRID_TEMPLATE = '1.5fr 2fr 1.5fr 1.5fr 1.5fr 40px';

  // ========================================================================
  // 5. RENDER ENGINE
  // ========================================================================
  return (
    <div className="citadel-card" style={{
      background: 'var(--bg-surface)', 
      border: '1px solid color-mix(in srgb, var(--status-danger) 30%, transparent)', // Semantic Danger Border
      borderRadius: '24px', display: 'flex', flexDirection: 'column',
      height: '100%', minHeight: '600px', boxShadow: '0 10px 40px rgba(239, 68, 68, 0.05)',
      overflow: 'hidden' 
    }}>
      
      {/* === A. STATIC MASTER HEADER === */}
      <div style={{ 
        padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'color-mix(in srgb, var(--status-danger) 2%, transparent)', // Extremely faint red tint
        zIndex: 20
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--status-danger)', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.5px' }}>
            <ShieldAlert size={20} strokeWidth={2.5} />
            Anomalies & Disputes
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
            Forensic ledger of refunds, chargebacks, and gateway failures.
          </p>
        </div>

        {!isLoading && (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', 
            background: 'var(--bg-surface)', borderRadius: '12px', 
            border: '1px solid color-mix(in srgb, var(--status-danger) 20%, transparent)' 
          }}>
            <ListFilter size={14} color="var(--status-danger)" />
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
            position: 'sticky', top: 0, zIndex: 10,
            display: 'grid', gridTemplateColumns: GRID_TEMPLATE, alignItems: 'center',
            padding: '12px 24px', background: 'var(--bg-input)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '1px',
            backdropFilter: 'blur(8px)'
          }}>
            <span style={{ paddingRight: '16px' }}>Timestamp & ID</span>
            <span style={{ paddingRight: '24px' }}>Context (Operator)</span>
            <span style={{ paddingRight: '16px' }}>Payment Gateway</span>
            <span style={{ textAlign: 'right', paddingRight: '32px' }}>Financial Impact</span>
            <span style={{ paddingRight: '16px' }}>Status & Reason</span>
            <span>{/* Action Column */}</span>
          </div>

          {/* --- THE SCROLLABLE DATA ROWS --- */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
            {isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="animate-pulse" style={{ height: '24px', background: 'var(--bg-input)', borderRadius: '8px', width: '100%' }} />
                  </div>
                ))}
              </div>
            )}

            {!isLoading && anomalies.length === 0 && (
              <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}>
                <EmptyState 
                  icon={ShieldAlert}
                  title="Zero Anomalies Detected"
                  description="No refunds or failed transactions found for the selected timeframe. Operations are running perfectly."
                  layout="expansive"
                />
              </div>
            )}

            {!isLoading && anomalies.length > 0 && (
              <>
                {anomalies.map(tx => (
                  <AnomalyRow 
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
                  <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', color: 'var(--status-danger)' }}>
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                )}
                
                {!hasMore && anomalies.length > 0 && (
                  <div style={{ padding: '40px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    — End of Anomaly Ledger —
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

export default AnomaliesLedger;