<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>AI-Resume | Future of Hiring</title>
        <meta name="description" content="Custom AI-powered resume solutions. Delivering impressive resumes today, built with AI that empowers your career tomorrow.">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Styles -->
        <link href="{{ asset('css/app.css') }}" rel="stylesheet" />
    </head>
    <body class="antialiased">
        <div class="app-container">
            <!-- Navigation -->
            <nav class="navbar">
                <div class="brand">
                    <div class="logo-icon">
                        <!-- Custom Icon -->
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <span class="brand-name">AI Resume Analyzer</span>
                </div>
                <div class="nav-links">
                    <a href="#services" class="nav-item">Services <span class="chevron"></span></a>
                    <a href="#about" class="nav-item">About us</a>
                    <a href="#contact" class="nav-item">Contact us</a>
                </div>

            </nav>

            <!-- Main Hero Section -->
            <main class="hero-section">
                <div class="hero-content">
                    <h1 class="hero-title">Custom AI-powered<br>resume solutions</h1>
                    <p class="hero-subtitle">
                        Delivering impressive resumes today, built with AI<br>
                        that empowers your career tomorrow.
                    </p>
                    <a href="{{ route('upload') }}" id="btn-open-modal" class="btn-glass" style="text-decoration: none;">
                        Upload your resume or CV
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </a>
                </div>

                <div class="hero-visual">
                    <img src="{{ asset('images/dashboard.png') }}" alt="AI Resume Analyzer Interface dashboard" class="laptop-img">
                </div>
            </main>
            
            <!-- Added Sections for Navigation functionality -->
            <section id="services" style="padding: 5rem 2rem; max-width: 1100px; margin: 0 auto; text-align: center; position: relative; z-index: 10;">
                <h2 style="font-size: 2.5rem; border-bottom: 1px solid var(--glass-border); display: inline-block; padding-bottom: 0.5rem; margin-bottom: 3rem; color: var(--text-primary);">Our Services</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                    <div class="service-card" style="background: rgba(255,255,255,0.03); padding: 2.5rem; border-radius: 20px; border: 1px solid var(--glass-border); transition: transform 0.3s;">
                        <h3 style="font-size: 1.5rem; color: var(--accent-color); margin-bottom: 1rem;">Intelligent Parsing</h3>
                        <p style="color: var(--text-secondary); line-height: 1.6;">We deeply analyze your structure, phrasing, and keyword density using Gemini 1.5 Pro to uncover hidden weaknesses.</p>
                    </div>
                    <div class="service-card" style="background: rgba(255,255,255,0.03); padding: 2.5rem; border-radius: 20px; border: 1px solid var(--glass-border); transition: transform 0.3s;">
                        <h3 style="font-size: 1.5rem; color: var(--accent-color); margin-bottom: 1rem;">Industry Standardized</h3>
                        <p style="color: var(--text-secondary); line-height: 1.6;">Your resume isn't judged in a vacuum. We dynamically cross-reference it with the explicit needs of your target field.</p>
                    </div>
                    <div class="service-card" style="background: rgba(255,255,255,0.03); padding: 2.5rem; border-radius: 20px; border: 1px solid var(--glass-border); transition: transform 0.3s;">
                        <h3 style="font-size: 1.5rem; color: var(--accent-color); margin-bottom: 1rem;">Instant Results</h3>
                        <p style="color: var(--text-secondary); line-height: 1.6;">Upload a PDF, specify your sector, and receive a comprehensive score, strengths, and actionable fixes within seconds.</p>
                    </div>
                </div>
            </section>
            
            <section id="about" style="padding: 5rem 2rem; max-width: 1100px; margin: 0 auto; text-align: center; position: relative; z-index: 10;">
                <h2 style="font-size: 2.5rem; border-bottom: 1px solid var(--glass-border); display: inline-block; padding-bottom: 0.5rem; margin-bottom: 2rem; color: var(--text-primary);">About Us</h2>
                <p style="color: var(--text-secondary); max-width: 800px; margin: 0 auto; font-size: 1.15rem; line-height: 1.8;">
                    Welcome to the <strong>AI Resume Analyzer</strong>. Our mission is to democratize career counseling by converting subjective resume advice into objective, machine-verified data. Built carefully to protect your sensitive information, our tool parses your credentials and immediately compares them against our secure industry guidelines.
                </p>
            </section>

            <section id="contact" style="padding: 5rem 2rem; max-width: 1100px; margin: 0 auto; text-align: center; position: relative; z-index: 10;">
                <h2 style="font-size: 2.5rem; border-bottom: 1px solid var(--glass-border); display: inline-block; padding-bottom: 0.5rem; margin-bottom: 2rem; color: var(--text-primary);">Contact</h2>
                <p style="color: var(--text-secondary);">Need a custom API deployment or specialized industry tuning? <br><a href="mailto:support@airesume.local" style="color: var(--accent-color); text-decoration: none; font-weight: bold; margin-top: 10px; display: inline-block;">Email Support Team</a></p>
            </section>
        </div>
    </body>
</html>
