# AyurVani - MacBook (M1/M2/M3) Setup

## 1. Prerequisites
- Homebrew
- Node.js 18+
- Python 3.11+ (or current 3.14 with venv)

## 2. Frontend
```bash
cd /Users/premkumarh/app/frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## 3. Backend
```bash
cd /Users/premkumarh/app/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

Backend runs on `http://localhost:8001`.

## 4. Environment
Create `frontend/.env`:
```bash
VITE_BACKEND_URL=http://localhost:8001
```

## 5. Demo Login Flow
1. Open `http://localhost:3000`.
2. Register a new account.
3. Pick one of 5 languages: English, Hindi, Kannada, Telugu, Tamil.
4. Start quiz or chat.

## Notes
- Current backend uses in-memory storage for hackathon speed (resets on restart).
- Chat replies are safe demo responses with multilingual prefix and disclaimer.

