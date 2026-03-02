# Periyar University Exam Portal

A modern, responsive exam schedule portal built for Periyar University. It displays live exam timetables, countdown timers, and session details — all configurable through a built-in admin panel without touching any code.

---

## Features

- **Live Exam Schedule** — Displays sections, sessions, and exam timing using Indian Standard Time (IST) regardless of the visitor's device timezone
- **Countdown Timer** — Real-time countdown to the next exam session
- **Admin Panel** — Password-protected dashboard to update all site content (title, sections, links, schedule) with instant save feedback
- **File Uploads** — Upload university logo and images directly through the admin panel
- **Toast Notifications** — Slide-in alert popups for save confirmations and login errors
- **Docker Ready** — Production Docker image with persistent data volumes
- **CI/CD** — Auto-deploy on every push to `main` via GitHub Actions (self-hosted runner)

---

## Tech Stack

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| Framework  | Next.js 16.1.6 (App Router)           |
| Language   | TypeScript 5                          |
| UI         | React 19 + Tailwind CSS v4            |
| Storage    | JSON file (`data/site-settings.json`) |
| Uploads    | Local filesystem (`public/uploads/`)  |
| Auth       | Session-based (sessionStorage)        |
| Deployment | Docker + GitHub Actions               |

---

## Project Structure

```
university_app/
├── app/
│   ├── page.tsx              # Public-facing exam portal
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── admin/
│       └── page.tsx          # Admin dashboard (login-protected)
│   └── api/
│       └── settings/         # REST API: GET/POST site settings
├── components/
│   ├── Header.tsx            # University header with logo
│   ├── ExamTitle.tsx         # Exam name and year display
│   ├── SectionsDisplay.tsx   # Exam sections with IST time logic
│   ├── SessionCard.tsx       # Individual session card
│   ├── CountdownTimer.tsx    # Live countdown to next session
│   ├── LinkButtons.tsx       # Quick navigation links
│   ├── ServerTime.tsx        # Current IST time display
│   ├── AdminForm.tsx         # Admin settings form
│   ├── AdminLoginGate.tsx    # Login wall + LogoutButton export
│   └── Alert.tsx             # Toast notification component
├── data/
│   └── site-settings.json    # Persisted site configuration
├── public/
│   └── uploads/              # Uploaded images (logo, etc.)
├── Dockerfile                # 3-stage production Docker build
├── docker-compose.yml        # Container orchestration
└── .github/
    └── workflows/
        └── deploy.yml        # GitHub Actions CI/CD pipeline
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

### Admin Login

```
Password: admin@123
```

Session is stored in `sessionStorage` — closing the browser tab will require you to log in again.

### Build for Production

```bash
npm run build
npm start
```

---

## Admin Panel

The admin dashboard (`/admin`) lets you update all site content without editing code:

- University name, exam title, academic year
- Upload university logo
- Add/remove exam sections and sessions
- Set session start/end times (displayed in IST)
- Manage quick-access link buttons
- All changes are saved instantly to `data/site-settings.json`

---

## IST Time

All exam times are displayed in **Indian Standard Time (IST, UTC+5:30)** regardless of the visitor's device timezone. This is achieved with UTC math:

```ts
const nowIST = () => new Date(Date.now() + 5.5 * 3600 * 1000);
```

---

## Docker Deployment

### Build and Run Locally

```bash
# Build image
docker build -t university_app:latest .

# Start container
docker compose up -d
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Persistent Data

Two directories are mounted as bind volumes so data survives container rebuilds:

| Host Path           | Container Path         | Purpose            |
| ------------------- | ---------------------- | ------------------ |
| `./data/`           | `/app/data/`           | Site settings JSON |
| `./public/uploads/` | `/app/public/uploads/` | Uploaded images    |

Always create these before the first run:

```bash
mkdir -p data public/uploads
```

### Environment Variables

| Variable                  | Default      | Description                |
| ------------------------- | ------------ | -------------------------- |
| `NODE_ENV`                | `production` | Node environment           |
| `NEXT_TELEMETRY_DISABLED` | `1`          | Disables Next.js telemetry |

---

## CI/CD — GitHub Actions (Self-Hosted Runner)

The workflow at `.github/workflows/deploy.yml` automatically deploys on every push to `main`.

### How It Works

```
Push to main
    │
    ▼
Self-hosted runner (= your server)
    │
    ├── Checkout code
    ├── Build Docker image (with layer cache)
    ├── docker compose down
    ├── docker compose up -d
    ├── Health check (polls /api/settings for 60s)
    └── Post deployment summary to GitHub
```

No image registry is needed — the image is built directly on the server.

### Setting Up the Self-Hosted Runner

1. Go to your GitHub repo → **Settings → Actions → Runners → New self-hosted runner**
2. Follow the instructions to install and start the runner on your server
3. Ensure Docker and Docker Compose are installed on the server
4. Push to `main` — the workflow runs automatically

### Manual Deploy

You can also trigger a deploy manually from the GitHub Actions tab using the **workflow_dispatch** trigger.

---

## Health Check

The container includes a built-in health check:

```bash
wget -qO- http://localhost:3000/api/settings
```

- Checks every **30 seconds**
- Times out after **10 seconds**
- Retries **3 times** before marking unhealthy
- Waits **20 seconds** after startup before first check

---

## API Reference

### `GET /api/settings`

Returns the current site configuration JSON.

### `POST /api/settings`

Saves updated site configuration. Accepts `multipart/form-data` (for file uploads) or `application/json`.

---

## License

Private project — Periyar University. All rights reserved.
