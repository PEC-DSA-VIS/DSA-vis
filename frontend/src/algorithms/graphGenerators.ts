import { StepAction } from '../types';

export interface GraphNodeData {
  id: string;
  val: string;
  x: number;
  y: number;
  status?: 'default' | 'active' | 'visited' | 'finalized' | 'frontier';
  dist?: number;
  prev?: string | null;
}

export interface GraphEdgeData {
  id?: string;
  from: string;
  to: string;
  weight?: number;
  status?: 'default' | 'active' | 'visited' | 'finalized' | 'rejected' | 'candidate';
  active?: boolean;
}

export interface DijkstraTableEntry {
  vertex: string;
  dist: number | string;
  prev: string;
  finalized: boolean;
  highlight?: boolean;
}

export interface PQItem {
  dist: number;
  node: string;
}

// Fixed non-clipping coordinate mapping (Canvas: 840 x 440)
// Ample 70px+ margin on all sides: Y in [100, 340], X in [140, 700]
const BASE_NODES: Record<string, { x: number; y: number }> = {
  A: { x: 140, y: 220 },
  B: { x: 320, y: 100 },
  C: { x: 320, y: 340 },
  D: { x: 520, y: 100 },
  E: { x: 520, y: 340 },
  F: { x: 700, y: 220 },
};

// =================================================================
// 1. BFS & DFS GRAPH GENERATOR
// =================================================================
export function* generateBFSDFSSteps(mode: 'bfs' | 'dfs' = 'bfs'): Generator<StepAction, void, unknown> {
  const allNodeKeys = ['A', 'B', 'C', 'D', 'E', 'F'];
  const adjacency: Record<string, string[]> = {
    A: ['B', 'C'],
    B: ['A', 'D', 'E'],
    C: ['A', 'E'],
    D: ['B', 'F'],
    E: ['B', 'C', 'F'],
    F: ['D', 'E'],
  };

  const adjMatrixTemplate: Record<string, Record<string, number>> = {};
  allNodeKeys.forEach((u) => {
    adjMatrixTemplate[u] = {};
    allNodeKeys.forEach((v) => {
      adjMatrixTemplate[u][v] = adjacency[u].includes(v) ? 1 : 0;
    });
  });

  // Track live appearance: nodes and edges appear as discovered
  const liveNodes: GraphNodeData[] = [];
  const liveEdges: GraphEdgeData[] = [];
  const liveAdjList: Record<string, string[]> = {};
  const liveAdjMatrix: Record<string, Record<string, number>> = {};
  allNodeKeys.forEach((u) => {
    liveAdjList[u] = [];
    liveAdjMatrix[u] = {};
    allNodeKeys.forEach((v) => {
      liveAdjMatrix[u][v] = 0;
    });
  });

  const visitedSet = new Set<string>();
  const visitedOrder: string[] = [];

  // Helper to add node if not yet visible
  const ensureNode = (id: string, status: GraphNodeData['status'] = 'default') => {
    const existing = liveNodes.find((n) => n.id === id);
    if (!existing) {
      liveNodes.push({
        id,
        val: id,
        x: BASE_NODES[id].x,
        y: BASE_NODES[id].y,
        status,
      });
    } else if (status) {
      existing.status = status;
    }
  };

  // Helper to add or update edge
  const ensureEdge = (from: string, to: string, status: GraphEdgeData['status'] = 'visited') => {
    const existing = liveEdges.find(
      (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );
    if (!existing) {
      liveEdges.push({ from, to, status, active: status === 'active' });
    } else {
      existing.status = status;
      existing.active = status === 'active';
    }

    if (!liveAdjList[from].includes(to)) liveAdjList[from].push(to);
    if (!liveAdjList[to].includes(from)) liveAdjList[to].push(from);
    liveAdjMatrix[from][to] = 1;
    liveAdjMatrix[to][from] = 1;
  };

  if (mode === 'bfs') {
    const queue: string[] = ['A'];
    visitedSet.add('A');
    visitedOrder.push('A');
    ensureNode('A', 'active');

    yield {
      type: 'start',
      codeLine: 1,
      dataState: {
        structure: 'graph',
        mode: 'bfs',
        nodes: JSON.parse(JSON.stringify(liveNodes)),
        edges: JSON.parse(JSON.stringify(liveEdges)),
        activeNodeId: 'A',
        queue: [...queue],
        visitedSequence: [...visitedOrder],
        adjList: JSON.parse(JSON.stringify(liveAdjList)),
        adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
        stats: {
          visitedCount: visitedSet.size,
          queueSize: queue.length,
          edgesExplored: 0,
        },
      },
      message: 'BFS initialized at source vertex A. Vertex A added to Queue and marked visited.',
      reason: {
        action: 'Enqueue Source A',
        why: 'Breadth-First Search starts at source vertex A with level distance 0.',
        rule: 'queue.push(start), visited.add(start)',
        values: { start: 'A', queue: [...queue] },
        details: 'Vertices are explored level-by-level using a FIFO queue.',
      },
    };

    let edgesExplored = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;
      ensureNode(current, 'active');

      yield {
        type: 'step',
        codeLine: 3,
        dataState: {
          structure: 'graph',
          mode: 'bfs',
          nodes: JSON.parse(JSON.stringify(liveNodes)),
          edges: JSON.parse(JSON.stringify(liveEdges)),
          activeNodeId: current,
          queue: [...queue],
          visitedSequence: [...visitedOrder],
          adjList: JSON.parse(JSON.stringify(liveAdjList)),
          adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
          stats: {
            visitedCount: visitedSet.size,
            queueSize: queue.length,
            edgesExplored,
          },
        },
        message: `Dequeued vertex ${current} from front of Queue. Now inspecting its outgoing neighbors.`,
        reason: {
          action: `Dequeue ${current}`,
          why: `Vertex ${current} is at the front of the FIFO queue. Processing its neighbor edges.`,
          rule: 'u = queue.pop()',
          values: { dequeued: current, remainingQueue: [...queue] },
          details: 'FIFO order guarantees nodes closer to source are fully expanded first.',
        },
      };

      const neighbors = adjacency[current];
      for (const nbr of neighbors) {
        edgesExplored++;
        const alreadyVisited = visitedSet.has(nbr);

        ensureNode(nbr, alreadyVisited ? 'visited' : 'frontier');
        ensureEdge(current, nbr, 'active');

        yield {
          type: 'compare',
          codeLine: 4,
          dataState: {
            structure: 'graph',
            mode: 'bfs',
            nodes: JSON.parse(JSON.stringify(liveNodes)),
            edges: JSON.parse(JSON.stringify(liveEdges)),
            activeNodeId: current,
            comparingNodeId: nbr,
            queue: [...queue],
            visitedSequence: [...visitedOrder],
            adjList: JSON.parse(JSON.stringify(liveAdjList)),
            adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
            stats: {
              visitedCount: visitedSet.size,
              queueSize: queue.length,
              edgesExplored,
            },
          },
          message: `Inspecting edge (${current} -> ${nbr}). Visited? ${alreadyVisited ? 'YES (Skip)' : 'NO (Enqueue)'}.`,
          reason: {
            action: `Check neighbor ${nbr}`,
            why: alreadyVisited
              ? `Vertex ${nbr} was already visited earlier; ignoring to prevent infinite cycles.`
              : `Vertex ${nbr} has not been visited yet; discovered via edge (${current}, ${nbr}).`,
            rule: 'if neighbor not in visited:',
            values: { current, neighbor: nbr, visited: alreadyVisited },
            details: `Updating Adjacency List [${current}].push(${nbr}) and Matrix [${current}][${nbr}]=1.`,
          },
        };

        if (!alreadyVisited) {
          visitedSet.add(nbr);
          visitedOrder.push(nbr);
          queue.push(nbr);
          ensureNode(nbr, 'frontier');
          ensureEdge(current, nbr, 'visited');

          yield {
            type: 'step',
            codeLine: 5,
            dataState: {
              structure: 'graph',
              mode: 'bfs',
              nodes: JSON.parse(JSON.stringify(liveNodes)),
              edges: JSON.parse(JSON.stringify(liveEdges)),
              activeNodeId: nbr,
              queue: [...queue],
              visitedSequence: [...visitedOrder],
              adjList: JSON.parse(JSON.stringify(liveAdjList)),
              adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
              stats: {
                visitedCount: visitedSet.size,
                queueSize: queue.length,
                edgesExplored,
              },
            },
            message: `Enqueued unvisited vertex ${nbr}. Queue is now: [${queue.join(', ')}].`,
            reason: {
              action: `Enqueue ${nbr}`,
              why: `Discovered new wavefront vertex ${nbr}; added to FIFO queue for later expansion.`,
              rule: 'visited.add(v); queue.push(v)',
              values: { enqueued: nbr, newQueue: [...queue] },
              details: `Level wavefront ripple expands to node ${nbr}.`,
            },
          };
        } else {
          ensureEdge(current, nbr, 'visited');
        }
      }

      ensureNode(current, 'finalized');
    }

    yield {
      type: 'complete',
      codeLine: 6,
      dataState: {
        structure: 'graph',
        mode: 'bfs',
        nodes: JSON.parse(JSON.stringify(liveNodes)),
        edges: JSON.parse(JSON.stringify(liveEdges)),
        activeNodeId: null,
        queue: [],
        visitedSequence: [...visitedOrder],
        adjList: JSON.parse(JSON.stringify(liveAdjList)),
        adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
        stats: {
          visitedCount: visitedSet.size,
          queueSize: 0,
          edgesExplored,
        },
      },
      message: `BFS Traversal Finished! Explored all ${visitedOrder.length} vertices in order: ${visitedOrder.join(' → ')}.`,
      reason: {
        action: 'BFS Complete',
        why: 'The FIFO queue is now empty. All reachable graph components have been explored.',
        rule: 'queue.isEmpty() == true',
        values: { finalOrder: visitedOrder, totalExplored: edgesExplored },
        details: 'Adjacency list and matrix are fully populated.',
      },
    };
  } else {
    // DFS Traversal
    const stack: string[] = ['A'];
    ensureNode('A', 'active');
    let edgesExplored = 0;

    yield {
      type: 'start',
      codeLine: 1,
      dataState: {
        structure: 'graph',
        mode: 'dfs',
        nodes: JSON.parse(JSON.stringify(liveNodes)),
        edges: JSON.parse(JSON.stringify(liveEdges)),
        activeNodeId: 'A',
        stack: [...stack],
        visitedSequence: [...visitedOrder],
        adjList: JSON.parse(JSON.stringify(liveAdjList)),
        adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
        stats: {
          visitedCount: visitedSet.size,
          stackSize: stack.length,
          edgesExplored: 0,
        },
      },
      message: 'DFS initialized at source vertex A. Vertex A pushed to Call Stack.',
      reason: {
        action: 'Push Source A to Stack',
        why: 'Depth-First Search starts at source vertex A and dives deep along each branch.',
        rule: 'stack.push(start)',
        values: { start: 'A', stack: [...stack] },
        details: 'Uses LIFO stack (or recursion) to explore as deep as possible before backtracking.',
      },
    };

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (!visitedSet.has(current)) {
        visitedSet.add(current);
        visitedOrder.push(current);
        ensureNode(current, 'active');

        yield {
          type: 'step',
          codeLine: 3,
          dataState: {
            structure: 'graph',
            mode: 'dfs',
            nodes: JSON.parse(JSON.stringify(liveNodes)),
            edges: JSON.parse(JSON.stringify(liveEdges)),
            activeNodeId: current,
            stack: [...stack],
            visitedSequence: [...visitedOrder],
            adjList: JSON.parse(JSON.stringify(liveAdjList)),
            adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
            stats: {
              visitedCount: visitedSet.size,
              stackSize: stack.length,
              edgesExplored,
            },
          },
          message: `Popped ${current} from LIFO Stack and marked visited. Order: [${visitedOrder.join(' → ')}].`,
          reason: {
            action: `Visit ${current}`,
            why: `Vertex ${current} was on top of the call stack. Deep diving into its unexplored branches.`,
            rule: 'visited.add(u)',
            values: { visited: current, stackRemaining: [...stack] },
            details: 'Deep branch exploration.',
          },
        };

        const neighbors = [...adjacency[current]].reverse(); // reverse so left-to-right order pop
        for (const nbr of neighbors) {
          edgesExplored++;
          const isVisited = visitedSet.has(nbr);
          ensureNode(nbr, isVisited ? 'visited' : 'frontier');
          ensureEdge(current, nbr, 'active');

          yield {
            type: 'compare',
            codeLine: 4,
            dataState: {
              structure: 'graph',
              mode: 'dfs',
              nodes: JSON.parse(JSON.stringify(liveNodes)),
              edges: JSON.parse(JSON.stringify(liveEdges)),
              activeNodeId: current,
              comparingNodeId: nbr,
              stack: [...stack],
              visitedSequence: [...visitedOrder],
              adjList: JSON.parse(JSON.stringify(liveAdjList)),
              adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
              stats: {
                visitedCount: visitedSet.size,
                stackSize: stack.length,
                edgesExplored,
              },
            },
            message: `Inspecting DFS edge (${current} -> ${nbr}). Already visited? ${isVisited ? 'YES (Backtrack)' : 'NO (Push)'}.`,
            reason: {
              action: `Inspect branch to ${nbr}`,
              why: isVisited
                ? `Node ${nbr} is already in visited set; skipping to avoid cycle.`
                : `Node ${nbr} unvisited; pushing onto LIFO stack to explore deep next.`,
              rule: 'if nbr not in visited: stack.push(nbr)',
              values: { current, nbr, isVisited },
              details: `Live edge (${current}, ${nbr}) added to Adjacency structures.`,
            },
          };

          if (!isVisited) {
            stack.push(nbr);
            ensureEdge(current, nbr, 'visited');
          } else {
            ensureEdge(current, nbr, 'visited');
          }
        }
        ensureNode(current, 'finalized');
      }
    }

    yield {
      type: 'complete',
      codeLine: 6,
      dataState: {
        structure: 'graph',
        mode: 'dfs',
        nodes: JSON.parse(JSON.stringify(liveNodes)),
        edges: JSON.parse(JSON.stringify(liveEdges)),
        activeNodeId: null,
        stack: [],
        visitedSequence: [...visitedOrder],
        adjList: JSON.parse(JSON.stringify(liveAdjList)),
        adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
        stats: {
          visitedCount: visitedSet.size,
          stackSize: 0,
          edgesExplored,
        },
      },
      message: `DFS Traversal Finished! Explored all ${visitedOrder.length} vertices in order: ${visitedOrder.join(' → ')}.`,
      reason: {
        action: 'DFS Complete',
        why: 'Call stack is empty. All recursive deep branches have backtracked and finished.',
        rule: 'stack.isEmpty() == true',
        values: { finalOrder: visitedOrder },
        details: 'All tree and cross-edges processed.',
      },
    };
  }
}

// =================================================================
// 2. DIJKSTRA SHORTEST PATH GENERATOR (>= 25 STEPS)
// =================================================================
export function* generateDijkstraSteps(): Generator<StepAction, void, unknown> {
  const vertices = ['A', 'B', 'C', 'D', 'E', 'F'];
  const edgesList: GraphEdgeData[] = [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 8 },
    { from: 'C', to: 'E', weight: 10 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'D', to: 'F', weight: 6 },
    { from: 'E', to: 'F', weight: 3 },
  ];

  const graphNodes: GraphNodeData[] = vertices.map((v) => ({
    id: v,
    val: v,
    x: BASE_NODES[v].x,
    y: BASE_NODES[v].y,
    status: 'default',
    dist: Infinity,
    prev: null,
  }));

  const distTable: Record<string, { dist: number; prev: string | null; finalized: boolean }> = {};
  vertices.forEach((v) => {
    distTable[v] = { dist: Infinity, prev: null, finalized: false };
  });

  // Source vertex A
  distTable['A'].dist = 0;
  const pq: PQItem[] = [{ dist: 0, node: 'A' }];

  let relaxationCount = 0;

  const getTableData = (highlightVertex?: string): DijkstraTableEntry[] => {
    return vertices.map((v) => ({
      vertex: v,
      dist: distTable[v].dist === Infinity ? '∞' : distTable[v].dist,
      prev: distTable[v].prev ?? '—',
      finalized: distTable[v].finalized,
      highlight: v === highlightVertex,
    }));
  };

  const getNodesSnapshot = () => {
    return graphNodes.map((n) => ({
      ...n,
      dist: distTable[n.id].dist,
      prev: distTable[n.id].prev,
      status: distTable[n.id].finalized
        ? 'finalized'
        : distTable[n.id].dist < Infinity
        ? 'frontier'
        : 'default',
    }));
  };

  // Step 1: Initial state
  yield {
    type: 'start',
    codeLine: 1,
    dataState: {
      structure: 'graph',
      mode: 'dijkstra',
      nodes: getNodesSnapshot(),
      edges: JSON.parse(JSON.stringify(edgesList)),
      distTable: getTableData('A'),
      pq: [...pq],
      activeNodeId: 'A',
      stats: {
        finalizedCount: 0,
        relaxations: 0,
        pqSize: pq.length,
        currentMinDist: 0,
      },
    },
    message: 'Dijkstra initialized at source vertex A. dist[A] = 0, all others = ∞. PQ: [(0, A)].',
    reason: {
      action: 'Initialize Source dist[A] = 0',
      why: 'Source vertex A distance is set to 0. All other tentative distances start at infinity.',
      rule: 'dist[src] = 0; pq.push({0, src})',
      values: { source: 'A', dist: 0 },
      details: 'Min-Heap Priority Queue greedily picks vertex with smallest tentative distance.',
    },
  };

  while (pq.length > 0) {
    // Sort PQ to simulate min-heap
    pq.sort((a, b) => a.dist - b.dist);
    const { dist: uDist, node: u } = pq.shift()!;

    if (distTable[u].finalized) {
      // Stale entry in PQ
      continue;
    }

    // Step: Pick minimum from PQ
    yield {
      type: 'step',
      codeLine: 3,
      dataState: {
        structure: 'graph',
        mode: 'dijkstra',
        nodes: getNodesSnapshot(),
        edges: JSON.parse(JSON.stringify(edgesList)),
        distTable: getTableData(u),
        pq: [...pq],
        activeNodeId: u,
        stats: {
          finalizedCount: Object.values(distTable).filter((t) => t.finalized).length,
          relaxations: relaxationCount,
          pqSize: pq.length,
          currentMinDist: uDist,
        },
      },
      message: `Extracted min-distance vertex ${u} from Priority Queue with confirmed distance ${uDist}.`,
      reason: {
        action: `Extract Min: ${u}`,
        why: `Vertex ${u} has smallest tentative distance (${uDist}) among all unfinalized vertices.`,
        rule: '(uDist, u) = pq.popMin()',
        values: { vertex: u, distance: uDist, remainingPQ: [...pq] },
        details: 'Non-negative edge weights ensure this distance is optimal.',
      },
    };

    // Find all outgoing edges from u (undirected or directed graph)
    const incidentEdges = edgesList.filter(
      (e) => (e.from === u || e.to === u)
    );

    for (const edge of incidentEdges) {
      const v = edge.from === u ? edge.to : edge.from;
      const weight = edge.weight ?? 1;

      if (distTable[v].finalized) {
        continue;
      }

      // Mark edge as active candidate
      edge.active = true;
      const oldDist = distTable[v].dist;
      const newDist = uDist + weight;
      const shouldRelax = newDist < oldDist;

      yield {
        type: 'compare',
        codeLine: 5,
        dataState: {
          structure: 'graph',
          mode: 'dijkstra',
          nodes: getNodesSnapshot(),
          edges: JSON.parse(JSON.stringify(edgesList)),
          distTable: getTableData(v),
          pq: [...pq],
          activeNodeId: u,
          comparingNodeId: v,
          candidateEdge: { from: u, to: v, weight },
          stats: {
            finalizedCount: Object.values(distTable).filter((t) => t.finalized).length,
            relaxations: relaxationCount,
            pqSize: pq.length,
            currentMinDist: uDist,
          },
        },
        message: `Inspecting edge (${u} ↔ ${v}, wt ${weight}). Test: dist[${u}] (${uDist}) + ${weight} = ${newDist} vs dist[${v}] (${oldDist === Infinity ? '∞' : oldDist}).`,
        reason: {
          action: `Test Relaxation: edge (${u}, ${v})`,
          why: shouldRelax
            ? `New path via ${u} costs ${newDist}, which is shorter than current dist[${v}] (${oldDist === Infinity ? '∞' : oldDist}). RELAX!`
            : `New path via ${u} costs ${newDist}, which is NOT shorter than existing dist[${v}] (${oldDist}). Keep existing.`,
          rule: 'if dist[u] + weight < dist[v]: relax',
          values: { u, v, weight, distU: uDist, oldDistV: oldDist === Infinity ? '∞' : oldDist, newDist, willRelax: shouldRelax },
          details: shouldRelax ? 'Shorter route discovered!' : 'Suboptimal route rejected.',
        },
      };

      if (shouldRelax) {
        relaxationCount++;
        distTable[v].dist = newDist;
        distTable[v].prev = u;
        pq.push({ dist: newDist, node: v });

        yield {
          type: 'step',
          codeLine: 6,
          dataState: {
            structure: 'graph',
            mode: 'dijkstra',
            nodes: getNodesSnapshot(),
            edges: JSON.parse(JSON.stringify(edgesList)),
            distTable: getTableData(v),
            pq: [...pq],
            activeNodeId: v,
            stats: {
              finalizedCount: Object.values(distTable).filter((t) => t.finalized).length,
              relaxations: relaxationCount,
              pqSize: pq.length,
              currentMinDist: uDist,
            },
          },
          message: `Relaxed dist[${v}]: was ${oldDist === Infinity ? '∞' : oldDist} → now ${newDist} via ${u}. Added (${newDist}, ${v}) to Priority Queue.`,
          reason: {
            action: `Relax dist[${v}] = ${newDist}`,
            why: `Updated tentative shortest distance for vertex ${v} to ${newDist} with predecessor ${u}.`,
            rule: 'dist[v] = dist[u] + weight; pq.push({dist[v], v})',
            values: { vertex: v, oldDistance: oldDist === Infinity ? '∞' : oldDist, newDistance: newDist, via: u },
            details: 'Distance table cell updated; new candidate pushed to priority queue.',
          },
        };
      }

      edge.active = false;
    }

    // Finalize node u
    distTable[u].finalized = true;

    yield {
      type: 'step',
      codeLine: 7,
      dataState: {
        structure: 'graph',
        mode: 'dijkstra',
        nodes: getNodesSnapshot(),
        edges: JSON.parse(JSON.stringify(edgesList)),
        distTable: getTableData(u),
        pq: [...pq],
        activeNodeId: u,
        stats: {
          finalizedCount: Object.values(distTable).filter((t) => t.finalized).length,
          relaxations: relaxationCount,
          pqSize: pq.length,
          currentMinDist: uDist,
        },
      },
      message: `Vertex ${u} finalized! Shortest distance from source A is permanently locked at ${uDist}.`,
      reason: {
        action: `Finalize ${u}`,
        why: `All outgoing edges from ${u} have been relaxed. Distance ${uDist} is guaranteed optimal.`,
        rule: 'finalized[u] = true',
        values: { vertex: u, finalDistance: uDist },
        details: 'Node turns emerald finalized badge.',
      },
    };
  }

  // Reconstruct shortest path from A to F
  const shortestPathEdges: { from: string; to: string }[] = [];
  let curr: string | null = 'F';
  const pathNodes: string[] = [];
  while (curr) {
    pathNodes.unshift(curr);
    const p: string | null = distTable[curr]?.prev ?? null;
    if (p) {
      shortestPathEdges.push({ from: p, to: curr });
    }
    curr = p;
  }

  // Highlight shortest path edges
  edgesList.forEach((e) => {
    const isInPath = shortestPathEdges.some(
      (p) => (p.from === e.from && p.to === e.to) || (p.from === e.to && p.to === e.from)
    );
    e.status = isInPath ? 'finalized' : 'default';
    e.active = isInPath;
  });

  yield {
    type: 'complete',
    codeLine: 8,
    dataState: {
      structure: 'graph',
      mode: 'dijkstra',
      nodes: getNodesSnapshot(),
      edges: JSON.parse(JSON.stringify(edgesList)),
      distTable: getTableData('F'),
      pq: [],
      activeNodeId: 'F',
      shortestPath: pathNodes,
      stats: {
        finalizedCount: 6,
        relaxations: relaxationCount,
        pqSize: 0,
        currentMinDist: distTable['F'].dist,
      },
    },
    message: `Dijkstra Shortest Path Complete! Optimal path to F: ${pathNodes.join(' → ')} with total distance ${distTable['F'].dist}.`,
    reason: {
      action: 'Dijkstra Complete',
      why: `All reachable vertices have optimal shortest distances computed. Shortest path to F identified with distance ${distTable['F'].dist}.`,
      rule: 'Backtrack predecessors from target',
      values: { optimalPath: pathNodes, totalCost: distTable['F'].dist, totalRelaxations: relaxationCount },
      details: 'The shortest path beam glows emerald on the canvas.',
    },
  };
}

// =================================================================
// 3. ADJACENCY LIST VS MATRIX DUAL-VIEW GENERATOR (>= 20 STEPS)
// =================================================================
export function* generateAdjDualSteps(): Generator<StepAction, void, unknown> {
  const vertices = ['A', 'B', 'C', 'D', 'E'];
  const edgesToInsert = [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 7 },
    { from: 'C', to: 'D', weight: 3 },
    { from: 'C', to: 'E', weight: 5 },
    { from: 'D', to: 'E', weight: 8 },
    { from: 'A', to: 'E', weight: 6 },
  ];

  const liveAdjList: Record<string, string[]> = { A: [], B: [], C: [], D: [], E: [] };
  const liveAdjMatrix: Record<string, Record<string, number>> = {
    A: { A: 0, B: 0, C: 0, D: 0, E: 0 },
    B: { A: 0, B: 0, C: 0, D: 0, E: 0 },
    C: { A: 0, B: 0, C: 0, D: 0, E: 0 },
    D: { A: 0, B: 0, C: 0, D: 0, E: 0 },
    E: { A: 0, B: 0, C: 0, D: 0, E: 0 },
  };
  const liveEdges: GraphEdgeData[] = [];
  const liveNodes: GraphNodeData[] = vertices.map((v) => ({
    id: v,
    val: v,
    x: BASE_NODES[v]?.x ?? 300,
    y: BASE_NODES[v]?.y ?? 200,
    status: 'default',
  }));

  yield {
    type: 'start',
    codeLine: 1,
    dataState: {
      structure: 'graph',
      mode: 'dual-view',
      nodes: liveNodes,
      edges: liveEdges,
      adjList: JSON.parse(JSON.stringify(liveAdjList)),
      adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
      stats: {
        vertices: 5,
        edgesCount: 0,
        matrixMemory: '5 × 5 = 25 cells',
        listMemory: '5 buckets, 0 edges',
      },
    },
    message: 'Dual-View Graph initialized with 5 vertices [A, B, C, D, E]. Adjacency List & Matrix start completely empty.',
    reason: {
      action: 'Initialize Dual Representations',
      why: 'Side-by-side demonstration of sparse Adjacency List (linked arrays) vs dense Adjacency Matrix (V x V grid).',
      rule: 'List: O(V + E) space; Matrix: O(V^2) space',
      values: { vertices, edges: 0 },
      details: 'We will now insert each edge step-by-step into both representations simultaneously.',
    },
  };

  for (let i = 0; i < edgesToInsert.length; i++) {
    const { from, to, weight } = edgesToInsert[i];

    // Step A: Inspect edge
    yield {
      type: 'compare',
      codeLine: 2,
      dataState: {
        structure: 'graph',
        mode: 'dual-view',
        nodes: liveNodes,
        edges: JSON.parse(JSON.stringify(liveEdges)),
        adjList: JSON.parse(JSON.stringify(liveAdjList)),
        adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
        activeNodeId: from,
        comparingNodeId: to,
        stats: {
          vertices: 5,
          edgesCount: liveEdges.length,
          matrixMemory: '25 cells',
          listMemory: `5 buckets, ${liveEdges.length * 2} entries`,
        },
      },
      message: `Inspecting edge #${i + 1}: (${from} ↔ ${to}, weight ${weight}) for insertion.`,
      reason: {
        action: `Process Edge (${from}, ${to})`,
        why: `Connecting vertices ${from} and ${to}. Updating Adjacency List bucket [${from}] and Matrix cell [${from}][${to}].`,
        rule: 'adjList[u].push(v); adjMatrix[u][v] = weight',
        values: { from, to, weight },
        details: 'Adjacency list appends neighbor to linked list; matrix writes weight at grid coordinate.',
      },
    };

    // Step B: Insert into list & matrix
    liveAdjList[from].push(`${to}(${weight})`);
    liveAdjList[to].push(`${from}(${weight})`);
    liveAdjMatrix[from][to] = weight;
    liveAdjMatrix[to][from] = weight;
    liveEdges.push({ from, to, weight, status: 'visited', active: true });

    yield {
      type: 'step',
      codeLine: 3,
      dataState: {
        structure: 'graph',
        mode: 'dual-view',
        nodes: liveNodes,
        edges: JSON.parse(JSON.stringify(liveEdges)),
        adjList: JSON.parse(JSON.stringify(liveAdjList)),
        adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
        activeNodeId: from,
        comparingNodeId: to,
        stats: {
          vertices: 5,
          edgesCount: liveEdges.length,
          matrixMemory: '25 cells',
          listMemory: `5 buckets, ${liveEdges.length * 2} entries`,
        },
      },
      message: `Edge (${from} ↔ ${to}) added! List: [${from}].push(${to}). Matrix: [${from}][${to}] = ${weight}.`,
      reason: {
        action: `Write to List & Matrix`,
        why: `Bidirectional edge inserted: Matrix lookup (u, v) is O(1); List saves memory when graph is sparse.`,
        rule: 'list[u].append(v); matrix[u][v] = weight',
        values: { u: from, v: to, weight },
        details: `Both structures synchronized with ${liveEdges.length} total edges.`,
      },
    };

    liveEdges[liveEdges.length - 1].active = false;
  }

  // Lookup Query 1: O(1) Matrix Edge Check vs List Scan
  yield {
    type: 'compare',
    codeLine: 4,
    dataState: {
      structure: 'graph',
      mode: 'dual-view',
      nodes: liveNodes,
      edges: JSON.parse(JSON.stringify(liveEdges)),
      adjList: JSON.parse(JSON.stringify(liveAdjList)),
      adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
      activeNodeId: 'B',
      comparingNodeId: 'D',
      stats: {
        vertices: 5,
        edgesCount: liveEdges.length,
        matrixMemory: '25 cells',
        listMemory: '16 entries',
      },
    },
    message: 'Query 1: "Is there an edge between B and D?" Matrix: matrix[B][D] == 7 in O(1) time! List: linear scan of bucket B.',
    reason: {
      action: 'Query: Edge Exists (B, D)',
      why: 'Adjacency matrix allows instant O(1) edge existence queries by direct index lookup.',
      rule: 'matrix[u][v] != 0 ? true : false',
      values: { query: 'hasEdge(B, D)', matrixResult: liveAdjMatrix['B']['D'], timeMatrix: 'O(1)', timeList: 'O(deg(B))' },
    },
  };

  // Lookup Query 2: All Neighbors of Vertex C
  yield {
    type: 'step',
    codeLine: 4,
    dataState: {
      structure: 'graph',
      mode: 'dual-view',
      nodes: liveNodes,
      edges: JSON.parse(JSON.stringify(liveEdges)),
      adjList: JSON.parse(JSON.stringify(liveAdjList)),
      adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
      activeNodeId: 'C',
      stats: {
        vertices: 5,
        edgesCount: liveEdges.length,
        matrixMemory: '25 cells',
        listMemory: '16 entries',
      },
    },
    message: `Query 2: "Find all neighbors of C." List: return bucket [${liveAdjList['C'].join(', ')}] directly in O(deg(C))! Matrix: must scan entire row C of 5 elements.`,
    reason: {
      action: 'Query: Get Neighbors of C',
      why: 'Adjacency list is optimal for BFS/DFS graph traversals because it visits only actual adjacent neighbors without scanning zeros.',
      rule: 'list[u] vs scan(matrix[u][0..V-1])',
      values: { neighbors: liveAdjList['C'], degree: liveAdjList['C'].length, timeList: 'O(deg(C))', timeMatrix: 'O(V)' },
    },
  };

  yield {
    type: 'complete',
    codeLine: 4,
    dataState: {
      structure: 'graph',
      mode: 'dual-view',
      nodes: liveNodes,
      edges: JSON.parse(JSON.stringify(liveEdges)),
      adjList: JSON.parse(JSON.stringify(liveAdjList)),
      adjMatrix: JSON.parse(JSON.stringify(liveAdjMatrix)),
      stats: {
        vertices: 5,
        edgesCount: liveEdges.length,
        matrixMemory: '25 cells (dense)',
        listMemory: '16 entries (sparse)',
      },
    },
    message: 'Dual-View comparison complete! Adjacency List is optimal for graph traversals O(V + E); Matrix is optimal for O(1) edge checks.',
    reason: {
      action: 'Dual Representation Complete',
      why: 'Demonstrated space and time trade-offs across insertion, storage, and neighbor retrieval.',
      rule: 'Trade-off: Time O(1) edge check vs Space O(V + E)',
      values: { totalEdges: liveEdges.length, vertices: 5 },
      details: 'All nodes and edges successfully mapped.',
    },
  };
}

// =================================================================
// 4. KRUSKAL & PRIM MINIMUM SPANNING TREE GENERATOR (>= 20 STEPS)
// =================================================================
export function* generateMSTSteps(mode: 'kruskal' | 'prim' = 'kruskal'): Generator<StepAction, void, unknown> {
  const vertices = ['A', 'B', 'C', 'D', 'E', 'F'];
  const allEdges: GraphEdgeData[] = [
    { from: 'B', to: 'C', weight: 1 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'E', to: 'F', weight: 3 },
    { from: 'A', to: 'B', weight: 4 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'D', to: 'F', weight: 6 },
    { from: 'C', to: 'D', weight: 8 },
    { from: 'C', to: 'E', weight: 10 },
  ];

  const graphNodes: GraphNodeData[] = vertices.map((v) => ({
    id: v,
    val: v,
    x: BASE_NODES[v].x,
    y: BASE_NODES[v].y,
    status: 'default',
  }));

  if (mode === 'kruskal') {
    // Kruskal: Sort edges ascending by weight, pick greedily unless cycle detected via Disjoint Set
    const parent: Record<string, string> = {};
    const rank: Record<string, number> = {};
    vertices.forEach((v) => {
      parent[v] = v;
      rank[v] = 0;
    });

    const find = (i: string): string => {
      if (parent[i] === i) return i;
      parent[i] = find(parent[i]);
      return parent[i];
    };

    const union = (u: string, v: string) => {
      const rootU = find(u);
      const rootV = find(v);
      if (rootU !== rootV) {
        if (rank[rootU] < rank[rootV]) {
          parent[rootU] = rootV;
        } else if (rank[rootU] > rank[rootV]) {
          parent[rootV] = rootU;
        } else {
          parent[rootV] = rootU;
          rank[rootU]++;
        }
      }
    };

    let mstWeight = 0;
    const acceptedEdges: GraphEdgeData[] = [];
    const rejectedEdges: GraphEdgeData[] = [];

    yield {
      type: 'start',
      codeLine: 1,
      dataState: {
        structure: 'graph',
        mode: 'mst-kruskal',
        nodes: graphNodes,
        edges: allEdges.map((e) => ({ ...e, status: 'default' })),
        candidateEdges: [...allEdges],
        stats: {
          mstWeight: 0,
          acceptedCount: 0,
          rejectedCount: 0,
          targetEdges: vertices.length - 1,
        },
      },
      message: `Kruskal's MST initialized. All ${allEdges.length} edges sorted ascending by weight. Target: V - 1 = 5 edges.`,
      reason: {
        action: 'Sort Edges by Weight',
        why: "Kruskal's algorithm greedily considers edges with smallest weight first.",
        rule: 'edges.sort((a, b) => a.weight - b.weight)',
        values: { sortedWeights: allEdges.map((e) => e.weight) },
        details: 'Cycle detection is managed in O(α(V)) time using Union-Find disjoint sets.',
      },
    };

    for (let i = 0; i < allEdges.length; i++) {
      const edge = allEdges[i];
      const rootU = find(edge.from);
      const rootV = find(edge.to);
      const causesCycle = rootU === rootV;

      // Candidate inspection step
      yield {
        type: 'compare',
        codeLine: 3,
        dataState: {
          structure: 'graph',
          mode: 'mst-kruskal',
          nodes: graphNodes,
          edges: allEdges.map((e) => {
            if (e === edge) return { ...e, status: 'candidate', active: true };
            if (acceptedEdges.includes(e)) return { ...e, status: 'finalized' };
            if (rejectedEdges.includes(e)) return { ...e, status: 'rejected' };
            return { ...e, status: 'default' };
          }),
          candidateEdge: edge,
          activeNodeId: edge.from,
          comparingNodeId: edge.to,
          stats: {
            mstWeight,
            acceptedCount: acceptedEdges.length,
            rejectedCount: rejectedEdges.length,
            targetEdges: vertices.length - 1,
          },
        },
        message: `Inspecting edge #${i + 1}: (${edge.from} ↔ ${edge.to}, wt ${edge.weight}). Find(${edge.from})='${rootU}', Find(${edge.to})='${rootV}'. Cycle? ${causesCycle ? 'YES (Reject)' : 'NO (Accept)'}.`,
        reason: {
          action: `Cycle check for edge (${edge.from}, ${edge.to})`,
          why: causesCycle
            ? `Both vertices ${edge.from} and ${edge.to} share the same Union-Find root '${rootU}'. Adding this edge creates a cycle!`
            : `Roots differ ('${rootU}' != '${rootV}'). Edge safely connects two separate components.`,
          rule: 'if find(u) != find(v): union(u, v) else reject',
          values: { edge: `${edge.from}-${edge.to}`, weight: edge.weight, rootU, rootV, causesCycle },
          details: causesCycle ? 'Cycle rejected!' : 'Safe tree edge accepted!',
        },
      };

      if (!causesCycle && acceptedEdges.length < vertices.length - 1) {
        union(edge.from, edge.to);
        acceptedEdges.push(edge);
        mstWeight += edge.weight ?? 0;

        yield {
          type: 'step',
          codeLine: 4,
          dataState: {
            structure: 'graph',
            mode: 'mst-kruskal',
            nodes: graphNodes,
            edges: allEdges.map((e) => {
              if (acceptedEdges.includes(e)) return { ...e, status: 'finalized' };
              if (rejectedEdges.includes(e)) return { ...e, status: 'rejected' };
              return { ...e, status: 'default' };
            }),
            activeNodeId: edge.from,
            comparingNodeId: edge.to,
            stats: {
              mstWeight,
              acceptedCount: acceptedEdges.length,
              rejectedCount: rejectedEdges.length,
              targetEdges: vertices.length - 1,
            },
          },
          message: `ACCEPTED edge (${edge.from} ↔ ${edge.to}, wt ${edge.weight}) into MST! Current MST Weight: ${mstWeight}. Accepted: ${acceptedEdges.length}/${vertices.length - 1}.`,
          reason: {
            action: `Accept Edge (${edge.from}, ${edge.to})`,
            why: `Merged sets of ${edge.from} and ${edge.to}. Total MST weight is now ${mstWeight}.`,
            rule: 'union(u, v); mst.add(edge)',
            values: { acceptedEdge: edge, newWeight: mstWeight, totalAccepted: acceptedEdges.length },
            details: 'Edge glows emerald in MST tree.',
          },
        };
      } else {
        rejectedEdges.push(edge);

        yield {
          type: 'step',
          codeLine: 5,
          dataState: {
            structure: 'graph',
            mode: 'mst-kruskal',
            nodes: graphNodes,
            edges: allEdges.map((e) => {
              if (acceptedEdges.includes(e)) return { ...e, status: 'finalized' };
              if (rejectedEdges.includes(e)) return { ...e, status: 'rejected' };
              return { ...e, status: 'default' };
            }),
            candidateEdge: edge,
            stats: {
              mstWeight,
              acceptedCount: acceptedEdges.length,
              rejectedCount: rejectedEdges.length,
              targetEdges: vertices.length - 1,
            },
          },
          message: `REJECTED edge (${edge.from} ↔ ${edge.to}, wt ${edge.weight}) because it forms a cycle in the connected component!`,
          reason: {
            action: `Reject Edge (${edge.from}, ${edge.to})`,
            why: `Cycle detected via Union-Find. Spanning trees cannot contain cycles.`,
            rule: 'find(u) == find(v) => discard',
            values: { rejectedEdge: edge, reason: 'Cycle detected' },
            details: 'Edge turns dashed/slate rejected style.',
          },
        };
      }

      if (acceptedEdges.length === vertices.length - 1) {
        yield {
          type: 'step',
          codeLine: 6,
          dataState: {
            structure: 'graph',
            mode: 'mst-kruskal',
            nodes: graphNodes.map((n) => ({ ...n, status: 'finalized' })),
            edges: allEdges.map((e) => {
              if (acceptedEdges.includes(e)) return { ...e, status: 'finalized' };
              if (rejectedEdges.includes(e)) return { ...e, status: 'rejected' };
              return { ...e, status: 'default' };
            }),
            stats: {
              mstWeight,
              acceptedCount: acceptedEdges.length,
              rejectedCount: rejectedEdges.length,
              targetEdges: vertices.length - 1,
            },
          },
          message: `Target reached! MST now contains exactly V - 1 = ${vertices.length - 1} edges. All ${vertices.length} vertices are spanned with no cycles. Remaining edges tested for cycle redundancy.`,
          reason: {
            action: 'MST Spanning Complete',
            why: `A spanning tree of ${vertices.length} vertices requires exactly ${vertices.length - 1} acyclic edges. Remaining heavier edges are safely pruned.`,
            rule: '|E_mst| == |V| - 1',
            values: { acceptedCount: acceptedEdges.length, totalVertices: vertices.length, mstWeight },
            details: 'Optimal minimal weight spanning tree confirmed.',
          },
        };
      }
    }

    yield {
      type: 'complete',
      codeLine: 6,
      dataState: {
        structure: 'graph',
        mode: 'mst-kruskal',
        nodes: graphNodes.map((n) => ({ ...n, status: 'finalized' })),
        edges: allEdges.map((e) => {
          if (acceptedEdges.includes(e)) return { ...e, status: 'finalized', active: true };
          return { ...e, status: 'default', active: false };
        }),
        stats: {
          mstWeight,
          acceptedCount: acceptedEdges.length,
          rejectedCount: rejectedEdges.length,
          targetEdges: vertices.length - 1,
        },
      },
      message: `Kruskal's MST Complete! Minimum Spanning Tree has ${acceptedEdges.length} edges with total optimal weight ${mstWeight}.`,
      reason: {
        action: 'Kruskal Complete',
        why: `Connected all ${vertices.length} vertices with minimal total weight of ${mstWeight} with zero cycles.`,
        rule: '|E_mst| == |V| - 1',
        values: { finalWeight: mstWeight, acceptedEdges: acceptedEdges.map((e) => `(${e.from}-${e.to}: ${e.weight})`) },
        details: 'Optimal spanning tree established.',
      },
    };
  } else {
    // Prim's Algorithm: Grow MST from starting vertex A by repeatedly choosing min-weight cut edge
    const inMST = new Set<string>(['A']);
    let mstWeight = 0;
    const acceptedEdges: GraphEdgeData[] = [];

    yield {
      type: 'start',
      codeLine: 1,
      dataState: {
        structure: 'graph',
        mode: 'mst-prim',
        nodes: graphNodes.map((n) => ({ ...n, status: n.id === 'A' ? 'finalized' : 'default' })),
        edges: allEdges.map((e) => ({ ...e, status: 'default' })),
        activeNodeId: 'A',
        stats: {
          mstWeight: 0,
          acceptedCount: 0,
          verticesInMST: 1,
          targetEdges: vertices.length - 1,
        },
      },
      message: `Prim's MST initialized at vertex A. inMST = {A}. Target: span all ${vertices.length} vertices.`,
      reason: {
        action: 'Initialize Prim at Source A',
        why: "Prim's algorithm starts with a single vertex and greedily grows the tree by taking the cheapest cut edge.",
        rule: 'inMST.add(source)',
        values: { source: 'A' },
        details: 'At each step, find edge (u, v) with u in MST, v not in MST, having minimum weight.',
      },
    };

    while (inMST.size < vertices.length) {
      // Find all cut edges
      const cutEdges = allEdges.filter((e) => {
        const uIn = inMST.has(e.from);
        const vIn = inMST.has(e.to);
        return (uIn && !vIn) || (!uIn && vIn);
      });

      if (cutEdges.length === 0) break;

      cutEdges.sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));
      const bestCutEdge = cutEdges[0];
      const newVertex = inMST.has(bestCutEdge.from) ? bestCutEdge.to : bestCutEdge.from;

      // Step A: Inspect cut set
      yield {
        type: 'compare',
        codeLine: 2,
        dataState: {
          structure: 'graph',
          mode: 'mst-prim',
          nodes: graphNodes.map((n) => ({
            ...n,
            status: inMST.has(n.id) ? 'finalized' : 'default',
          })),
          edges: allEdges.map((e) => {
            if (cutEdges.includes(e)) return { ...e, status: 'candidate' };
            if (acceptedEdges.includes(e)) return { ...e, status: 'finalized' };
            return { ...e, status: 'default' };
          }),
          stats: {
            mstWeight,
            acceptedCount: acceptedEdges.length,
            verticesInMST: inMST.size,
            targetEdges: vertices.length - 1,
          },
        },
        message: `Inspecting ${cutEdges.length} cut edges crossing from MST set {${Array.from(inMST).join(', ')}} to unvisited vertices.`,
        reason: {
          action: 'Evaluate Cut Edges',
          why: 'A cut edge connects a vertex inside the MST to one outside.',
          rule: 'Cut property: cheapest cut edge must belong to MST',
          values: { cutEdges: cutEdges.map((e) => `(${e.from}-${e.to}: ${e.weight})`) },
        },
      };

      // Step B: Pick minimum cut edge
      yield {
        type: 'compare',
        codeLine: 3,
        dataState: {
          structure: 'graph',
          mode: 'mst-prim',
          nodes: graphNodes.map((n) => ({
            ...n,
            status: inMST.has(n.id) ? 'finalized' : n.id === newVertex ? 'frontier' : 'default',
          })),
          edges: allEdges.map((e) => {
            if (e === bestCutEdge) return { ...e, status: 'candidate', active: true };
            if (acceptedEdges.includes(e)) return { ...e, status: 'finalized' };
            return { ...e, status: 'default' };
          }),
          candidateEdge: bestCutEdge,
          activeNodeId: newVertex,
          stats: {
            mstWeight,
            acceptedCount: acceptedEdges.length,
            verticesInMST: inMST.size,
            targetEdges: vertices.length - 1,
          },
        },
        message: `Greedy choice: Cheapest cut edge is (${bestCutEdge.from} ↔ ${bestCutEdge.to}, wt ${bestCutEdge.weight}).`,
        reason: {
          action: 'Select Minimum Cut Edge',
          why: `Edge (${bestCutEdge.from}, ${bestCutEdge.to}) has the smallest weight (${bestCutEdge.weight}) among all crossing edges.`,
          rule: 'min_{(u in MST, v not in MST)} weight(u, v)',
          values: { minEdge: `${bestCutEdge.from}-${bestCutEdge.to}`, weight: bestCutEdge.weight },
          details: 'Greedy choice property guarantees this edge belongs to the MST.',
        },
      };

      inMST.add(newVertex);
      acceptedEdges.push(bestCutEdge);
      mstWeight += bestCutEdge.weight ?? 0;

      // Step C: Add vertex & edge to MST
      yield {
        type: 'step',
        codeLine: 4,
        dataState: {
          structure: 'graph',
          mode: 'mst-prim',
          nodes: graphNodes.map((n) => ({
            ...n,
            status: inMST.has(n.id) ? 'finalized' : 'default',
          })),
          edges: allEdges.map((e) => {
            if (acceptedEdges.includes(e)) return { ...e, status: 'finalized' };
            return { ...e, status: 'default' };
          }),
          activeNodeId: newVertex,
          stats: {
            mstWeight,
            acceptedCount: acceptedEdges.length,
            verticesInMST: inMST.size,
            targetEdges: vertices.length - 1,
          },
        },
        message: `Added vertex ${newVertex} to MST via edge (${bestCutEdge.from} ↔ ${bestCutEdge.to}, wt ${bestCutEdge.weight}). Total MST weight: ${mstWeight}.`,
        reason: {
          action: `Grow MST with vertex ${newVertex}`,
          why: `Vertex ${newVertex} is now part of the MST.`,
          rule: 'inMST.add(v); mst.add(edge)',
          values: { newVertex, addedWeight: bestCutEdge.weight, newTotal: mstWeight },
          details: `MST now spans ${inMST.size}/${vertices.length} vertices.`,
        },
      };

      // Step D: Expand cut boundary from new vertex
      const newOutgoing = allEdges.filter(
        (e) => (e.from === newVertex && !inMST.has(e.to)) || (e.to === newVertex && !inMST.has(e.from))
      );

      yield {
        type: 'step',
        codeLine: 4,
        dataState: {
          structure: 'graph',
          mode: 'mst-prim',
          nodes: graphNodes.map((n) => ({
            ...n,
            status: inMST.has(n.id) ? 'finalized' : 'default',
          })),
          edges: allEdges.map((e) => {
            if (acceptedEdges.includes(e)) return { ...e, status: 'finalized' };
            if (newOutgoing.includes(e)) return { ...e, status: 'candidate' };
            return { ...e, status: 'default' };
          }),
          activeNodeId: newVertex,
          stats: {
            mstWeight,
            acceptedCount: acceptedEdges.length,
            verticesInMST: inMST.size,
            targetEdges: vertices.length - 1,
          },
        },
        message: `Updated cut frontier: Added ${newOutgoing.length} outgoing candidate edges from new vertex ${newVertex} to PQ.`,
        reason: {
          action: `Update Frontier from ${newVertex}`,
          why: `Connecting ${newVertex} reveals new edges to unvisited vertices.`,
          rule: 'for edge in adj[newVertex]: if neighbor not in MST: pq.insert(edge)',
          values: { outgoingEdges: newOutgoing.map((e) => `(${e.from}-${e.to}: ${e.weight})`) },
        },
      };
    }

    yield {
      type: 'complete',
      codeLine: 5,
      dataState: {
        structure: 'graph',
        mode: 'mst-prim',
        nodes: graphNodes.map((n) => ({ ...n, status: 'finalized' })),
        edges: allEdges.map((e) => {
          if (acceptedEdges.includes(e)) return { ...e, status: 'finalized', active: true };
          return { ...e, status: 'default' };
        }),
        stats: {
          mstWeight,
          acceptedCount: acceptedEdges.length,
          verticesInMST: inMST.size,
          targetEdges: vertices.length - 1,
        },
      },
      message: `Prim's MST Complete! Spanned all ${vertices.length} vertices with ${acceptedEdges.length} edges and total optimal weight ${mstWeight}.`,
      reason: {
        action: 'Prim Complete',
        why: 'All vertices are incorporated into a single minimal-weight tree without cycles.',
        rule: 'inMST.size == |V|',
        values: { totalWeight: mstWeight, edgesCount: acceptedEdges.length },
        details: 'Spanning tree covers all nodes.',
      },
    };
  }
}
