# 🛠 Private Deployment & Hosting Guide for Sachin Mishra

This guide contains everything you need to host the **Production RAG** landing page for free and configure live payments. (This information is kept strictly private for you and has been removed from the public student landing page).

---

## ☁️ Option 1: 100% Free Hosting on Vercel (Recommended)

Vercel provides free global CDN hosting, automatic SSL, and zero server maintenance.

### Steps to Deploy:
1. Initialize a git repository and push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Production RAG masterclass"
   git branch -M main
   # Create a repo on github.com, then:
   git remote add origin https://github.com/<your-username>/production-rag.git
   git push -u origin main
   ```
2. Open [vercel.com](https://vercel.com) and log in with GitHub.
3. Click **"Add New..." > "Project"**.
4. Import your `production-rag` repository.
5. In the configuration dialog:
   - **Framework Preset**: Vite
   - **Root Directory**: Click "Edit" and choose `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**.
7. In ~30 seconds, your site is live with a free `*.vercel.app` domain and free automatic SSL!
8. *(Optional)* Add your custom domain (e.g. `productionrag.dev`) under **Project Settings > Domains**.

---

## 🐙 Option 2: 100% Free Hosting on GitHub Pages

The repository already includes an automated GitHub Actions deployment workflow at `.github/workflows/deploy.yml`.

### Steps:
1. In your GitHub repository, go to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Push any commit to the `main` branch:
   ```bash
   git push origin main
   ```
4. GitHub Actions will automatically compile the React frontend and deploy it to `https://<your-username>.github.io/<repo-name>/`.

---

## 💳 Payment Gateway Setup (Razorpay & UPI)

### 1. Razorpay Key Configuration
- Sign up or log into [razorpay.com](https://razorpay.com).
- Go to **Account & Settings > API Keys**.
- Generate a new Key ID and Key Secret.
- Add your Key ID to `frontend/.env`:
  ```env
  VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
  ```

### 2. Direct UPI QR Code (Configured & Live)
- The dynamic QR code in `PaymentModal.tsx` is configured with Sachin Mishra's official verified credentials:
  `upi://pay?pa=sm2157982-1@okhdfcbank&pn=Sachin%20Mishra&am=8099&cu=INR`
- **UPI ID**: `sm2157982-1@okhdfcbank`
- **Phone Number**: `7820802707`
- All registrations and UTR transactions are stored in `backend/data/students.db`.

---

## 🐍 Optional Python FastAPI Backend (`backend/`)

If you want a dedicated Python server to handle server-side Razorpay order generation and webhook signature verification:

1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Create `backend/.env` based on `.env.example`:
   ```env
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_key_here
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
   PORT=8000
   ```
3. Run with uvicorn:
   ```bash
   python main.py
   ```
4. You can host this backend for free on **Render** (Free Web Service), **Railway**, or **Fly.io**.
