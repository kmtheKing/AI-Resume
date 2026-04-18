<x-guest-layout pageTitle="Sign In">
    <!-- Session Status -->
    @if (session('status'))
        <div class="alert-success">{{ session('status') }}</div>
    @endif

    <!-- Validation Errors -->
    @if ($errors->any())
        <div class="alert-error">
            @foreach ($errors->all() as $error)
                <div>{{ $error }}</div>
            @endforeach
        </div>
    @endif

    <div class="card-header">
        <h1 class="card-title">Welcome back</h1>
        <p class="card-subtitle">Sign in to download and manage your AI-optimized resume</p>
    </div>

    <form method="POST" action="{{ route('login') }}" id="form-login">
        @csrf

        <div class="form-group">
            <label class="form-label" for="email">Email address</label>
            <input
                id="email"
                type="email"
                name="email"
                class="form-input"
                value="{{ old('email') }}"
                placeholder="you@example.com"
                required
                autofocus
                autocomplete="username"
            />
            @error('email')
                <p class="form-error">{{ $message }}</p>
            @enderror
        </div>

        <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input
                id="password"
                type="password"
                name="password"
                class="form-input"
                placeholder="••••••••"
                required
                autocomplete="current-password"
            />
            @error('password')
                <p class="form-error">{{ $message }}</p>
            @enderror
        </div>

        <div class="form-row">
            <label class="checkbox-label">
                <input type="checkbox" name="remember" id="remember_me">
                Remember me
            </label>
            @if (Route::has('password.request'))
                <a href="{{ route('password.request') }}" class="forgot-link">Forgot password?</a>
            @endif
        </div>

        <button type="submit" class="btn-primary" id="btn-submit-login">
            Sign In →
        </button>
    </form>

    <div class="auth-footer">
        Don't have an account? <a href="{{ route('register') }}">Create one free</a>
    </div>
</x-guest-layout>
