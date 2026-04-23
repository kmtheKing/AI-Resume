
export function Header({ tier = 'none', onPricingClick }: { tier?: 'none' | 'starter' | 'pro' | 'elite'; onPricingClick?: () => void }) {
  const AppConfig = (window as any).AppConfig;
  const isAuthenticated = AppConfig?.isAuthenticated ?? false;
  const userName = AppConfig?.user?.name ?? 'User';

  const tierColors = {
    none: 'hidden',
    starter: 'bg-[var(--color-dark-border)] text-gray-300',
    pro: 'bg-[var(--color-accent)] text-white shadow-[0_0_10px_var(--color-accent-glow)]',
    elite: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.3)]',
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-dark-border)] bg-[var(--color-dark-bg)]/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold tracking-tight font-display text-[var(--color-text-primary)] hover:opacity-80 transition-opacity">
            Resume <span className="gradient-text">Analyzer</span>
          </a>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200">How it works</a>
          <button onClick={onPricingClick || (() => { window.location.hash = '#pricing'; })} className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200">Pricing</button>
          <a href="#templates" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200">Templates</a>
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">Hi, {userName.split(' ')[0]}</span>
                {tier !== 'none' && (
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tierColors[tier]}`}>
                    {tier}
                  </span>
                )}
              </div>
              <a href="/dashboard" className="text-sm font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors duration-200 border border-[var(--color-dark-border)] px-4 py-1.5 rounded-full">Dashboard</a>
            </div>
          ) : (
            <a href="/login" className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-bold text-white hover:bg-[var(--color-accent-muted)] transition-all duration-200 shadow-lg shadow-[var(--color-accent-glow)]">
              Log in
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

