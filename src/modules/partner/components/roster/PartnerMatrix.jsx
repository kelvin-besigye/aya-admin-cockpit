import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Network, Users, Loader2, Filter } from 'lucide-react';

// IMPORT LEVEL 1 & 4 DEPENDENCIES
import { partnerService } from '../../data/partner.service';
import PartnerRow from './PartnerRow';

// IMPORT LEVEL 2 PRIMITIVES (Assuming you have a generic EmptyState, otherwise we render inline)
// import EmptyState from '../primitives/EmptyState'; 

/**
 * 👑 PARTNER MATRIX (Level 4: Macro Hub - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: PartnerMatrix.jsx
 * * DESCRIPTION:
 * The apex infinite-scroll ledger for the Operator network.
 * * UPGRADES:
 * - Bi-Directional Viewport: Houses the 1050px strict-width rows with horizontal scrolling.
 * - Glassmorphism Sticky Header: Table headers remain pinned to the top during vertical scroll.
 * - Algorithmic Sync: Grid template mathematically synced with PartnerRow.jsx.
 */

const PartnerMatrix = ({ 
  filters, 
  onPartnerSelect // Triggers Level 5: Partner Profile 
}) => {

  // ========================================================================
  // 1. STATE: DATA & PAGINATION
  // ========================================================================
  const [partners, setPartners] = useState([]);
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
  const fetchMatrixData = async (currentPage, isReset = false) => {
    try {
      if (isReset) setIsLoading(true);
      else setIsFetchingNextPage(true);

      const response = await partnerService.getPartnerMatrix(filters, currentPage, PAGE_LIMIT);
      
      if (isReset) {
        setPartners(response.data || []);
      } else {
        setPartners(prev => [...prev, ...(response.data || [])]);
      }

      setTotalRecords(response.total || 0);
      setHasMore(currentPage < response.totalPages);

    } catch (error) {
      console.error("Matrix Fetch Error:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  };

  // ========================================================================
  // 3. LIFECYCLE: FILTER CHANGES & OBSERVER
  // ========================================================================
  // Reset and fetch when global filters change
  useEffect(() => {
    setPage(1);
    fetchMatrixData(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); 

  // Infinite Scroll Trigger
  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !isLoading && !isFetchingNextPage) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchMatrixData(nextPage, false);
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
  // STRICT SYNC: Must perfectly match the gridTemplateColumns in PartnerRow.jsx
  const GRID_TEMPLATE = '2.5fr 1.5fr 1fr 2fr 1.5fr 40px';

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
      <div style={{ 
        padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--bg-surface)', zIndex: 20
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.5px' }}>
            <Network size={20} color="var(--brand-primary)" />
            Partner Ecosystem Matrix
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
            Live telemetry and operational ranking of all active fleets.
          </p>
        </div>

        {/* Dynamic Record Counter */}
        {!isLoading && (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', 
            background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-subtle)' 
          }}>
            <Users size={14} color="var(--brand-primary)" />
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>
              {new Intl.NumberFormat('en-US').format(totalRecords)}
            </span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Operators</span>
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
            padding: '12px 24px', background: 'color-mix(in srgb, var(--bg-surface) 85%, transparent)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '1px',
            backdropFilter: 'blur(12px)' // Premium glassmorphism effect
          }}>
            <span style={{ paddingRight: '24px' }}>Identity & Fleet Code</span>
            <span style={{ paddingRight: '16px' }}>Sovereign Tier</span>
            <span style={{ paddingRight: '16px' }}>Health</span>
            <span style={{ paddingRight: '16px' }}>Operational Telemetry</span>
            <span style={{ paddingRight: '16px' }}>Capacity & Issues</span>
            <span>{/* Action Column */}</span>
          </div>

          {/* --- THE SCROLLABLE DATA ROWS --- */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
            {/* Loading Skeletons */}
            {isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="animate-pulse" style={{ height: '28px', background: 'var(--bg-input)', borderRadius: '8px', width: '100%' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && partners.length === 0 && (
              <div style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <Filter size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>No Partners Found</span>
                <span style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>Adjust your Omni-Filter parameters to broaden the search.</span>
              </div>
            )}

            {/* Live Data Injection */}
            {!isLoading && partners.length > 0 && (
              <>
                {partners.map(partner => (
                  <PartnerRow 
                    key={partner.id} 
                    partner={partner} 
                    onClick={onPartnerSelect} 
                  />
                ))}
                
                {/* Intersection Observer Target (The trigger point for infinite scroll) */}
                <div ref={observerTarget} style={{ height: '24px', width: '100%' }} />
                
                {/* Spinner when loading the next chunk */}
                {isFetchingNextPage && (
                  <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                )}
                
                {/* End of Ledger */}
                {!hasMore && partners.length > 0 && (
                  <div style={{ padding: '40px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    — End of Roster —
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

export default PartnerMatrix;