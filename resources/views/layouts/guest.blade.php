<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'ResumeAI') }} — {{ $pageTitle ?? 'Sign In' }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=outfit:300,400,500,600,700,800,900&family=inter:300,400,500,600,700&display=swap" rel="stylesheet" />

    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --bg:          #0a0a0a;
            --surface:     #111111;
            --card:        #161616;
            --border:      #222222;
            --border-lit:  #333333;
            --red:         #e11d48;
            --red-dark:    #9f1239;
            --red-glow:    rgba(225, 29, 72, 0.18);
            --red-glow2:   rgba(225, 29, 72, 0.06);
            --text:        #f1f5f9;
            --muted:       #64748b;
            --subtle:      #1e1e1e;
        }

        html, body { height: 100%; }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }

        /* ── Animated mesh background ── */
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background:
                radial-gradient(ellipse 80% 60% at 15% 20%, rgba(225, 29, 72, 0.08) 0%, transparent 60%),
                radial-gradient(ellipse 60% 80% at 85% 75%, rgba(180, 0, 40, 0.06) 0%, transparent 55%),
                radial-gradient(ellipse 40% 40% at 50% 0%,   rgba(225, 29, 72, 0.04) 0%, transparent 60%);
            pointer-events: none;
            z-index: 0;
        }

        /* ── Grid lines ── */
        body::after {
            content: '';
            position: fixed;
            inset: 0;
            background-image:
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 60px 60px;
            pointer-events: none;
            z-index: 0;
        }

        /* ── Page layout ── */
        .auth-wrapper {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 480px;
            padding: 1.5rem;
        }

        /* ── Logo / Brand ── */
        .brand {
            text-align: center;
            margin-bottom: 2.5rem;
        }
        .brand-link {
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            text-decoration: none;
        }
        .brand-icon {
            width: 42px;
            height: 42px;
            background: linear-gradient(135deg, var(--red), #ff6b6b);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: 0 0 24px var(--red-glow);
        }
        .brand-name {
            font-family: 'Outfit', sans-serif;
            font-weight: 800;
            font-size: 1.5rem;
            letter-spacing: -0.03em;
            color: var(--text);
        }
        .brand-name span { color: var(--red); }

        /* ── Card ── */
        .auth-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 2.5rem;
            position: relative;
            overflow: hidden;
            box-shadow:
                0 0 0 1px var(--border),
                0 25px 50px rgba(0,0,0,0.5),
                0 0 60px var(--red-glow2);
        }
        .auth-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--red), transparent);
            opacity: 0.6;
        }

        /* ── Card header ── */
        .card-header {
            margin-bottom: 2rem;
        }
        .card-title {
            font-family: 'Outfit', sans-serif;
            font-size: 1.75rem;
            font-weight: 800;
            letter-spacing: -0.03em;
            margin-bottom: 0.4rem;
        }
        .card-subtitle {
            font-size: 0.875rem;
            color: var(--muted);
        }

        /* ── Google button ── */
        .btn-google {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            width: 100%;
            padding: 0.85rem 1.25rem;
            background: var(--subtle);
            border: 1px solid var(--border-lit);
            border-radius: 14px;
            color: var(--text);
            font-size: 0.9rem;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: 'Inter', sans-serif;
        }
        .btn-google:hover {
            background: #252525;
            border-color: #444;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            transform: translateY(-1px);
        }
        .google-icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }

        /* ── Divider ── */
        .divider {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin: 1.5rem 0;
        }
        .divider-line {
            flex: 1;
            height: 1px;
            background: var(--border);
        }
        .divider-text {
            font-size: 0.75rem;
            color: var(--muted);
            font-weight: 500;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            white-space: nowrap;
        }

        /* ── Form elements ── */
        .form-group { margin-bottom: 1.25rem; }
        .form-label {
            display: block;
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--muted);
            margin-bottom: 0.4rem;
            letter-spacing: 0.03em;
            text-transform: uppercase;
        }
        .form-input {
            width: 100%;
            padding: 0.8rem 1rem;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            color: var(--text);
            font-size: 0.9rem;
            font-family: 'Inter', sans-serif;
            outline: none;
            transition: all 0.2s ease;
        }
        .form-input:focus {
            border-color: var(--red);
            box-shadow: 0 0 0 3px var(--red-glow);
        }
        .form-input::placeholder { color: var(--muted); }

        /* ── Remember + Forgot row ── */
        .form-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
        }
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.85rem;
            color: var(--muted);
            cursor: pointer;
        }
        .checkbox-label input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: var(--red);
            border-radius: 4px;
        }
        .forgot-link {
            font-size: 0.82rem;
            color: var(--red);
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.15s;
        }
        .forgot-link:hover { opacity: 0.8; }

        /* ── Primary button ── */
        .btn-primary {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            width: 100%;
            padding: 0.9rem 1.25rem;
            background: linear-gradient(135deg, var(--red), #c8003a);
            border: none;
            border-radius: 14px;
            color: #fff;
            font-size: 0.95rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.01em;
            box-shadow: 0 4px 20px var(--red-glow);
        }
        .btn-primary:hover {
            background: linear-gradient(135deg, #f43f5e, var(--red));
            transform: translateY(-1px);
            box-shadow: 0 8px 30px rgba(225,29,72,0.35);
        }
        .btn-primary:active { transform: translateY(0); }

        /* ── Footer link ── */
        .auth-footer {
            text-align: center;
            margin-top: 1.75rem;
            font-size: 0.85rem;
            color: var(--muted);
        }
        .auth-footer a {
            color: var(--red);
            font-weight: 600;
            text-decoration: none;
            transition: opacity 0.15s;
        }
        .auth-footer a:hover { opacity: 0.8; }

        /* ── Error messages ── */
        .form-error {
            font-size: 0.78rem;
            color: #f87171;
            margin-top: 0.35rem;
            display: flex;
            align-items: center;
            gap: 0.3rem;
        }
        .alert-error {
            background: rgba(239,68,68,0.1);
            border: 1px solid rgba(239,68,68,0.25);
            border-radius: 12px;
            padding: 0.85rem 1rem;
            margin-bottom: 1.25rem;
            font-size: 0.85rem;
            color: #f87171;
        }
        .alert-success {
            background: rgba(16,185,129,0.1);
            border: 1px solid rgba(16,185,129,0.25);
            border-radius: 12px;
            padding: 0.85rem 1rem;
            margin-bottom: 1.25rem;
            font-size: 0.85rem;
            color: #34d399;
        }

        /* ── Floating orbs ── */
        .orb {
            position: fixed;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.35;
            pointer-events: none;
            animation: float 8s ease-in-out infinite;
        }
        .orb-1 {
            width: 400px; height: 400px;
            background: var(--red);
            top: -150px; left: -150px;
            animation-delay: 0s;
            opacity: 0.08;
        }
        .orb-2 {
            width: 300px; height: 300px;
            background: #9f1239;
            bottom: -100px; right: -100px;
            animation-delay: 4s;
            opacity: 0.06;
        }
        @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50%       { transform: translate(20px, -20px) scale(1.05); }
        }

        /* ── Badge ── */
        .security-badge {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            margin-top: 1.5rem;
            font-size: 0.75rem;
            color: var(--muted);
        }
        .security-badge svg {
            color: var(--red);
        }
    </style>
</head>
<body>
    <!-- Floating orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>

    <div class="auth-wrapper">
        <!-- Brand -->
        <div class="brand">
            <a href="{{ route('home') }}" class="brand-link">
                <div class="brand-icon">✦</div>
                <span class="brand-name">Resume<span>AI</span></span>
            </a>
        </div>

        <!-- Card -->
        <div class="auth-card">
            {{ $slot }}
        </div>

        <!-- Security badge -->
        <div class="security-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            256-bit SSL Encryption · Your data is always safe
        </div>
    </div>
</body>
</html>
