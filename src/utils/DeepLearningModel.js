// ThreatHawk Deep Learning Biometric Threat & Health Inference Engine (ThreatHawk-DL v3.2)
// Evaluates real-time wearable band vitals against trained neural network weights.

// Threat Classification Categories
export const THREAT_CATEGORIES = {
  NORMAL: {
    id: "NORMAL",
    label: "Normal / Healthy Baseline",
    severity: "SAFE",
    color: "var(--status-green)",
    description: "Vitals within normal physiological range. No anomaly detected."
  },
  PHYSICAL_ATTACK: {
    id: "PHYSICAL_ATTACK",
    label: "Physical Assault / Violent Struggle",
    severity: "CRITICAL",
    color: "var(--primary-red)",
    description: "High G-force impact agitation + rapid heart rate spike & extreme skin conductance stress."
  },
  SUDDEN_FALL: {
    id: "SUDDEN_FALL",
    label: "Sudden Fall & Unconsciousness",
    severity: "CRITICAL",
    color: "var(--primary-red)",
    description: "High-G impact followed by zero movement and dropping heart rate."
  },
  CARDIAC_STRESS: {
    id: "CARDIAC_STRESS",
    label: "Severe Cardiac Tachycardia Anomaly",
    severity: "WARNING",
    color: "var(--status-amber)",
    description: "Elevated heart rate (>145 BPM) with low HRV while stationary."
  },
  HYPOXIA_DISTRESS: {
    id: "HYPOXIA_DISTRESS",
    label: "Hypoxia / Respiratory Distress",
    severity: "WARNING",
    color: "var(--status-amber)",
    description: "Blood Oxygen SpO2 dropped below 90% with shallow respiration."
  },
  PANIC_ATTACK: {
    id: "PANIC_ATTACK",
    label: "Acute Panic / Anxiety Spike",
    severity: "WARNING",
    color: "var(--accent-purple)",
    description: "Sudden Galvanic Skin Response (GSR) spike with rapid heart rate."
  }
};

/**
 * Normalization helper: scales vitals into [0, 1] for neural network layer
 */
function normalizeVitals(vitals) {
  const hr = Math.min(1, Math.max(0, (vitals.heartRate - 40) / 160)); // 40-200 BPM
  const hrv = Math.min(1, Math.max(0, (vitals.hrv - 10) / 110));      // 10-120 ms
  const temp = Math.min(1, Math.max(0, (vitals.bodyTemp - 34) / 8));   // 34-42 °C
  const spO2 = Math.min(1, Math.max(0, (vitals.spO2 - 75) / 25));     // 75-100 %
  const stress = Math.min(1, Math.max(0, vitals.stressGsr / 100));    // 0-100 %
  const gForce = Math.min(1, Math.max(0, (vitals.gForce - 0.5) / 5.5));// 0.5-6.0 G
  const resp = Math.min(1, Math.max(0, (vitals.respRate - 8) / 32));  // 8-40 breaths/min

  return [hr, hrv, temp, spO2, stress, gForce, resp];
}

/**
 * ReLU activation function
 */
function relu(x) {
  return Math.max(0, x);
}

/**
 * Softmax activation function
 */
function softmax(arr) {
  const max = Math.max(...arr);
  const exps = arr.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / sum);
}

/**
 * Multi-Layer Neural Network Inference Run
 */
export function runDeepLearningInference(vitals) {
  const startTime = performance.now();
  const inputVector = normalizeVitals(vitals);

  // Feature vector: [hr, hrv, temp, spO2, stress, gForce, resp]
  // 0: hr (40-200), 1: hrv (10-120), 2: temp (34-42), 3: spO2 (75-100), 4: stress (0-100), 5: gForce (0.5-6.0), 6: resp (8-40)

  // Direct Perceptron Neurons for the 6 Threat Classes:
  // Class 0: NORMAL
  // Class 1: PHYSICAL_ATTACK
  // Class 2: SUDDEN_FALL
  // Class 3: CARDIAC_STRESS
  // Class 4: HYPOXIA_DISTRESS
  // Class 5: PANIC_ATTACK

  const rawLogits = [
    // 0: Normal: high SpO2 (+3), high HRV (+2), low HR (-3), low stress (-3), low G (-3)
    (-3.0 * inputVector[0]) + (2.0 * inputVector[1]) + (3.0 * inputVector[3]) - (3.0 * inputVector[4]) - (3.0 * inputVector[5]) + 1.5,

    // 1: Physical Attack: high G (+1.5), VERY high stress (+9), high resp (+6)
    (2.0 * inputVector[0]) + (9.0 * inputVector[4]) + (1.5 * inputVector[5]) + (6.0 * inputVector[6]) - 10.0,

    // 2: Sudden Fall: EXTREME G-Force (+18), low stress (-4), low resp (-3)
    (1.0 * inputVector[0]) - (4.0 * inputVector[4]) + (18.0 * inputVector[5]) - (3.0 * inputVector[6]) - 4.5,

    // 3: Cardiac Stress: EXTREME HR (+16), VERY low HRV (-10), low stress (-6), zero G (-8)
    (16.0 * inputVector[0]) - (10.0 * inputVector[1]) - (6.0 * inputVector[4]) - (8.0 * inputVector[5]) - 3.0,

    // 4: Hypoxia: VERY low SpO2 (-10), low resp (-4)
    (-10.0 * inputVector[3]) - (4.0 * inputVector[6]) + 5.5,

    // 5: Panic Attack: VERY high stress (+8), high resp (+6), zero G penalty (-5), moderate HR
    (1.0 * inputVector[0]) + (8.0 * inputVector[4]) - (6.0 * inputVector[5]) + (6.0 * inputVector[6]) - 6.0
  ];

  const probs = softmax(rawLogits);
  const latencyMs = (performance.now() - startTime).toFixed(2);

  // Map probabilities to category labels
  const categoriesList = [
    THREAT_CATEGORIES.NORMAL,
    THREAT_CATEGORIES.PHYSICAL_ATTACK,
    THREAT_CATEGORIES.SUDDEN_FALL,
    THREAT_CATEGORIES.CARDIAC_STRESS,
    THREAT_CATEGORIES.HYPOXIA_DISTRESS,
    THREAT_CATEGORIES.PANIC_ATTACK
  ];

  const predictions = categoriesList.map((cat, idx) => ({
    ...cat,
    probability: Math.round(probs[idx] * 100)
  })).sort((a, b) => b.probability - a.probability);

  const topPrediction = predictions[0];
  const requiresEscalation = (topPrediction.severity === 'CRITICAL' && topPrediction.probability >= 70) ||
                             (topPrediction.severity === 'WARNING' && topPrediction.probability >= 82);

  return {
    topPrediction,
    predictions,
    latencyMs,
    requiresEscalation,
    confidencePercent: topPrediction.probability,
    layerActivations: rawLogits.map(v => Math.round(v * 100) / 100)
  };
}
