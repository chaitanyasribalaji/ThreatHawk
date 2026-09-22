import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Play, 
  Square, 
  CheckCircle, 
  Compass,
  Share2
} from 'lucide-react';
import { soundEngine } from '../utils/AudioSynthesizer';
import confetti from 'canvas-confetti';

export default function SafeWalkTab({ userLocation, onTriggerSOS, onLogActivity }) {
  const [destination, setDestination] = useState('Walking Home via Coastal Road');
  const [durationMins, setDurationMins] = useState(15);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [timeLeftSec, setTimeLeftSec] = useState(0);
  const [activeScenario, setActiveScenario] = useState('coastal'); // coastal, highway, industrial

  const canvasRef = useRef(null);

  // Map Animation Canvas for 17.08967° N, 82.06680° E
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let angle = 0;

    const renderMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark map background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines with Lat/Lng markings
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Coordinate Crosshair Markings
      ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.font = '10px Space Grotesk, monospace';
      ctx.fillText('LAT: 17.08967° N', 12, 20);
      ctx.fillText('LNG: 82.06680° E', 12, 35);
      ctx.fillText('ELEV: 6m MSL • SECTOR: EAST GODAVARI AP', 12, 310);

      // Simulated Road / Coastal Network based on Scenario
      if (activeScenario === 'coastal') {
        // Coastal Coastline curve
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 240);
        ctx.bezierCurveTo(200, 220, 350, 280, 650, 250);
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 242, 254, 0.05)';
        ctx.lineTo(650, 320);
        ctx.lineTo(0, 320);
        ctx.fill();

        // Main Beach Road
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(40, 60);
        ctx.lineTo(280, 140);
        ctx.lineTo(580, 160);
        ctx.stroke();

      } else if (activeScenario === 'highway') {
        // NH-216 Dual Highway
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(30, 280);
        ctx.lineTo(620, 40);
        ctx.stroke();

        // Center line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.moveTo(30, 280);
        ctx.lineTo(620, 40);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        // Industrial Field Grid
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.lineWidth = 6;
        ctx.strokeRect(60, 60, 220, 180);
        ctx.strokeRect(340, 60, 240, 180);
      }

      // Breadcrumb Walk Path
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(80, 100);
      ctx.lineTo(180, 120);
      ctx.lineTo(280, 140);
      ctx.lineTo(380, 150);
      ctx.stroke();
      ctx.setLineDash([]);

      // Waypoint 1: Kakinada Port Guard Station
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(580, 160, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.fillText('PORT PATROL HUB', 530, 164);

      // Waypoint 2: District Police Command
      ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.strokeStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(180, 70, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillText('DISTRICT POLICE HQ', 125, 74);

      // User Live Location Radar Ping at 17.08967° N, 82.06680° E
      const posX = 280;
      const posY = 140;

      angle += 0.04;
      const radius = 22 + Math.sin(angle) * 7;

      // Pulse Ring
      ctx.fillStyle = 'rgba(255, 59, 92, 0.25)';
      ctx.beginPath();
      ctx.arc(posX, posY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Core Beacon Point
      ctx.fillStyle = '#ff3b5c';
      ctx.beginPath();
      ctx.arc(posX, posY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label with Exact Coordinates
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Outfit, sans-serif';
      ctx.fillText('LIVE BEACON (17.08967° N, 82.06680° E)', posX + 14, posY - 4);
      ctx.fillStyle = 'var(--accent-cyan)';
      ctx.font = '10px Space Grotesk, monospace';
      ctx.fillText('Accuracy: 3m High Acc • Dual NavIC Lock', posX + 14, posY + 12);

      animationFrameId = requestAnimationFrame(renderMap);
    };

    renderMap();

    return () => cancelAnimationFrame(animationFrameId);
  }, [activeScenario]);

  // Safe Walk Timer Logic
  useEffect(() => {
    let timer;
    if (isSessionActive && timeLeftSec > 0) {
      timer = setInterval(() => {
        setTimeLeftSec(prev => prev - 1);
      }, 1000);
    } else if (isSessionActive && timeLeftSec === 0) {
      // Auto-trigger SOS!
      setIsSessionActive(false);
      onTriggerSOS();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSessionActive, timeLeftSec]);

  const handleStartSession = () => {
    soundEngine.playBeep(800, 0.2);
    setTimeLeftSec(durationMins * 60);
    setIsSessionActive(true);

    onLogActivity({
      type: 'SAFE_WALK',
      title: `Safe Walk Session Started`,
      description: `Target Destination: ${destination}. Timer set to ${durationMins} minutes. Guardians notified.`,
      severity: 'info'
    });
  };

  const handleCompleteSession = () => {
    soundEngine.playBeep(1000, 0.3);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    setIsSessionActive(false);

    onLogActivity({
      type: 'SAFE_WALK',
      title: `Safe Walk Arrived Safely`,
      description: `User checked in safely at destination: ${destination}. Session cleared.`,
      severity: 'info'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={24} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Live GPS & Safe Walk Guard</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Real-time breadcrumb tracking with automated timer checks. If you don't arrive before the timer expires, SOS activates automatically.
            </p>
          </div>

          <span className={`badge ${isSessionActive ? 'badge-amber' : 'badge-green'}`}>
            {isSessionActive ? 'SAFE WALK SESSION ACTIVE' : 'LOCATION TRACKING READY'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        
        {/* Geographical Scenarios Selector Bar */}
        <div className="glass-panel" style={{ padding: '18px 24px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
            GEOGRAPHICAL SAFETY SCENARIO SELECTOR • TARGET: 17.08967° N, 82.06680° E
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setActiveScenario('coastal')}
              className={`btn ${activeScenario === 'coastal' ? 'btn-cyan' : 'btn-secondary'} btn-sm`}
              style={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              <MapPin size={16} />
              <div>
                <div style={{ fontWeight: '700' }}>1. Coastal Beach Road</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>17.08967° N, 82.06680° E</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveScenario('highway')}
              className={`btn ${activeScenario === 'highway' ? 'btn-cyan' : 'btn-secondary'} btn-sm`}
              style={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              <Navigation size={16} />
              <div>
                <div style={{ fontWeight: '700' }}>2. NH-216 Urban Corridor</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>17.08967° N, 82.06680° E</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveScenario('industrial')}
              className={`btn ${activeScenario === 'industrial' ? 'btn-cyan' : 'btn-secondary'} btn-sm`}
              style={{ justifyContent: 'flex-start', textAlign: 'left' }}
            >
              <ShieldCheck size={16} />
              <div>
                <div style={{ fontWeight: '700' }}>3. Industrial Field Zone</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>17.08967° N, 82.06680° E</div>
              </div>
            </button>
          </div>
        </div>

        {/* Interactive Canvas GPS Map Card */}
        <div className="glass-panel" style={{ padding: '20px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.95rem', fontWeight: '700' }}>Live GPS Satellite Canvas</span>
            </div>
            <span className="badge badge-cyan" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              📍 {userLocation?.formatted || '17.08967° N, 82.06680° E'} ({userLocation?.accuracy || 3}m Acc)
            </span>
          </div>

          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
            <canvas 
              ref={canvasRef} 
              width={650} 
              height={320} 
              style={{ width: '100%', height: '320px', display: 'block' }} 
            />
          </div>

          {/* Map Overlay Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '16px'
          }}>
            <div style={{ background: 'rgba(10, 15, 26, 0.6)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nearest Safe Haven</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--status-green)' }}>Port Guard Hub (800m away)</div>
            </div>

            <div style={{ background: 'rgba(10, 15, 26, 0.6)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Geographical Safety Index</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>High Protection (96% Secure)</div>
            </div>

            <div style={{ background: 'rgba(10, 15, 26, 0.6)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Emergency Dispatch Unit</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-purple)' }}>Police HQ (1.2 km away)</div>
            </div>
          </div>
        </div>

        {/* Safe Walk Controls Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>
            "Escort Me Home" Safe Walk Timer
          </h3>

          {!isSessionActive ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label>Target Destination</label>
                <input 
                  type="text"
                  className="input-field"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="e.g. Home, Subway station, Dorm Room"
                />
              </div>

              <div>
                <label>Estimated Walking Duration</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {[10, 15, 20, 30].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDurationMins(m)}
                      className={`btn ${durationMins === m ? 'btn-cyan' : 'btn-secondary'} btn-sm`}
                    >
                      {m} Mins
                    </button>
                  ))}
                </div>
              </div>

              <button 
                className="btn btn-primary"
                onClick={handleStartSession}
                style={{ marginTop: '8px', padding: '14px', fontSize: '1.05rem' }}
              >
                <Play size={18} />
                <span>Start Guarded Walk Session</span>
              </button>
            </div>
          ) : (
            <div style={{
              background: 'rgba(10, 15, 26, 0.8)',
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--accent-cyan)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Guarded Walk to: <strong>{destination}</strong>
              </div>

              <div style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-mono)',
                margin: '12px 0'
              }}>
                {Math.floor(timeLeftSec / 60).toString().padStart(2, '0')}:{(timeLeftSec % 60).toString().padStart(2, '0')}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '20px' }}>
                Tap "I Have Arrived Safely" when you reach your destination. If timer hits zero, panic SOS will trigger automatically.
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={() => setIsSessionActive(false)} style={{ flex: 1 }}>
                  Cancel Session
                </button>
                <button className="btn btn-cyan" onClick={handleCompleteSession} style={{ flex: 2 }}>
                  <CheckCircle size={18} />
                  <span>I Have Arrived Safely</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
