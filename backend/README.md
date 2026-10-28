# AlgoViz Backend API

Minimal, high-performance Node.js backend for AlgoViz AI Mentor and Problem Solver.

## 🚀 How to Run

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set your `AI_API_KEY` (optional - if omitted, built-in intelligent DSA heuristics are used).
3. Start the server:
   ```bash
   npm start
   # or for auto-reload during development:
   npm run dev
   ```
   The backend server runs at `http://localhost:3001`.

## 📡 Endpoints

- `POST /api/chat`:
  - Handles streaming AI responses via Server-Sent Events (SSE).
  - Enforces per-IP rate limiting (25 requests/min).
  - Context-aware DSA mentoring & Problem Solver JSON plans with tool-calling board actions (`jumpToStep`, `stepForward`, etc.).
