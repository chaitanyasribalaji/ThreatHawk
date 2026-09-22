import { runDeepLearningInference, THREAT_CATEGORIES } from './DeepLearningModel.js';

export function runModelEpochTests() {
  const testResults = [];
  const startTime = performance.now();

  // Test Suite Definitions
  const testCases = [
    {
      name: "Epoch Test 1: Normal Healthy Baseline",
      vitals: { heartRate: 72, hrv: 65, bodyTemp: 36.6, spO2: 98, stressGsr: 20, gForce: 1.0, respRate: 16 },
      expectedId: THREAT_CATEGORIES.NORMAL.id,
      minConfidence: 85
    },
    {
      name: "Epoch Test 2: Violent Physical Assault",
      vitals: { heartRate: 162, hrv: 15, bodyTemp: 37.9, spO2: 94, stressGsr: 95, gForce: 4.1, respRate: 30 },
      expectedId: THREAT_CATEGORIES.PHYSICAL_ATTACK.id,
      minConfidence: 80
    },
    {
      name: "Epoch Test 3: High-G Sudden Fall Impact",
      vitals: { heartRate: 135, hrv: 22, bodyTemp: 36.5, spO2: 96, stressGsr: 78, gForce: 4.5, respRate: 20 },
      expectedId: THREAT_CATEGORIES.SUDDEN_FALL.id,
      minConfidence: 80
    },
    {
      name: "Epoch Test 4: Severe Tachycardia Cardiac Anomaly",
      vitals: { heartRate: 170, hrv: 10, bodyTemp: 37.0, spO2: 93, stressGsr: 65, gForce: 1.0, respRate: 22 },
      expectedId: THREAT_CATEGORIES.CARDIAC_STRESS.id,
      minConfidence: 75
    },
    {
      name: "Epoch Test 5: Hypoxia Respiratory Failure",
      vitals: { heartRate: 88, hrv: 45, bodyTemp: 36.2, spO2: 82, stressGsr: 40, gForce: 1.0, respRate: 9 },
      expectedId: THREAT_CATEGORIES.HYPOXIA_DISTRESS.id,
      minConfidence: 75
    },
    {
      name: "Epoch Test 6: Acute Panic Attack Spike",
      vitals: { heartRate: 128, hrv: 30, bodyTemp: 36.8, spO2: 97, stressGsr: 96, gForce: 1.1, respRate: 34 },
      expectedId: THREAT_CATEGORIES.PANIC_ATTACK.id,
      minConfidence: 75
    }
  ];

  let passedCount = 0;

  testCases.forEach((tc) => {
    const res = runDeepLearningInference(tc.vitals);
    const top = res.topPrediction;
    const isSuccess = top.id === tc.expectedId && top.probability >= tc.minConfidence;

    if (isSuccess) passedCount++;

    testResults.push({
      name: tc.name,
      status: isSuccess ? 'PASSED' : 'FAILED',
      actualLabel: top.label,
      actualId: top.id,
      expectedId: tc.expectedId,
      confidence: `${top.probability}%`,
      latencyMs: res.latencyMs
    });
  });

  // Benchmark: 1,000 Iteration Epoch Speed Sweep
  const benchStart = performance.now();
  const dummyVitals = { heartRate: 75, hrv: 60, bodyTemp: 36.6, spO2: 98, stressGsr: 25, gForce: 1.0, respRate: 16 };
  for (let i = 0; i < 1000; i++) {
    runDeepLearningInference(dummyVitals);
  }
  const benchTotalMs = (performance.now() - benchStart).toFixed(2);
  const avgLatencyPerEpochMs = (benchTotalMs / 1000).toFixed(4);

  const totalTimeMs = (performance.now() - startTime).toFixed(2);

  return {
    passedCount,
    totalTests: testCases.length,
    accuracyPercent: Math.round((passedCount / testCases.length) * 100),
    totalTimeMs,
    avgLatencyPerEpochMs,
    bench1000EpochsMs: benchTotalMs,
    testResults
  };
}
