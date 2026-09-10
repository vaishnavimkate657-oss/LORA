# TripPartner — Render Cloud Deployment Guide (render.com)

This guide walks you through deploying the complete **TripPartner** full-stack platform (React 18 + Vite frontend, Spring Boot 3 backend, and PostgreSQL database) to [Render](https://render.com).

---

## Architecture on Render

```
  ┌───────────────────────────────┐
  │   trippartner-frontend        │  Static Site (React 18 + Vite)
  │   https://<frontend>.onrender.com
  └───────────────┬───────────────┘
                  │ HTTPS (VITE_API_BASE_URL)
                  ▼
  ┌───────────────────────────────┐
  │   trippartner-backend         │  Web Service (Docker + Spring Boot 3)
  │   https://<backend>.onrender.com
  └───────────────┬───────────────┘
                  │ JDBC / SSL (DATABASE_URL)
                  ▼
  ┌───────────────────────────────┐
  │   trippartner-db              │  Managed PostgreSQL 16 (Free Tier)
  │   Render Managed Database     │
  └───────────────────────────────┘
```

---

## Method 1: 1-Click Blueprint Deployment (Recommended)

Render Blueprints automatically provision the database, backend web service, frontend static site, and environment variable wiring using the included [`render.yaml`](file:///c:/Users/ADMIN/Desktop/trippartner/trippartner/render.yaml).

### Steps:
1. **Push your code to GitHub/GitLab**:
   ```bash
   git add .
   git commit -m "Configure full-stack project for Render cloud deployment"
   git push origin main
   ```
2. **Log into Render**: Go to [dashboard.render.com](https://dashboard.render.com/).
3. Click **New +** in the top-right corner and select **Blueprint**.
4. Connect your GitHub/GitLab repository (`trippartner`).
5. Render will detect `render.yaml` and display the resources to be created:
   - `trippartner-db` (PostgreSQL Database)
   - `trippartner-backend` (Docker Web Service)
   - `trippartner-frontend` (Static Site)
6. Click **Apply**.
7. Once deployment completes (usually 3–5 minutes), your full-stack app is live!

---

## Method 2: Manual Dashboard Deployment

If you prefer to configure each component manually in the Render dashboard:

### Step 1: Create the PostgreSQL Database
1. In the Render Dashboard, click **New +** → **PostgreSQL**.
2. Set the following details:
   - **Name**: `trippartner-db`
   - **Database**: `trippartner`
   - **User**: `trippartner_user`
   - **Region**: Choose the closest region (e.g. `Oregon (US West)`)
   - **Plan**: `Free`
3. Click **Create Database**.
4. Once created, copy the **Internal Database URL** (or **External Database URL**).

---

### Step 2: Deploy the Backend Web Service
1. Click **New +** → **Web Service**.
2. Connect your Git repository.
3. Configure the service:
   - **Name**: `trippartner-backend`
   - **Language**: `Docker`
   - **Root Directory**: `backend` (or leave empty if using root Dockerfile)
   - **Dockerfile Path**: `./backend/Dockerfile` (or `./Dockerfile`)
   - **Region**: Match the database region (e.g. `Oregon`)
   - **Instance Type**: `Free`
4. Add the following **Environment Variables**:

| Variable Key | Value | Description |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | `postgres` | Activates PostgreSQL datasource profile |
| `DATABASE_URL` | *Paste your database connection string* | Auto-parsed by `DatabaseConfig.java` |
| `CORS_ALLOWED_ORIGINS` | `https://*.onrender.com` | Allows your Render frontend to make API calls |
| `APP_JWT_SECRET` | *Click "Generate"* or enter a 64-char string | Secret key for signing JWT tokens |
| `PORT` | `8080` (or leave default, Render sets dynamically) | Dynamic port binding |

5. Under **Advanced**, set **Health Check Path** to `/api/destinations/trending`.
6. Click **Create Web Service**.

---

### Step 3: Deploy the Frontend Static Site
1. Click **New +** → **Static Site**.
2. Connect your Git repository.
3. Configure the static site:
   - **Name**: `trippartner-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add the following **Environment Variable**:

| Variable Key | Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `https://trippartner-backend.onrender.com/api` | URL of your deployed backend service |

5. Under **Redirects/Rewrites**, add an SPA fallback rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
   *(This ensures client-side routing like `/planner` or `/destinations` works on browser refresh without 404 errors)*.
6. Click **Create Static Site**.

---

## Pre-Seeded Demo Accounts

When starting up on an empty PostgreSQL database on Render, the backend automatically seeds the database with initial demo accounts and travel destinations:

| Email | Password | Role / Profile |
|---|---|---|
| `demo@trippartner.com` | `password123` | Alex Mercer (Verified Nomad) |
| `ananya@trippartner.com` | `password123` | Ananya Sharma (Hampta Pass Trekker) |
| `marcus@trippartner.com` | `password123` | Marcus Vance (Remote Developer) |
| `priya@trippartner.com` | `password123` | Priya & Rohan (Bike Bloggers) |
| `elena@trippartner.com` | `password123` | Elena Rostova (Yoga & Retreats) |

---

## Troubleshooting & FAQ

### 1. Backend Cold Starts on Render Free Tier
- **Symptom**: The first API request after 15 minutes of inactivity takes 30–50 seconds.
- **Explanation**: Render's free tier spins down web services during periods of inactivity.
- **Solution**: The frontend has an increased 15-second Axios timeout and will retry. For production 24/7 uptime without sleep, upgrade the backend web service to Render's **Starter** tier ($7/month).

### 2. 404 Errors on Refreshing Pages (e.g. `/register` or `/explore`)
- **Fix**: Verify that the SPA rewrite rule in Render Static Site is active:
  `/*` → `/index.html` (type: `Rewrite`).

### 3. CORS Issues
- If you use a custom domain (e.g. `https://mycustomtrippartner.com`), add it to the `CORS_ALLOWED_ORIGINS` environment variable on the backend service:
  ```
  CORS_ALLOWED_ORIGINS=https://trippartner-frontend.onrender.com,https://mycustomtrippartner.com
  ```
