import React from 'react';
import { 
  ShieldAlert, 
  Watch, 
  Users, 
  MapPin, 
  Clock, 
  Settings, 
  PhoneCall, 
  Activity,
  Zap,
  LogIn,
  LogOut,
  ShieldCheck,
  UserCheck,
  Radio,
  BrainCircuit
} from 'lucide-react';

import threatHawkLogo from '../assets/threathawk-logo.png';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  bandMetrics, 
  onTriggerSOS, 
  onOpenFakeCall,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenSidePanel,
  dlResult
}) {
  const baseTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'guardians', label: 'Guardians Portal', icon: Users, badge: 'Dedicated' },
    { id: 'safewalk', label: 'Safe Walk & GPS', icon: MapPin },
    { id: 'activity', label: 'Alert History', icon: Clock },
    { id: 'settings', label: 'Band Settings', icon: Settings }
  ];

  // If Admin role, prepend Admin Command Ops tab
  const tabs = currentUser?.role === 'admin'
    ? [{ id: 'admin', label: 'Admin Command Ops', icon: Radio, badge: 'ADMIN' }, ...baseTabs]
    : baseTabs;

  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img 
            src={threatHawkLogo} 
            alt="ThreatHawk Logo" 
            style={{ 
              height: '48px', 
              width: 'auto', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 12px rgba(0, 242, 254, 0.4))'
            }} 
          />
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px', background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              THREAT<span style={{ color: 'var(--primary-red)', WebkitTextFillColor: 'initial' }}>HAWK</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              Smart Band Emergency & Security System
            </p>
          </div>
        </div>

        {/* Physical Band Connection Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(10, 15, 26, 0.8)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-glass)'
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: bandMetrics?.connected ? 'var(--status-green)' : 'var(--primary-red)',
            boxShadow: bandMetrics?.connected ? '0 0 10px var(--status-green)' : '0 0 10px var(--primary-red)'
          }} />
          <Watch size={18} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
            {bandMetrics?.deviceName || 'ThreatHawk Sentinel Pro'}
          </span>
          <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
            {bandMetrics?.batteryPercent ?? 100}% BAT
          </span>
        </div>

        {/* Right Action Controls & User Account Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
          
          {/* AI Vitals & DL Engine Side Screen Toggle */}
          <button
            className="btn btn-cyan btn-sm"
            onClick={onOpenSidePanel}
            title="Open Live Vitals & Deep Learning Model Side Screen"
          >
            <BrainCircuit size={16} />
            <span>AI Vitals</span>
            {dlResult?.topPrediction && (
              <span className={`badge ${dlResult.topPrediction.severity === 'CRITICAL' ? 'badge-red' : 'badge-green'}`} style={{ fontSize: '0.6rem', padding: '1px 5px' }}>
                {dlResult.topPrediction.probability}%
              </span>
            )}
          </button>

          <button 
            className="btn btn-sos btn-sm animate-pulse-red"
            onClick={onTriggerSOS}
          >
            <Zap size={16} color="#fff" />
            <span>EMERGENCY SOS</span>
          </button>

          {/* User Account / Auth Section (Rightmost Position) */}
          <div style={{ paddingLeft: '12px', borderLeft: '1px solid var(--border-glass)' }}>
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0, 242, 254, 0.4)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{currentUser.name}</span>
                    <span className={`badge ${currentUser.role === 'admin' ? 'badge-red' : 'badge-green'}`} style={{ fontSize: '0.6rem', padding: '1px 5px' }}>
                      {currentUser.role.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                </div>

                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={onLogout}
                  title="Sign out of account"
                  style={{ padding: '6px 10px', marginLeft: '4px' }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button className="btn btn-cyan btn-sm" onClick={onOpenAuthModal}>
                <LogIn size={16} />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Navigation Tabs Bar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '20px',
        borderTop: '1px solid var(--border-glass)',
        paddingTop: '16px',
        overflowX: 'auto'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'var(--transition)',
                whiteSpace: 'nowrap',
                background: isActive ? 'linear-gradient(135deg, rgba(79, 172, 254, 0.2), rgba(139, 92, 246, 0.2))' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                outline: isActive ? '1px solid rgba(79, 172, 254, 0.4)' : 'none',
                boxShadow: isActive ? '0 4px 15px rgba(79, 172, 254, 0.15)' : 'none'
              }}
            >
              <Icon size={18} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`badge ${tab.badge === 'ADMIN' ? 'badge-red' : 'badge-cyan'}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
