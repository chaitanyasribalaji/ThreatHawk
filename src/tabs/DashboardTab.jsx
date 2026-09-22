import React from 'react';
import { 
  ShieldCheck, 
  Watch, 
  Users, 
  Zap, 
  AlertTriangle, 
  Volume2, 
  Camera, 
  MapPin, 
  Heart, 
  Battery, 
  Activity,
  ArrowRight,
  Send,
  Radio,
  BrainCircuit,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { soundEngine } from '../utils/AudioSynthesizer';

export default function DashboardTab({ 
  bandMetrics, 
  guardians, 
  activityLogs, 
  userLocation,
  dlResult,
  vitals,
  onTriggerSOS, 
  onTriggerFallAlert,
  onOpenFakeCall, 
  onSwitchTab,
  onOpenSidePanel,
  onSimulateScenario
}) {
  const primaryGuardians = guardians.filter(g => g.priority === 'Primary SOS');

  const handleSirenBlast = () => {
    soundEngine.startSiren();
    setTimeout(() => {
      soundEngine.stopSiren();
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Safety Score Overview Hero Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(16, 22, 37, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-green">SYSTEM FULLY PROTECTED</span>
              <span className="badge badge-cyan">BAND ACTIVE</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '10px', color: '#fff' }}>
              ThreatHawk Sentinel Protection Hub
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px', maxWidth: '600px' }}>
              Your wearable band is actively monitoring biometrics and G-force impact sensors. Emergency dispatch is ready for <strong>{guardians.length} registered guardians</strong>.
            </p>
          </div>

          {/* Safety Score Radial Gauge */}
          <div style={{
            background: 'rgba(10, 15, 26, 0.8)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 28px',
            textAlign: 'center',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.15)'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              SAFETY SCORE
            </div>
            <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', lineHeight: '1.1' }}>
              98<span style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>/100</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-green)', marginTop: '4px', fontWeight: '600' }}>
              Optimal Security State
            </div>
          </div>

        </div>

        {/* Protection Health Indicators matching original design */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-glass)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="var(--status-green)" />
            <span style={{ fontSize: '0.85rem' }}>Fall Sensor: <strong>Active</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={20} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.85rem' }}>GPS: <strong>{userLocation?.formatted || '17.08967° N, 82.06680° E'}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={20} color="var(--status-amber)" />
            <span style={{ fontSize: '0.85rem' }}>Stealth Rec: <strong>Standby</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="var(--accent-purple)" />
            <span style={{ fontSize: '0.85rem' }}>Guardians: <strong>{primaryGuardians.length || 1} Primary</strong></span>
          </div>
        </div>
      </div>

      {/* Deep Learning Neural Network Live Inference Status Card */}
      {dlResult && (
        <div className="glass-panel" style={{
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08), rgba(16, 22, 37, 0.9))',
          border: `1px solid ${dlResult.topPrediction.color}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BrainCircuit size={24} color="var(--accent-cyan)" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-cyan)', letterSpacing: '0.5px' }}>
                    DEEP LEARNING MODEL INFERENCE FEED
                  </span>
                  <span className={`badge ${dlResult.topPrediction.severity === 'CRITICAL' ? 'badge-red' : dlResult.topPrediction.severity === 'WARNING' ? 'badge-amber' : 'badge-green'}`}>
                    {dlResult.topPrediction.probability}% CONFIDENCE
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: dlResult.topPrediction.color, marginTop: '2px' }}>
                  Diagnosis: {dlResult.topPrediction.label}
                </h3>
              </div>
            </div>

            <button className="btn btn-cyan" onClick={onOpenSidePanel}>
              <Activity size={16} />
              <span>Open All Vitals Side Screen</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Emergency Action Tiles */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px', color: 'var(--text-main)' }}>
          Quick Emergency Action Controls
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          
          {/* Tile 1: Emergency SOS */}
          <div 
            className="glass-panel"
            onClick={onTriggerSOS}
            style={{
              padding: '20px',
              cursor: 'pointer',
              border: '1px solid rgba(255, 59, 92, 0.3)',
              background: 'linear-gradient(135deg, rgba(255, 59, 92, 0.15), rgba(19, 27, 44, 0.8))'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={22} color="#fff" />
              </div>
              <span className="badge badge-red">CRITICAL</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>Emergency SOS</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Trigger full siren beacon, camera recording & guardian dispatch.
            </p>
          </div>

          {/* Tile 3: Fall Sensor Test */}
          <div 
            className="glass-panel"
            onClick={onTriggerFallAlert}
            style={{ padding: '20px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={22} color="var(--status-amber)" />
              </div>
              <span className="badge badge-amber">TEST SENSOR</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>Fall Impact Test</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Simulate 3.8G accelerometer impact & sudden BPM spike.
            </p>
          </div>

        </div>
      </div>

      {/* Primary Guardians Quick Bar */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Primary Guardian Dispatch Quick Bar</h3>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onSwitchTab('guardians')}
          >
            <span>Manage Guardians ({guardians.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {guardians.map(g => (
            <div 
              key={g.id}
              style={{
                background: 'rgba(10, 15, 26, 0.6)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={g.avatar} alt={g.name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>{g.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{g.relationship}</div>
                </div>
              </div>
              <span className={`badge ${g.priority === 'Primary SOS' ? 'badge-red' : 'badge-cyan'}`} style={{ fontSize: '0.65rem' }}>
                {g.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
