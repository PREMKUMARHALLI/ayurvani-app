# AyurVani - Product Requirements (MVP)

## Goal
Build a lightweight, multilingual Ayurvedic SLM experience for Bharat with offline-first intent and culturally-aware guidance.

## Target Users
- Underserved users needing affordable wellness consultation
- Users preferring Indian language interactions

## MVP Features
- Vite + React Router frontend
- FastAPI backend
- Auth (register/login/logout, cookie session)
- 5-language support: `en`, `hi`, `kn`, `te`, `ta`
- Prakriti quiz and result save
- Chat interface with multilingual responses
- Health history local workflow UI
- Profile + language preference switch

## Non-Goals (for MVP)
- Full medical diagnosis
- Production-grade security and persistence
- Full RAG infra and model orchestration

## APIs Implemented
- `GET /api/auth/me`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `PUT /api/auth/language`
- `GET /api/chat/status`
- `POST /api/chat/message`
- `POST /api/prakriti/submit`
- `POST /api/health/entry`
- `GET /api/health/entries`
- `GET /api/health/timeline`

## Validation Done
- `npm run build` passes on frontend
- `python -m py_compile server.py` passes on backend

