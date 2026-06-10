import React, { useState, useEffect, useRef } from 'react';
import { 
    Search, Filter, Calendar, Download, 
    X, ChevronDown, Activity, ShieldCheck, 
    Briefcase, AlertTriangle, SlidersHorizontal
} from 'lucide-react';

// IMPORT LEVEL 1 CONSTANTS
import { AUDIT_DOMAINS, AUDIT_ACTORS, AUDIT_SEVERITY } from '../../data/audit.constants';

/**
 * 👑 FORENSIC STREAM FILTERS (Level 5: Auditor Module - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Auditor
 * File: StreamFilters.jsx
 * * DESCRIPTION:
 * The apex query interface for the Immutable Ledger. Translates human 
 * forensic inquiries into machine-readable API parameters.
 * * UPGRADES:
 * - Progressive Disclosure: Collapsed complex filters into a togglable command bar.
 * - Active Filter Badging: UI warns the Admin if hidden filters are currently active.
 * - Ultra-Compact Pills: Reclaimed vertical space while preserving filter context.
 * - Debounce Physics: Prevents API race conditions during rapid text input.
 */

const StreamFilters = ({ currentFilters, onFilterChange, onExport, isExporting }) => {
    // ========================================================================
    // 1. STATE MANAGEMENT
    // ========================================================================
    const [searchTerm, setSearchTerm] = useState(currentFilters.searchQuery || '');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const debounceTimerRef = useRef(null);

    // ========================================================================
    // 2. DEBOUNCE & SEARCH PHYSICS
    // ========================================================================
    const handleSearchInput = (e) => {
        const val = e.target.value;
        setSearchTerm(val);

        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        
        // Wait 400ms after the Admin stops typing before hammering the API
        debounceTimerRef.current = setTimeout(() => {
            onFilterChange({ ...currentFilters, searchQuery: val, page: 1 });
        }, 400);
    };

    // ========================================================================
    // 3. FILTER MUTATION ENGINE
    // ========================================================================
    const handleSelectChange = (key, value) => {
        onFilterChange({ ...currentFilters, [key]: value, page: 1 });
    };

    const handleClearAll = () => {
        setSearchTerm('');
        onFilterChange({
            page: 1, limit: 50, searchQuery: '', 
            domain: 'ALL', actorType: 'ALL', severity: 'ALL', 
            startDate: '', endDate: ''
        });
        setIsFiltersOpen(false); // Auto-close when cleared
    };

    const removeFilter = (key) => {
        if (key === 'searchQuery') setSearchTerm('');
        onFilterChange({ ...currentFilters, [key]: key === 'searchQuery' ? '' : 'ALL', page: 1 });
    };

    // ========================================================================
    // 4. ACTIVE STATE CALCULATION
    // ========================================================================
    // Checks which filters are currently applied so we can render context pills and badges
    const activePills = [];
    if (currentFilters.searchQuery) activePills.push({ key: 'searchQuery', label: `Search: "${currentFilters.searchQuery}"` });
    if (currentFilters.domain !== 'ALL') activePills.push({ key: 'domain', label: `Domain: ${AUDIT_DOMAINS[currentFilters.domain]?.label || currentFilters.domain}` });
    if (currentFilters.actorType !== 'ALL') activePills.push({ key: 'actorType', label: `Actor: ${AUDIT_ACTORS[currentFilters.actorType]?.label || currentFilters.actorType}` });
    if (currentFilters.severity !== 'ALL') activePills.push({ key: 'severity', label: `Severity: ${AUDIT_SEVERITY[currentFilters.severity]?.label || currentFilters.severity}` });

    const activeFilterCount = activePills.filter(p => p.key !== 'searchQuery').length;

    // ========================================================================
    // 5. RENDER ENGINE
    // ========================================================================
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0, position: 'relative' }}>
            
            {/* Inject Custom Select CSS */}
            <style>
                {`
                    .sovereign-select {
                        appearance: none; -webkit-appearance: none;
                        width: 100%; padding: 12px 40px 12px 36px;
                        background: var(--bg-canvas); border: 1px solid var(--border-subtle);
                        border-radius: 12px; color: var(--text-main);
                        font-size: 13px; font-weight: 800; cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    .sovereign-select:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 15%, transparent); }
                    .sovereign-select:hover { border-color: color-mix(in srgb, var(--text-muted) 50%, transparent); }
                `}
            </style>

            {/* === ROW 1: THE COMMAND BAR === */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                
                {/* Master Search Input */}
                <div style={{ 
                    flex: 1, minWidth: '300px', position: 'relative', display: 'flex', alignItems: 'center',
                    background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)',
                    transition: 'border-color 0.2s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }} onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand-primary)'} onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
                    <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
                    <input 
                        type="text"
                        placeholder="Scan ledger by ID, Identity, IP Address..."
                        value={searchTerm}
                        onChange={handleSearchInput}
                        style={{
                            width: '100%', padding: '16px 40px 16px 44px', background: 'transparent',
                            border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '14px',
                            fontWeight: '600', fontFamily: 'monospace'
                        }}
                    />
                    {searchTerm && (
                        <button onClick={() => { setSearchTerm(''); onFilterChange({ ...currentFilters, searchQuery: '', page: 1 }); }} style={{ position: 'absolute', right: '12px', background: 'var(--bg-input)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <X size={12} />
                        </button>
                    )}
                </div>

                {/* Filter Toggle Button */}
                <button 
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    style={{
                        padding: '0 20px', borderRadius: '16px', background: isFiltersOpen ? 'var(--bg-input)' : 'var(--bg-surface)',
                        border: `1px solid ${isFiltersOpen ? 'var(--text-muted)' : 'var(--border-subtle)'}`, 
                        color: 'var(--text-main)', fontSize: '13px', fontWeight: '800', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease', position: 'relative'
                    }}
                >
                    <SlidersHorizontal size={16} color={activeFilterCount > 0 ? 'var(--brand-primary)' : 'currentColor'} />
                    Filters
                    {/* Glowing active badge */}
                    {activeFilterCount > 0 && (
                        <div style={{ 
                            position: 'absolute', top: '-6px', right: '-6px', background: 'var(--brand-primary)', 
                            color: '#fff', fontSize: '10px', fontWeight: '900', width: '20px', height: '20px', 
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px solid var(--bg-canvas)'
                        }}>
                            {activeFilterCount}
                        </div>
                    )}
                </button>

                {/* Export Action */}
                <button 
                    onClick={onExport}
                    disabled={isExporting}
                    style={{
                        padding: '0 20px', borderRadius: '16px', background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)', color: 'var(--text-main)',
                        fontSize: '13px', fontWeight: '900', cursor: isExporting ? 'wait' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { if (!isExporting) e.currentTarget.style.background = 'var(--bg-input)'; }}
                    onMouseLeave={e => { if (!isExporting) e.currentTarget.style.background = 'var(--bg-surface)'; }}
                >
                    {isExporting ? <Activity size={16} className="animate-spin" /> : <Download size={16} color="var(--brand-primary)" />}
                    {isExporting ? 'Compiling...' : 'Export'}
                </button>
            </div>

            {/* === ROW 2: ADVANCED FILTERS (Progressively Disclosed) === */}
            {isFiltersOpen && (
                <div style={{ 
                    display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', 
                    background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)',
                    animation: 'slideDown 0.2s ease-out'
                }}>
                    <style>
                        {`@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}
                    </style>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        
                        {/* Domain Filter */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}><Activity size={14} /></div>
                            <select className="sovereign-select" value={currentFilters.domain} onChange={(e) => handleSelectChange('domain', e.target.value)}>
                                <option value="ALL">All Ecosystem Domains</option>
                                {Object.values(AUDIT_DOMAINS).map(domain => <option key={domain.id} value={domain.id}>{domain.label}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                        </div>

                        {/* Actor Filter */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}><Briefcase size={14} /></div>
                            <select className="sovereign-select" value={currentFilters.actorType} onChange={(e) => handleSelectChange('actorType', e.target.value)}>
                                <option value="ALL">All Actor Types</option>
                                {Object.values(AUDIT_ACTORS).map(actor => <option key={actor.id} value={actor.id}>{actor.label}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                        </div>

                        {/* Severity Filter */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}><AlertTriangle size={14} /></div>
                            <select className="sovereign-select" value={currentFilters.severity} onChange={(e) => handleSelectChange('severity', e.target.value)}>
                                <option value="ALL">All Severities</option>
                                {Object.values(AUDIT_SEVERITY).map(sev => <option key={sev.id} value={sev.id}>{sev.label}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                        </div>

                        {/* Date Filter */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}><Calendar size={14} /></div>
                            <select className="sovereign-select" defaultValue="7D">
                                <option value="24H">Last 24 Hours</option>
                                <option value="7D">Last 7 Days</option>
                                <option value="30D">Last 30 Days</option>
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                        </div>

                    </div>
                </div>
            )}

            {/* === ROW 3: ULTRA-COMPACT PILLS === */}
            {activePills.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', padding: '0 4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '4px' }}>Active:</span>
                    
                    {activePills.map(pill => (
                        <div key={pill.key} style={{ 
                            display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', 
                            background: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)', 
                            border: '1px solid color-mix(in srgb, var(--brand-primary) 30%, transparent)', 
                            borderRadius: '100px', fontSize: '11px', fontWeight: '800', color: 'var(--brand-primary)'
                        }}>
                            {pill.label}
                            <button onClick={() => removeFilter(pill.key)} style={{ background: 'transparent', border: 'none', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0' }}>
                                <X size={12} strokeWidth={3} />
                            </button>
                        </div>
                    ))}

                    <button onClick={handleClearAll} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', cursor: 'pointer', marginLeft: 'auto', textDecoration: 'underline' }}>
                        Clear All
                    </button>
                </div>
            )}
        </div>
    );
};

export default StreamFilters;