import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Watch, 
  Radio, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  CheckCircle, 
  UserCheck, 
  Sliders, 
  FileText,
  Activity
} from 'lucide-react';
import { soundEngine } from '../utils/AudioSynthesizer';
import confetti from 'canvas-confetti';

export default function AdminTab({ currentUser, masterFleet, setMasterFleet, allUsers, setAllUsers, onLogActivity }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubView, setActiveSubView] = useState('DISPATCH'); // DISPATCH, FLEET, USERS
  const [dispatchLogs, setDispatchLogs] = useState([
    {
      id: "disp-1",
      userName: "David Kim",
      phone: "+1 (555) 304-9912",
      location: "37.7690° N, 122.4480° W (Golden Gate Park)",
      triggerTime: "3 minutes ago",
      heartRate: 132,
      status: "ACTIVE_SOS",
      bandSerial: "SN-991042-Z"
    }
  ]);

  const handleResolveDispatch = (id, name) => {
    soundEngine.playBeep(900, 0.2);
    setDispatchLogs(prev => prev.filter(d => d.id !== id));
    setMasterFleet(prev => prev.map(f => f.userName === name ? { ...f, status: 'ACTIVE' } : f));
    confetti({ particleCount: 40, spread: 50 });

    onLogActivity({
      type: 'ADMIN_ACTION',
      title: `Emergency SOS Resolved by Admin`,
      description: `Administrator ${currentUser.name} resolved SOS alert for user ${name}.`,
      severity: 'info'
    });
  };

  const handleDispatchPatrol = (name) => {
    soundEngine.playBeep(800, 0.2);
    alert(`Patrol Unit #4 dispatched to ${name}'s GPS location.`);
  };

  const toggleUserRole = (userId) => {
    soundEngine.playBeep(700, 0.15);
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextRole = u.role === 'admin' ? 'user' : 'admin';
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Admin Security Ops Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(255, 59, 92, 0.15) 0%, rgba(16, 22, 37, 0.9) 100%)',
        border: '1px solid rgba(255, 59, 92, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-red">ADMIN SECURITY COMMAND CENTER</span>
              <span className="badge badge-cyan">OPS OPERATOR: {currentUser.name}</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '10px', color: '#fff' }}>
              Central Monitoring & Emergency Dispatch Console
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Real-time surveillance fleet status, active emergency signals, master user directory, and security override controls.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveSubView('DISPATCH')}
              className={`btn btn-sm ${activeSubView === 'DISPATCH' ? 'btn-sos' : 'btn-secondary'}`}
            >
              <ShieldAlert size={16} />
              <span>SOS Console ({dispatchLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveSubView('FLEET')}
              className={`btn btn-sm ${activeSubView === 'FLEET' ? 'btn-cyan' : 'btn-secondary'}`}
            >
              <Watch size={16} />
              <span>Fleet Bands ({masterFleet.length})</span>
            </button>

            <button
              onClick={() => setActiveSubView('USERS')}
              className={`btn btn-sm ${activeSubView === 'USERS' ? 'btn-cyan' : 'btn-secondary'}`}
            >
              <Users size={16} />
              <span>User Directory ({allUsers.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUBVIEW 1: ACTIVE DISPATCH CONSOLE */}
      {activeSubView === 'DISPATCH' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={20} color="var(--primary-red)" className="animate-pulse-red" />
            <span>Active Emergency SOS Signals Stream</span>
          </h3>

          {dispatchLogs.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--status-green)' }}>
              <CheckCircle size={36} style={{ marginBottom: '10px' }} />
              <h3>All Clear - No Active SOS Signals across Network</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {dispatchLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="glass-panel" 
                  style={{
                    padding: '24px',
                    borderLeft: '5px solid var(--primary-red)',
                    background: 'linear-gradient(135deg, rgba(255, 59, 92, 0.12), rgba(16, 22, 37, 0.9))'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="badge badge-red" style={{ fontSize: '0.8rem' }}>HIGH PRIORITY SOS</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Triggered {log.triggerTime}</span>
                      </div>

                      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '8px', color: '#fff' }}>
                        {log.userName} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>({log.phone})</span>
                      </h2>

                      <div style={{ display: 'flex', gap: '16px', margin: '12px 0', fontSize: '0.85rem' }}>
                        <div>📍 Location: <strong style={{ color: 'var(--accent-cyan)' }}>{log.location}</strong></div>
                        <div>❤️ Heart Rate: <strong style={{ color: 'var(--primary-red)' }}>{log.heartRate} BPM</strong></div>
                        <div>⌚ Band: <strong>{log.bandSerial}</strong></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
                      <button 
                        className="btn btn-sos btn-sm"
                        onClick={() => handleDispatchPatrol(log.userName)}
                      >
                        <PhoneCall size={16} />
                        <span>Dispatch Security Patrol</span>
                      </button>

                      <button 
                        className="btn btn-cyan btn-sm"
                        onClick={() => handleResolveDispatch(log.id, log.userName)}
                      >
                        <CheckCircle size={16} />
                        <span>Mark Alert Resolved</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBVIEW 2: MASTER FLEET BANDS */}
      {activeSubView === 'FLEET' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>
            Master Connected Band Devices Fleet ({masterFleet.length})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {masterFleet.map((fleet) => (
              <div key={fleet.serialNumber} className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className={`badge ${fleet.status === 'ACTIVE' ? 'badge-green' : fleet.status === 'SOS_ALERT' ? 'badge-red' : 'badge-amber'}`}>
                    {fleet.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {fleet.serialNumber}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{fleet.userName}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fleet.bandModel}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', marginTop: '14px' }}>
                  <div>Battery: <strong>{fleet.battery}%</strong></div>
                  <div>Pulse: <strong>{fleet.heartRate} BPM</strong></div>
                  <div>Guardians: <strong>{fleet.guardiansCount} Linked</strong></div>
                  <div>Last Ping: <strong>{fleet.lastPing}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBVIEW 3: MASTER USERS DIRECTORY */}
      {activeSubView === 'USERS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>
              Master User Account Directory ({allUsers.length})
            </h3>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {allUsers.map((user) => (
                <div 
                  key={user.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    background: 'rgba(10, 15, 26, 0.6)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-glass)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={user.avatar} alt={user.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>{user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email} • {user.phone}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`badge ${user.role === 'admin' ? 'badge-red' : 'badge-cyan'}`}>
                      {user.role.toUpperCase()}
                    </span>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => toggleUserRole(user.id)}
                    >
                      <span>Toggle Role ({user.role === 'admin' ? 'Set User' : 'Set Admin'})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
