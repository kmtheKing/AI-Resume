import { useState } from 'react';
import { CreditCard, Lock, AlertTriangle } from 'lucide-react';

interface PaymentFormProps {
  onComplete: () => void;
  onBack: () => void;
}

export function PaymentForm({ onComplete, onBack }: PaymentFormProps) {
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onComplete();
    }, 2000);
  };

  return (
    <div className="max-w-lg mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Test mode banner */}
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <p className="text-sm font-medium">This is a <strong>TEST PAYMENT</strong> — no real charges will occur.</p>
      </div>

      <div className="rounded-3xl bg-[var(--color-dark-card)] border border-amber-500/30 p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] font-display">Pro Upgrade</h2>
            <p className="text-sm text-[var(--color-text-muted)]">$15.00/month</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Cardholder Name</label>
            <input
              type="text"
              defaultValue="Moayed Elshafia"
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] text-[var(--color-text-primary)] focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Card Number</label>
            <input
              type="text"
              defaultValue="4242 4242 4242 4242"
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] text-[var(--color-text-primary)] focus:border-amber-500 focus:outline-none transition-colors font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">CVC</label>
              <input
                type="text"
                defaultValue="123"
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] text-[var(--color-text-primary)] focus:border-amber-500 focus:outline-none transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Zip Code</label>
              <input
                type="text"
                defaultValue="90210"
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] text-[var(--color-text-primary)] focus:border-amber-500 focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Confirm & Complete (Dummy Payment - TEST ONLY)
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3 rounded-xl border border-[var(--color-dark-border)] text-[var(--color-text-muted)] font-medium hover:text-[var(--color-text-primary)] hover:bg-[var(--color-dark-hover)] transition-all"
            >
              Back to Pricing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
