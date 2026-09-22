// Initial Mock Data for ThreatHawk Security Application

export const initialUsers = [
  {
    id: "usr-101",
    email: "user@threathawk.com",
    password: "password123",
    name: "Chaitanya",
    role: "user",
    phone: "+1 (555) 019-2831",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    registeredAt: "2026-08-10",
    bandSerial: "SN-882910-X"
  },
  {
    id: "usr-102",
    email: "admin@threathawk.com",
    password: "admin123",
    name: "Commander Alex Vance",
    role: "admin",
    phone: "+1 (800) 999-OPS1",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    registeredAt: "2026-01-01",
    bandSerial: "ADM-COMMAND-01"
  }
];

export const masterFleetBands = [
  {
    userId: "usr-101",
    userName: "Chaitanya",
    userPhone: "+1 (555) 019-2831",
    bandModel: "ThreatHawk Sentinel Pro X",
    serialNumber: "SN-882910-X",
    status: "ACTIVE", // ACTIVE, SOS_ALERT, DISCONNECTED
    battery: 88,
    heartRate: 74,
    location: "37.7749° N, 122.4194° W (SF Downtown)",
    guardiansCount: 4,
    lastPing: "10s ago"
  },
  {
    userId: "usr-103",
    userName: "Sophia Martinez",
    userPhone: "+1 (555) 839-2041",
    bandModel: "ThreatHawk Sentinel Light",
    serialNumber: "SN-441209-B",
    status: "ACTIVE",
    battery: 94,
    heartRate: 68,
    location: "37.7833° N, 122.4167° W (SOMA District)",
    guardiansCount: 3,
    lastPing: "2m ago"
  },
  {
    userId: "usr-104",
    userName: "David Kim",
    userPhone: "+1 (555) 304-9912",
    bandModel: "ThreatHawk Sentinel Pro X",
    serialNumber: "SN-991042-Z",
    status: "SOS_ALERT",
    battery: 45,
    heartRate: 132,
    location: "37.7690° N, 122.4480° W (Golden Gate Park)",
    guardiansCount: 5,
    lastPing: "JUST NOW"
  },
  {
    userId: "usr-105",
    userName: "Rachel Adams",
    userPhone: "+1 (555) 712-4098",
    bandModel: "ThreatHawk Sentinel Standard",
    serialNumber: "SN-102948-C",
    status: "DISCONNECTED",
    battery: 12,
    heartRate: 0,
    location: "37.7550° N, 122.4180° W (Mission District)",
    guardiansCount: 2,
    lastPing: "45m ago"
  }
];

export const initialGuardians = [
  {
    id: "g-1",
    name: "Eleanor Vance",
    relationship: "Mother / Primary Guardian",
    phone: "+1 (555) 234-5678",
    email: "eleanor.vance@example.com",
    priority: "Primary SOS",
    status: "Verified",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    channels: {
      sms: true,
      call: true,
      push: true,
      whatsapp: true
    },
    notes: "Has key to apartment. Lives 5 minutes away.",
    lastVerified: "Today, 09:30 AM"
  },
  {
    id: "g-2",
    name: "Marcus Miller",
    relationship: "Partner / Spouse",
    phone: "+1 (555) 987-6543",
    email: "marcus.m@example.com",
    priority: "Primary SOS",
    status: "Verified",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    channels: {
      sms: true,
      call: true,
      push: true,
      whatsapp: false
    },
    notes: "Works at Downtown Office, reachable 24/7.",
    lastVerified: "Yesterday, 06:15 PM"
  },
  {
    id: "g-3",
    name: "Dr. Sarah Chen",
    relationship: "Personal Physician",
    phone: "+1 (555) 456-7890",
    email: "dr.chen@healthclinic.org",
    priority: "Medical Priority",
    status: "Verified",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    channels: {
      sms: true,
      call: false,
      push: true,
      whatsapp: false
    },
    notes: "Medical profile & emergency allergy info attached.",
    lastVerified: "3 days ago"
  },
  {
    id: "g-4",
    name: "Campus Security Desk",
    relationship: "Security Service",
    phone: "+1 (800) 555-SAFE",
    email: "dispatch@campussecurity.edu",
    priority: "Secondary SOS",
    status: "Verified",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    channels: {
      sms: true,
      call: true,
      push: false,
      whatsapp: false
    },
    notes: "Local rapid response security team dispatcher.",
    lastVerified: "1 week ago"
  }
];

export const initialBandMetrics = {
  deviceName: "ThreatHawk Sentinel Pro X",
  modelNumber: "TH-990-BT5",
  serialNumber: "SN-882910-X",
  connected: true,
  batteryPercent: 88,
  signalStrengthDbm: -58, // dBm
  firmwareVersion: "v2.4.1-stable",
  lastSynced: "Just now",
  sensors: {
    heartRateBpm: 72,
    bodyTempC: 36.6,
    accelerometerG: 1.02,
    skinConductance: "Normal",
    fallDetectorActive: true
  }
};

export const initialActivityLogs = [
  {
    id: "log-101",
    timestamp: "2026-09-17 19:45",
    type: "TEST_PING",
    title: "Guardian Test Alert Passed",
    description: "Sent test location ping to Eleanor Vance (+1 555 234-5678). Verified SMS & Push dispatch.",
    status: "SUCCESS",
    severity: "low"
  },
  {
    id: "log-102",
    timestamp: "2026-09-17 14:10",
    type: "SAFE_WALK",
    title: "Safe Walk Session Completed",
    description: "20-minute safe walk session to Home finished safely. Guardians notified.",
    status: "RESOLVED",
    severity: "info"
  },
  {
    id: "log-103",
    timestamp: "2026-09-15 22:30",
    type: "FALL_DETECTED",
    title: "Fall Detection Auto-Triggered",
    description: "Impact sensor registered 3.8G acceleration spike. User cancelled countdown in 3s (False alarm).",
    status: "CANCELLED",
    severity: "medium"
  },
  {
    id: "log-104",
    timestamp: "2026-09-10 18:05",
    type: "BAND_SYNC",
    title: "Band Firmware Updated",
    description: "Updated ThreatHawk Sentinel Pro X firmware to version v2.4.1-stable.",
    status: "SYSTEM",
    severity: "info"
  }
];

export const initialSafetySettings = {
  countdownSeconds: 5,
  sirenAudioEnabled: true,
  strobeFlashEnabled: true,
  stealthRecordingEnabled: true,
  autoDialEmergency: false,
  fallDetectionSensitivity: "High", // Low, Medium, High
  hapticPattern: "Heavy Triple Pulse", // Subtle, Double Pulse, Heavy Triple Pulse, Continuous
  bandButtonAction: "Hold 3 Seconds or 3 Rapid Clicks",
  pinCode: "1234",
  stealthMode: false
};
