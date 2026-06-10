import React from 'react';
import { Shield, Clock, User, HardDrive, Terminal } from 'lucide-react';

/**
 * SECURITY LOG (Level 6: The Microscope)
 * ------------------------------------------------------------------
 * An immutable activity trail for a single transaction.
 * Tracks administrative actions to ensure regulatory compliance.
 */

const SecurityLog = ({ logs = [], isLoading = false }) => {

  // 1. SEVERITY THEME ENGINE
  const getActionTheme = (action) => {
    const act = action.toUpperCase();
    if (act.includes('REFUND') || act.includes('VOID')) return { color: 'var(--status-danger)', bg: 'rgba(239, 68, 68, 0.1)' };
    if (act.includes('EXPORT') || act.includes('DOWNLOAD')) return { color: 'var(--status-warning)', bg: 'rgba(245, 158, 11, 0.1)' };
    return { color: 'var(--brand-primary)', bg: 'rgba(14, 165, 233, 0.1)' };
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '16px',
      padding: '20px', background: 'var(--bg-input)', borderRadius: '12px',
      border: '1px solid var(--border-subtle)'
    }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <Terminal size={16} color="var(--text-muted)" />
        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Audit Trail & Access Logs
        </span>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse" style={{ height: '50px', background: 'var(--bg-surface)', borderRadius: '8px' }} />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed var(--border-subtle)', borderRadius: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No administrative actions recorded yet.</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border-subtle)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          {logs.map((log, index) => {
            const theme = getActionTheme(log.action);
            return (
              <div key={log.id || index} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 120px', gap: '12px',
                padding: '12px', background: 'var(--bg-surface)', alignItems: 'center'
              }}>
                
                {/* ICON BLOCK */}
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '8px', background: theme.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Shield size={14} color={theme.color} />
                </div>

                {/* CONTENT BLOCK */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                    {log.action}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={10} /> {log.admin_name}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace' }}>
                      <HardDrive size={10} /> {log.ip_address || '0.0.0.0'}
                    </span>
                  </div>
                </div>

                {/* TIMESTAMP BLOCK */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    <Clock size={10} /> {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* FOOTER COMPLIANCE NOTE */}
      <div style={{ padding: '8px', background: 'rgba(var(--brand-primary-rgb), 0.05)', borderRadius: '6px', border: '1px solid rgba(var(--brand-primary-rgb), 0.1)' }}>
        <p style={{ margin: 0, fontSize: '10px', color: 'var(--brand-primary)', fontWeight: '600', textAlign: 'center' }}>
          Logs are cryptographically hashed and cannot be modified by administrators.
        </p>
      </div>
    </div>
  );
};

export default SecurityLog;