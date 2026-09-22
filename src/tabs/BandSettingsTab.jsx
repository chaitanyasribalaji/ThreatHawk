import React, { useState } from 'react';
import { 
  Settings, 
  Watch, 
  Shield, 
  Sliders, 
  Volume2, 
  Lock, 
  RotateCcw, 
  CheckCircle,
  Vibrate
} from 'lucide-react';
import { soundEngine } from '../utils/AudioSynthesizer';
import confetti from 'canvas-confetti';

export default function BandSettingsTab({ settings, setSettings, onLogActivity }) {
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    soundEngine.playBeep(700, 0.2);
    setSettings({ ...localSettings });
    setSavedSuccess(true);
    confetti({ particleCount: 40, spread: 50 });

    onLogActivity({
      type: 'SETTINGS_UPDATE',
      title: 'Band & Safety Configuration Updated',
      description: `Updated Haptic pattern to "${localSettings.hapticPattern}" and Fall Sensitivity to "${localSettings.fallDetectionSensitivity}".`,
      severity: 'info'
    });

    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={24} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Band Hardware & Safety Preferences</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Configure physical smart band button triggers, haptic vibration feedback, fall detection sensitivity, and emergency PIN.
            </p>
          </div>

          {savedSuccess && (
            <span className="badge badge-green" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
              <CheckCircle size={14} /> SETTINGS SAVED!
            </span>
          )}
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        
        {/* Section 1: Physical Band Triggers */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Watch size={20} color="var(--accent-cyan)" />
            <span>Physical Band Triggers & Haptics</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label>Band Panic Button Activation</label>
              <select 
                className="input-field"
                value={localSettings.bandButtonAction}
                onChange={e => setLocalSettings({ ...localSettings, bandButtonAction: e.target.value })}
              >
                <option value="Hold 3 Seconds or 3 Rapid Clicks">Hold 3 Seconds OR 3 Rapid Clicks</option>
                <option value="Double Tap Hardware Button">Double Tap Hardware Button</option>
                <option value="Single Long Press (5s)">Single Long Press (5s)</option>
              </select>
            </div>

            <div>
              <label>Vibration Haptic Pattern</label>
              <select 
                className="input-field"
                value={localSettings.hapticPattern}
                onChange={e => setLocalSettings({ ...localSettings, hapticPattern: e.target.value })}
              >
                <option value="Heavy Triple Pulse">Heavy Triple Pulse (Recommended)</option>
                <option value="Subtle Single Buzz">Subtle Single Buzz</option>
                <option value="Continuous Alarm Buzz">Continuous Alarm Buzz</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label>Fall Detection Accelerometer Sensitivity</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '6px' }}>
              {['Low', 'Medium', 'High'].map((sens) => (
                <button
                  key={sens}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, fallDetectionSensitivity: sens })}
                  className={`btn btn-sm ${localSettings.fallDetectionSensitivity === sens ? 'btn-cyan' : 'btn-secondary'}`}
                >
                  {sens} Impact ({sens === 'High' ? '3.5G+' : sens === 'Medium' ? '4.5G+' : '6.0G+'})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Emergency SOS & Beacon Preferences */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="var(--primary-red)" />
            <span>Emergency SOS & Siren Preferences</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label>Countdown Cancellation Delay</label>
              <select 
                className="input-field"
                value={localSettings.countdownSeconds}
                onChange={e => setLocalSettings({ ...localSettings, countdownSeconds: Number(e.target.value) })}
              >
                <option value={3}>3 Seconds (Rapid Dispatch)</option>
                <option value={5}>5 Seconds (Recommended)</option>
                <option value={10}>10 Seconds (Extra buffer)</option>
              </select>
            </div>

            <div>
              <label>Cancel Security PIN (4 Digits)</label>
              <input 
                type="text"
                className="input-field"
                maxLength={4}
                value={localSettings.pinCode}
                onChange={e => setLocalSettings({ ...localSettings, pinCode: e.target.value })}
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#fff' }}>
              <input 
                type="checkbox"
                checked={localSettings.sirenAudioEnabled}
                onChange={e => setLocalSettings({ ...localSettings, sirenAudioEnabled: e.target.checked })}
              />
              <span>Synthesized Siren Horn Sound</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#fff' }}>
              <input 
                type="checkbox"
                checked={localSettings.strobeFlashEnabled}
                onChange={e => setLocalSettings({ ...localSettings, strobeFlashEnabled: e.target.checked })}
              />
              <span>Full Screen Strobe LED Beacon</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
            Save Hardware Configuration
          </button>
        </div>

      </form>

    </div>
  );
}
