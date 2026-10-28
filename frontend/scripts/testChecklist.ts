import { runReasonValidationSuite } from '../src/tests/algorithmReason.test';

try {
  const result = runReasonValidationSuite();
  console.log(`TOTAL_STEPS: ${result.totalSteps}`);
  console.log(`ALGO_COUNT: ${result.algorithmCount}`);
  for (const item of result.checklist) {
    console.log(`CHECKLIST_ITEM: ${item.id} | ${item.name} | ${item.status} | steps: ${item.stepCount}`);
  }
} catch (err: any) {
  console.error('FAILED:', err.message);
  process.exit(1);
}
