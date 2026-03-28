# AI Resume Analyzer

An advanced, full-stack AI Resume Analyzer powered by Google Gemini, Laravel, and React.

This application allows users to upload their resumes (PDF, DOCX, TXT) and select their target field of work. The system parses the document text securely on the backend, feeds it alongside specialized industry prompts into the Gemini AI, and returns a detailed scoring and improvement matrix to a stunning React front-end application.

## 🚀 Features
- **Intelligent Text Extraction**: Uses `smalot/pdfparser` directly in PHP to read native PDF texts securely.
- **Dynamic Field Selection**: Tailor the AI's analysis strictly to your chosen industry requirements.
- **ATS Compatibility Scoring**: Generates a generic score to guess how well Applicant Tracking Systems will read your resume.
- **Interactive AI Editor**: Highlight specific weak points on your resume and ask the backend to "Improve with Action Verbs" in real-time.
- **Stunning UI**: A highly interactive Single Page Application powered by Vite, React, Framer Motion, and Tailwind CSS v4.
- **Secure Architecture**: API keys are securely hidden in the Laravel backend; the React frontend interacts strictly through authenticated endpoint bridges.

## 🛠️ Technology Stack
- **Backend Framework**: Laravel 11.x
- **Frontend library**: React (via `@vitejs/plugin-react`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Database**: MySQL (via Laravel Eloquent ORM)
- **AI Integration**: Google Gemini API (`generativelanguage.googleapis.com`)
- **PDF Extraction**: `smalot/pdfparser`
- **Compiler**: Vite 8.x

---

## 💻 Installation & Setup

### 1. Requirements
- PHP 8.2 or higher
- Composer
- Node.js (v18 or higher) and NPM
- MySQL database (e.g. XAMPP, Herd, Valet)

### 2. Clone the Repository
```bash
git clone <repository_url>
cd AI-Resume/laravel
```

### 3. Install Dependencies
Install PHP dependencies via Composer:
```bash
composer install
```
Install Javascript dependencies via NPM:
```bash
npm install
```

### 4. Environment Variables
Copy the `.env.example` file and configure your database and API keys:
```bash
cp .env.example .env
```
Ensure you generate an app key:
```bash
php artisan key:generate
```

Open `.env` and configure:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=root
DB_PASSWORD=

# Make sure to grab an API key from Google AI Studio
GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. Database Setup
Run migrations to set up the necessary tables, and run the seeder to populate the `Field of Work` tags:
```bash
php artisan migrate --seed
```
*(If you do not have a seeder, simply register an admin account and add them via the `/admin/fields` route).*

### 6. Linking Storage
The backend actively stores and tracks analyzed resumes. Ensure the public disk is linked:
```bash
php artisan storage:link
```

### 7. Running the Application
You will need two terminal tabs open simultaneously for the application to function fully during development.

**Terminal 1 (Laravel Backend):**
```bash
php artisan serve
```

**Terminal 2 (Vite Server for React):**
```bash
npm run dev
```

Visit `http://localhost:8000` to start using your AI Resume Analyzer!

---

## 🔒 Security Notice
**Do not** put your Google Gemini API key into any Javascript or React configuration variables. This application is explicitly designed to keep the API key safe in Laravel's `.env`, bridging API calls through authenticated `/analyze` routing.
