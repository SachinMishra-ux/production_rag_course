# Production RAG Live Masterclass 🚀
### 4-Week Live Intensive Cohort by Sachin Mishra (Senior Gen AI Engineer)

[![Live Video](https://img.shields.io/badge/Full%20HD%20Video-1080p%2030fps-cyan)](assets/video/production_rag_promo.mp4)
[![Neural Voice](https://img.shields.io/badge/Voice-Edge--TTS%20ChristopherNeural-blue)](assets/audio/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20Tailwind-blue)](frontend/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Razorpay-emerald)](backend/)
[![Promo Code](https://img.shields.io/badge/Promo%20Code-EARLYBIRD10%20(10%25%20Off)-emerald)](#-official-cohort-tuition--promo-code)
[![Free Hosting](https://img.shields.io/badge/Free%20Hosting-Vercel%20%7C%20GitHub%20Pages-purple)](DEPLOYMENT_GUIDE.md)

---

## 📌 Executive Summary

Most online courses teach **"Toy RAG"**—ingesting 2 clean text files with `RecursiveCharacterTextSplitter`, inserting 10 embeddings into a local ChromaDB, and calling it a day.

When engineers try to deploy this in production, **95% of systems fail immediately**:
1. **Real enterprise documents have 0 extractable ASCII text**: Scanned manuals, technical schematics, and multi-tier block diagrams (such as the **77-page MiG-29 Flight Manual** and **Figure 1-1A Engine Control Unit** included in this repo) return empty string buffers with standard `PyPDFLoader`, causing 100% hallucinations.
2. **Signal Disconnection in Block Diagrams**: Multi-tier arrows (LP/HP compressor speed, EGT, CIP routing to ECU and Relais Box) get chopped in half by character splitters, destroying relational circuit context.
3. **Concurrency Bottlenecks**: Ingesting 100–200 heavy PDFs simultaneously locks worker threads, surging query latencies from 120ms to 8,420ms and triggering **HTTP 504 Gateway Timeouts** and 64GB OOM cluster crashes.
4. **Career & Monetization Gap**: Engineers struggle to articulate system design trade-offs in interviews or monetize their skills via high-ticket enterprise freelance retainers.

This repository provides an end-to-end masterclass codebase, cinematic video assets, and an interactive landing page to teach and showcase **Production RAG at enterprise scale**.

---

## 🏷️ Official Cohort Tuition & Promo Code

| Pass Tier | Standard Tuition | Early Bird Promo Code (`EARLYBIRD10`) | Net Discounted Price |
| :--- | :--- | :--- | :--- |
| **Full Masterclass Pass** | **₹8,999 INR** *(was ₹19,999)* | **-10% Instant Discount (-₹900)** | **₹8,099 INR** *(or $99 USD)* |

- **Early Bird Promo Code**: `EARLYBIRD10`
- **What's Included**: 4 Weeks Live Weekend Coding, Production Codebase, Scanned MiG-29 Dataset, 20-30 LPA Interview Kit, ₹15k-₹50k Freelance Retainer Templates, Lifetime Discord & Recordings.
- **7-Day Guarantee**: Attend the first week of live classes. If not 100% satisfied, get a full refund immediately.

---

## 📁 Repository Directory Structure

```text
Production_RAG/
├── assets/                                # All generated multimedia assets & volumes
│   ├── audio/                             # Neural voiceover, SFX, & background music
│   │   ├── master_promo_audio.wav         # 104s Master mixed audio (TTS + Music + 6 SFX)
│   │   ├── synth_bg_track.wav             # Cyberpunk synthwave background music loop
│   │   ├── scene1.mp3 ... scene5.mp3      # Edge-TTS ChristopherNeural dialogue takes
│   │   └── scene1.wav ... scene5.wav      # Studio 44.1kHz audio stems
│   ├── docs/                              # Heavy technical manuals & datasets
│   │   └── mig29_flight_manual.pdf        # Scanned 77-page technical manual (0 ASCII text)
│   ├── images/                            # Schematics, block diagrams & instructor portrait
│   │   ├── sachin_photo.jpg               # Sachin Mishra verified instructor photo
│   │   ├── mig29_blueprint.jpg            # Page 7 jet blueprint with wing dimensions
│   │   ├── mig29_engine_block_diagram.jpg # Figure 1-1A Engine Control & Sensor Inputs
│   │   └── sample_pdf_page_*.png          # Extracted manual page renders
│   ├── video/                             # Rendered promotional & walkthrough videos
│   │   └── production_rag_promo.mp4       # 104s Master 1080p video with neural voice
│   └── video_frames/                      # High-resolution frame exports from the video
│       ├── frame_s1.jpg                   # Scene 1: Scanned blueprint failure & terminal
│       ├── frame_s2.jpg                   # Scene 2: Figure 1-1A & 8,420ms latency surge graph
│       ├── frame_s3.jpg                   # Scene 3: ColPali multimodal architecture pillars
│       ├── frame_s4.jpg                   # Scene 4: 3 Career & monetization cards
│       └── frame_s5_clean.jpg             # Scene 5: Tuition ₹8,999 & EARLYBIRD10 promo code
├── backend/                               # Production Python FastAPI backend
│   ├── main.py                            # Razorpay orders, discount logic & webhooks
│   ├── requirements.txt                   # FastAPI, Uvicorn, Razorpay, Pydantic dependencies
│   ├── Dockerfile                         # Container deployment for Render/Railway/Fly.io
│   └── .env.example                       # API keys and webhook secrets template
├── frontend/                              # Production React + TypeScript + Vite app
│   ├── public/                            # Static media served to web app
│   │   ├── production_rag_promo.mp4       # Embedded promo video
│   │   ├── sachin_photo.jpg               # Instructor spotlight image
│   │   ├── mig29_blueprint.jpg            # Interactive stress test blueprint
│   │   └── mig29_engine_block_diagram.jpg # Figure 1-1A interactive block diagram
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx                 # Header with countdown timer & enrollment pill
│   │   │   ├── Hero.tsx                   # Hero section with live video trigger
│   │   │   ├── VideoPlayer.tsx            # Custom video player with 5 synced chapters
│   │   │   ├── Mig29StressTest.tsx        # Interactive scanner comparing PyPDF vs ColPali
│   │   │   ├── Curriculum.tsx             # 4-Week syllabus breakdown
│   │   │   ├── CareerMonetization.tsx     # 20-30 LPA salary & ₹15k-₹50k freelance ROI tool
│   │   │   ├── Mentor.tsx                 # Sachin Mishra credentials & student reviews
│   │   │   ├── Pricing.tsx                # Tuition ₹8,999 & interactive coupon EARLYBIRD10
│   │   │   ├── PaymentModal.tsx           # Multi-method checkout: Razorpay, UPI QR, Stripe
│   │   │   └── Footer.tsx                 # Executive footer & copyright
│   │   ├── App.tsx                        # Master container
│   │   └── main.tsx                       # React DOM entrypoint
│   ├── package.json                       # React 18, Tailwind, Lucide, Canvas-Confetti
│   ├── tailwind.config.js                 # Eye-coolness dark slate color scheme
│   └── vite.config.ts                     # Vite build configuration
├── scripts/                               # Video rendering & audio generation tools
│   ├── render_promo_video.py              # 104s video generator with HUD, graphs & typography
│   └── render_sample_frames.py            # Quick preview frame exporter
├── DEPLOYMENT_GUIDE.md                    # Private step-by-step free hosting guide
└── README.md                              # Repository overview & run commands
```

---

## ⚡ Quickstart: How to Run the Repository

### 1. Prerequisites
- **Node.js**: v18+ or v20+ (`node -v`)
- **Python**: 3.10, 3.11, or 3.12 (`python3 --version`)
- **FFmpeg**: (Optional, only needed if re-rendering the promo video)

---

### 2. Running the Frontend (Landing Page & Video Player)

The frontend is built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (only required the first time)
npm install

# Start the Vite development server
npm run dev
```

> 🌐 Open your browser and visit: **`http://localhost:3000/`** (or the port displayed in your terminal).

To create an optimized production build:
```bash
cd frontend
npm run build
# The production bundle is output to frontend/dist/
```

---

### 3. Running the Backend (FastAPI & Payment Webhooks)

The backend provides the API for Razorpay order generation, discount calculation (`EARLYBIRD10`), cryptographic signature verification, and async webhooks.

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required Python dependencies
pip install -r requirements.txt

# (Optional) Copy environment template and enter your Razorpay keys
cp .env.example .env

# Start the FastAPI server with live reload
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

> 📖 **API Documentation**: Visit **`http://localhost:8000/docs`** for interactive Swagger UI testing of:
> - `POST /api/create-order` (Creates Razorpay order with `EARLYBIRD10` discount logic)
> - `POST /api/verify-payment` (Verifies HMAC-SHA256 signature)
> - `POST /api/razorpay-webhook` (Asynchronous server-to-server confirmation)

---

### 4. (Optional) Re-generating the 104s Master Promotional Video

All video and audio assets are pre-rendered in `assets/video/` and `assets/audio/`. If you want to modify dialogue, typography, or timing and re-render the video:

```bash
# Install audio & video rendering requirements
python3 -m pip install edge-tts numpy pillow

# Run the master video rendering script
python3 scripts/render_promo_video.py
```
The script uses **Apple `Avenir Next` and `Menlo` system fonts**, paints real-time latency graphs, HUD status bars, terminal windows, and mixes with Microsoft Edge-TTS neural voice (`en-US-ChristopherNeural`) into `assets/video/production_rag_promo.mp4`.

---

## 💳 Payment Gateway, Verified UPI & Student Database

### 1. Verified Instructor UPI Credentials
- **Payee Name**: Sachin Mishra
- **UPI ID**: `sm2157982-1@okhdfcbank`
- **GPay / PhonePe Number**: `7820802707`
- **Dynamic QR Code**: Pre-configured with intent `upi://pay?pa=sm2157982-1@okhdfcbank&pn=Sachin%20Mishra&am=8099&cu=INR`
- **Mobile 1-Click Launch**: Mobile visitors tap "Open in UPI App" to launch GPay/PhonePe directly.

### 2. Persistent Student Database (`backend/data/students.db`)
All student information collected during enrollment (Full Name, WhatsApp Phone, Email, Amount, Promo Code, Payment Method, and 12-digit UTR Reference Number) is automatically stored in a persistent SQLite database located at `backend/data/students.db`.

#### Admin Endpoints for Instructor:
- **View All Registered Students**: `GET http://localhost:8000/api/students`
- **Download Full Student Roster (CSV)**: `GET http://localhost:8000/api/export-students-csv` (1-click export directly to Excel or Google Sheets)
- **Direct Terminal Query**:
  ```bash
  sqlite3 backend/data/students.db "SELECT id, name, email, phone, utr_number, amount_inr, status, created_at FROM students;"
  ```
- **Redundant Local Storage**: Frontend automatically keeps a secondary client-side backup in `localStorage` under `production_rag_enrolled_students` to guarantee zero data loss.

---

## 💳 Checkout Flow Options

1. **Direct Scan-and-Pay UPI QR Code (Primary)**:
   - Students scan the QR code with Google Pay, PhonePe, or Paytm for ₹8,099 INR (or ₹8,999 without coupon).
   - Enter their 12-digit UPI UTR / Reference Number and tap "Confirm Payment".
   - Record is stored immediately in `students.db` and confirmation screen opens with VIP Discord link.
2. **Razorpay Gateway (India & Global Cards)**:
   - Supports Cards, NetBanking, Google Pay, PhonePe, Paytm, and EMI.
   - Automatically stores order intent and updates status to `paid` upon HMAC signature verification.
3. **Stripe USD Gateway (International Students)**:
   - Preset checkout for **$99 USD** via Visa, Mastercard, AMEX, or Apple Pay.

---

## ☁️ Free Cloud Deployment Options

For full deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

### Option 1: Vercel (Frontend — 1-Click Free Hosting)
1. Push this repository to GitHub.
2. Link your GitHub repo in [vercel.com](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Deploy! Vercel automatically builds `frontend/dist` and assigns a free global SSL domain.

### Option 2: GitHub Pages (Frontend — 100% Free)
- A GitHub Actions workflow is provided in `.github/workflows/deploy.yml` that automatically builds and deploys the frontend upon pushing to `main`.

### Option 3: Render / Railway (Backend API — Free Tier)
- Connect your repo to [Render](https://render.com) or [Railway](https://railway.app), select Docker or Python runtime pointing to `backend/`, and expose port `8000`.

---

## 👨‍🏫 Instructor Bio

**Sachin Mishra**
*Senior Generative AI Engineer & AI System Architect*
- 6+ Years Enterprise AI/ML Experience building and deploying high-concurrency LLM systems.
- Built multimodal RAG pipelines handling millions of documents and sub-200ms latency.
- Mentored 500+ engineers into Senior Gen AI roles (20–30 LPA) and independent consulting retainers (₹15k–₹50k/project).

---

## 📄 License & Usage
All materials, codebases, and media assets in this repository are prepared for the **Production RAG Masterclass Cohort**. Free for personal learning and educational deployment.
