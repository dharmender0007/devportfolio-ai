# DevPortfolio AI 🚀

> Auto Portfolio Builder for Developers — powered by GitHub API + Groq ai

---

## ✨ Features

- **JWT Authentication** — Secure signup/login with hashed passwords
- **GitHub Integration** — Import repos, stars, languages, and profile data
- **Resume Parsing** — Upload PDF → auto-extract skills, experience, education
- **AI Content Generation** — GPT-4o-mini writes your bio, project descriptions & taglines
- **3 Portfolio Themes** — Minimal · Dark Developer · Creative Modern
- **Portfolio Editor** — Edit every field before publishing
- **One-Click Publish** — Generate a shareable live URL
- **SEO Meta Tags** — Custom title, description, and keywords per portfolio

---

## 🗂️ Project Structure

```
devportfolio-ai/
├── client/                        # React frontend
│   ├── public/index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── styles/index.css
│       ├── utils/api.js           # Axios instance
│       ├── hooks/
│       │   ├── useAuthStore.js    # Zustand auth state
│       │   └── usePortfolioStore.js
│       ├── pages/
│       │   ├── LandingPage.js
│       │   ├── LoginPage.js
│       │   ├── RegisterPage.js
│       │   ├── DashboardPage.js
│       │   ├── EditorPage.js
│       │   └── PublicPortfolioPage.js
│       └── components/
│           ├── dashboard/
│           │   ├── GitHubImport.js
│           │   ├── ResumeUpload.js
│           │   └── AIGenerator.js
│           └── portfolio/
│               ├── MinimalTheme.js
│               ├── DarkDeveloperTheme.js
│               └── CreativeModernTheme.js
│
└── server/                        # Node.js + Express backend
    ├── index.js                   # App entry point
    ├── config/database.js
    ├── models/
    │   ├── User.js
    │   └── Portfolio.js
    ├── middleware/auth.js
    ├── controllers/
    │   ├── authController.js
    │   ├── githubController.js
    │   ├── aiController.js
    │   ├── resumeController.js
    │   ├── portfolioController.js
    │   └── deployController.js
    └── routes/
        ├── auth.js
        ├── github.js
        ├── portfolio.js
        ├── resume.js
        ├── ai.js
        └── deploy.js
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- GitHub Personal Access Token
- OpenAI API Key

### 1. Clone & Install

```bash
git clone https://github.com/yourname/devportfolio-ai.git
cd devportfolio-ai
npm run install:all
```

### 2. Configure Environment Variables

```bash
# Server env
cp .env.example server/.env
# Edit server/.env with your values
```

**Required values in `server/.env`:**

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for JWT signing |
| `GITHUB_TOKEN` | GitHub Personal Access Token |
| `OPENAI_API_KEY` | OpenAI API key |
| `CLIENT_URL` | Frontend URL (default: http://localhost:3000) |

### 3. Run in Development

```bash
npm run dev
# Starts both client (port 3000) and server (port 5000)
```

---

## 🧪 Sample Test User

After setup, register via the UI or seed with:

```
Name:     Demo Developer
Email:    demo@devportfolio.ai
Password: demo123
GitHub:   torvalds  (or any public username)
```

---

## 📡 API Routes Documentation

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/profile` | ✅ | Update profile |

### GitHub
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/github/user/:username` | ✅ | Fetch GitHub profile |
| GET | `/api/github/repos/:username` | ✅ | Fetch repositories |
| POST | `/api/github/import` | ✅ | Import to portfolio |

### Portfolio
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/portfolio/me` | ✅ | Get own portfolio |
| PUT | `/api/portfolio/me` | ✅ | Update portfolio |
| POST | `/api/portfolio/publish` | ✅ | Publish & get URL |
| PUT | `/api/portfolio/unpublish` | ✅ | Unpublish |
| GET | `/api/portfolio/:slug` | — | Public portfolio view |

### Resume
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/resume/upload` | ✅ | Upload PDF resume |

### AI
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/ai/generate-bio` | ✅ | Generate bio |
| POST | `/api/ai/generate-project-descriptions` | ✅ | Generate project descriptions |
| POST | `/api/ai/generate-about` | ✅ | Generate about section |
| POST | `/api/ai/generate-tagline` | ✅ | Generate taglines |

### Deploy
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/deploy` | ✅ | Deploy portfolio |

---

## 🚀 Deployment Guide

### Frontend → Vercel

```bash
cd client
npm run build

# Deploy to Vercel
npx vercel --prod
```

Add environment variable in Vercel dashboard:
- `REACT_APP_API_URL` = your Render backend URL

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set root directory to `server`
4. Build command: `npm install`
5. Start command: `node index.js`
6. Add all environment variables from `.env.example`

### Update CORS

In `server/index.js`, update:
```js
origin: 'https://your-vercel-app.vercel.app'
```

---

## 🎨 Themes

| Theme | Description | Best For |
|---|---|---|
| **Minimal** | White, clean, lots of whitespace | Traditional roles, enterprise |
| **Dark Developer** | Terminal-inspired, monospace, dark | Tech-focused, open source devs |
| **Creative Modern** | Bold gradients, expressive | Designers, freelancers, startups |

---

## 🔐 Security Notes

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens expire in 7 days
- Rate limiting: 100 req / 15 min per IP
- Helmet.js security headers
- File upload restricted to PDF only, max 5MB
- CORS restricted to client URL

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Zustand, React Router 6 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| AI | OpenAI GPT-4o-mini |
| Auth | JWT + bcryptjs |
| File Uploads | Multer + pdf-parse |
| Deployment | Vercel (FE) + Render (BE) |

---

Built with ❤️ using DevPortfolio AI
