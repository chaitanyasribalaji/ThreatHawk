import React, { useState, useEffect } from 'react';
import { 
  Watch, 
  Heart, 
  Battery, 
  Wifi, 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  Zap, 
  RefreshCw,
  Sliders
} from 'lucide-react';
import { soundEngine } from '../utils/AudioSynthesizer';

export default function SmartBandSim({ 
  bandMetrics, 
  setBandMetrics, 
  onTriggerSOS, 
  onTriggerFallAlert 
}) {
  const [bpm, setBpm] = useState(bandMetrics?.sensors?.heartRateBpm || 74);
  const [isSimulatingFall, setIsSimulatingFall] = useState(false);

  // Live heart rate pulse simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // slight fluctuation
      const delta = (Math.random() - 0.5) * 4;
      setBpm(prev => {
        const next = Math.round(Math.max(60, Math.min(160, prev + delta)));
        setBandMetrics(m => ({
          ...m,
          sensors: { ...(m?.sensors || {}), heartRateBpm: next }
        }));
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleBandPanicClick = () => {
    soundEngine.playBeep(900, 0.2);
    onTriggerSOS();
  };

  const handleSimulateFallClick = () => {
    setIsSimulatingFall(true);
    soundEngine.playBeep(300, 0.4, 'sawtooth');
    onTriggerFallAlert();
    setTimeout(() => setIsSimulatingFall(false), 3000);
  };

  const toggleConnection = () => {
    soundEngine.playBeep(600, 0.1);
    setBandMetrics(m => ({
      ...m,
      connected: !m.connected
    }));
  };

  const handleBatteryChange = (e) => {
    const val = Number(e.target.value);
    setBandMetrics(m => ({
      ...m,
      batteryPercent: val
    }));
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Watch size={22} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Smart Band Hardware Hub</h3>
        </div>
        <span className={`badge ${bandMetrics?.connected ? 'badge-green' : 'badge-red'}`}>
          {bandMetrics?.connected ? 'SYNCED & ACTIVE' : 'DISCONNECTED'}
        </span>
      </div>

      {/* Visual Band Graphic */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 16px',
        border: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)'
      }}>

        {/* Wristband Strap Top */}
        <div style={{
          width: '60px',
          height: '24px',
          background: 'linear-gradient(90deg, #1e293b, #334155, #1e293b)',
          borderRadius: '8px 8px 0 0',
          borderBottom: '2px solid #0f172a'
        }} />

        {/* Physical Band Body */}
        <div style={{
          width: '200px',
          height: '260px',
          background: '#0f172a',
          borderRadius: '36px',
          border: '3px solid #334155',
          boxShadow: isSimulatingFall 
            ? '0 0 30px var(--primary-red)' 
            : '0 10px 25px rgba(0,0,0,0.8), 0 0 15px rgba(0, 242, 254, 0.15)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          transition: 'all 0.3s ease'
        }}>
          
          {/* Band LED Screen */}
          <div style={{
            width: '100%',
            height: '170px',
            background: '#040711',
            borderRadius: '24px',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)'
          }}>

            {/* Top Bar of LED Screen */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Wifi size={12} color={bandMetrics?.connected ? 'var(--status-green)' : 'var(--primary-red)'} />
                <span>{bandMetrics?.connected ? 'BT 5.3' : 'OFF'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Battery size={12} color={(bandMetrics?.batteryPercent ?? 100) < 20 ? 'var(--primary-red)' : 'var(--accent-cyan)'} />
                <span>{bandMetrics?.batteryPercent ?? 100}%</span>
              </div>
            </div>

            {/* Middle Display: Time & Heart Rate */}
            <div style={{ textAlign: 'center', margin: '8px 0' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff' }}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
                <Heart size={16} color="var(--primary-red)" className="animate-pulse-cyan" />
                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                  {bpm} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BPM</span>
                </span>
              </div>
            </div>

            {/* Bottom Status on Screen */}
            <div style={{ textAlign: 'center' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                {isSimulatingFall ? 'IMPACT DETECTED!' : 'THREATHAWK PROTECT'}
              </span>
            </div>

          </div>

          {/* Hardware Panic SOS Touch Button on Band Face */}
          <button
            onClick={handleBandPanicClick}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #ff3b5c, #d90429)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.4)',
              fontWeight: '800',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(255, 59, 92, 0.5)',
              transition: 'var(--transition)'
            }}
          >
            <Zap size={16} color="#fff" />
            <span>HOLD / TAP FOR SOS</span>
          </button>

        </div>

        {/* Wristband Strap Bottom */}
        <div style={{
          width: '60px',
          height: '24px',
          background: 'linear-gradient(90deg, #1e293b, #334155, #1e293b)',
          borderRadius: '0 0 8px 8px',
          borderTop: '2px solid #0f172a'
        }} />

      </div>

      {/* Hardware Simulation Controls */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px' }}>
          HARDWARE TEST BENCH
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <button 
            className="btn btn-danger btn-sm"
            onClick={handleSimulateFallClick}
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} />
              <span>Simulate High-G Fall Sensor Trigger</span>
            </div>
            <span className="badge badge-red">3.8G</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={toggleConnection}
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={16} />
              <span>Toggle Bluetooth Connection</span>
            </div>
            <span>{bandMetrics.connected ? 'Disconnect' : 'Reconnect'}</span>
          </button>

        </div>
      </div>

    </div>
  );
}
