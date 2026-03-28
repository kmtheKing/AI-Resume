# ResumeAI — AI-Powered Resume Analyzer & Editor

A premium, full-stack AI Resume Analyzer powered by **Google Gemini**, **Laravel**, and **React**.

Upload your resume, select your target industry, and receive an instant AI-generated score, strengths/weaknesses breakdown, ATS compatibility rating, and actionable improvement suggestions — all within a stunning dark-themed interface.

![ResumeAI Screenshot](public/images/hero.png)

---

## ✨ Features

- **AI-Powered Analysis** — Gemini 2.0 Flash evaluates your resume against industry-specific standards
- **ATS Compatibility Score** — Understand how well applicant tracking systems can parse your resume
- **Actionable Suggestions** — Get section-by-section improvement recommendations with clear reasoning
- **Interactive AI Editor** — Highlight any text and click "AI Improve" to rewrite it with action verbs and quantified achievements
- **Dynamic Industry Selection** — Admin-configurable fields of work with custom descriptions
- **Drag & Drop Upload** — Supports PDF, DOCX, and TXT files via react-dropzone
- **Dark Theme UI** — Premium dark interface with glassmorphism, scroll animations, and subtle glow effects
- **Secure Architecture** — API keys stay server-side; React communicates through authenticated Laravel endpoints

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Laravel 11.x (PHP 8.2+) |
| **Frontend** | React 18 + TypeScript |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) |
| **Animations** | Framer Motion + CSS scroll-reveal |
| **Charts** | Recharts (radial score gauge) |
| **AI Engine** | Google Gemini 2.0 Flash API |
| **PDF Parsing** | smalot/pdfparser |
| **Auth** | Laravel Breeze |
| **Database** | MySQL (Eloquent ORM) |
| **Build Tool** | Vite 8.x |

---

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+, Composer
- Node.js 18+, npm
- MySQL (XAMPP, Herd, or standalone)
- A [Google AI Studio](https://aistudio.google.com/) API key

### Installation

```bash
# Clone the repository
git clone https://github.com/kmtheKing/AI-Resume.git
cd AI-Resume

# Install PHP dependencies
composer install

# Install JS dependencies
npm install

# Environment setup
cp .env.example .env
php artisan key:generate
```

### Configure `.env`

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ai_resume
DB_USERNAME=root
DB_PASSWORD=

GEMINI_API_KEY=your_gemini_api_key_here
```

### Database & Storage

```bash
php artisan migrate --seed
php artisan storage:link
```

### Run the Application

Open **two terminals**:

```bash
# Terminal 1 — Laravel backend
php artisan serve

# Terminal 2 — Vite dev server (for hot reload)
npm run dev
```

Visit **http://localhost:8000** to start analyzing resumes!

> For production, run `npm run build` and only the Laravel server is needed.

---

## 🔐 Security

- The Gemini API key is stored exclusively in Laravel's `.env` file
- The React frontend **never** touches the API key directly
- All AI requests are proxied through authenticated Laravel controller endpoints
- CSRF protection is enforced on all POST requests
- Admin routes are protected via Laravel Breeze `auth` middleware

---

## 📁 Project Structure

```
├── app/
│   ├── Http/Controllers/
│   │   ├── ResumeAnalysisController.php   # AI analysis + improve endpoints
│   │   └── FieldOfWorkController.php      # Admin CRUD for industries
│   └── Models/
│       ├── ResumeAnalysis.php
│       └── FieldOfWork.php
├── resources/
│   ├── js/react/                          # React SPA
│   │   ├── App.tsx                        # Main app with scroll animations
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── ResumeUpload.tsx
│   │   │   ├── AnalysisDashboard.tsx
│   │   │   └── ResumeEditor.tsx
│   │   └── services/
│   │       └── gemini.ts                  # Secure fetch bridge to Laravel
│   └── views/
│       └── upload.blade.php               # React mount point
├── routes/web.php
├── vite.config.js
└── tsconfig.json
```

---

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `test@example.com` | `password` |

Admin panel: **http://localhost:8000/admin/fields**

---

## 📄 License

This project is open-sourced for educational purposes.
