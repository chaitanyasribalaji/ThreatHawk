import React from 'react';
import { 
  BrainCircuit, 
  Heart, 
  Activity, 
  Thermometer, 
  Wind, 
  Zap, 
  X, 
  AlertTriangle, 
  CheckCircle,
  Sparkles,
  Sliders,
  Cpu
} from 'lucide-react';
import { THREAT_CATEGORIES } from '../utils/DeepLearningModel';

export default function AIVitalsSidePanel({ 
  isOpen, 
  onClose, 
  vitals, 
  setVitals, 
  dlResult, 
  onSimulateScenario 
}) {
  if (!isOpen) return null;

  const top = dlResult?.topPrediction || THREAT_CATEGORIES.NORMAL;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '440px',
      maxWidth: '100vw',
      zIndex: 9995,
      background: 'rgba(9, 13, 22, 0.95)',
      backdropFilter: 'blur(20px)',
      borderLeft: '1px solid var(--accent-cyan)',
      boxShadow: '-10px 0 40px rgba(0,0,0,0.8)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', pb: '16px', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BrainCircuit size={22} color="#090d16" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
              Vitals & AI Neural Engine
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ThreatHawk-DL v3.2 Neural Classification Model
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'var(--text-muted)', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* DL Prediction Badge Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 22, 37, 0.9), rgba(30, 41, 59, 0.9))',
        border: `1px solid ${top.color || 'var(--accent-cyan)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
            <Cpu size={10} /> INFERENCE LATENCY: {dlResult?.latencyMs || 1.2}ms
          </span>
          <span className={`badge ${top.severity === 'CRITICAL' ? 'badge-red' : top.severity === 'WARNING' ? 'badge-amber' : 'badge-green'}`}>
            {top.probability}% CONFIDENCE
          </span>
        </div>

        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: top.color || '#fff', marginTop: '6px' }}>
          {top.label}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {top.description}
        </p>
      </div>

      {/* SECTION 1: ALL 7 LIVE VITALS GAUGES */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
          Live Band Sensor Vitals Feed
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          
          {/* Vital 1: Heart Rate */}
          <div style={{ background: 'rgba(10, 15, 26, 0.8)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Heart size={14} color="var(--primary-red)" className="animate-pulse-cyan" />
              <span>Heart Rate</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: vitals.heartRate > 120 ? 'var(--primary-red)' : 'var(--accent-cyan)', marginTop: '4px' }}>
              {vitals.heartRate} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BPM</span>
            </div>
          </div>

          {/* Vital 2: HRV */}
          <div style={{ background: 'rgba(10, 15, 26, 0.8)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Activity size={14} color="var(--accent-cyan)" />
              <span>Heart Rate Var (HRV)</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
              {vitals.hrv} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ms</span>
            </div>
          </div>

          {/* Vital 3: Blood Oxygen SpO2 */}
          <div style={{ background: 'rgba(10, 15, 26, 0.8)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Zap size={14} color="var(--status-green)" />
              <span>Blood Oxygen SpO2</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: vitals.spO2 < 92 ? 'var(--status-amber)' : 'var(--status-green)', marginTop: '4px' }}>
              {vitals.spO2} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>%</span>
            </div>
          </div>

          {/* Vital 4: Body Temp */}
          <div style={{ background: 'rgba(10, 15, 26, 0.8)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Thermometer size={14} color="var(--status-amber)" />
              <span>Body Temp</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
              {vitals.bodyTemp} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>°C</span>
            </div>
          </div>

          {/* Vital 5: Stress / GSR */}
          <div style={{ background: 'rgba(10, 15, 26, 0.8)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Sparkles size={14} color="var(--accent-purple)" />
              <span>Stress / GSR</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: vitals.stressGsr > 75 ? 'var(--primary-red)' : 'var(--accent-purple)', marginTop: '4px' }}>
              {vitals.stressGsr} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>%</span>
            </div>
          </div>

          {/* Vital 6: Accelerometer G-Force */}
          <div style={{ background: 'rgba(10, 15, 26, 0.8)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Activity size={14} color="var(--primary-red)" />
              <span>G-Force Accelerometer</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: vitals.gForce > 3.0 ? 'var(--primary-red)' : '#fff', marginTop: '4px' }}>
              {vitals.gForce} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>G</span>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: NEURAL NETWORK PROBABILITY DISTRIBUTION */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
          Neural Network Classification Probabilities
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {dlResult?.predictions?.map((pred) => (
            <div key={pred.id} style={{ fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: pred.probability > 30 ? '#fff' : 'var(--text-muted)' }}>{pred.label}</span>
                <span style={{ fontWeight: '700', color: pred.color }}>{pred.probability}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pred.probability}%`,
                  background: pred.color,
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: SCENARIO TESTER BUTTONS */}
      <div>
        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
          Instant Threat Scenario Testing
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => onSimulateScenario('ATTACK')}
            style={{ fontSize: '0.75rem', justifyContent: 'center' }}
          >
            <AlertTriangle size={14} />
            <span>Simulate Assault</span>
          </button>

          <button 
            className="btn btn-danger btn-sm"
            onClick={() => onSimulateScenario('FALL')}
            style={{ fontSize: '0.75rem', justifyContent: 'center' }}
          >
            <Activity size={14} />
            <span>Simulate High Fall</span>
          </button>

          <button 
            className="btn btn-cyan btn-sm"
            onClick={() => onSimulateScenario('CARDIAC')}
            style={{ fontSize: '0.75rem', justifyContent: 'center' }}
          >
            <Heart size={14} />
            <span>Cardiac Stress</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onSimulateScenario('NORMAL')}
            style={{ fontSize: '0.75rem', justifyContent: 'center' }}
          >
            <CheckCircle size={14} />
            <span>Reset Normal</span>
          </button>
        </div>
      </div>

    </div>
  );
}
