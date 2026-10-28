# AlgoViz - Comprehensive DSA Visualization Platform & AI Problem Solver

AlgoViz is an interactive Data Structures & Algorithms learning platform built with React, Vite, TypeScript, and Tailwind CSS v4, organized into **`frontend/`** and **`backend/`**.

---

## 📚 Complete Curriculum (20 Modules)

### PART 1: DATA STRUCTURES (12 Topics)
1. **Arrays & Patterns:** Static vs dynamic, index access, traversal, insertion, deletion, searching; patterns: Kadane (max subarray sum), Two Pointers, Sliding Window (fixed & variable), Prefix Sum.  
   *Real-life analogy: Train passenger seats numbered 0 to N-1 with instant seat access in O(1) time.*
2. **Strings & Pattern Matching:** Comparison, concatenation, palindrome check, subsequences, substrings, pattern matching, KMP (with LPS table), Rabin-Karp (rolling hash).  
   *Real-life analogy: Ctrl+F search in a document editor without redundant backtracking.*
3. **Linked Lists:** Singly, Doubly, Circular, Circular Doubly; insertion, deletion, traversal, reversal, loop detection (Floyd cycle) and loop removal.  
   *Real-life analogy: Music player playlist with Next/Prev pointers and repeat-playlist loops.*
4. **Stack (LIFO):** Push, pop, peek; undo/redo demo, syntax/parentheses check, backtracking demo.  
   *Real-life analogy: A stack of cafeteria plates, browser back-history, and Ctrl+Z undo buffer.*
5. **Queue (FIFO) & Deque:** Simple Queue, Circular Queue with modulo pointer wrap, Priority Queue, Deque (double-ended).  
   *Real-life analogy: Ticket counter queue or printer job spooling buffer.*
6. **Trees & BST:** Binary tree, BST (insert, search, delete), AVL rotations, traversals (inorder, preorder, postorder, level order), height/depth, LCA.  
   *Real-life analogy: Operating system directory folder hierarchy and corporate org chart.*
7. **Graphs & Dual View:** Directed/undirected, weighted/unweighted, Adjacency List vs Adjacency Matrix shown simultaneously side-by-side, BFS, DFS, Dijkstra, Kruskal, Prim.  
   *Real-life analogy: Google Maps city road intersections and social media friend networks.*
8. **Hashing & Collisions:** Hash functions, hash table/map, separate chaining, open addressing linear probing.  
   *Real-life analogy: Airport luggage tag barcodes mapping directly to carousel retrieval slots.*
9. **Heap (Tree + Array View):** Min-heap, max-heap, insert, extract, heapify, Heap Sort, Priority Queue (synchronized tree view and array view side by side).  
   *Real-life analogy: Emergency room triage where highest emergency patient is treated first.*
10. **Trie (Prefix Tree):** Insert, search, prefix search, autocomplete.  
    *Real-life analogy: Phonebook predictive keyboard autocomplete while typing messages.*
11. **Disjoint Set (Union-Find):** Union, find, path compression, union by rank; connected to Kruskal's MST.  
    *Real-life analogy: Merging social clubs where each club has one elected president representing the group.*
12. **Matrix & 2D Grid:** 2D grid traversal, image-processing style flood fill, spiral traversal, rotate 90°, DP on grids.  
    *Real-life analogy: Photoshop paint bucket tool flood filling a shape or image pixel manipulation.*

### PART 2: ALGORITHMS (8 Topics)
1. **Recursion & Call Stack:** Factorial, Fibonacci (call stack and recursion tree), Tower of Hanoi disk movement.  
   *Real-life analogy: Russian Matryoshka nesting dolls opening smaller identical dolls inside.*
2. **Searching:** Linear, Binary, Jump, Interpolation.  
   *Real-life analogy: Opening a physical dictionary right in the middle to find a word faster.*
3. **Sorting:** Basic (Bubble, Insertion, Selection) and Advanced (Merge, Quick, Heap, Counting); compare mode for any two.  
   *Real-life analogy: Arranging playing cards in your hand in ascending order.*
4. **Divide and Conquer:** Merge Sort split/merge tree, Quick Sort partitioning, Binary Search as D&C.  
   *Real-life analogy: Dividing a company project among teams, then synthesizing results.*
5. **Dynamic Programming:** Fibonacci with Memoization (top-down) vs Tabulation (bottom-up) side by side, LCS, 0/1 Knapsack, Coin Change, Matrix Chain Multiplication.  
   *Real-life analogy: Remembering 1+1+1+1=4 so adding one more is instantly known as 5 without recount.*
6. **Greedy:** Huffman Coding tree builder, Activity Selection, Kruskal, Prim.  
   *Real-life analogy: Cashier giving change with fewest coins by picking largest denomination first.*
7. **Backtracking:** N-Queens, Sudoku Solver (showing Choose, Explore, Undo phases).  
   *Real-life analogy: Navigating a maze: walk a path until hitting a dead end, then backtrack to the fork.*
8. **Bit Manipulation:** AND, OR, XOR, shifts, counting set bits, odd/even check; animated toggling binary cells.  
   *Real-life analogy: A bank of light switches representing device on/off configuration states.*

---

## ⚡ How to Run

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

### Backend (Optional)
```bash
cd backend
cp .env.example .env
npm start
```
Runs at `http://localhost:3001`.
