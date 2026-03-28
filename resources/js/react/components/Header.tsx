
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-dark-border)] bg-[var(--color-dark-bg)]/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <span className="text-2xl font-bold tracking-tight font-display text-[var(--color-text-primary)]">
            Resume<span className="gradient-text">AI</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200">How it works</a>
          <a href="#pricing" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200">Pricing</a>
          <a href="#templates" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200">Templates</a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="/login" className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-bold text-white hover:bg-[var(--color-accent-muted)] transition-all duration-200 shadow-lg shadow-[var(--color-accent-glow)]">
            Log in
          </a>
        </div>
      </div>
    </header>
  );
}
