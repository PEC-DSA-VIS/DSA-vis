// Node.js test runner for Algorithm Reason Validation
// Validates that EVERY yielded step across ALL algorithms in AlgoViz has a non-empty `reason` object:
// - action (string)
// - why (string with real numbers)
// - rule (string)

import { algorithmRegistry } from '../src/algorithms/registry.js';
import { ensureStepReason } from '../src/lib/reasonUtils.js';

console.log('🧪 Starting AlgoViz Reason Validation Unit Test Suite...\n');

let totalAlgorithms = 0;
let totalStepsEvaluated = 0;
const failures = [];

for (const algo of algorithmRegistry) {
  totalAlgorithms++;
  try {
    const generator = algo.run(algo.defaultInput || {});
    let result = generator.next();
    let stepIndex = 0;

    while (!result.done) {
      totalStepsEvaluated++;
      const step = result.value;
      const reason = step.reason ? step.reason : ensureStepReason(step);

      if (!reason) {
        failures.push(`Algorithm [${algo.name}] (${algo.id}) step ${stepIndex}: reason is undefined!`);
      } else {
        if (!reason.action || typeof reason.action !== 'string' || !reason.action.trim()) {
          failures.push(`Algorithm [${algo.name}] (${algo.id}) step ${stepIndex}: reason.action is missing or empty!`);
        }
        if (!reason.why || typeof reason.why !== 'string' || !reason.why.trim()) {
          failures.push(`Algorithm [${algo.name}] (${algo.id}) step ${stepIndex}: reason.why is missing or empty!`);
        }
        if (!reason.rule || typeof reason.rule !== 'string' || !reason.rule.trim()) {
          failures.push(`Algorithm [${algo.name}] (${algo.id}) step ${stepIndex}: reason.rule is missing or empty!`);
        }
      }

      result = generator.next();
      stepIndex++;
    }
  } catch (err) {
    failures.push(`Algorithm [${algo.name}] (${algo.id}) execution threw exception: ${err.message}`);
  }
}

if (failures.length > 0) {
  console.error(`❌ UNIT TEST FAILED: ${failures.length} reason validation errors encountered:`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
} else {
  console.log(`✅ UNIT TEST PASSED!`);
  console.log(`   - Evaluated ${totalAlgorithms} algorithms in catalog`);
  console.log(`   - Evaluated ${totalStepsEvaluated} total execution steps`);
  console.log(`   - 100% of steps have valid, non-empty { action, why, rule } reasons!\n`);
  process.exit(0);
}
