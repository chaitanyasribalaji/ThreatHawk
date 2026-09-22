import React, { useState } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Info, 
  Search, 
  Download, 
  Trash2,
  FileText
} from 'lucide-react';
import IncidentReportModal from '../components/IncidentReportModal';

export default function ActivityLogTab({ activityLogs, setActivityLogs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [isReportOpen, setIsReportOpen] = useState(false);

  const safeLogs = activityLogs || [];
  const filteredLogs = safeLogs.filter(log => {
    if (!log) return false;
    const titleStr = log.title || '';
    const descStr = log.description || '';
    const matchesSearch = titleStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          descStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = severityFilter === 'ALL' || log.severity === severityFilter || log.type === severityFilter;
    return matchesSearch && matchesFilter;
  });

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to clear all activity logs?")) {
      setActivityLogs([]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={24} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Alert History & Incident Log</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Comprehensive timestamped audit log of all physical band alerts, fall sensor triggers, guardian tests, and safe walks.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-cyan" onClick={() => setIsReportOpen(true)}>
              <Download size={16} />
              <span>Export Incident Report</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleClearLogs} title="Clear history">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar for All Logs */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search all activity & alert logs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <span className="badge badge-cyan" style={{ fontSize: '0.8rem', padding: '8px 12px' }}>
          ALL LOGS ({filteredLogs.length})
        </span>
      </div>

      {/* Timeline List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <Info size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
            <p>No activity logs found matching your filter criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredLogs.map((log) => {
              const isHigh = log.severity === 'high' || log.type === 'EMERGENCY_SOS';
              return (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '16px',
                    background: 'rgba(10, 15, 26, 0.6)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: isHigh ? '4px solid var(--primary-red)' : '4px solid var(--accent-cyan)',
                    border: '1px solid var(--border-glass)'
                  }}
                >
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: isHigh ? 'rgba(255, 59, 92, 0.2)' : 'rgba(0, 242, 254, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isHigh ? <ShieldAlert size={20} color="var(--primary-red)" /> : <CheckCircle size={20} color="var(--accent-cyan)" />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>{log.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {log.timestamp}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {log.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Export Report Modal */}
      <IncidentReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        logs={activityLogs}
      />

    </div>
  );
}
