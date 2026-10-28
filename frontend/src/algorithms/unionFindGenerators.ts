import { StepAction } from '../types';

export interface KruskalEdge {
  u: number;
  v: number;
  weight: number;
  status?: 'considering' | 'accepted' | 'rejected';
}

export interface DisjointSetDataState {
  parent: number[];
  rank: number[];
  components: number[][];
  activeUnion?: [number, number] | null;
  activePath?: number[];
  compressedNode?: number | null;
  kruskalEdges?: KruskalEdge[];
  mstTotalWeight?: number;
  operation: string;
  runningMetric: string;
}

/**
 * Disjoint Set (Union-Find) with Union by Rank, Path Compression, and Kruskal's MST
 */
export function* generateUnionFindSteps(): Generator<StepAction<DisjointSetDataState>, void, unknown> {
  const n = 6;
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);

  const getComponents = () => {
    const compMap: Record<number, number[]> = {};
    for (let i = 0; i < n; i++) {
      let root = i;
      while (parent[root] !== root) root = parent[root];
      if (!compMap[root]) compMap[root] = [];
      compMap[root].push(i);
    }
    return Object.values(compMap);
  };

  const kruskalEdges: KruskalEdge[] = [
    { u: 0, v: 1, weight: 2 },
    { u: 1, v: 2, weight: 3 },
    { u: 0, v: 2, weight: 4 }, // Will form cycle with (0,1) and (1,2)!
    { u: 3, v: 4, weight: 5 },
    { u: 2, v: 3, weight: 6 },
    { u: 4, v: 5, weight: 8 },
  ];

  let mstWeight = 0;

  // Step 1: Initial State
  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    dataState: {
      parent: [...parent],
      rank: [...rank],
      components: getComponents(),
      kruskalEdges: kruskalEdges.map((e) => ({ ...e })),
      mstTotalWeight: 0,
      operation: 'Initialize Disjoint Set',
      runningMetric: '6 Elements, each in its own singleton subset (parent[i] = i, rank[i] = 0)',
    },
    message: 'Disjoint Set (Union-Find) initialized with 6 elements. Each element is initially its own root leader.',
    reason: {
      action: 'Init Union-Find',
      why: 'Starting with n singleton disjoint sets. Parent array maps each element to itself.',
      rule: 'parent[i] = i, rank[i] = 0',
      values: { elementsCount: n },
    },
  };

  // Helper find with path compression tracking
  function* findWithCompression(i: number): Generator<StepAction<DisjointSetDataState>, number, unknown> {
    const path: number[] = [i];
    let curr = i;
    while (parent[curr] !== curr) {
      curr = parent[curr];
      path.push(curr);
    }
    const root = curr;

    // Apply path compression
    for (const node of path) {
      if (node !== root && parent[node] !== root) {
        parent[node] = root; // Compress pointer directly to root

        yield {
          type: 'step',
          codeLine: 2,
          indices: [node, root],
          pointers: { node, newParent: root },
          dataState: {
            parent: [...parent],
            rank: [...rank],
            components: getComponents(),
            activePath: [...path],
            compressedNode: node,
            kruskalEdges: kruskalEdges.map((e) => ({ ...e })),
            mstTotalWeight: mstWeight,
            operation: `Path Compression: Node ${node} -> Root ${root}`,
            runningMetric: `Pointed Node ${node} directly to Root ${root} (Flattens tree for O(α(n)) time)`,
          },
          message: `PATH COMPRESSION: Pointed Node ${node} directly to root ${root}. Flattens tree height for nearly O(1) subsequent queries!`,
          reason: {
            action: `Compress ${node} -> ${root}`,
            why: 'Path compression flattens the tree structure during find operations, giving amortized inverse Ackermann O(α(n)) time.',
            rule: 'parent[i] = find(parent[i])',
            values: { node, root },
          },
        };
      }
    }

    return root;
  }

  // Phase: Execute Kruskal's MST using Union-Find
  yield {
    type: 'step',
    codeLine: 3,
    indices: [],
    dataState: {
      parent: [...parent],
      rank: [...rank],
      components: getComponents(),
      kruskalEdges: kruskalEdges.map((e) => ({ ...e })),
      mstTotalWeight: mstWeight,
      operation: "Start Kruskal's MST using Union-Find",
      runningMetric: 'Considering edges in ascending order of weight',
    },
    message: "Starting KRUSKAL'S MINIMUM SPANNING TREE: Considering edges in increasing weight order. Using Union-Find to detect and reject cycles.",
    reason: {
      action: 'Start Kruskal',
      why: 'Kruskal greedily picks the lowest weight edge that does not form a cycle with already chosen edges.',
      rule: 'if find(u) != find(v): union(u, v); addEdge()',
      values: { totalEdges: kruskalEdges.length },
    },
  };

  for (let eIdx = 0; eIdx < kruskalEdges.length; eIdx++) {
    const edge = kruskalEdges[eIdx];
    edge.status = 'considering';

    yield {
      type: 'compare',
      codeLine: 4,
      indices: [edge.u, edge.v],
      dataState: {
        parent: [...parent],
        rank: [...rank],
        components: getComponents(),
        kruskalEdges: kruskalEdges.map((e) => ({ ...e })),
        mstTotalWeight: mstWeight,
        operation: `Consider Edge (${edge.u}, ${edge.v}) [Weight: ${edge.weight}]`,
        runningMetric: `Testing Edge (${edge.u}, ${edge.v}) for cycles: find(${edge.u}) vs find(${edge.v})`,
      },
      message: `Evaluating Edge (${edge.u}, ${edge.v}) [weight ${edge.weight}]. Checking whether ${edge.u} and ${edge.v} belong to the same component.`,
      reason: {
        action: `Check Cycle for (${edge.u}, ${edge.v})`,
        why: 'If both vertices already share the same root leader, adding this edge would create an illegal cycle.',
        rule: 'rootU = find(u); rootV = find(v)',
        values: { u: edge.u, v: edge.v, weight: edge.weight },
      },
    };

    // Find roots
    const rootU: number = yield* findWithCompression(edge.u);
    const rootV: number = yield* findWithCompression(edge.v);

    if (rootU === rootV) {
      // CYCLE DETECTED!
      edge.status = 'rejected';

      yield {
        type: 'mismatch',
        codeLine: 5,
        indices: [edge.u, edge.v],
        dataState: {
          parent: [...parent],
          rank: [...rank],
          components: getComponents(),
          kruskalEdges: kruskalEdges.map((e) => ({ ...e })),
          mstTotalWeight: mstWeight,
          operation: `CYCLE REJECTED: Edge (${edge.u}, ${edge.v})`,
          runningMetric: `CYCLE DETECTED! Both in Set (Root: ${rootU}) -> Edge REJECTED!`,
        },
        message: `CYCLE DETECTED! Both vertex ${edge.u} and vertex ${edge.v} already share common root ${rootU}. Adding edge (${edge.u}, ${edge.v}) would form a closed cycle. REJECTED!`,
        reason: {
          action: 'Reject Edge (Cycle)',
          why: `find(${edge.u}) == find(${edge.v}) == ${rootU}. Path already exists between these vertices.`,
          rule: 'rootU == rootV => REJECT_EDGE',
          values: { u: edge.u, v: edge.v, commonRoot: rootU },
        },
      };
    } else {
      // ACCEPT EDGE & UNION BY RANK
      edge.status = 'accepted';
      mstWeight += edge.weight;

      // Union by rank
      let newRoot = rootU;
      if (rank[rootU] < rank[rootV]) {
        parent[rootU] = rootV;
        newRoot = rootV;
      } else if (rank[rootU] > rank[rootV]) {
        parent[rootV] = rootU;
        newRoot = rootU;
      } else {
        parent[rootV] = rootU;
        rank[rootU]++;
        newRoot = rootU;
      }

      yield {
        type: 'insert',
        codeLine: 6,
        indices: [edge.u, edge.v],
        pointers: { rootU, rootV, newRoot },
        dataState: {
          parent: [...parent],
          rank: [...rank],
          components: getComponents(),
          activeUnion: [edge.u, edge.v],
          kruskalEdges: kruskalEdges.map((e) => ({ ...e })),
          mstTotalWeight: mstWeight,
          operation: `Accepted Edge (${edge.u}, ${edge.v}) -> Union by Rank`,
          runningMetric: `Edge ACCEPTED! Merged sets under Root ${newRoot}. MST Weight: ${mstWeight}`,
        },
        message: `ACCEPTED EDGE (${edge.u}, ${edge.v})! Added to Minimum Spanning Tree. Merged sets under leader ${newRoot} via Union by Rank.`,
        reason: {
          action: `Union(${rootU}, ${rootV})`,
          why: `Disjoint sets merged. Attached lower rank root under higher rank root to maintain minimal tree depth.`,
          rule: 'parent[smallerRank] = higherRank',
          values: { edge: `${edge.u}-${edge.v}`, weight: edge.weight, newRoot, totalMstWeight: mstWeight },
        },
      };
    }
  }

  // Complete
  yield {
    type: 'complete',
    codeLine: 7,
    indices: [],
    dataState: {
      parent: [...parent],
      rank: [...rank],
      components: getComponents(),
      kruskalEdges: kruskalEdges.map((e) => ({ ...e })),
      mstTotalWeight: mstWeight,
      operation: 'Kruskal MST Complete via Union-Find',
      runningMetric: `MST Complete! 5 Edges Chosen, Total Weight: ${mstWeight}`,
    },
    message: `Kruskal's MST Complete! All 6 vertices connected with 5 tree edges (weight = ${mstWeight}) with zero cycles, verified by Union-Find.`,
    reason: {
      action: 'MST Verified',
      why: 'Demonstrated Union by Rank, Path Compression, and cycle detection.',
      rule: 'MST Spanning Complete',
      values: { totalWeight: mstWeight, componentsRemaining: getComponents().length },
    },
  };
}
