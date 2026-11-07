import { z } from 'zod';

// Supported visual primitive boards
export const VisualPrimitiveEnum = z.enum([
  'array',
  'grid-2d',
  'stack-queue',
  'linked-list',
  'tree',
  'graph',
]);
export type VisualPrimitive = z.infer<typeof VisualPrimitiveEnum>;

// Step schema strictly compatible with the playback engine
export const PlanStepSchema = z.object({
  type: z.enum([
    'start',
    'pointer',
    'compare',
    'swap',
    'visit',
    'set',
    'highlight',
    'discard',
    'found',
    'not-found',
    'sorted',
    'complete',
  ]),
  indices: z.array(z.number()).optional(),
  pointers: z.record(z.string(), z.union([z.number(), z.null()])).optional(),
  discardedIndices: z.array(z.number()).optional(),
  // For 2D grid/matrix algorithms like Number of Islands
  gridCell: z.tuple([z.number(), z.number()]).optional(),
  visitedCells: z.array(z.tuple([z.number(), z.number()])).optional(),
  // Snapshot data of the visual primitive
  dataState: z.any(),
  codeLine: z.number().default(1),
  message: z.string(),
  customMetadata: z.record(z.string(), z.any()).optional(),
});
export type PlanStep = z.infer<typeof PlanStepSchema>;

// Complete Problem Solver JSON Plan schema
export const ProblemPlanSchema = z.object({
  canVisualize: z.boolean(),
  pattern: z.string(), // e.g. "Two Pointers", "Breadth-First Search / Flood Fill", "Dynamic Programming"
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium'),
  approachSummary: z.string(),
  timeComplexity: z.string(),
  spaceComplexity: z.string(),
  code: z.object({
    python: z.string(),
    cpp: z.string(),
    java: z.string(),
  }),
  pseudocode: z.array(z.string()).default([]),
  hints: z.array(z.string()).default([]),
  boardType: VisualPrimitiveEnum.default('array'),
  initialData: z.any(),
  steps: z.array(PlanStepSchema).default([]),
  fallbackExplanation: z.string().optional(),
});
export type ProblemPlan = z.infer<typeof ProblemPlanSchema>;
