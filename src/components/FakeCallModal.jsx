import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, User, Mic, Volume2, Shield } from 'lucide-react';
import { soundEngine } from '../utils/AudioSynthesizer';

export default function FakeCallModal({ isOpen, onClose }) {
  const [callerName, setCallerName] = useState('Dad (Marcus)');
  const [delaySec, setDelaySec] = useState(0); // 0, 5, 15
  const [stage, setStage] = useState('CONFIG'); // CONFIG, WAITING, RINGING, IN_CALL
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStage('CONFIG');
      soundEngine.stopRingtone();
      return;
    }
  }, [isOpen]);

  // Handle countdown & ringing state
  useEffect(() => {
    let timer;
    if (stage === 'WAITING') {
      if (secondsRemaining > 0) {
        timer = setInterval(() => {
          setSecondsRemaining(prev => prev - 1);
        }, 1000);
      } else {
        setStage('RINGING');
        soundEngine.startRingtone();
      }
    } else if (stage === 'IN_CALL') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [stage, secondsRemaining]);

  const handleStartCallTrigger = () => {
    if (delaySec === 0) {
      setStage('RINGING');
      soundEngine.startRingtone();
    } else {
      setSecondsRemaining(delaySec);
      setStage('WAITING');
    }
  };

  const handleAcceptCall = () => {
    soundEngine.stopRingtone();
    soundEngine.playBeep(600, 0.1);
    setCallDuration(0);
    setStage('IN_CALL');
  };

  const handleDeclineCall = () => {
    soundEngine.stopRingtone();
    soundEngine.playBeep(300, 0.2, 'sawtooth');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(5, 8, 15, 0.95)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>

      {/* STAGE 1: CONFIGURATION */}
      {stage === 'CONFIG' && (
        <div className="glass-panel" style={{ maxWidth: '420px', width: '100%', padding: '28px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(0, 242, 254, 0.15)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <Phone size={28} color="var(--accent-cyan)" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Ghost Call Safety Escape</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Simulates a realistic incoming call to help you exit uncomfortable situations safely.
            </p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>Custom Caller Name / ID</label>
            <input
              type="text"
              className="input-field"
              value={callerName}
              onChange={e => setCallerName(e.target.value)}
              placeholder="e.g. Dad, Officer Smith, Manager"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label>Trigger Delay Timer</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[0, 5, 15].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setDelaySec(sec)}
                  className={`btn ${delaySec === sec ? 'btn-cyan' : 'btn-secondary'} btn-sm`}
                >
                  {sec === 0 ? 'Instant' : `${sec} Secs`}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleStartCallTrigger} style={{ flex: 1 }}>
              Start Ghost Call
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: WAITING COUNTDOWN */}
      {stage === 'WAITING' && (
        <div className="glass-panel" style={{ maxWidth: '360px', width: '100%', padding: '32px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Incoming Call Scheduled
          </h3>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', margin: '16px 0' }}>
            {secondsRemaining}s
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            Put your phone down or keep it in hand. Ringer will activate shortly.
          </p>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ marginTop: '20px' }}>
            Cancel Timer
          </button>
        </div>
      )}

      {/* STAGE 3: RINGING SCREEN (REALISTIC PHONE CALL UI) */}
      {stage === 'RINGING' && (
        <div style={{
          width: '340px',
          height: '620px',
          background: 'linear-gradient(180deg, #090d16 0%, #1e293b 100%)',
          borderRadius: '40px',
          border: '3px solid #334155',
          boxShadow: '0 0 50px rgba(0, 242, 254, 0.4)',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#fff'
        }}>
          {/* Top Caller Info */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #334155, #475569)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: '0 0 20px rgba(255,255,255,0.1)'
            }}>
              <User size={44} color="var(--accent-cyan)" />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              {callerName}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>
              Incoming Phone Call...
            </p>
          </div>

          {/* Bottom Accept / Decline Buttons */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
            
            {/* Decline Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleDeclineCall}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--primary-red)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(255, 59, 92, 0.6)'
                }}
              >
                <PhoneOff size={28} color="#fff" />
              </button>
              <div style={{ fontSize: '0.75rem', marginTop: '8px', color: 'var(--text-muted)' }}>Decline</div>
            </div>

            {/* Accept Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleAcceptCall}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--status-green)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)'
                }}
                className="animate-pulse-cyan"
              >
                <Phone size={28} color="#fff" />
              </button>
              <div style={{ fontSize: '0.75rem', marginTop: '8px', color: 'var(--text-muted)' }}>Accept</div>
            </div>

          </div>
        </div>
      )}

      {/* STAGE 4: ACTIVE IN-CALL SCREEN */}
      {stage === 'IN_CALL' && (
        <div style={{
          width: '340px',
          height: '620px',
          background: 'linear-gradient(180deg, #090d16 0%, #0f172a 100%)',
          borderRadius: '40px',
          border: '3px solid #334155',
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.3)',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#fff'
        }}>
          {/* Active Call Header */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{callerName}</h3>
            <div style={{ fontSize: '1rem', color: 'var(--status-green)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
              {Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}
            </div>
          </div>

          {/* Call Control Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            width: '100%',
            padding: '20px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mic size={20} color="#fff" />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mute</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Volume2 size={20} color="#fff" />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Speaker</span>
            </div>
          </div>

          {/* End Call Button */}
          <button
            onClick={handleDeclineCall}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--primary-red)',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(255, 59, 92, 0.6)',
              marginBottom: '20px'
            }}
          >
            <PhoneOff size={28} color="#fff" />
          </button>
        </div>
      )}

    </div>
  );
}
