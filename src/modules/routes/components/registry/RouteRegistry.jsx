import React, { useEffect, useState, useMemo } from 'react';
import { RefreshCw, Layers, Clock, Filter, AlertCircle, ChevronRight } from 'lucide-react';
import { routesService } from '../../data/routes.service';
import RegistryHeader from './RegistryHeader'; 
import RouteSidebar from './RouteSidebar'; 

const RouteRegistry = ({ onSelect, onEdit, isCompact }) => {
  const [routes, setRoutes] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [view, setView] = useState('ACTIVE');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [liveData, draftData] = await Promise.all([
        routesService.fetchRoutes(),
        routesService.fetchDrafts()
      ]);
      setRoutes(liveData || []);
      setDrafts(draftData || []);
    } catch (err) {
      console.error("Registry Sync Failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const handleUpdate = () => fetchAllData();
    window.addEventListener('citadel-routes-update', handleUpdate);
    window.addEventListener('citadel-draft-update', handleUpdate);
    return () => {
      window.removeEventListener('citadel-routes-update', handleUpdate);
      window.removeEventListener('citadel-draft-update', handleUpdate);
    };
  }, []);

  const routeTree = useMemo(() => {
    if (view === 'DRAFTS') return {};
    const q = searchQuery.toLowerCase();
    const filtered = routes.filter(r => {
      if (!q) return true;
      return (
        r.origin_city?.toLowerCase().includes(q) ||
        r.destination_city?.toLowerCase().includes(q) ||
        r.partners?.company_name?.toLowerCase().includes(q) ||
        r.route_code?.toLowerCase().includes(q)
      );
    });

    const tree = {};
    filtered.forEach(route => {
      const pId = route.partner_id || 'unknown';
      const pName = route.partners?.company_name || 'Unassigned Partner';
      const cId = route.bus_config_id || 'unknown_config';
      const cName = route.bus_configs?.bus_class || 'Standard Class';

      if (!tree[pId]) tree[pId] = { id: pId, label: pName, configs: {} };
      if (!tree[pId].configs[cId]) tree[pId].configs[cId] = { id: cId, label: cName, routes: [] };
      tree[pId].configs[cId].routes.push(route);
    });

    Object.values(tree).forEach(partner => {
      Object.values(partner.configs).forEach(config => {
        config.routes.sort((a, b) => a.departure_time.localeCompare(b.departure_time));
      });
    });
    return tree;
  }, [routes, searchQuery, view]);

  const handleSelect = (id) => {
    setSelectedId(id);
    const routeObj = routes.find(r => r.id === id);
    if (routeObj && onSelect) onSelect(routeObj);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-surface)' }}>
      
      <RegistryHeader 
        view={view} setView={setView} 
        stats={{ active: routes.length, drafts: drafts.length }}
        searchQuery={searchQuery} onSearchChange={setSearchQuery}
        onAction={() => onEdit({})} 
      />

      <div className="citadel-scroll-area" style={{ flex: 1, overflowY: 'auto' }}>
        {loading && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <div style={{ fontWeight: 600 }}>Syncing Network...</div>
          </div>
        )}

        {!loading && view === 'ACTIVE' && (
          <RouteSidebar tree={routeTree} selectedId={selectedId} onSelect={handleSelect} />
        )}

        {!loading && view === 'DRAFTS' && (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {drafts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <Layers size={32} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <div style={{ fontSize: '14px', fontWeight: 700 }}>No Drafts Found</div>
              </div>
            ) : (
              drafts.filter(d => (d.label || '').toLowerCase().includes(searchQuery.toLowerCase())).map(draft => (
                <div 
                  key={draft.id} 
                  onClick={() => onEdit(draft)} 
                  style={{ 
                    cursor: 'pointer', background: 'white', padding: '16px', borderRadius: '12px',
                    border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.02)', transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#F59E0B' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#D97706', background: '#FFFBEB', padding: '2px 6px', borderRadius: '4px' }}>Step {draft.step_number}</span>
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>{draft.label || 'Untitled Draft'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '6px' }}>
                    <Clock size={12} /> Last edited {new Date(draft.last_updated).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteRegistry;