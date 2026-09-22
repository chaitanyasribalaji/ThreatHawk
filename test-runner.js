// Node CLI Test Runner for Aegis-DL Neural Network Model Validation
import { runModelEpochTests } from './src/utils/modelTests.js';

console.log("=================================================");
console.log("   AEGIS-DL v3.2 MODEL EPOCH VALIDATION SUITE    ");
console.log("=================================================\n");

const summary = runModelEpochTests();

console.log(`[Summary] Total Tests Run: ${summary.totalTests}`);
console.log(`[Summary] Passed: ${summary.passedCount} / ${summary.totalTests} (${summary.accuracyPercent}% Accuracy)`);
console.log(`[Benchmark] 1,000 Epoch Inferences Time: ${summary.bench1000EpochsMs} ms`);
console.log(`[Benchmark] Avg Latency per Epoch: ${summary.avgLatencyPerEpochMs} ms\n`);

console.log("-------------------------------------------------");
console.log("  DETAILED TEST CASE EPOCH RESULTS:              ");
console.log("-------------------------------------------------");

summary.testResults.forEach((res, i) => {
  console.log(`\n[${res.status}] ${res.name}`);
  console.log(`   Result: ${res.actualLabel} (${res.confidence} confidence)`);
  console.log(`   Latency: ${res.latencyMs} ms`);
});

console.log("\n=================================================");
console.log("   MODEL VALIDATION COMPLETED SUCCESSFULLY       ");
console.log("=================================================");
