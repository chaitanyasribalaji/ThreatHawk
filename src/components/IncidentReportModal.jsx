import React from 'react';
import { ShieldAlert, Printer, X, Download, FileText } from 'lucide-react';

export default function IncidentReportModal({ isOpen, onClose, logs }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(9, 13, 22, 0.9)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ maxWidth: '650px', width: '100%', padding: '32px', maxHeight: '85vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={24} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Security Incident Summary Report</h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Report Content */}
        <div style={{ background: '#0a0f1d', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', fontFamily: 'var(--font-mono)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>THREATHAWK OFFICIAL AUDIT REPORT</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Generated: {new Date().toLocaleString()} • Device ID: AS-990-BT5
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', marginBottom: '20px' }}>
            <div>User Profile: <strong>Chaitanya</strong></div>
            <div>Wearable Sync: <strong>CONNECTED (Bluetooth 5.3)</strong></div>
            <div>Primary Guardian: <strong>Eleanor Vance</strong></div>
            <div>GPS Tracking: <strong>37.7749° N, 122.4194° W</strong></div>
          </div>

          <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: '10px', textTransform: 'uppercase' }}>
            Recent Incident Log Entries ({logs.length})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
            {logs.map((log, index) => (
              <div key={log.id} style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                <div style={{ color: 'var(--accent-cyan)' }}>[{log.timestamp}] {log.title}</div>
                <div style={{ color: 'var(--text-muted)' }}>{log.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}
