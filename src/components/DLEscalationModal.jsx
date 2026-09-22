import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  BrainCircuit, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Heart, 
  Activity,
  Zap,
  Volume2
} from 'lucide-react';
import { soundEngine } from '../utils/AudioSynthesizer';

export default function DLEscalationModal({ 
  isOpen, 
  onClose, 
  onConfirmEscalation, 
  dlResult, 
  vitals 
}) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(10);
      return;
    }

    // Play alert beep sound
    soundEngine.playBeep(880, 0.3);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onConfirmEscalation();
          return 0;
        }
        soundEngine.playBeep(920, 0.15);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !dlResult) return null;

  const top = dlResult.topPrediction;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'rgba(9, 13, 22, 0.95)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} className="animate-strobe">

      <div className="glass-panel" style={{
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        border: '3px solid var(--primary-red)',
        boxShadow: '0 0 60px rgba(255, 59, 92, 0.8)',
        borderRadius: 'var(--radius-lg)',
        position: 'relative'
      }}>

        {/* AI Model Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
            <BrainCircuit size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.5px' }}>
              DEEP LEARNING MODEL AUTO-ESCALATION
            </span>
          </div>
          <span className="badge badge-red animate-pulse-red" style={{ marginLeft: 'auto' }}>
            {top.probability}% DL CONFIDENCE
          </span>
        </div>

        {/* Alert Cause Title */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'var(--primary-red)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 35px var(--primary-red)',
            marginBottom: '12px'
          }} className="animate-pulse-red">
            <AlertTriangle size={36} color="#fff" />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
            {top.label}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {top.description}
          </p>
        </div>

        {/* Vitals Snapshot Card */}
        <div style={{
          background: 'rgba(10, 15, 26, 0.8)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-glass)',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>
            Triggering Vitals Snapshot
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '0.85rem' }}>
            <div>Heart Rate: <strong style={{ color: 'var(--primary-red)' }}>{vitals?.heartRate} BPM</strong></div>
            <div>Stress (GSR): <strong style={{ color: 'var(--accent-cyan)' }}>{vitals?.stressGsr}%</strong></div>
            <div>G-Force: <strong style={{ color: 'var(--status-amber)' }}>{vitals?.gForce}G</strong></div>
            <div>SpO2: <strong style={{ color: 'var(--status-green)' }}>{vitals?.spO2}%</strong></div>
            <div>Body Temp: <strong>{vitals?.bodyTemp}°C</strong></div>
            <div>Respiration: <strong>{vitals?.respRate}/m</strong></div>
          </div>
        </div>

        {/* Countdown Box & Cancel Override Button */}
        <div style={{
          background: 'rgba(255, 59, 92, 0.1)',
          border: '1px solid rgba(255, 59, 92, 0.4)',
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Automated Guardian SOS Dispatch in:
          </div>
          <div style={{ fontSize: '3.2rem', fontWeight: '800', color: 'var(--primary-red)', fontFamily: 'var(--font-mono)', margin: '6px 0' }}>
            00:{countdown.toString().padStart(2, '0')}
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
            If this is a false alarm or you are safe, tap the button below immediately to stop escalation.
          </p>

          <button
            onClick={() => {
              soundEngine.stopSiren();
              soundEngine.playBeep(1200, 0.3);
              onClose();
            }}
            className="btn btn-cyan"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '1.1rem',
              fontWeight: '800',
              boxShadow: '0 0 25px var(--accent-cyan-glow)'
            }}
          >
            <CheckCircle size={22} />
            <span>STOP ESCALATION (I AM SAFE)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
