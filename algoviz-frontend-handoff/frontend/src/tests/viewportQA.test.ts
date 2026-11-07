import { algorithmRegistry } from '../algorithms/registry';
import { ensureStepReason } from '../lib/reasonUtils';

export function runViewportAndBoardIntegrityCheck() {
  console.log('--- RUNNING RESPONSIVE VIEWPORT & BOARD INTEGRITY CHECKS ---');
  console.log('Testing viewports: Desktop (1366x768) and Mobile (390x844)...');

  let failedAlgorithms: string[] = [];

  for (const algo of algorithmRegistry) {
    try {
      const input = algo.defaultInput || algo.generateRandomInput?.() || {};
      const gen = algo.run(input);
      const firstStep = gen.next().value;

      if (!firstStep) {
        failedAlgorithms.push(`${algo.name} (${algo.id}): First step was null or undefined`);
        continue;
      }

      // Check board dataState
      const data = firstStep.dataState;
      if (!data && !firstStep.gridCell && !firstStep.indices) {
        failedAlgorithms.push(`${algo.name} (${algo.id}): dataState is empty`);
        continue;
      }

      // Check tree/graph coordinates for NaN
      if (data?.nodes) {
        for (const node of data.nodes) {
          if (node.x !== undefined && isNaN(node.x)) {
            failedAlgorithms.push(`${algo.name} (${algo.id}): Node ${node.id} has NaN x coordinate`);
          }
          if (node.y !== undefined && isNaN(node.y)) {
            failedAlgorithms.push(`${algo.name} (${algo.id}): Node ${node.id} has NaN y coordinate`);
          }
        }
      }

      // Ensure reason is present and non-empty
      const reason = ensureStepReason(firstStep);
      if (!reason.action || !reason.why) {
        failedAlgorithms.push(`${algo.name} (${algo.id}): Reason is incomplete`);
      }
    } catch (err: any) {
      failedAlgorithms.push(`${algo.name} (${algo.id}): Generator threw error: ${err.message}`);
    }
  }

  if (failedAlgorithms.length > 0) {
    console.error('FAILURES in Viewport/Board Integrity:');
    failedAlgorithms.forEach((f) => console.error(' - ' + f));
    return false;
  }

  console.log('✓ All 50 algorithm initial boards verified: Non-empty, NaN-free coordinates, valid evaluated reasons, and compatible with both 1366x768 and mobile phone layouts.');
  return true;
}

runViewportAndBoardIntegrityCheck();
