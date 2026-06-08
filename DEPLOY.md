Deployment instructions — Render (backend) + Vercel (frontend)

1) Backend (Render)
  - Create a new Web Service on Render from this repository.
  - If using `render.yaml`, Render will pick up the `seva-connect-backend` service; otherwise set the start command to `node backend/index.js`.
  - Add environment variables in the Render dashboard:
    - `MONGODB_URI` (required)
    - `JWT_SECRET` (recommended)
    - `EMAIL_USER`, `EMAIL_PASS` (optional, for email)
    - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` (for payments)
  - Deploy and note the service URL (e.g. `https://seva-backend.onrender.com`).

2) Frontend (Vercel)
  - In the `seva-connect-hub-main` directory, the app is a Vite project with `npm run build`.
  - Create a new Vercel project from the `seva-connect-hub-main` folder.
  - In `vercel.json` replace `<RENDER_BACKEND_URL>` with your Render service host (without trailing slash), e.g. `https://seva-backend.onrender.com`.
  - Optional: Set any environment variables needed for the frontend build in Vercel (none required if using relative `/api` paths).
  - Deploy the frontend.

3) Post-deploy
  - Verify backend `GET /api/health` returns status 200.
  - Verify frontend can call APIs (e.g., browse site and check console/network or use curl to `/api/ngos`).

Notes
  - The frontend has been updated to use relative `/api` paths so Vercel routes `/api/*` to the backend configured in `vercel.json`.
  - If you prefer setting the API base in the frontend, replace usages with `import.meta.env.VITE_API_URL` and set that env in Vercel.
