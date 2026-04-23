<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Resume Analyzer — Dashboard</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=outfit:400,600,700,800&family=inter:400,500,600,700&display=swap" rel="stylesheet" />

    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --bg:       #0a0a0a;
            --surface:  #111111;
            --card:     #161616;
            --border:   #222222;
            --red:      #e11d48;
            --red-glow: rgba(225, 29, 72, 0.15);
            --text:     #f1f5f9;
            --muted:    #64748b;
            --accent:   #6366f1;
        }

        html, body { min-height: 100%; background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; }

        /* ── Navbar ── */
        .dash-nav {
            position: sticky; top: 0; z-index: 50;
            background: rgba(10,10,10,0.85);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border);
            padding: 0 1.5rem;
            height: 64px;
            display: flex; align-items: center; justify-content: space-between;
        }
        .dash-nav .brand {
            font-family: 'Outfit', sans-serif;
            font-weight: 800; font-size: 1.25rem;
            color: var(--text); text-decoration: none;
        }
        .dash-nav .brand span { color: var(--red); }
        .nav-actions { display: flex; align-items: center; gap: 1rem; }
        .nav-btn {
            display: inline-flex; align-items: center; gap: 0.4rem;
            padding: 0.45rem 1rem; border-radius: 999px;
            font-size: 0.82rem; font-weight: 600;
            border: 1px solid var(--border);
            color: var(--muted); background: transparent;
            text-decoration: none; transition: all 0.2s;
            cursor: pointer;
        }
        .nav-btn:hover { color: var(--text); border-color: #444; background: #1a1a1a; }
        .nav-btn.red { background: var(--red); border-color: var(--red); color: #fff; }
        .nav-btn.red:hover { background: #c0173e; }

        /* ── Layout ── */
        .dash-main { max-width: 1100px; margin: 0 auto; padding: 2.5rem 1.5rem; }

        /* ── Welcome banner ── */
        .welcome-banner {
            background: linear-gradient(135deg, #1a0a10 0%, #0f0a1a 100%);
            border: 1px solid rgba(225,29,72,0.2);
            border-radius: 20px;
            padding: 2rem 2.5rem;
            margin-bottom: 2rem;
            display: flex; align-items: center; justify-content: space-between;
            flex-wrap: wrap; gap: 1rem;
            position: relative; overflow: hidden;
        }
        .welcome-banner::before {
            content: '';
            position: absolute; inset: 0;
            background: radial-gradient(ellipse 60% 80% at 90% 50%, rgba(225,29,72,0.08) 0%, transparent 70%);
            pointer-events: none;
        }
        .welcome-title { font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 800; }
        .welcome-title span { color: var(--red); }
        .welcome-sub { color: var(--muted); font-size: 0.9rem; margin-top: 0.3rem; }
        .welcome-cta {
            display: inline-flex; align-items: center; gap: 0.5rem;
            padding: 0.7rem 1.4rem; border-radius: 999px;
            background: var(--red); color: #fff; font-weight: 700; font-size: 0.9rem;
            text-decoration: none; transition: background 0.2s; white-space: nowrap;
        }
        .welcome-cta:hover { background: #c0173e; }

        /* ── Stats row ── */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card {
            background: var(--card); border: 1px solid var(--border); border-radius: 16px;
            padding: 1.25rem 1.5rem;
        }
        .stat-label { font-size: 0.72rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem; }
        .stat-value { font-family: 'Outfit', sans-serif; font-size: 1.9rem; font-weight: 800; color: var(--text); }
        .stat-badge { font-size: 0.72rem; font-weight: 600; margin-top: 0.25rem; }
        .stat-badge.green { color: #34d399; }
        .stat-badge.red { color: var(--red); }

        /* ── Section headers ── */
        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
        .section-title { font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 700; color: var(--text); }
        .section-link { font-size: 0.82rem; color: var(--red); text-decoration: none; font-weight: 600; }
        .section-link:hover { text-decoration: underline; }

        /* ── Cards grid ── */
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2rem; }

        /* ── Resume card ── */
        .resume-card {
            background: var(--card); border: 1px solid var(--border); border-radius: 16px;
            padding: 1.25rem; display: flex; flex-direction: column; gap: 0.8rem;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .resume-card:hover { border-color: rgba(225,29,72,0.3); box-shadow: 0 0 20px var(--red-glow); }
        .rc-top { display: flex; align-items: center; gap: 0.75rem; }
        .rc-icon {
            width: 40px; height: 40px; border-radius: 10px;
            background: rgba(225,29,72,0.1); border: 1px solid rgba(225,29,72,0.2);
            display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;
        }
        .rc-name { font-weight: 700; font-size: 0.95rem; }
        .rc-date { font-size: 0.75rem; color: var(--muted); }
        .score-bar-wrap { height: 6px; background: #1e1e1e; border-radius: 99px; overflow: hidden; }
        .score-bar { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--red), #f97316); transition: width 1s ease; }
        .rc-footer { display: flex; align-items: center; justify-content: space-between; }
        .score-label { font-size: 0.78rem; color: var(--muted); }
        .score-val { font-weight: 700; font-size: 0.85rem; }
        .rc-action { font-size: 0.78rem; color: var(--red); font-weight: 600; text-decoration: none; }
        .rc-action:hover { text-decoration: underline; }

        /* empty state */
        .empty-card {
            background: var(--card); border: 1px dashed var(--border); border-radius: 16px;
            padding: 2.5rem; text-align: center; grid-column: 1/-1;
        }
        .empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .empty-title { font-weight: 700; margin-bottom: 0.4rem; }
        .empty-sub { font-size: 0.85rem; color: var(--muted); margin-bottom: 1.25rem; }

        /* ── Template quick-pick ── */
        .templates-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .tpl-card {
            background: var(--card); border: 1px solid var(--border); border-radius: 16px;
            overflow: hidden; cursor: pointer; transition: border-color 0.2s, transform 0.2s;
        }
        .tpl-card:hover { border-color: rgba(225,29,72,0.4); transform: translateY(-3px); }
        .tpl-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; object-position: top; opacity: 0.85; display: block; }
        .tpl-info { padding: 0.8rem; }
        .tpl-name { font-weight: 700; font-size: 0.85rem; }
        .tpl-tier { font-size: 0.7rem; color: var(--muted); }

        /* ── Tier badge ── */
        .tier-pill {
            display: inline-flex; align-items: center; gap: 0.35rem;
            padding: 0.3rem 0.85rem; border-radius: 999px;
            font-size: 0.75rem; font-weight: 700;
        }
        .tier-free { background: rgba(100,116,139,0.12); color: #94a3b8; border: 1px solid #334155; }
        .tier-starter { background: rgba(52,211,153,0.1); color: #34d399; border: 1px solid rgba(52,211,153,0.2); }
        .tier-pro { background: rgba(99,102,241,0.1); color: #818cf8; border: 1px solid rgba(99,102,241,0.2); }
        .tier-elite { background: rgba(245,158,11,0.1); color: #fbbf24; border: 1px solid rgba(245,158,11,0.2); }

        /* ── Quick links ── */
        .quick-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2.5rem; }
        .quick-card {
            background: var(--card); border: 1px solid var(--border); border-radius: 16px;
            padding: 1.2rem; display: flex; flex-direction: column; gap: 0.5rem;
            text-decoration: none; transition: border-color 0.2s, background 0.2s;
            cursor: pointer;
        }
        .quick-card:hover { border-color: rgba(225,29,72,0.3); background: #1a0a10; }
        .quick-icon { font-size: 1.5rem; }
        .quick-label { font-weight: 700; font-size: 0.88rem; color: var(--text); }
        .quick-sub { font-size: 0.75rem; color: var(--muted); }

        @media (max-width: 640px) {
            .welcome-banner { padding: 1.25rem 1.25rem; }
            .welcome-title { font-size: 1.25rem; }
            .dash-main { padding: 1.25rem 1rem; }
            .stat-value { font-size: 1.5rem; }
        }
    </style>
</head>
<body>

<!-- Navbar -->
<nav class="dash-nav">
    <a href="{{ route('home') }}" class="brand">Resume <span>Analyzer</span></a>
    <div class="nav-actions">
        <a href="{{ route('home') }}" class="nav-btn">🏠 Analyze Resume</a>
        <a href="{{ route('profile.edit') }}" class="nav-btn">⚙️ Profile</a>
        <form method="POST" action="{{ route('logout') }}" style="display:inline;">
            @csrf
            <button type="submit" class="nav-btn red">Sign Out</button>
        </form>
    </div>
</nav>

<main class="dash-main">

    <!-- Welcome Banner -->
    <div class="welcome-banner">
        <div>
            <div class="welcome-title">Welcome back, <span>{{ Auth::user()->name }}</span> 👋</div>
            <div class="welcome-sub">Your AI-powered resume command center. Let's land that job.</div>
        </div>
        <a href="{{ route('home') }}" class="welcome-cta">
            ✦ Analyze New Resume
        </a>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-label">Current Plan</div>
            <div style="margin-top: 0.5rem;">
                <span class="tier-pill tier-free">✦ Free</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Resumes Analyzed</div>
            <div class="stat-value">0</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Best ATS Score</div>
            <div class="stat-value">—</div>
            <div class="stat-badge red">No scans yet</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Member Since</div>
            <div style="font-size:0.95rem; font-weight:700; color:var(--text); margin-top: 0.3rem;">
                {{ Auth::user()->created_at->format('M Y') }}
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="section-header">
        <div class="section-title">Quick Actions</div>
    </div>
    <div class="quick-grid" style="margin-bottom:2rem;">
        <a href="{{ route('home') }}" class="quick-card">
            <div class="quick-icon">📄</div>
            <div class="quick-label">Upload Resume</div>
            <div class="quick-sub">Get your ATS score instantly</div>
        </a>
        <div class="quick-card" onclick="window.location.href='{{ route('home') }}#templates'">
            <div class="quick-icon">🎨</div>
            <div class="quick-label">Browse Templates</div>
            <div class="quick-sub">3 professional layouts</div>
        </div>
        <div class="quick-card" onclick="window.location.href='{{ route('home') }}#pricing'">
            <div class="quick-icon">⚡</div>
            <div class="quick-label">Upgrade Plan</div>
            <div class="quick-sub">Unlock premium features from $2</div>
        </div>
        <a href="{{ route('profile.edit') }}" class="quick-card">
            <div class="quick-icon">👤</div>
            <div class="quick-label">Edit Profile</div>
            <div class="quick-sub">Update your account info</div>
        </a>
    </div>

    <!-- Resume Templates -->
    <div class="section-header">
        <div class="section-title">Resume Templates</div>
        <a href="{{ route('home') }}#templates" class="section-link">View All →</a>
    </div>
    <div class="templates-row">
        @foreach ([
            ['Classic Professional', '/assets/template-classic.png', 'Free'],
            ['Modern Minimalist',    '/assets/template-modern.png',   'Pro'],
            ['Executive Pro',        '/assets/template-executive.png', 'Pro'],
        ] as $tpl)
        <div class="tpl-card" onclick="window.location.href='{{ route('home') }}'">
            <img src="{{ $tpl[1] }}" alt="{{ $tpl[0] }}" class="tpl-img" loading="lazy">
            <div class="tpl-info">
                <div class="tpl-name">{{ $tpl[0] }}</div>
                <div class="tpl-tier">{{ $tpl[2] === 'Free' ? '✓ Free' : '🔒 Pro' }}</div>
            </div>
        </div>
        @endforeach
    </div>

    <!-- Recent Resumes (empty state) -->
    <div class="section-header">
        <div class="section-title">Your Resumes</div>
    </div>
    <div class="cards-grid">
        <div class="empty-card">
            <div class="empty-icon">📋</div>
            <div class="empty-title">No resumes yet</div>
            <div class="empty-sub">Upload your first resume to see your analysis, score, and improvement suggestions here.</div>
            <a href="{{ route('home') }}" class="welcome-cta" style="display:inline-flex;">✦ Analyze Your First Resume</a>
        </div>
    </div>

    <!-- Upgrade CTA (only shown if free) -->
    <div style="background: linear-gradient(135deg, #0f0f1a 0%, #0a0a12 100%); border: 1px solid rgba(99,102,241,0.2); border-radius: 20px; padding: 2rem; text-align: center; margin-top: 1rem;">
        <div style="font-size: 1.75rem; margin-bottom: 0.75rem;">🚀</div>
        <div style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem;">Unlock the Full Experience</div>
        <p style="color: var(--muted); font-size: 0.9rem; max-width: 480px; margin: 0 auto 1.25rem;">
            Get your ATS score for $2 · Unlimited resumes + Premium Templates for $5 · Add Interview Prep for $7.
        </p>
        <a href="{{ route('home') }}#pricing" class="welcome-cta" style="display:inline-flex;">View Plans →</a>
    </div>

</main>

</body>
</html>
