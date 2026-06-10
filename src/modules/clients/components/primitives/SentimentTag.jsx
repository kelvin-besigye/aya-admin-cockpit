import React, { useMemo } from 'react';
import { 
    ShieldAlert, AlertTriangle, Info, 
    CheckCircle2, Tag 
} from 'lucide-react';

// IMPORT LEVEL 1 DEPENDENCIES
import { SENTIMENT_DICTIONARY } from '../../data/clients.constants';

/**
 * 👑 SENTIMENT TAG (Level 2: Visual Primitive - Sovereign Edition)
 * ------------------------------------------------------------------
 * Module: Clients
 * File: SentimentTag.jsx
 * * DESCRIPTION:
 * An autonomous visual taxonomy chip. Automatically resolves its own color, 
 * severity, and iconography by cross-referencing the global NLP dictionary.
 * * UPGRADES:
 * - Autonomous Resolution: Requires only a text string to build its UI state.
 * - Semantic Shaping: Uses sharp radiuses (6px) to distinguish data from users.
 * - Glassmorphism: Color-mix ensures perfect visibility in Dark/Light modes.
 */

const SentimentTag = ({ 
    tag, 
    size = 'md',
    className = '',
    style = {}
}) => {

    // ========================================================================
    // 1. AUTONOMOUS RESOLUTION ENGINE
    // ========================================================================
    const config = useMemo(() => {
        if (!tag) return { color: 'var(--text-muted)', severity: 0, icon: Tag };

        const lowerTag = tag.toLowerCase();
        
        // Scan the global dictionary for a match to determine severity and color
        for (const key in SENTIMENT_DICTIONARY) {
            const category = SENTIMENT_DICTIONARY[key];
            // If any keyword in the dictionary matches our tag text
            if (category.tags.some(t => lowerTag.includes(t.toLowerCase()))) {
                
                // Resolve the Icon based on mathematical severity
                let ResolvedIcon = Info;
                if (category.severityScore >= 100) ResolvedIcon = ShieldAlert;
                else if (category.severityScore >= 50) ResolvedIcon = AlertTriangle;
                else if (category.severityScore < 0) ResolvedIcon = CheckCircle2;

                return { 
                    color: category.color, 
                    severity: category.severityScore, 
                    icon: ResolvedIcon 
                };
            }
        }

        // Fallback for custom/unknown tags (e.g., "Luggage", "General")
        return { color: 'var(--text-muted)', severity: 0, icon: Tag };
    }, [tag]);

    // ========================================================================
    // 2. SIZE & SCALING PHYSICS
    // ========================================================================
    const sizingConfig = {
        sm: { padding: '2px 6px', fontSize: '9px', iconSize: 10, gap: '4px' },
        md: { padding: '4px 8px', fontSize: '10px', iconSize: 12, gap: '6px' },
        lg: { padding: '6px 12px', fontSize: '12px', iconSize: 14, gap: '6px' }
    };
    const currentSize = sizingConfig[size] || sizingConfig.md;
    const Icon = config.icon;

    // ========================================================================
    // 3. RENDER ENGINE
    // ========================================================================
    return (
        <div 
            className={`sentiment-tag ${className}`}
            title={`Severity Score: ${config.severity}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: currentSize.gap,
                padding: currentSize.padding,
                borderRadius: '6px', // Distinct taxonomy shape
                
                // Advanced Sovereign Glassmorphism
                background: `color-mix(in srgb, ${config.color} 10%, transparent)`,
                border: `1px solid color-mix(in srgb, ${config.color} 25%, transparent)`,
                color: config.color,
                
                // Anti-Squish Locks
                flexShrink: 0,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                ...style
            }}
        >
            <Icon 
                size={currentSize.iconSize} 
                strokeWidth={config.severity >= 100 ? 2.5 : 2} 
                style={{ flexShrink: 0 }}
            />
            
            <span style={{ 
                fontSize: currentSize.fontSize, 
                fontWeight: '800', 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px',
                lineHeight: '1',
                transform: 'translateY(0.5px)' // Optical vertical alignment
            }}>
                {tag}
            </span>
        </div>
    );
};

export default SentimentTag;