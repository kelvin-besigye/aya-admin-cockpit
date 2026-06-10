import React, { useState, useEffect, useCallback } from 'react';
import { Network, Activity, Database, RefreshCcw } from 'lucide-react';

// 1. DATA & LOGIC LAYER (The Brain)
import { treasuryService } from './data/treasury.service';
import { fxService } from './data/fx.service';
import { DEFAULT_BASE_CURRENCY } from './data/treasury.constants'; 

// 2. COMPONENT LAYER (The Upgraded Sovereign Children)
import OmniFilterBar from './components/controls/OmniFilterBar';
import TreasuryKpiHud from './components/visuals/TreasuryKpiHud';
import RevenueChart from './components/visuals/RevenueChart';
import GatewaySplitChart from './components/visuals/GatewaySplitChart';
import PerformanceLeaderboard from './components/visuals/PerformanceLeaderboard';
import UnitEconomicsBar from './components/visuals/UnitEconomicsBar';
import TransactionLedger from './components/ledger/TransactionLedger';
import AnomaliesLedger from './components/ledger/AnomaliesLedger';
import TransactionInspector from './components/inspector/TransactionInspector';

/**
 * 👑 AYABUS TREASURY MODULE (Level 7: The Master Orchestrator)
 * ------------------------------------------------------------------
 * Module: Treasury
 * File: TreasuryModule.jsx
 * * DESCRIPTION:
 * The apex command center for the financial ecosystem.
 * Orchestrates the fluid layout, global state, and data routing for all
 * 7 Sovereign UI components.
 */

const TreasuryModule = () => {
  // ========================================================================
  // 1. MASTER STATE MANAGEMENT
  // ========================================================================
  const [filters, setFilters] = useState({
    epochId: 'TODAY',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    partnerId: 'ALL',
    routeId: 'ALL',
    gateway: 'ALL'
  });

  const [activeCurrency, setActiveCurrency] = useState(DEFAULT_BASE_CURRENCY);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Component-Specific State
  const [leaderboardTab, setLeaderboardTab] = useState('PARTNER'); // 'PARTNER' | 'ROUTE'
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  // Data Stores
  const [dashboardData, setDashboardData] = useState({
    kpis: null,
    kpisPrevious: null,
    revenue: [],
    gateways: [],
    economics: {},
    leaderboard: []
  });

  // ========================================================================
  // 2. THE GLOBAL FX ENGINE (Currency Resolution)
  // ========================================================================
  useEffect(() => {
    const fetchRate = async () => {
      if (activeCurrency === DEFAULT_BASE_CURRENCY) {
        setExchangeRate(1);
        return;
      }
      const rate = await fxService.getLiveRate(DEFAULT_BASE_CURRENCY, activeCurrency);
      setExchangeRate(rate);
    };
    fetchRate();
  }, [activeCurrency]);

  // ========================================================================
  // 3. THE MASTER FETCH ENGINE (Routing data to the charts)
  // * Note: Ledgers fetch their own infinite-scroll data based on filters.
  // ========================================================================
  const fetchDashboardIntelligence = useCallback(async () => {
    setIsLoading(true);
    try {
      // Execute all macro-economic fetches concurrently for maximum speed
      const [kpis, revenue, gateways, economics, leaderboard] = await Promise.all([
        treasuryService.getKpis(filters),
        treasuryService.getRevenueVelocity(filters),
        treasuryService.getGatewayDistribution(filters),
        treasuryService.getUnitEconomics(filters),
        treasuryService.getLeaderboard(filters, leaderboardTab)
      ]);

      setDashboardData({
        kpis: kpis.current,
        kpisPrevious: kpis.previous,
        revenue,
        gateways,
        economics,
        leaderboard
      });
    } catch (error) {
      console.error("Treasury Intelligence Sync Failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, leaderboardTab]);

  useEffect(() => {
    fetchDashboardIntelligence();
  }, [fetchDashboardIntelligence]);

  // ========================================================================
  // 4. INTERACTION HANDLERS
  // ========================================================================
  const handleInspectTransaction = (tx) => {
    setSelectedTx(tx);
    setIsInspectorOpen(true);
  };

  // ========================================================================
  // 5. RENDER ENGINE (The 100vw Sovereign Fluid Layout)
  // ========================================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)', overflow: 'hidden' }}>
      
      {/* --- A. THE GLOBAL CONTROL BAR --- */}
      <div style={{ flexShrink: 0, zIndex: 50, position: 'relative' }}>
        <OmniFilterBar 
          filters={filters} 
          onFilterChange={setFilters}
          activeCurrency={activeCurrency}
          onCurrencyChange={setActiveCurrency}
          isGlobalLoading={isLoading}
        />
      </div>

      {/* --- B. THE PROTECTED SCROLL VIEWPORT --- */}
      <div className="ayabus-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* ZONE 1: Executive KPI Strip */}
        <section>
          <TreasuryKpiHud 
            data={dashboardData.kpis} 
            previousData={dashboardData.kpisPrevious}
            isLoading={isLoading}
            activeCurrency={activeCurrency}
            exchangeRate={exchangeRate}
          />
        </section>

        {/* ZONE 2: Macro-Economics (Fluid Wrap Architecture) */}
        <section style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
          {/* Left: The Velocity Engine (Takes up more space) */}
          <div style={{ flex: '2 1 600px' }}>
            <RevenueChart 
              data={dashboardData.revenue} 
              isLoading={isLoading}
              activeCurrency={activeCurrency}
              exchangeRate={exchangeRate}
            />
          </div>
          {/* Right: The Forensic Economics (Takes up less space) */}
          <div style={{ flex: '1 1 350px' }}>
            <UnitEconomicsBar 
              data={dashboardData.economics} 
              isLoading={isLoading}
              activeCurrency={activeCurrency}
              exchangeRate={exchangeRate}
            />
          </div>
        </section>

        {/* ZONE 3: Ecosystem Distribution (Fluid Wrap Architecture) */}
        <section style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
          <div style={{ flex: '1 1 400px' }}>
            <GatewaySplitChart 
              data={dashboardData.gateways} 
              isLoading={isLoading}
              activeCurrency={activeCurrency}
              exchangeRate={exchangeRate}
            />
          </div>
          <div style={{ flex: '1 1 400px' }}>
            <PerformanceLeaderboard 
              data={dashboardData.leaderboard}
              activeTab={leaderboardTab}
              onTabChange={setLeaderboardTab}
              isLoading={isLoading}
              activeCurrency={activeCurrency}
              exchangeRate={exchangeRate}
            />
          </div>
        </section>

        {/* ZONE 4: THE GROUND TRUTH (The Infinite Ledgers) */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '16px' }}>
          
          {/* Visual Divider to separate Analytics from Raw Data */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <Database size={14} /> Financial Ledgers
            </div>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          <div style={{ flex: '1 1 100%' }}>
            {/* Decoupled: It fetches its own data using the global filters */}
            <TransactionLedger 
              filters={filters}
              activeCurrency={activeCurrency}
              exchangeRate={exchangeRate}
              onRowClick={handleInspectTransaction}
            />
          </div>

          <div style={{ flex: '1 1 100%' }}>
            {/* Decoupled: It fetches its own data using the global filters */}
            <AnomaliesLedger 
              filters={filters}
              activeCurrency={activeCurrency}
              exchangeRate={exchangeRate}
              onRowClick={handleInspectTransaction}
            />
          </div>
        </section>

        {/* Spacer to allow scrolling past the bottom ledger comfortably */}
        <div style={{ height: '40px' }} />

      </div>

      {/* --- C. THE FORENSIC INSPECTOR MODAL --- */}
      <TransactionInspector 
        isOpen={isInspectorOpen}
        transaction={selectedTx}
        onClose={() => setIsInspectorOpen(false)}
        activeCurrency={activeCurrency}
        exchangeRate={exchangeRate}
      />

    </div>
  );
};

export default TreasuryModule;
