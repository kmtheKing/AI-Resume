import { CheckCircle2, Crown, ArrowRight, Sparkles } from 'lucide-react';

interface PaymentSuccessProps {
  onReturn: () => void;
}

export function PaymentSuccess({ onReturn }: PaymentSuccessProps) {
  return (
    <div className="max-w-xl mx-auto text-center space-y-10 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Success Icon */}
      <div className="relative mx-auto w-28 h-28">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
        <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-500/30">
          <CheckCircle2 className="h-14 w-14 text-white" />
        </div>
      </div>

      {/* Text */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] font-display">Payment Confirmed!</h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
          Welcome to <span className="text-[var(--color-accent)] font-semibold">Pro</span>! Your account is now upgraded. Premium templates are unlocked, and advanced AI improvement features are now available.
        </p>
      </div>

      {/* Unlocked Preview Illustration */}
      <div className="relative mx-auto max-w-sm">
        <div className="rounded-2xl border border-emerald-500/30 bg-[var(--color-dark-card)] p-8 shadow-2xl shadow-emerald-500/10">
          {/* Mini resume preview */}
          <div className="space-y-3 text-left">
            <div className="h-4 w-3/4 rounded-full bg-[var(--color-text-primary)]/20" />
            <div className="h-3 w-1/2 rounded-full bg-[var(--color-accent)]/30" />
            <div className="h-px bg-[var(--color-dark-border)] my-3" />
            <div className="h-3 w-full rounded-full bg-[var(--color-text-muted)]/20" />
            <div className="h-3 w-5/6 rounded-full bg-[var(--color-text-muted)]/20" />
            <div className="h-3 w-4/6 rounded-full bg-[var(--color-text-muted)]/20" />
            <div className="h-px bg-[var(--color-dark-border)] my-3" />
            <div className="h-3 w-full rounded-full bg-[var(--color-text-muted)]/20" />
            <div className="h-3 w-3/4 rounded-full bg-[var(--color-text-muted)]/20" />
          </div>
          
          {/* Unlocked badge */}
          <div className="absolute -top-3 -right-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-xs font-bold shadow-lg">
            <Crown className="h-3.5 w-3.5" /> Unlocked Pro
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onReturn}
        className="flex items-center gap-3 mx-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02]"
      >
        <Sparkles className="h-5 w-5" />
        Return to Editor with Premium Tools
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}
