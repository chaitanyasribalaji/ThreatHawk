import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SmartBandSim from './components/SmartBandSim';
import SOSModal from './components/SOSModal';
import AuthModal from './components/AuthModal';
import FakeCallModal from './components/FakeCallModal';
import DLEscalationModal from './components/DLEscalationModal';
import AIVitalsSidePanel from './components/AIVitalsSidePanel';

import DashboardTab from './tabs/DashboardTab';
import GuardiansTab from './tabs/GuardiansTab';
import SafeWalkTab from './tabs/SafeWalkTab';
import ActivityLogTab from './tabs/ActivityLogTab';
import BandSettingsTab from './tabs/BandSettingsTab';
import AdminTab from './tabs/AdminTab';

import { watchRealLocation } from './utils/GeolocationHelper';
import { runDeepLearningInference } from './utils/DeepLearningModel';
import { fetchLiveAddress } from './utils/ReverseGeocoding';

import { 
  initialUsers,
  masterFleetBands,
  initialGuardians, 
  initialBandMetrics, 
  initialActivityLogs, 
  initialSafetySettings 
} from './data/mockData';

// Helper for safe localStorage parsing
const safeJSONParse = (key, fallback, oldKey) => {
  try {
    const saved = localStorage.getItem(key) || (oldKey ? localStorage.getItem(oldKey) : null);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed;
  } catch (err) {
    console.warn(`[ThreatHawk] Corrupt state found in ${key}, restoring fallback.`, err);
    try { localStorage.removeItem(key); } catch (e) {}
    return fallback;
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Real-Time Smart Band Vitals Feed (All 7 Vitals)
  const [vitals, setVitals] = useState({
    heartRate: 74,
    hrv: 62,
    bodyTemp: 36.6,
    spO2: 98,
    stressGsr: 22,
    gForce: 1.0,
    respRate: 16
  });

  // Deep Learning Model Result State
  const [dlResult, setDlResult] = useState(null);
  const [isDLEscalationOpen, setIsDLEscalationOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // Real Geolocation State (Set to 17.08967° N, 82.06680° E)
  const [userLocation, setUserLocation] = useState({
    lat: '17.08967',
    lng: '82.06680',
    rawLat: 17.08967,
    rawLng: 82.06680,
    formatted: '17.08967° N, 82.06680° E',
    accuracy: 3
  });

  // Users Directory & Fleet
  const [allUsers, setAllUsers] = useState(() => safeJSONParse('threathawk_users_dir', initialUsers, 'aegis_users_dir'));
  const [masterFleet, setMasterFleet] = useState(() => safeJSONParse('threathawk_master_fleet', masterFleetBands, 'aegis_master_fleet'));
  const [currentUser, setCurrentUser] = useState(() => safeJSONParse('threathawk_current_user', null, 'aegis_current_user'));
  const [guardians, setGuardians] = useState(() => safeJSONParse('threathawk_guardians', initialGuardians, 'aegis_guardians'));
  const [bandMetrics, setBandMetrics] = useState(initialBandMetrics);
  const [activityLogs, setActivityLogs] = useState(() => safeJSONParse('threathawk_logs', initialActivityLogs, 'aegis_logs'));
  const [settings, setSettings] = useState(() => safeJSONParse('threathawk_settings', initialSafetySettings, 'aegis_settings'));

  // Modal triggers (Default isAuthModalOpen to true if not signed in)
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [sosTriggerSource, setSosTriggerSource] = useState('Panic SOS Button');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => !safeJSONParse('threathawk_current_user', null, 'aegis_current_user'));
  const [isFakeCallOpen, setIsFakeCallOpen] = useState(false);

  // Start real browser geolocation watcher
  useEffect(() => {
    const stopWatcher = watchRealLocation((loc) => {
      setUserLocation(prev => ({ ...prev, ...loc }));
    });
    return () => {
      if (stopWatcher) stopWatcher();
    };
  }, []);

  // Live Reverse Geocoding Address Lookup
  useEffect(() => {
    let isMounted = true;
    fetchLiveAddress(userLocation.rawLat || 17.08967, userLocation.rawLng || 82.06680).then(res => {
      if (isMounted && res) {
        setUserLocation(prev => ({
          ...prev,
          addressName: res.formattedAddress || res.displayName,
          district: res.district,
          city: res.city
        }));
      }
    });
    return () => { isMounted = false; };
  }, [userLocation.rawLat, userLocation.rawLng]);

  // Run Deep Learning Inference Loop on live vitals
  useEffect(() => {
    const result = runDeepLearningInference(vitals);
    setDlResult(result);

    // Auto-trigger Escalation Warning Modal if DL model detects high anomaly
    if (result.requiresEscalation && !isSOSOpen && !isDLEscalationOpen) {
      setIsDLEscalationOpen(true);
    }
  }, [vitals, isSOSOpen, isDLEscalationOpen]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('threathawk_users_dir', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('threathawk_master_fleet', JSON.stringify(masterFleet));
  }, [masterFleet]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('threathawk_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('threathawk_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('threathawk_guardians', JSON.stringify(guardians));
  }, [guardians]);

  useEffect(() => {
    localStorage.setItem('threathawk_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('threathawk_settings', JSON.stringify(settings));
  }, [settings]);

  // Activity Logger Helper
  const handleLogActivity = (newLog) => {
    const logItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      ...newLog
    };
    setActivityLogs(prev => [logItem, ...prev]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    setIsAuthModalOpen(true);
    handleLogActivity({
      type: 'AUTH_LOGOUT',
      title: 'User Signed Out',
      description: 'Account session closed. Please sign in to continue.',
      severity: 'info'
    });
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
    handleLogActivity({
      type: 'AUTH_LOGIN',
      title: `User Signed In: ${user.name}`,
      description: `Authenticated with role: ${user.role.toUpperCase()}. Email verified.`,
      severity: 'info'
    });
  };

  const triggerSOS = (source = "Panic SOS Button") => {
    setSosTriggerSource(source);
    setIsSOSOpen(true);
    handleLogActivity({
      type: 'EMERGENCY_SOS',
      title: `EMERGENCY SOS TRIGGERED`,
      description: `Emergency beacon activated via ${source} at ${userLocation.formatted}. Siren & Guardian broadcast active.`,
      severity: 'high'
    });
  };

  const triggerFallAlert = () => {
    // Spike vitals for DL fall inference
    setVitals(v => ({ ...v, gForce: 4.2, heartRate: 145, stressGsr: 88 }));
    setSosTriggerSource("Band Fall Sensor Impact (3.8G)");
    setIsSOSOpen(true);
    handleLogActivity({
      type: 'FALL_DETECTED',
      title: `Fall Sensor Auto-Triggered`,
      description: `Impact acceleration 3.8G + sudden 145 BPM pulse spike registered by band at ${userLocation.formatted}.`,
      severity: 'high'
    });
  };

  // DL Threat Scenario Simulation
  const handleSimulateScenario = (type) => {
    if (type === 'ATTACK') {
      setVitals({ heartRate: 158, hrv: 18, bodyTemp: 37.8, spO2: 95, stressGsr: 92, gForce: 3.8, respRate: 28 });
      handleLogActivity({
        type: 'DL_SIMULATION',
        title: 'Deep Learning Test: Assault Attack',
        description: 'Simulated physical assault vitals (158 BPM, 3.8G impact, 92% stress).',
        severity: 'high'
      });
    } else if (type === 'FALL') {
      setVitals({ heartRate: 135, hrv: 25, bodyTemp: 36.6, spO2: 96, stressGsr: 75, gForce: 4.2, respRate: 20 });
      handleLogActivity({
        type: 'DL_SIMULATION',
        title: 'Deep Learning Test: High Fall',
        description: 'Simulated high-G fall sensor spike (4.2G acceleration).',
        severity: 'high'
      });
    } else if (type === 'CARDIAC') {
      setVitals({ heartRate: 165, hrv: 12, bodyTemp: 37.1, spO2: 93, stressGsr: 65, gForce: 1.0, respRate: 22 });
      handleLogActivity({
        type: 'DL_SIMULATION',
        title: 'Deep Learning Test: Cardiac Stress',
        description: 'Simulated severe tachycardia cardiac spike (165 BPM).',
        severity: 'medium'
      });
    } else {
      setVitals({ heartRate: 74, hrv: 62, bodyTemp: 36.6, spO2: 98, stressGsr: 22, gForce: 1.0, respRate: 16 });
      setIsDLEscalationOpen(false);
      handleLogActivity({
        type: 'DL_SIMULATION',
        title: 'Vitals Reset to Baseline Normal',
        description: 'Reset band sensors to healthy physiological baseline.',
        severity: 'info'
      });
    }
  };

  const handleStopEscalationAndReset = () => {
    // Reset vitals to healthy baseline normal
    setVitals({
      heartRate: 74,
      hrv: 62,
      bodyTemp: 36.6,
      spO2: 98,
      stressGsr: 22,
      gForce: 1.0,
      respRate: 16
    });
    setIsDLEscalationOpen(false);
    setIsSOSOpen(false);
    setActiveTab('dashboard'); // Return to Home Dashboard
    handleLogActivity({
      type: 'DE_ESCALATION',
      title: 'Escalation Stopped & Vitals Reset',
      description: 'User stopped escalation. Vitals normalized to baseline. System returned to Home Dashboard.',
      severity: 'info'
    });
  };

  const handleConfirmDLEscalation = () => {
    setIsDLEscalationOpen(false);
    triggerSOS(`Deep Learning Auto-Escalation (${dlResult?.topPrediction?.label})`);
  };

  return (
    <div className="app-container">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        bandMetrics={bandMetrics}
        onTriggerSOS={() => triggerSOS('Navbar Emergency Button')}
        onOpenFakeCall={() => setIsFakeCallOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenSidePanel={() => setIsSidePanelOpen(true)}
        dlResult={dlResult}
      />

      {/* Main Content Area */}
      <div className="content-grid content-grid-with-sidebar">
        
        {/* Left Sidebar: Smart Band Hardware Simulator */}
        <aside style={{ height: 'fit-content' }}>
          <SmartBandSim
            bandMetrics={bandMetrics}
            setBandMetrics={setBandMetrics}
            onTriggerSOS={() => triggerSOS('Wearable Band Touch Screen')}
            onTriggerFallAlert={triggerFallAlert}
          />
        </aside>

        {/* Right Main Tab View */}
        <main>
          {activeTab === 'dashboard' && (
            <DashboardTab 
              bandMetrics={bandMetrics}
              guardians={guardians || []}
              activityLogs={activityLogs || []}
              userLocation={userLocation}
              dlResult={dlResult}
              vitals={vitals}
              onTriggerSOS={() => triggerSOS('Dashboard Quick Tile')}
              onTriggerFallAlert={triggerFallAlert}
              onOpenFakeCall={() => setIsFakeCallOpen(true)}
              onSwitchTab={setActiveTab}
              onOpenSidePanel={() => setIsSidePanelOpen(true)}
              onSimulateScenario={handleSimulateScenario}
            />
          )}

          {activeTab === 'guardians' && (
            <GuardiansTab 
              guardians={guardians || []}
              setGuardians={setGuardians}
              onLogActivity={handleLogActivity}
            />
          )}

          {activeTab === 'safewalk' && (
            <SafeWalkTab 
              userLocation={userLocation}
              onTriggerSOS={() => triggerSOS('Safe Walk Timer Expiration')}
              onLogActivity={handleLogActivity}
            />
          )}

          {activeTab === 'activity' && (
            <ActivityLogTab 
              activityLogs={activityLogs || []}
              setActivityLogs={setActivityLogs}
            />
          )}

          {activeTab === 'settings' && (
            <BandSettingsTab 
              settings={settings}
              setSettings={setSettings}
              onLogActivity={handleLogActivity}
            />
          )}

          {activeTab === 'admin' && (
            currentUser?.role === 'admin' ? (
              <AdminTab
                currentUser={currentUser}
                masterFleet={masterFleet || []}
                setMasterFleet={setMasterFleet}
                allUsers={allUsers || []}
                setAllUsers={setAllUsers}
                onLogActivity={handleLogActivity}
              />
            ) : (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', background: 'rgba(16, 22, 37, 0.9)' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255, 59, 92, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <span style={{ fontSize: '24px' }}>🔒</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Admin Privileges Required</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                  You are currently signed in as <strong>{currentUser?.name || 'User'}</strong> ({currentUser?.role || 'Guest'}). Switch to an administrator account or click below to sign in as Admin.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button className="btn btn-cyan" onClick={() => setIsAuthModalOpen(true)}>
                    Sign In as Admin
                  </button>
                  <button className="btn btn-secondary" onClick={() => setActiveTab('dashboard')}>
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )
          )}

          {!['dashboard', 'guardians', 'safewalk', 'activity', 'settings', 'admin'].includes(activeTab) && (
            <DashboardTab 
              bandMetrics={bandMetrics}
              guardians={guardians || []}
              activityLogs={activityLogs || []}
              userLocation={userLocation}
              dlResult={dlResult}
              vitals={vitals}
              onTriggerSOS={() => triggerSOS('Dashboard Quick Tile')}
              onTriggerFallAlert={triggerFallAlert}
              onSwitchTab={setActiveTab}
              onOpenSidePanel={() => setIsSidePanelOpen(true)}
              onSimulateScenario={handleSimulateScenario}
            />
          )}
        </main>

      </div>

      {/* Modals & Side Screens */}
      <SOSModal 
        isOpen={isSOSOpen} 
        onClose={handleStopEscalationAndReset} 
        guardians={guardians}
        settings={settings}
        userLocation={userLocation}
        triggerSource={sosTriggerSource}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        existingUsers={allUsers}
        setExistingUsers={setAllUsers}
      />

      <FakeCallModal
        isOpen={isFakeCallOpen}
        onClose={() => setIsFakeCallOpen(false)}
      />

      {/* Deep Learning Auto-Escalation Warning Alert Modal */}
      <DLEscalationModal
        isOpen={isDLEscalationOpen}
        onClose={handleStopEscalationAndReset}
        onConfirmEscalation={handleConfirmDLEscalation}
        dlResult={dlResult}
        vitals={vitals}
      />

      {/* DEDICATED AI VITALS SIDE SCREEN / DRAWER */}
      <AIVitalsSidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        vitals={vitals}
        setVitals={setVitals}
        dlResult={dlResult}
        onSimulateScenario={handleSimulateScenario}
      />

    </div>
  );
}
