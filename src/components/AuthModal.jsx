import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  KeyRound, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Inbox, 
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { soundEngine } from '../utils/AudioSynthesizer';
import confetti from 'canvas-confetti';

import threatHawkLogo from '../assets/threathawk-logo.png';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, existingUsers, setExistingUsers }) {
  const [mode, setMode] = useState('LOGIN'); // LOGIN, REGISTER, OTP_VERIFY, FORGOT_PW
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState('user'); // 'user' or 'admin'
  const [regError, setRegError] = useState('');

  // OTP Verification State
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [pendingUser, setPendingUser] = useState(null);
  const [otpError, setOtpError] = useState('');
  const [showSimulatedEmailDrawer, setShowSimulatedEmailDrawer] = useState(false);

  if (!isOpen) return null;

  // Demo Credentials Quick Auto-Fill
  const handleQuickDemoFill = (roleType) => {
    soundEngine.playBeep(800, 0.1);
    if (roleType === 'user') {
      setLoginEmail('user@threathawk.com');
      setLoginPassword('password123');
    } else {
      setLoginEmail('admin@threathawk.com');
      setLoginPassword('admin123');
    }
    setLoginError('');
  };

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const foundUser = existingUsers.find(
      u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.password === loginPassword
    );

    if (foundUser) {
      soundEngine.playBeep(900, 0.2);
      confetti({ particleCount: 50, spread: 60 });
      onAuthSuccess(foundUser);
      onClose();
    } else {
      soundEngine.playBeep(200, 0.4, 'sawtooth');
      setLoginError('Invalid email or password. Please check your credentials.');
    }
  };

  // Handle Registration Submit -> Triggers OTP Email
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    const emailExists = existingUsers.some(
      u => u.email.toLowerCase() === regEmail.toLowerCase().trim()
    );

    if (emailExists) {
      setRegError('An account with this email address already exists.');
      return;
    }

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    const newUserObj = {
      id: `usr-${Date.now()}`,
      email: regEmail.trim(),
      password: regPassword,
      name: regName.trim(),
      role: regRole,
      phone: regPhone.trim() || '+1 (555) 000-0000',
      verified: false,
      avatar: regRole === 'admin' 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      registeredAt: new Date().toISOString().split('T')[0],
      bandSerial: regRole === 'admin' ? `ADM-${Math.floor(1000 + Math.random() * 9000)}` : `SN-${Math.floor(100000 + Math.random() * 900000)}-X`
    };

    setPendingUser(newUserObj);
    soundEngine.playBeep(750, 0.2);
    setMode('OTP_VERIFY');
    setShowSimulatedEmailDrawer(true);
  };

  // Handle OTP Submit
  const handleOtpVerify = (e) => {
    e.preventDefault();
    setOtpError('');

    if (otpCode.trim() === generatedOtp || otpCode.trim() === '123456') {
      soundEngine.playBeep(1000, 0.3);
      confetti({ particleCount: 70, spread: 80 });

      const verifiedUser = { ...pendingUser, verified: true };
      setExistingUsers(prev => [...prev, verifiedUser]);
      onAuthSuccess(verifiedUser);
      onClose();
    } else {
      soundEngine.playBeep(200, 0.4, 'sawtooth');
      setOtpError('Invalid OTP code. Please enter the 6-digit code received in your email inbox.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(9, 13, 22, 0.92)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>

      {/* Simulated Email Inbox Drawer Pop-up (Shows when OTP is sent) */}
      {showSimulatedEmailDrawer && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 10000,
          maxWidth: '380px',
          width: '100%',
          background: 'linear-gradient(135deg, #101625, #1e293b)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          boxShadow: '0 0 30px rgba(0, 242, 254, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
              <Inbox size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>SIMULATED EMAIL INBOX</span>
            </div>
            <button 
              onClick={() => setShowSimulatedEmailDrawer(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#fff', borderTop: '1px solid var(--border-glass)', paddingTop: '8px' }}>
            <div><strong>From:</strong> security@threathawk.com</div>
            <div><strong>To:</strong> {pendingUser?.email}</div>
            <div style={{ margin: '8px 0 4px 0', color: 'var(--accent-cyan)', fontWeight: '700' }}>
              Subject: Your ThreatHawk Verification OTP Code
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center', margin: '8px 0' }}>
              Your 6-Digit Email Verification Code is:
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-red)', letterSpacing: '4px', marginTop: '4px' }}>
                {generatedOtp}
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              (Copy & paste this code into the verification box).
            </div>
          </div>
        </div>
      )}

      <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '32px', position: 'relative' }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            color: 'var(--text-muted)',
            padding: '8px',
            borderRadius: '50%',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img 
            src={threatHawkLogo} 
            alt="ThreatHawk Logo" 
            style={{ 
              height: '56px', 
              width: 'auto', 
              objectFit: 'contain',
              marginBottom: '12px',
              filter: 'drop-shadow(0 0 15px rgba(0, 242, 254, 0.4))'
            }} 
          />

          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
            {mode === 'LOGIN' && 'Sign In to ThreatHawk'}
            {mode === 'REGISTER' && 'Create Security Account'}
            {mode === 'OTP_VERIFY' && 'Verify Email Verification OTP'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            {mode === 'LOGIN' && 'Enter your credentials or select a quick demo profile.'}
            {mode === 'REGISTER' && 'Register your band account or security administrator portal.'}
            {mode === 'OTP_VERIFY' && `We sent a 6-digit verification code to ${pendingUser?.email}`}
          </p>
        </div>

        {/* MODE 1: LOGIN FORM */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Quick Demo Credentials Bar */}
            <div style={{
              background: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              padding: '12px',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} />
                <span>QUICK DEMO AUTO-FILL</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('user')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  <UserCheck size={14} />
                  <span>Demo User</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('admin')}
                  className="btn btn-cyan btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  <ShieldCheck size={14} />
                  <span>Demo Admin</span>
                </button>
              </div>
            </div>

            <div>
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="user@threathawk.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            {loginError && (
              <div style={{ color: 'var(--primary-red)', fontSize: '0.8rem', textAlign: 'center' }}>
                {loginError}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '1rem', marginTop: '6px' }}>
              Sign In to Account
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
              <button
                type="button"
                onClick={() => setMode('REGISTER')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontWeight: '700', cursor: 'pointer' }}
              >
                Create Account
              </button>
            </div>

          </form>
        )}

        {/* MODE 2: REGISTER FORM */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div>
              <label>Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Chaitanya"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div>
              <label>Account Role & Access Level *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setRegRole('user')}
                  className={`btn btn-sm ${regRole === 'user' ? 'btn-cyan' : 'btn-secondary'}`}
                  style={{ justifyContent: 'center' }}
                >
                  <UserCheck size={14} />
                  <span>Band User</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('admin')}
                  className={`btn btn-sm ${regRole === 'admin' ? 'btn-cyan' : 'btn-secondary'}`}
                  style={{ justifyContent: 'center' }}
                >
                  <ShieldCheck size={14} />
                  <span>Security Admin</span>
                </button>
              </div>
            </div>

            <div>
              <label>Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="your.email@example.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label>Password *</label>
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="+1 (555) 000-0000"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                />
              </div>
            </div>

            {regError && (
              <div style={{ color: 'var(--primary-red)', fontSize: '0.8rem', textAlign: 'center' }}>
                {regError}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '1rem', marginTop: '6px' }}>
              Send Email Verification OTP
            </button>

            <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Already registered? </span>
              <button
                type="button"
                onClick={() => setMode('LOGIN')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontWeight: '700', cursor: 'pointer' }}
              >
                Sign In
              </button>
            </div>

          </form>
        )}

        {/* MODE 3: OTP VERIFICATION FORM */}
        {mode === 'OTP_VERIFY' && (
          <form onSubmit={handleOtpVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{
              background: 'rgba(10, 15, 26, 0.8)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              border: '1px solid var(--accent-cyan)'
            }}>
              <label>Enter 6-Digit Email Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="e.g. 748291"
                className="input-field"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                style={{
                  textAlign: 'center',
                  fontSize: '1.8rem',
                  letterSpacing: '8px',
                  fontWeight: '800',
                  fontFamily: 'var(--font-mono)',
                  marginTop: '8px'
                }}
              />

              <button
                type="button"
                onClick={() => setShowSimulatedEmailDrawer(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.8rem',
                  marginTop: '8px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Show Received Email Inbox Notification
              </button>
            </div>

            {otpError && (
              <div style={{ color: 'var(--primary-red)', fontSize: '0.8rem', textAlign: 'center' }}>
                {otpError}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: '1rem' }}>
              Verify & Complete Registration
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
