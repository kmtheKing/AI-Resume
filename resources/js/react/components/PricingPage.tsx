import { Sparkles, Crown, Zap, Check } from 'lucide-react';

interface PricingPageProps {
  onSelectPro: () => void;
  onBack: () => void;
}

export function PricingPage({ onSelectPro, onBack }: PricingPageProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] font-display">Choose Your Plan</h1>
        <p className="text-[var(--color-text-muted)] text-lg">Unlock the full power of AI-driven resume optimization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Basic */}
        <div className="rounded-3xl bg-[var(--color-dark-card)] p-8 border border-[var(--color-dark-border)] flex flex-col hover-lift">
          <h3 className="font-bold text-2xl mb-2 text-[var(--color-text-primary)]">Basic</h3>
          <div className="text-4xl font-display font-bold mb-6 text-[var(--color-text-primary)]">$0<span className="text-lg text-[var(--color-text-muted)] font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1 text-[var(--color-text-secondary)]">
            <li className="flex items-center gap-3"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> AI Resume Analysis</li>
            <li className="flex items-center gap-3"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> 1 ATS Score Check</li>
            <li className="flex items-center gap-3"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Basic Editor Access</li>
          </ul>
          <button 
            onClick={onBack}
            className="w-full py-3 rounded-full bg-[var(--color-dark-hover)] border border-[var(--color-dark-border)] font-bold hover:bg-[var(--color-dark-border)] transition-colors text-[var(--color-text-primary)]"
          >
            Current Plan
          </button>
        </div>

        {/* Pro — Highlighted */}
        <div className="rounded-3xl bg-gradient-to-b from-[#6366f1] to-[#4f46e5] p-8 border border-[#818cf8] shadow-2xl shadow-[var(--color-accent-glow)] flex flex-col relative transform md:-translate-y-4 hover-lift">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#a78bfa] text-[var(--color-dark-bg)] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
            <Crown className="h-3 w-3" /> Recommended
          </div>
          <h3 className="font-bold text-2xl mb-2 text-white">Pro</h3>
          <div className="text-4xl font-display font-bold mb-6 text-white">$15<span className="text-lg text-indigo-200 font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1 text-indigo-100">
            <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-white shrink-0" /> AI Resume Polishing</li>
            <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-white shrink-0" /> Auto-generated Project Descriptions</li>
            <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-white shrink-0" /> Access to All Premium Templates</li>
            <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-white shrink-0" /> Unlimited AI Checks</li>
            <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-white shrink-0" /> Priority Support</li>
          </ul>
          <button 
            onClick={onSelectPro}
            className="w-full py-3.5 rounded-full bg-white text-[var(--color-accent-muted)] font-bold hover:bg-indigo-50 transition-all text-lg shadow-lg"
          >
            Upgrade to Pro
          </button>
        </div>

        {/* Mastery */}
        <div className="rounded-3xl bg-[var(--color-dark-card)] p-8 border border-[var(--color-dark-border)] flex flex-col hover-lift">
          <h3 className="font-bold text-2xl mb-2 text-[var(--color-text-primary)]">Mastery</h3>
          <div className="text-4xl font-display font-bold mb-6 text-[var(--color-text-primary)]">$49<span className="text-lg text-[var(--color-text-muted)] font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1 text-[var(--color-text-secondary)]">
            <li className="flex items-center gap-3"><Zap className="h-4 w-4 text-amber-400 shrink-0" /> Everything in Pro</li>
            <li className="flex items-center gap-3"><Zap className="h-4 w-4 text-amber-400 shrink-0" /> Career Coaching AI</li>
            <li className="flex items-center gap-3"><Zap className="h-4 w-4 text-amber-400 shrink-0" /> Custom Resume Branding</li>
            <li className="flex items-center gap-3"><Zap className="h-4 w-4 text-amber-400 shrink-0" /> Interview Prep Module</li>
          </ul>
          <button className="w-full py-3 rounded-full bg-[var(--color-dark-hover)] border border-[var(--color-dark-border)] font-bold hover:bg-[var(--color-dark-border)] transition-colors text-[var(--color-text-primary)]">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}
