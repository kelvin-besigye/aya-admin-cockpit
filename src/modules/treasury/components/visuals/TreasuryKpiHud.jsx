import React, { useMemo } from 'react';
import { Wallet, Landmark, HandCoins, Ticket } from 'lucide-react';

// IMPORT LEVEL 1 & 2 DEPENDENCIES
import KpiCard from '../primitives/KpiCard';
import { formatCurrency } from '../../data/treasury.utils';

/**
 * 👑 TREASURY KPI HUD (Level 4: Dashboard Visual - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Treasury
 * File: TreasuryKpiHud.jsx
 * * DESCRIPTION:
 * The high-fidelity command strip for financial health.
 * Orchestrates the spacing and distribution of core liquidity metrics.
 * * UPGRADES (Phase 3):
 * - Fluid Grid Architecture: Swapped 'repeat(4, 1fr)' for 'auto-fit' 
 * to permanently prevent card crushing on smaller displays.
 * - System Cadence Sync: Gap adjusted to 24px to match the global OS standard.
 */

const TreasuryKpiHud = ({ 
  data,               
  previousData,       
  isLoading = false,
  activeCurrency = 'UGX',
  exchangeRate = 1 
}) => {

  // ========================================================================
  // 1. DATA RESOLUTION (Ensuring zero-state stability)
  // ========================================================================
  const current = data || { 
    gross_volume: 0, 
    platform_yield: 0, 
    partner_payout: 0, 
    ticket_count: 0 
  };
  
  const previous = previousData || { 
    gross_volume: 0, 
    platform_yield: 0, 
    partner_payout: 0, 
    ticket_count: 0 
  };

  // ========================================================================
  // 2. FORMATTERS
  // ========================================================================
  const formatMoney = (val) => formatCurrency(val, activeCurrency, exchangeRate);
  const formatTickets = (val) => new Intl.NumberFormat('en-US').format(val || 0);

  // ========================================================================
  // 3. RENDER ENGINE
  // ========================================================================
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', // THE CRITICAL FLUIDITY UPGRADE
      gap: '24px',          // Aligned with Analytics HUD for system-wide consistency
      width: '100%',
      padding: '4px',       // SHADOW BUFFER: Prevents KpiCard hover-shadows from being clipped
      boxSizing: 'border-box'
    }}>
      
      {/* CARD 1: GROSS VOLUME (The Top Line) */}
      <KpiCard 
        title="Gross Volume"
        value={formatMoney(current.gross_volume)}
        icon={Wallet}
        accentColor="var(--brand-primary)" // Citadel Blue
        tooltipDescription="Total revenue processed through all gateways before any deductions or fees."
        isLoading={isLoading}
        varianceData={{
          current: current.gross_volume,
          previous: previous.gross_volume
        }}
      />

      {/* CARD 2: PLATFORM YIELD (Our Revenue) */}
      <KpiCard 
        title="Platform Yield"
        value={formatMoney(current.platform_yield)}
        icon={Landmark}
        accentColor="#F59E0B" // Citadel Gold
        tooltipDescription="The net service fees retained by the platform after gateway costs."
        isLoading={isLoading}
        varianceData={{
          current: current.platform_yield,
          previous: previous.platform_yield
        }}
      />

      {/* CARD 3: OPERATOR PAYOUT (The Liability) */}
      <KpiCard 
        title="Operator Payout"
        value={formatMoney(current.partner_payout)}
        icon={HandCoins}
        accentColor="#10B981" // Success Emerald
        tooltipDescription="Total funds earmarked for distribution to bus operators and partners."
        isLoading={isLoading}
        varianceData={{
          current: current.partner_payout,
          previous: previous.partner_payout
        }}
      />

      {/* CARD 4: TICKET VOLUME (Throughput) */}
      <KpiCard 
        title="Tickets Sold"
        value={formatTickets(current.ticket_count)}
        icon={Ticket}
        accentColor="#8B5CF6" // Analytics Purple
        tooltipDescription="Total volume of settled ticket transactions across the network."
        isLoading={isLoading}
        varianceData={{
          current: current.ticket_count,
          previous: previous.ticket_count
        }}
      />

    </div>
  );
};

export default TreasuryKpiHud;