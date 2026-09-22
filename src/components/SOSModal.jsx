import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  MapPin, 
  Lock, 
  CheckCircle, 
  Radio, 
  Camera, 
  Video,
  X,
  AlertTriangle,
  Send
} from 'lucide-react';
import { soundEngine } from '../utils/AudioSynthesizer';
import confetti from 'canvas-confetti';

export default function SOSModal({ 
  isOpen, 
  onClose, 
  guardians, 
  settings, 
  userLocation,
  triggerSource = "Panic SOS Button" 
}) {
  const [countdown, setCountdown] = useState(settings.countdownSeconds || 5);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [dispatchStep, setDispatchStep] = useState(0);

  // Handle countdown
  useEffect(() => {
    if (!isOpen) {
      setCountdown(settings.countdownSeconds || 5);
      setIsAlertActive(false);
      setDispatchStep(0);
      setEnteredPin('');
      setPinError(false);
      soundEngine.stopSiren();
      return;
    }

    // Start siren if audio enabled
    if (settings.sirenAudioEnabled && !isMuted) {
      soundEngine.startSiren();
    }

    let timer;
    if (countdown > 0 && !isAlertActive) {
      soundEngine.playBeep(880, 0.2);
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !isAlertActive) {
      setIsAlertActive(true);
      // Trigger dispatch progression
      runDispatchProgress();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, countdown, isAlertActive]);

  const runDispatchProgress = () => {
    setDispatchStep(1); // GPS Broadcasted
    setTimeout(() => setDispatchStep(2), 1200); // SMS & Push Sent
    setTimeout(() => setDispatchStep(3), 2500); // Calls Placed
    setTimeout(() => setDispatchStep(4), 3800); // Stealth Rec Started
    setTimeout(() => setDispatchStep(5), 5000); // Emergency Services Notified
  };

  const toggleMute = () => {
    if (isMuted) {
      soundEngine.startSiren();
      setIsMuted(false);
    } else {
      soundEngine.stopSiren();
      setIsMuted(true);
    }
  };

  const handleCancelAttempt = (e) => {
    e.preventDefault();
    if (enteredPin === (settings.pinCode || '1234')) {
      soundEngine.stopSiren();
      soundEngine.playBeep(1200, 0.3);
      onClose();
    } else {
      setPinError(true);
      soundEngine.playBeep(200, 0.4, 'sawtooth');
    }
  };

  if (!isOpen) return null;

  const primaryGuardians = guardians.filter(g => g.priority === 'Primary SOS');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(9, 13, 22, 0.95)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflowY: 'auto'
    }} className={settings.strobeFlashEnabled && isAlertActive ? 'animate-strobe' : ''}>
      
      <div className="glass-panel" style={{
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        border: '2px solid var(--primary-red)',
        boxShadow: '0 0 50px rgba(255, 59, 92, 0.6)',
        position: 'relative',
        borderRadius: 'var(--radius-lg)'
      }}>

        {/* Mute Siren Button */}
        <button
          onClick={toggleMute}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem'
          }}
        >
          {isMuted ? <VolumeX size={18} color="var(--primary-red)" /> : <Volume2 size={18} color="var(--accent-cyan)" />}
          <span>{isMuted ? 'Unmute Siren' : 'Mute Siren'}</span>
        </button>

        {/* SOS Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff3b5c, #d90429)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px var(--primary-red)',
            marginBottom: '12px'
          }} className="animate-pulse-red">
            <ShieldAlert size={40} color="#fff" />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', textTransform: 'uppercase' }}>
            {isAlertActive ? 'EMERGENCY SOS BROADCAST ACTIVE' : `SOS ACTIVATING IN ${countdown}s`}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Triggered via: <strong style={{ color: 'var(--accent-cyan)' }}>{triggerSource}</strong>
          </p>
        </div>

        {/* Countdown Stage */}
        {!isAlertActive ? (
          <div style={{
            background: 'rgba(10, 15, 26, 0.9)',
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary-red)', fontFamily: 'var(--font-mono)' }}>
              00:0{countdown}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '12px 0 20px 0' }}>
              Instant emergency dispatch to guardians & emergency services will occur when countdown reaches zero.
            </p>

            <button
              className="btn btn-sos"
              onClick={() => {
                setCountdown(0);
                setIsAlertActive(true);
                runDispatchProgress();
              }}
              style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
            >
              DISPATCH SOS IMMEDIATELY
            </button>
          </div>
        ) : (
          /* Active SOS Dispatch Progress */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Live GPS Coordinates banner */}
            <div style={{
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={20} color="var(--accent-cyan)" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
                    Live Browser GPS Broadcasting
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {userLocation?.formatted || '37.7749° N, 122.4194° W'} (Accuracy: {userLocation?.accuracy || 5}m)
                  </div>
                </div>
              </div>
              <span className="badge badge-cyan">BEACON LIVE</span>
            </div>

            {/* Dispatch Timeline */}
            <div style={{
              background: 'rgba(10, 15, 26, 0.8)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glass)'
            }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
                Automated Dispatch Sequence
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: dispatchStep >= 1 ? 1 : 0.4 }}>
                  <CheckCircle size={18} color={dispatchStep >= 1 ? 'var(--status-green)' : 'var(--text-dim)'} />
                  <span style={{ fontSize: '0.85rem' }}>1. Encrypted GPS beacon sent to all 4 Guardians</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: dispatchStep >= 2 ? 1 : 0.4 }}>
                  <CheckCircle size={18} color={dispatchStep >= 2 ? 'var(--status-green)' : 'var(--text-dim)'} />
                  <span style={{ fontSize: '0.85rem' }}>2. High-priority SMS & WhatsApp broadcasted</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: dispatchStep >= 3 ? 1 : 0.4 }}>
                  <PhoneCall size={18} color={dispatchStep >= 3 ? 'var(--accent-cyan)' : 'var(--text-dim)'} />
                  <span style={{ fontSize: '0.85rem' }}>
                    3. Auto-dialing Primary Guardian: <strong>{primaryGuardians[0]?.name || 'Eleanor Vance'}</strong> ({primaryGuardians[0]?.phone})
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: dispatchStep >= 4 ? 1 : 0.4 }}>
                  <Video size={18} color={dispatchStep >= 4 ? 'var(--primary-red)' : 'var(--text-dim)'} />
                  <span style={{ fontSize: '0.85rem' }}>4. Stealth HD Camera & Ambient Audio Recording Active</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: dispatchStep >= 5 ? 1 : 0.4 }}>
                  <Radio size={18} color={dispatchStep >= 5 ? 'var(--status-amber)' : 'var(--text-dim)'} />
                  <span style={{ fontSize: '0.85rem' }}>5. Emergency Dispatch Center Pinged (Status: Alert Sent)</span>
                </div>

              </div>
            </div>

            {/* Simulated Stealth Camera View */}
            <div style={{
              background: '#000',
              height: '120px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--primary-red)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-red)' }} className="animate-pulse-red" />
                <span style={{ fontSize: '0.7rem', color: 'var(--primary-red)', fontWeight: '700' }}>REC [AUDIO & VIDEO]</span>
              </div>
              <Camera size={28} color="rgba(255,255,255,0.2)" />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                Encrypted cloud video stream in progress...
              </div>
            </div>

          </div>
        )}

        {/* PIN Security Cancel Box */}
        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-glass)'
        }}>
          <form onSubmit={handleCancelAttempt} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="password"
                placeholder="Enter 4-Digit Security PIN to Cancel (Default: 1234)"
                value={enteredPin}
                onChange={e => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                className="input-field"
                style={{ paddingLeft: '38px' }}
                maxLength={4}
              />
            </div>

            <button type="submit" className="btn btn-secondary">
              Cancel Alert
            </button>
          </form>

          {pinError && (
            <p style={{ color: 'var(--primary-red)', fontSize: '0.8rem', marginTop: '6px', textAlign: 'center' }}>
              Invalid Security PIN code! Please enter correct 4-digit PIN.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
