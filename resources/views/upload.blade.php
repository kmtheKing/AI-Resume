<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Upload Resume | AI Analyzer</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=Outfit:300,400,500,600,700&family=Inter:300,400,500,600,700&display=swap" rel="stylesheet" />
        
        @viteReactRefresh
        @vite(['resources/js/react/index.css', 'resources/js/react/main.tsx'])
        
        <script>
            // Injecting backend routing & csrf tokens into javascript context securely
            window.AppConfig = {
                csrfToken: "{{ csrf_token() }}",
                routes: {
                    analyze: "{{ route('resume.analyze') }}",
                    home: "{{ route('home') }}",
                    improve: "/api/resume/improve",
                    login: "{{ route('login') }}",
                    register: "{{ route('register') }}"
                },
                isAuthenticated: {{ auth()->check() ? 'true' : 'false' }},
                user: @json(auth()->check() ? ['name' => auth()->user()->name, 'avatar' => auth()->user()->avatar] : null),
                fieldsOfWork: @json($fields)
            };
        </script>
    </head>
    <body class="antialiased">
        <div id="root"></div>
    </body>
</html>
