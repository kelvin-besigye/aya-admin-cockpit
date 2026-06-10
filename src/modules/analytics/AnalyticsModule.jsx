import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Calendar, RefreshCw, ShieldCheck } from 'lucide-react';

// --- 1. ENGINES & DICTIONARIES ---
import { TIME_WINDOWS } from './data/analytics.constants';
import { analyticsService } from './data/analytics.service';
import { AnalyticsPhysics } from './data/analytics.physics';

// --- 2. THE 5 INTELLIGENCE ZONES ---
import GlobalTelemetryHud from './components/visuals/GlobalTelemetryHud';
import ApexMatrix from './components/leaderboards/ApexMatrix';
import TemporalPhysics from './components/charts/TemporalPhysics';
import NetworkTide from './components/charts/NetworkTide';
import CabinPreferenceMap from './components/heatmaps/CabinPreferenceMap';

/**
 * 👑 AYABUS ANALYTICS & INTELLIGENCE CENTRE (Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Analytics
 * File: AnalyticsModule.jsx
 * * DESCRIPTION:
 * The Master Orchestrator. Controls the Global Time Dial, handles 
 * the massive database fetch payloads, and feeds the processed 
 * physics down into the 5 UI Zones.
 */

const AnalyticsModule = () => {

    // ========================================================================
    // A. MASTER STATE
    // ========================================================================
    const [timeframe, setTimeframe] = useState(TIME_WINDOWS.TODAY);
    const [isLoading, setIsLoading] = useState(true);
    const [lastSync, setLastSync] = useState(new Date());

    // Processed Data States for the 5 Zones
    const [telemetry, setTelemetry] = useState(null);
    const [matrix, setMatrix] = useState(null);
    const [behavioral, setBehavioral] = useState(null);
    const [gravity, setGravity] = useState(null);
    const [channels, setChannels] = useState(null);
    const [migration, setMigration] = useState(null);
    const [delays, setDelays] = useState([]);

    // ========================================================================
    // B. THE HARVEST & PHYSICS PIPELINE
    // ========================================================================
    const loadIntelligence = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Fetch raw data from the Supabase Harvester based on the Time Dial
            const response = await analyticsService.fetchTelemetryData(timeframe);

            if (!response.success) {
                throw new Error(response.error);
            }

            const { currentTickets, previousTickets, slaAverageMinutes, activeNetworkCapacity } = response.data;

            // 2. Route raw data through the Physics Engine
            const computedTelemetry = AnalyticsPhysics.computeGlobalTelemetry(currentTickets, previousTickets, activeNetworkCapacity);
            
            // Inject the SLA from the Harvester into the Telemetry payload
            computedTelemetry.slaAverageMinutes = slaAverageMinutes;
            
            setTelemetry(computedTelemetry);
            setMatrix(AnalyticsPhysics.generateApexMatrix(currentTickets));
            setBehavioral(AnalyticsPhysics.calculateBehavioralVelocity(currentTickets));
            setGravity(AnalyticsPhysics.computeSeatGravity(currentTickets));

            // 3. Dynamic Aggregations for Tide & Punctuality
            let mobile = 0, web = 0, boxOffice = 0;
            let inbound = 0, outbound = 0;
            let operatorDelays = {};

            currentTickets.forEach(t => {
                // A. Channels extraction
                const ch = (t.meta?.channel || 'boxoffice').toLowerCase();
                if (ch.includes('mobile')) mobile++;
                else if (ch.includes('web')) web++;
                else boxOffice++;

                // B. Migration Tide (Inbound to Hub vs Outbound to Borders)
                const dest = (t.routes?.destination_city || '').toLowerCase();
                // Assuming 'Kampala' is the primary central hub
                if (dest.includes('kampala')) inbound++;
                else outbound++;

                // C. Operator Delays
                const opName = t.partners?.company_name || 'Unknown Operator';
                const delayMins = t.meta?.delay_minutes || 0; // If logged by gatekeepers
                if (!operatorDelays[opName]) operatorDelays[opName] = { total: 0, count: 0 };
                operatorDelays[opName].total += delayMins;
                operatorDelays[opName].count += 1;
            });

            setChannels({ mobile, web, boxOffice });
            setMigration({ inbound, outbound });
            
            const computedDelays = Object.keys(operatorDelays).map(op => ({
                operatorName: op,
                delayMinutes: operatorDelays[op].count > 0 ? Math.round(operatorDelays[op].total / operatorDelays[op].count) : 0
            }));
            setDelays(computedDelays);

            setLastSync(new Date());

        } catch (error) {
            console.error("Intelligence Pipeline Failed:", error);
            // In production, trigger a toast notification here
        } finally {
            setIsLoading(false);
        }
    }, [timeframe]);

    // Re-run pipeline every time the Time Dial changes
    useEffect(() => {
        loadIntelligence();
    }, [loadIntelligence]);

    // ========================================================================
    // C. RENDER ENGINE (The Sovereign 100vw Layout)
    // ========================================================================
    return (
        <div className="ayabus-scroll-area" style={{ 
            height: '100%', overflowY: 'auto', background: 'var(--bg-canvas)',
            padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px'
        }}>
            
            {/* --- MASTER HEADER & GLOBAL TIME DIAL --- */}
            <header style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', 
                paddingBottom: '24px', borderBottom: '2px solid var(--border-subtle)' 
            }}>
                <div>
                    <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--brand-primary)', letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={14} /> Intelligence Centre
                    </span>
                    <h1 style={{ margin: '4px 0 0 0', fontSize: '32px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-1.5px' }}>
                        OPERATIONAL TELEMETRY
                    </h1>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    
                    {/* Last Sync Indicator */}
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RefreshCw size={10} style={{ cursor: 'pointer' }} onClick={loadIntelligence} className={isLoading ? "animate-spin" : ""} />
                        Live Sync: {lastSync.toLocaleTimeString()}
                    </div>

                    {/* The Time Dial (Segmented Control) */}
                    <div style={{ display: 'flex', background: 'var(--bg-input)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        {Object.entries(TIME_WINDOWS).map(([key, value]) => {
                            const isActive = timeframe === value;
                            return (
                                <button 
                                    key={value}
                                    onClick={() => setTimeframe(value)}
                                    style={{
                                        padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                        background: isActive ? 'var(--bg-surface)' : 'transparent',
                                        color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                                        fontWeight: '800', fontSize: '12px', letterSpacing: '0.5px',
                                        boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {value === 'TODAY' && <Calendar size={12} style={{ display: 'inline', marginRight: '6px', marginBottom: '-2px' }} />}
                                    {value}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* --- ZONE 1: GLOBAL TELEMETRY (The Reality Check) --- */}
            <section>
                <GlobalTelemetryHud metrics={telemetry} isLoading={isLoading} />
            </section>

            {/* --- ZONE 2: THE APEX MATRIX (Leaderboards) --- */}
            <section>
                <ApexMatrix matrixData={matrix} isLoading={isLoading} />
            </section>

            {/* --- ZONES 3 & 4: MACRO BEHAVIOR (50/50 Split) --- */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '32px' }}>
                <TemporalPhysics behavioralData={behavioral} delayData={delays} isLoading={isLoading} />
                <NetworkTide channelData={channels} migrationData={migration} isLoading={isLoading} />
            </section>

            {/* --- ZONE 5: CABIN HEATMAP (The Killer Feature) --- */}
            <section style={{ paddingBottom: '60px' }}>
                <CabinPreferenceMap gravityData={gravity} isLoading={isLoading} />
            </section>

            {/* SCROLLBAR PERFORMANCE OVERRIDES */}
            <style>{`
                .ayabus-scroll-area::-webkit-scrollbar { width: 6px; }
                .ayabus-scroll-area::-webkit-scrollbar-track { background: transparent; }
                .ayabus-scroll-area::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 10px; }
                .ayabus-scroll-area::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
            `}</style>
        </div>
    );
};

export default AnalyticsModule;