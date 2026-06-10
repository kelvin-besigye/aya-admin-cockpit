import React, { useState, useEffect, useMemo } from 'react';
import { 
    FileText, ShieldCheck, ShieldAlert, Clock, 
    UploadCloud, ExternalLink, AlertOctagon 
} from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { partnerService } from '../../data/partner.service';
import { analyzeComplianceStatus } from '../../data/partner.utils';
import { COMPLIANCE_DOCUMENTS } from '../../data/partner.constants';

/**
 * 👑 DOCUMENT VAULT (Level 5: The Compliance Shield - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Partner
 * File: DocumentVault.jsx
 * * DESCRIPTION:
 * A forensic ledger tracking all mandatory regulatory documents (MoWT, TLB, IOV).
 * Automatically calculates expiry timelines and engages Hard Blocks if an 
 * operator becomes non-compliant.
 * * UPGRADES:
 * - Bi-Directional Viewport: Safely houses the 1000px strict-width legal rows.
 * - Timeline Visualization: Physical bars representing the document's lifespan.
 * - Auto-Triage: Immediately bubbles expired or critical documents to the top.
 */

const DocumentVault = ({ partner }) => {

    // ========================================================================
    // 1. STATE & DATA FETCHING
    // ========================================================================
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!partner?.id) return;
        
        let isMounted = true;
        setIsLoading(true);

        // Fetch the specific legal document registry for this partner
        partnerService.getComplianceVault(partner.id)
            .then(data => {
                if (isMounted) setDocuments(data || []);
            })
            .catch(err => console.error("Compliance Fetch Error:", err))
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, [partner?.id]);

    // ========================================================================
    // 2. COMPLIANCE INTELLIGENCE ENGINE
    // ========================================================================
    const { processedDocs, systemHealth, hasHardBlock } = useMemo(() => {
        if (!documents.length) return { processedDocs: [], systemHealth: 'UNKNOWN', hasHardBlock: false };

        let blockActive = false;
        let lowestStatus = 'VALID';

        // Augment raw DB data with our Sovereign Date Math
        const augmented = documents.map(doc => {
            const config = COMPLIANCE_DOCUMENTS[doc.docType];
            const analysis = analyzeComplianceStatus(doc.expiryDate, doc.docType);
            
            if (analysis.isHardBlock && analysis.status === 'EXPIRED') blockActive = true;
            if (analysis.status === 'EXPIRED') lowestStatus = 'EXPIRED';
            else if (analysis.status === 'CRITICAL' && lowestStatus !== 'EXPIRED') lowestStatus = 'CRITICAL';
            else if (analysis.status === 'WARNING' && lowestStatus === 'VALID') lowestStatus = 'WARNING';

            return {
                ...doc,
                config,
                analysis,
                // Calculate percentage of lifespan remaining (assuming 1 year validity for the bar chart)
                lifespanPct: Math.max(0, Math.min(100, (analysis.daysRemaining / 365) * 100))
            };
        });

        // Sort: Expired/Critical bubble to the top automatically
        augmented.sort((a, b) => a.analysis.daysRemaining - b.analysis.daysRemaining);

        return { processedDocs: augmented, systemHealth: lowestStatus, hasHardBlock: blockActive };
    }, [documents]);

    // ========================================================================
    // 3. CSS GRID DEFINITION
    // ========================================================================
    const GRID_TEMPLATE = '2fr 1.5fr 2fr 1.5fr 100px';

    // ========================================================================
    // 4. RENDER ENGINE
    // ========================================================================
    return (
        <div className="citadel-card" style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: '24px', display: 'flex', flexDirection: 'column',
            height: '100%', minHeight: '500px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
            overflow: 'hidden'
        }}>
            
            {/* === A. MASTER HEADER & HARD BLOCK ALERT === */}
            <div style={{ 
                padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                flexWrap: 'wrap', gap: '20px', 
                background: hasHardBlock ? 'color-mix(in srgb, var(--status-danger) 2%, var(--bg-surface))' : 'var(--bg-surface)', 
                zIndex: 20, transition: 'background 0.3s ease'
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: hasHardBlock ? 'var(--status-danger)' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
                        {hasHardBlock ? <AlertOctagon size={20} /> : <FileText size={20} color="var(--brand-primary)" />}
                        Regulatory Document Vault
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Live monitoring of MoWT and TLB compliance mandates.
                    </p>
                </div>

                {/* Macro System Health Indicator */}
                {!isLoading && (
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
                        background: hasHardBlock ? 'color-mix(in srgb, var(--status-danger) 10%, transparent)' : 'var(--bg-input)', 
                        borderRadius: '12px', 
                        border: `1px solid ${hasHardBlock ? 'color-mix(in srgb, var(--status-danger) 20%, transparent)' : 'var(--border-subtle)'}` 
                    }}>
                        {hasHardBlock ? <ShieldAlert size={16} color="var(--status-danger)" /> : <ShieldCheck size={16} color="var(--status-success)" />}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '10px', fontWeight: '800', color: hasHardBlock ? 'var(--status-danger)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Shield Status
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: '900', color: hasHardBlock ? 'var(--status-danger)' : 'var(--text-main)', letterSpacing: '-0.5px' }}>
                                {hasHardBlock ? 'DISPATCH LOCKED' : 'Fully Compliant'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* === B. BI-DIRECTIONAL SCROLL VIEWPORT === */}
            <div style={{ flex: 1, overflow: 'auto' }} className="ayabus-scroll-area">
                
                {/* The 1000px Anchor: Prevents legal text from squishing on mobile */}
                <div style={{ minWidth: '1000px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                    
                    {/* --- THE STICKY GRID HEADER --- */}
                    <div style={{
                        position: 'sticky', top: 0, zIndex: 10,
                        display: 'grid', gridTemplateColumns: GRID_TEMPLATE, alignItems: 'center',
                        padding: '12px 32px', background: 'color-mix(in srgb, var(--bg-surface) 85%, transparent)',
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '1px',
                        backdropFilter: 'blur(12px)'
                    }}>
                        <span style={{ paddingRight: '16px' }}>Requirement & Authority</span>
                        <span style={{ paddingRight: '16px' }}>Status Verification</span>
                        <span style={{ paddingRight: '24px' }}>Expiry Timeline</span>
                        <span style={{ paddingRight: '16px' }}>Exact Expiry Date</span>
                        <span style={{ textAlign: 'right' }}>Actions</span>
                    </div>

                    {/* --- THE SCROLLABLE DATA ROWS --- */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        
                        {/* Loading State */}
                        {isLoading && (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)' }}>
                                        <div className="animate-pulse" style={{ height: '28px', background: 'var(--bg-input)', borderRadius: '8px', width: '100%' }} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Live Data Injection */}
                        {!isLoading && processedDocs.map((doc, index) => (
                            <DocumentRow key={doc.docType || index} doc={doc} gridTemplate={GRID_TEMPLATE} />
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};

// ========================================================================
// 5. SUB-COMPONENT: DOCUMENT ROW (The Uncrushable Grid Atom)
// ========================================================================
const DocumentRow = ({ doc, gridTemplate }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const { config, analysis, lifespanPct } = doc;
    const isExpired = analysis.status === 'EXPIRED';

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'grid', gridTemplateColumns: gridTemplate, alignItems: 'center',
                padding: '20px 32px', background: isHovered ? 'var(--bg-hover)' : 'transparent',
                borderBottom: '1px solid var(--border-subtle)',
                transition: 'background 0.2s ease', position: 'relative'
            }}
        >
            {/* Critical Edge Highlight */}
            {(isExpired || analysis.status === 'CRITICAL') && (
                <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                    background: analysis.color, borderTopRightRadius: '4px', borderBottomRightRadius: '4px'
                }} />
            )}

            {/* Col 1: Requirement & Authority */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, paddingRight: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {config?.label || doc.docType}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Authority: {doc.verifier || config?.authority}
                </span>
            </div>

            {/* Col 2: Status Badge & Block Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0, paddingRight: '16px', alignItems: 'flex-start' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '4px 10px', borderRadius: '100px',
                    background: `color-mix(in srgb, ${analysis.color} 10%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${analysis.color} 20%, transparent)`,
                    color: analysis.color, fontSize: '10px', fontWeight: '900', textTransform: 'uppercase'
                }}>
                    {isExpired ? <ShieldAlert size={12} strokeWidth={2.5} /> : <CheckCircle2 size={12} strokeWidth={2.5} />}
                    {analysis.label}
                </div>
                {/* Reveal if this specific document causes a hard block */}
                {analysis.isHardBlock && isExpired && (
                    <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--status-danger)', textTransform: 'uppercase', letterSpacing: '0.5px', background: 'color-mix(in srgb, var(--status-danger) 10%, transparent)', padding: '2px 6px', borderRadius: '4px' }}>
                        API Dispatch Locked
                    </span>
                )}
            </div>

            {/* Col 3: Visual Expiry Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0, paddingRight: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>Lifespan</span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: analysis.color, fontFamily: 'monospace' }}>
                        {analysis.daysRemaining} Days Left
                    </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                        height: '100%', width: `${lifespanPct}%`, 
                        background: analysis.color, borderRadius: '4px',
                        transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' 
                    }} />
                </div>
            </div>

            {/* Col 4: Exact Expiry Date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, paddingRight: '16px' }}>
                <Clock size={14} color={isExpired ? 'var(--status-danger)' : 'var(--text-muted)'} />
                <span style={{ fontSize: '13px', fontWeight: '800', fontFamily: 'monospace', color: isExpired ? 'var(--status-danger)' : 'var(--text-main)' }}>
                    {doc.expiryDate}
                </span>
            </div>

            {/* Col 5: Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                <button 
                    title="View Document"
                    style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: isHovered ? 'var(--bg-input)' : 'transparent',
                        border: `1px solid ${isHovered ? 'var(--border-subtle)' : 'transparent'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s ease'
                    }}
                >
                    <ExternalLink size={14} />
                </button>
                <button 
                    title={isExpired ? "Request Urgent Renewal" : "Update Document"}
                    style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: isExpired ? 'var(--status-danger)' : 'color-mix(in srgb, var(--brand-primary) 10%, transparent)',
                        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isExpired ? '#fff' : 'var(--brand-primary)', cursor: 'pointer', transition: 'all 0.2s ease',
                        boxShadow: isExpired ? '0 4px 12px color-mix(in srgb, var(--status-danger) 30%, transparent)' : 'none'
                    }}
                >
                    <UploadCloud size={14} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default DocumentVault;