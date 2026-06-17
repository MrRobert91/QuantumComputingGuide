# Qiskit v2.x Developer Certification — Prep App

An interactive web app to prepare for IBM's
[**Qiskit v2.x Developer — Associate** certification](https://www.ibm.com/quantum/blog/qiskit-v2x-developer-certification)
(C1000-179). It combines:

- 📚 **Theory** covering the exam objectives (qubits, gates, circuits, operators, primitives,
  runtime & execution modes, transpilation, visualization, OpenQASM).
- 🧪 A **circuit Playground** with a visual **drag/click composer** *and* a **Qiskit code editor**,
  kept **in sync both ways** (composer → generates code; code → renders the circuit).
- ⚛ **Interactive visualizations**: a three.js **Bloch sphere**, **superposition** demos,
  **statevector amplitudes/phases**, and **measurement histograms**.
- ✅ **Exercises** with instant, phase-aware validation, and a **mock exam**.
- 🖥 Execution on the local **Qiskit Aer** simulator, with **optional IBM Quantum** hardware/cloud
  execution when you provide an API token.

> Educational content is **original**, written to cover the same objectives as IBM's open
> materials, with links back to the authoritative sources. Qiskit and IBM Quantum are trademarks of
> IBM; this project is not affiliated with or endorsed by IBM.

## Architecture

A monorepo with two independently dockerized services:

```
.
├── backend/    FastAPI + Qiskit 2.x + Aer (+ optional IBM Runtime)
│               circuit execution, composer<->code conversion, exercise validation,
│               a sandbox for running user-submitted Qiskit code.
├── frontend/   React + Vite + TypeScript SPA (three.js, Monaco), served by nginx.
└── docker-compose.yml
```

The frontend calls the backend at `/api`; in production nginx proxies `/api` to the backend
container, and in dev Vite proxies it to `http://localhost:8000`.

## Quick start (Docker)

```bash
cp .env.example .env        # optional: add IBM_QUANTUM_TOKEN to enable IBM execution
docker compose up --build
```

- App (frontend): http://localhost:8080
- API docs:       http://localhost:8000/docs

## Local development

**Backend**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload          # http://localhost:8000
pytest                                  # run backend tests
```

**Frontend**

```bash
cd frontend
npm install
npm run dev                             # http://localhost:5173 (proxies /api -> :8000)
npm test                                # run frontend tests
npm run build                           # production build
```

## IBM Quantum (optional)

Set `IBM_QUANTUM_TOKEN` (from https://quantum.ibm.com/) in `.env`. The app then offers an
**IBM Quantum** run mode that submits circuits via Qiskit Runtime `SamplerV2` to the least-busy
backend. Without a token everything runs locally on Aer.

## Security note

User-submitted Qiskit code is executed in a best-effort sandbox: an **AST allowlist** (only
`qiskit`/`numpy`/`math` imports, no `os`/`eval`/dunder escapes) plus a **subprocess** with a
wall-clock timeout and CPU/memory limits. This is appropriate for a single-user learning tool, not
for untrusted multi-tenant hosting.

## Status

Foundational modules (**Foundations**, **Gates & Operations**) are fully written with interactive
widgets and exercises. Later modules (Circuits, Operators, Primitives, Runtime, Transpilation,
Visualization, OpenQASM) are **scaffolded** with objectives and links, ready to be filled in.
