<x-guest-layout pageTitle="Create Account">
    <!-- Validation Errors -->
    @if ($errors->any())
        <div class="alert-error">
            @foreach ($errors->all() as $error)
                <div>{{ $error }}</div>
            @endforeach
        </div>
    @endif

    <div class="card-header">
        <h1 class="card-title">Create account</h1>
        <p class="card-subtitle">Join thousands of professionals optimizing their resumes with AI</p>
    </div>

    <form method="POST" action="{{ route('register') }}" id="form-register">
        @csrf

        <div class="form-group">
            <label class="form-label" for="name">Full name</label>
            <input
                id="name"
                type="text"
                name="name"
                class="form-input"
                value="{{ old('name') }}"
                placeholder="John Smith"
                required
                autofocus
                autocomplete="name"
            />
            @error('name')
                <p class="form-error">{{ $message }}</p>
            @enderror
        </div>

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
                placeholder="Min. 8 characters"
                required
                autocomplete="new-password"
            />
            @error('password')
                <p class="form-error">{{ $message }}</p>
            @enderror
        </div>

        <div class="form-group" style="margin-bottom: 1.75rem;">
            <label class="form-label" for="password_confirmation">Confirm password</label>
            <input
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                class="form-input"
                placeholder="Re-enter password"
                required
                autocomplete="new-password"
            />
        </div>

        <button type="submit" class="btn-primary" id="btn-submit-register">
            Create Account →
        </button>
    </form>

    <div class="auth-footer">
        Already have an account? <a href="{{ route('login') }}">Sign in</a>
    </div>
</x-guest-layout>
