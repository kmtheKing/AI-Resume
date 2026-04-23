import { Sparkles, Crown, Zap, Check, Star, BookOpen } from 'lucide-react';

interface PricingPageProps {
  onSelectPlan: (tier: 'starter' | 'pro' | 'elite') => void;
  onBack: () => void;
}

export function PricingPage({ onSelectPlan, onBack }: PricingPageProps) {
  const plans = [
    {
      id: 'starter' as const,
      name: 'Starter',
      price: '$2',
      period: '/one-time',
      tagline: 'Get your score. Know where you stand.',
      icon: Star,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-400/10',
      accentBorder: 'border-[var(--color-dark-border)]',
      featured: false,
      features: [
        { text: 'Full AI Resume Analysis', included: true },
        { text: 'ATS Compatibility Score', included: true },
        { text: 'Section-by-section Breakdown', included: true },
        { text: 'Basic Editor Access', included: true },
        { text: '1 Resume Download (Classic Template)', included: true },
        { text: 'Multiple Resumes', included: false },
        { text: 'Premium Templates', included: false },
        { text: 'Interview Prep Module', included: false },
      ],
      cta: 'Get Score — $2',
      ctaClass: 'bg-[var(--color-dark-hover)] border border-[var(--color-dark-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-dark-border)]',
    },
    {
      id: 'pro' as const,
      name: 'Pro',
      price: '$5',
      period: '/one-time',
      tagline: 'Build more. Stand out more.',
      icon: Crown,
      iconColor: 'text-white',
      iconBg: 'bg-white/10',
      accentBorder: 'border-[#818cf8]',
      featured: true,
      features: [
        { text: 'Everything in Starter', included: true },
        { text: 'Create Unlimited Resumes', included: true },
        { text: '3 Premium Templates (Modern, Executive, Creative)', included: true },
        { text: 'AI Resume Polishing', included: true },
        { text: 'Auto-generated Project Descriptions', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Interview Prep Module', included: false },
      ],
      cta: 'Go Pro — $5',
      ctaClass: 'bg-white text-[var(--color-accent-muted)] hover:bg-indigo-50',
    },
    {
      id: 'elite' as const,
      name: 'Elite',
      price: '$7',
      period: '/one-time',
      tagline: 'Ace the interview. Land the job.',
      icon: BookOpen,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-400/10',
      accentBorder: 'border-amber-500/40',
      featured: false,
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Interview Prep Module', included: true },
        { text: 'Field-specific Question Bank', included: true },
        { text: 'AI Mock Interview Insights', included: true },
        { text: 'Salary Negotiation Tips', included: true },
        { text: 'Career Coaching AI', included: true },
      ],
      cta: 'Get Elite — $7',
      ctaClass: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600',
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] font-display">Choose Your Plan</h1>
        <p className="text-[var(--color-text-muted)] text-lg">Unlock the full power of AI-driven resume optimization. Simple one-time pricing — no subscriptions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-7 border flex flex-col hover-lift relative ${plan.featured
              ? 'bg-gradient-to-b from-[#6366f1] to-[#4f46e5] shadow-2xl shadow-[var(--color-accent-glow)] md:-translate-y-4'
              : 'bg-[var(--color-dark-card)]'
            } ${plan.accentBorder}`}
          >
            {plan.featured && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#a78bfa] text-[var(--color-dark-bg)] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Crown className="h-3 w-3" /> Most Popular
              </div>
            )}

            <div className={`h-11 w-11 rounded-xl ${plan.iconBg} flex items-center justify-center mb-4`}>
              <plan.icon className={`h-5 w-5 ${plan.iconColor}`} />
            </div>

            <h3 className={`font-bold text-2xl mb-1 ${plan.featured ? 'text-white' : 'text-[var(--color-text-primary)]'}`}>
              {plan.name}
            </h3>
            <p className={`text-sm mb-4 ${plan.featured ? 'text-indigo-200' : 'text-[var(--color-text-muted)]'}`}>{plan.tagline}</p>
            <div className={`text-4xl font-display font-bold mb-6 ${plan.featured ? 'text-white' : 'text-[var(--color-text-primary)]'}`}>
              {plan.price}
              <span className={`text-base font-normal ml-1 ${plan.featured ? 'text-indigo-200' : 'text-[var(--color-text-muted)]'}`}>
                {plan.period}
              </span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className={`flex items-start gap-3 text-sm ${plan.featured ? 'text-indigo-100' : 'text-[var(--color-text-secondary)]'}`}>
                  {feature.included ? (
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <span className="h-4 w-4 shrink-0 mt-0.5 flex items-center justify-center">
                      <span className={`block w-3 h-px ${plan.featured ? 'bg-indigo-300/40' : 'bg-[var(--color-dark-border)]'}`} />
                    </span>
                  )}
                  <span className={!feature.included ? 'opacity-40' : ''}>{feature.text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelectPlan(plan.id)}
              className={`w-full py-3.5 rounded-full font-bold transition-all text-base shadow-lg ${plan.ctaClass}`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-[var(--color-text-muted)] pb-4">
        All plans include a 100% satisfaction guarantee. Questions? <span className="text-[var(--color-accent)] cursor-pointer hover:underline">Contact us</span>
      </p>
    </div>
  );
}
