import { StepAction, StepReason } from '../types';

export function ensureStepReason(step: Partial<StepAction>): StepReason {
  if (
    step.reason &&
    typeof step.reason.action === 'string' &&
    step.reason.action.trim() &&
    typeof step.reason.why === 'string' &&
    step.reason.why.trim() &&
    typeof step.reason.rule === 'string' &&
    step.reason.rule.trim()
  ) {
    return {
      action: step.reason.action,
      why: step.reason.why,
      rule: step.reason.rule,
      values: step.reason.values || {},
      details: step.reason.details || step.message || '',
    };
  }

  // Derive rich, meaningful reason from step type & metadata
  const type = step.type || 'step';
  const indicesStr = step.indices && step.indices.length > 0 ? step.indices.join(', ') : '';
  const message = step.message || '';

  let action = 'Step executed';
  let why = message || 'Advancing algorithm execution state.';
  let rule = 'Next instruction sequence';

  switch (type) {
    case 'compare':
      action = indicesStr ? `Compare: indices [${indicesStr}]` : 'Compare elements';
      rule = 'Condition check (A vs B)';
      why = message || `Comparing values at indices [${indicesStr}] to evaluate conditional branching.`;
      break;
    case 'swap':
      action = indicesStr ? `Swap: [${indicesStr.replace(',', ' <->')}]` : 'Swap elements';
      rule = 'arr[i] > arr[j] => swap to reorder';
      why = message || `Values were out of sorted order; swapping them into ascending arrangement.`;
      break;
    case 'found':
      action = 'Target Found!';
      rule = 'currentValue === target';
      why = message || `Element exactly matched the search target. Search terminates successfully!`;
      break;
    case 'not-found':
      action = 'Target Not Found';
      rule = 'search space exhausted (low > high)';
      why = message || `Search boundaries crossed without finding the target value.`;
      break;
    case 'pointer':
      action = step.pointers
        ? Object.entries(step.pointers)
            .filter(([_, v]) => v !== null && v !== undefined)
            .map(([k, v]) => `${k}: ${v}`)
            .join(' | ')
        : 'Update pointers';
      rule = 'Advance pointer along active partition';
      why = message || `Repositioning pointers to focus on remaining subproblem space.`;
      break;
    case 'discard':
      action = 'Discard subsegment (Dark Matter)';
      rule = 'Target out of boundary range';
      why = message || `Eliminating invalid half of search space since array is sorted.`;
      break;
    case 'push':
    case 'enqueue':
    case 'insert':
      action = `Insert / Enqueue element`;
      rule = 'LIFO / FIFO state transition';
      why = message || `Pushed new item into active collection structure.`;
      break;
    case 'pop':
    case 'dequeue':
    case 'delete':
      action = `Remove / Dequeue element`;
      rule = 'Extract top / front element';
      why = message || `Extracted item from collection according to access rules.`;
      break;
    case 'rotate':
      action = 'Subtree Rotation (AVL Balance)';
      rule = '|balanceFactor| > 1';
      why = message || `Rebalancing binary tree nodes to restore logarithmic height O(log n).`;
      break;
    case 'sorted':
    case 'complete':
      action = 'Algorithm Completed';
      rule = 'All iterations / invariants satisfied';
      why = message || `All elements verified in final sorted / processed state.`;
      break;
    default:
      action = type.toUpperCase();
      why = message || `Processed step in ${type} operation.`;
      rule = 'Sequential step evaluation';
      break;
  }

  return {
    action,
    why,
    rule,
    values: step.pointers || {},
    details: message,
  };
}
