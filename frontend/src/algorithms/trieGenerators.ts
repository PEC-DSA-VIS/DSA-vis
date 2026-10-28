import { StepAction } from '../types';

export interface TrieNodeInfo {
  id: string;
  char: string;
  parentId: string | null;
  children: string[]; // child IDs
  isEndOfWord: boolean;
  word?: string;
}

export interface TrieDataState {
  nodes: TrieNodeInfo[];
  words: string[];
  activeNodeId?: string | null;
  activeWord?: string | null;
  activeChar?: string | null;
  searchPrefix?: string | null;
  foundMatches?: string[];
  operation: string;
  runningMetric: string;
}

/**
 * Trie: Character-by-Character Node Creation, Search Path, and Autocomplete DFS
 */
export function* generateTrieSteps(): Generator<StepAction<TrieDataState>, void, unknown> {
  const wordsToInsert = ['cat', 'car', 'cart', 'dog', 'dot'];
  const nodes: TrieNodeInfo[] = [
    {
      id: 'root',
      char: 'ROOT',
      parentId: null,
      children: [],
      isEndOfWord: false,
    },
  ];

  // Helper to clone nodes
  const cloneTrie = () => nodes.map((n) => ({ ...n, children: [...n.children] }));

  // Step 1: Start with Empty Trie (Root only)
  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    dataState: {
      nodes: cloneTrie(),
      words: [],
      activeNodeId: 'root',
      operation: 'Empty Trie Initialized',
      runningMetric: 'Root Node Allocated (Children = empty)',
    },
    message: 'Trie (Prefix Tree) initialized EMPTY with single Root node. Fast O(L) dictionary lookups for string operations.',
    reason: {
      action: 'Init Empty Trie',
      why: 'Trie starts with an empty root node. Edges or child pointers represent individual characters.',
      rule: 'root = new TrieNode()',
      values: { alphabetSize: 26 },
    },
  };

  // Phase 1: Character-by-character word insertion
  for (const word of wordsToInsert) {
    let currId = 'root';

    for (let cIdx = 0; cIdx < word.length; cIdx++) {
      const ch = word[cIdx];
      const isLast = cIdx === word.length - 1;
      const expectedChildId = `${currId}-${ch}`;

      const currNode = nodes.find((n) => n.id === currId)!;
      const childExists = currNode.children.includes(expectedChildId);

      if (!childExists) {
        // Allocate new character node
        currNode.children.push(expectedChildId);
        nodes.push({
          id: expectedChildId,
          char: ch,
          parentId: currId,
          children: [],
          isEndOfWord: isLast,
          word: isLast ? word : undefined,
        });

        yield {
          type: 'insert',
          codeLine: 2,
          indices: [],
          pointers: { char: ch, parent: currId },
          dataState: {
            nodes: cloneTrie(),
            words: wordsToInsert,
            activeNodeId: expectedChildId,
            activeWord: word,
            activeChar: ch,
            operation: `Insert Char '${ch}' for "${word}"`,
            runningMetric: `Created node '${ch}' under '${currNode.char}'${isLast ? ' (End of Word!)' : ''}`,
          },
          message: `Word "${word}" [char ${cIdx + 1}/${word.length} = '${ch}']: Child node did not exist. Created new TrieNode('${ch}') under '${currNode.char}'.${
            isLast ? ` Marked isEndOfWord = TRUE for "${word}".` : ''
          }`,
          reason: {
            action: `Create Node('${ch}')`,
            why: `Character '${ch}' not yet present under prefix. New node allocated.`,
            rule: 'curr.children[ch] = new TrieNode()',
            values: { word, char: ch, parent: currNode.char, isEndOfWord: isLast },
          },
        };
      } else {
        // Reusing existing character node
        const existingNode = nodes.find((n) => n.id === expectedChildId)!;
        if (isLast) {
          existingNode.isEndOfWord = true;
          existingNode.word = word;
        }

        yield {
          type: 'step',
          codeLine: 3,
          indices: [],
          dataState: {
            nodes: cloneTrie(),
            words: wordsToInsert,
            activeNodeId: expectedChildId,
            activeWord: word,
            activeChar: ch,
            operation: `Reuse Prefix Char '${ch}'`,
            runningMetric: `Reusing common prefix node '${ch}' for "${word}"`,
          },
          message: `Word "${word}" [char '${ch}']: Existing prefix node found! Reusing node '${ch}' without extra memory.`,
          reason: {
            action: `Traverse Prefix '${ch}'`,
            why: `Prefix sharing: Words sharing common prefixes share the same node path.`,
            rule: 'curr = curr.children[ch]',
            values: { word, char: ch, sharedPrefix: true },
          },
        };
      }

      currId = expectedChildId;
    }
  }

  // Phase 2: Prefix Search for "ca"
  const prefix = 'ca';
  yield {
    type: 'step',
    codeLine: 4,
    indices: [],
    dataState: {
      nodes: cloneTrie(),
      words: wordsToInsert,
      searchPrefix: prefix,
      operation: `Prefix Search: "${prefix}"`,
      runningMetric: `Navigating path for prefix "${prefix}"`,
    },
    message: `Starting PREFIX SEARCH for "${prefix}". Tracing character path from root.`,
    reason: {
      action: `Search Prefix "${prefix}"`,
      why: 'Trie searches prefixes in O(length) time regardless of the total number of words in the dictionary.',
      rule: 'findPrefix(prefix)',
      values: { prefix },
    },
  };

  let prefixNodeId = 'root';
  for (let i = 0; i < prefix.length; i++) {
    const ch = prefix[i];
    prefixNodeId = `${prefixNodeId}-${ch}`;

    yield {
      type: 'compare',
      codeLine: 5,
      indices: [],
      dataState: {
        nodes: cloneTrie(),
        words: wordsToInsert,
        activeNodeId: prefixNodeId,
        searchPrefix: prefix,
        activeChar: ch,
        operation: `Matched Prefix Char '${ch}'`,
        runningMetric: `Matched '${ch}' -> At Node [${prefixNodeId}]`,
      },
      message: `Prefix matching: Matched character '${ch}' at node [${prefixNodeId}].`,
      reason: {
        action: `Match '${ch}'`,
        why: `Character '${ch}' exists in trie child branches.`,
        rule: 'curr = curr.children[ch]',
        values: { char: ch, prefix },
      },
    };
  }

  // Phase 3: Autocomplete DFS from Prefix Node
  yield {
    type: 'step',
    codeLine: 6,
    indices: [],
    dataState: {
      nodes: cloneTrie(),
      words: wordsToInsert,
      activeNodeId: prefixNodeId,
      searchPrefix: prefix,
      foundMatches: [],
      operation: `Autocomplete DFS from "${prefix}"`,
      runningMetric: `Running DFS exploration to find all words starting with "${prefix}"`,
    },
    message: `Prefix node found! Running DFS from node [${prefixNodeId}] to collect all completions with prefix "${prefix}".`,
    reason: {
      action: 'Start Autocomplete DFS',
      why: 'All subtrees rooted at prefix node represent words having this prefix.',
      rule: 'dfsCollect(prefixNode)',
      values: { prefixRoot: prefixNodeId },
    },
  };

  const matches: string[] = [];
  function* dfsCollect(nId: string): Generator<StepAction<TrieDataState>, void, unknown> {
    const node = nodes.find((n) => n.id === nId)!;

    if (node.isEndOfWord && node.word) {
      matches.push(node.word);

      yield {
        type: 'found',
        codeLine: 7,
        indices: [],
        dataState: {
          nodes: cloneTrie(),
          words: wordsToInsert,
          activeNodeId: nId,
          searchPrefix: prefix,
          foundMatches: [...matches],
          operation: `Found Completion: "${node.word}"`,
          runningMetric: `Matches so far: [${matches.join(', ')}]`,
        },
        message: `FOUND MATCH: "${node.word}" has isEndOfWord = TRUE. Added to autocomplete suggestions!`,
        reason: {
          action: `Collect "${node.word}"`,
          why: `Reached terminal word node during DFS.`,
          rule: 'if node.isEndOfWord: results.add(node.word)',
          values: { completedWord: node.word },
        },
      };
    }

    for (const childId of node.children) {
      yield* dfsCollect(childId);
    }
  }

  yield* dfsCollect(prefixNodeId);

  // Complete
  yield {
    type: 'complete',
    codeLine: 8,
    indices: [],
    dataState: {
      nodes: cloneTrie(),
      words: wordsToInsert,
      searchPrefix: prefix,
      foundMatches: [...matches],
      operation: 'Trie Autocomplete Complete',
      runningMetric: `Autocomplete Results for "${prefix}": [${matches.join(', ')}]`,
    },
    message: `Trie Autocomplete Finished! Found ${matches.length} matching words starting with "${prefix}": [${matches.join(
      ', '
    )}]. Time: O(prefix_len + matches).`,
    reason: {
      action: 'Autocomplete Complete',
      why: 'Demonstrated character-by-character creation, O(L) prefix search, and DFS autocomplete.',
      rule: 'Prefix Tree Verified',
      values: { prefix, results: [...matches] },
    },
  };
}
