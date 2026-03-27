# AyurVani: Fast Deploy (Vercel + Render)

## 1) Push code to GitHub
```bash
cd ~/app
git add .
git commit -m "Prepare hackathon deploy with Vercel + Render configs"
git push origin main
```

## 2) Deploy Backend on Render
- Create **Web Service** (not Background Worker)
- Repository: your `ayurvani-app`
- Use `render.yaml` from repo (recommended), or manual values:
  - Root Directory: `backend`
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
  - Health Check Path: `/api/`
- Env vars:
  - `FRONTEND_ORIGINS=https://<your-frontend-domain>`
  - `SESSION_COOKIE_SECURE=true`
  - `SESSION_COOKIE_SAMESITE=none`

## 3) Deploy Frontend on Vercel
- Import repo
- Root Directory: `frontend`
- Framework: Vite
- Env var:
  - `VITE_BACKEND_URL=https://<your-render-backend-domain>`

## 4) Final wiring
1. Get frontend domain from Vercel
2. Update Render env var:
   - `FRONTEND_ORIGINS=https://<your-vercel-domain>`
3. Redeploy Render service
4. Redeploy Vercel service

## 5) Verify
- Open frontend domain
- Register new account
- Login
- Open chat and send one message

