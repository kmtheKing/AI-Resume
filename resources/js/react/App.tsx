/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ResumeUpload } from './components/ResumeUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ResumeEditor } from './components/ResumeEditor';
import { PricingPage } from './components/PricingPage';
import { PaymentForm } from './components/PaymentForm';
import { PaymentSuccess } from './components/PaymentSuccess';
import { analyzeResume, ResumeAnalysis } from './services/gemini';
import { Sparkles, ArrowLeft, FileText, Target, Zap, BookOpen, CheckCircle, Lock, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AppState = 'upload' | 'analyzing' | 'results' | 'editor' | 'pricing' | 'payment' | 'success' | 'interview';
type PlanTier = 'none' | 'starter' | 'pro' | 'elite';

/* Scroll-reveal hook */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const el = ref.current;
    if (el) {
      el.querySelectorAll('.scroll-reveal, .stagger-children').forEach((child) => {
        observer.observe(child);
      });
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}

/* Interview Prep Module */
function InterviewPrepModule({ field, onBack }: { field: string; onBack: () => void }) {
  const questions = [
    { category: 'Behavioral', q: 'Tell me about a time you faced a significant challenge. How did you overcome it?' },
    { category: 'Behavioral', q: 'Describe a situation where you had to work with a difficult team member.' },
    { category: 'Technical', q: `What are the most important skills for a ${field || 'professional'} in today's market?` },
    { category: 'Technical', q: 'Walk me through your most complex project and the decisions you made.' },
    { category: 'Situational', q: 'How would you prioritize multiple urgent tasks with tight deadlines?' },
    { category: 'Situational', q: 'If you discovered a major error in a deliverable close to deadline, what would you do?' },
    { category: 'Career', q: 'Where do you see yourself in 5 years within this industry?' },
    { category: 'Career', q: 'Why are you the best candidate for this specific role?' },
  ];

  const tips = [
    { title: 'Use STAR Method', desc: 'Situation → Task → Action → Result. Structure every behavioral answer this way.' },
    { title: 'Quantify Impact', desc: 'Mention numbers: "Reduced costs by 20%", "Led a team of 8", "Improved speed by 3x".' },
    { title: 'Research the Company', desc: 'Know their mission, recent news, and competitors. Reference them naturally.' },
    { title: 'Ask Smart Questions', desc: 'Prepare 3–5 thoughtful questions about the role, team culture, and growth paths.' },
  ];

  const categoryColors: Record<string, string> = {
    Behavioral: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Technical:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Situational:'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Career:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-[var(--color-dark-surface)] hover:bg-[var(--color-dark-hover)] border border-[var(--color-dark-border)] rounded-xl text-[var(--color-text-primary)] transition-all hover:-translate-x-1">
          <ArrowLeft className="h-4 w-4" /> AI Resume Editor
        </button>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold">
          <BookOpen className="h-4 w-4" /> Elite Feature — Interview Prep
        </div>
      </div>

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold font-display text-[var(--color-text-primary)]">Interview Preparation</h2>
        <p className="text-[var(--color-text-secondary)]">Tailored question bank and strategies for your field: <strong className="text-[var(--color-text-primary)]">{field || 'General Professional'}</strong></p>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tips.map((tip, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <h4 className="font-bold text-[var(--color-text-primary)]">{tip.title}</h4>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed pl-6">{tip.desc}</p>
          </div>
        ))}
      </div>

      {/* Questions */}
      <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-3xl p-6 md:p-8">
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Common Interview Questions</h3>
        <div className="space-y-4">
          {questions.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] hover:border-[var(--color-accent)]/30 transition-colors">
              <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${categoryColors[item.category]}`}>
                {item.category}
              </span>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{item.q}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Tips */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-6 md:p-8">
        <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
          <Star className="h-5 w-5" /> Salary Negotiation Tips
        </h3>
        <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
          <li className="flex gap-3"><span className="text-amber-400 font-bold shrink-0">→</span> Always let the employer name a number first. Silence is your ally.</li>
          <li className="flex gap-3"><span className="text-amber-400 font-bold shrink-0">→</span> Anchor high (10–15% above your target) and justify with market data.</li>
          <li className="flex gap-3"><span className="text-amber-400 font-bold shrink-0">→</span> Negotiate total comp: base, equity, bonuses, PTO, remote flexibility.</li>
          <li className="flex gap-3"><span className="text-amber-400 font-bold shrink-0">→</span> Never accept on the spot. Ask for 24–48 hours to review the offer.</li>
        </ul>
      </div>
    </div>
  );
}

/* Landing page pricing section (simplified) */
function LandingPricingSection({ onUpgrade }: { onUpgrade: () => void }) {
  const plans = [
    { name: 'Starter', price: '$2', desc: 'Resume Score + ATS Check', color: 'border-[var(--color-dark-border)]', badge: null },
    { name: 'Pro', price: '$5', desc: 'Unlimited Resumes + 3 Premium Templates', color: 'border-[var(--color-accent)]', badge: 'Popular' },
    { name: 'Elite', price: '$7', desc: 'Everything + Interview Prep Module', color: 'border-amber-500/30', badge: null },
  ];
  return (
    <section id="pricing" className="scroll-reveal py-20 bg-[var(--color-dark-surface)] rounded-[2rem] text-white px-6 md:px-16 border border-[var(--color-dark-border)]">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
        <h2 className="text-3xl font-bold font-display text-[var(--color-text-primary)]">Simple, transparent pricing</h2>
        <p className="text-[var(--color-text-muted)] text-lg">One-time payments. No subscriptions. No surprises.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger-children">
        {plans.map((p, i) => (
          <div key={i} className={`rounded-3xl bg-[var(--color-dark-card)] p-7 border flex flex-col hover-lift relative ${p.color}`}>
            {p.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {p.badge}
              </div>
            )}
            <div className="text-4xl font-display font-bold text-[var(--color-text-primary)] mb-2">{p.price}</div>
            <div className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{p.name}</div>
            <p className="text-sm text-[var(--color-text-muted)] mb-6 flex-1">{p.desc}</p>
            <button
              onClick={onUpgrade}
              className="w-full py-3 rounded-full bg-[var(--color-dark-hover)] border border-[var(--color-dark-border)] font-bold hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-white transition-all text-[var(--color-text-primary)] text-sm"
            >
              Get {p.name}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [state, setState] = useState<AppState>('upload');
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const AppConfig = (window as any).AppConfig;
  const [tier, setTier] = useState<PlanTier>(() => {
    // Priority: Database (AppConfig) -> LocalStorage -> 'none'
    if (AppConfig?.user?.tier && AppConfig.user.tier !== 'none') {
      return AppConfig.user.tier as PlanTier;
    }
    return (localStorage.getItem('ai_resume_tier') as PlanTier) || 'none';
  });
  const [previousState, setPreviousState] = useState<AppState>('upload');
  const [selectedTierForPayment, setSelectedTierForPayment] = useState<'starter' | 'pro' | 'elite'>('pro');
  const [resumeField, setResumeField] = useState('');
  const scrollRef = useScrollReveal();

  const isPremium = tier === 'pro' || tier === 'elite';
  const hasInterviewPrep = tier === 'elite';

  // Persist tier and update global theme color dynamically
  useEffect(() => {
    localStorage.setItem('ai_resume_tier', tier);
    
    const root = document.documentElement;
    if (tier === 'elite') {
      root.style.setProperty('--color-accent', '#f59e0b');
      root.style.setProperty('--color-accent-muted', '#d97706');
      root.style.setProperty('--color-accent-glow', 'rgba(245, 158, 11, 0.2)');
    } else {
      root.style.setProperty('--color-accent', '#e11d48');
      root.style.setProperty('--color-accent-muted', '#be123c');
      root.style.setProperty('--color-accent-glow', 'rgba(225, 29, 72, 0.2)');
    }
  }, [tier]);

  const goToPricing = () => {
    if (state !== 'pricing' && state !== 'payment' && state !== 'success') {
      setPreviousState(state);
    }
    setState('pricing');
  };

  const handleUpload = async (file: File, field: string) => {
    setState('analyzing');
    setResumeField(field);
    try {
      const responsePayload = await analyzeResume(file, field);
      setAnalysis(responsePayload.result);
      setResumeText(responsePayload.parsedText);
      setState('results');
    } catch (error: any) {
      console.error('Analysis failed:', error);
      setState('upload');
      alert(error.message || 'Failed to analyze resume. Please try again.');
    }
  };

  const handleSelectPlan = (planTier: 'starter' | 'pro' | 'elite') => {
    setSelectedTierForPayment(planTier);
    setState('payment');
  };

  const handlePaymentComplete = async (completedTier: 'starter' | 'pro' | 'elite') => {
    setTier(completedTier);
    
    // Save to backend if authenticated
    if (AppConfig?.isAuthenticated && AppConfig?.routes?.updateTier) {
      try {
        await fetch(AppConfig.routes.updateTier, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': AppConfig.csrfToken
          },
          body: JSON.stringify({ tier: completedTier })
        });
      } catch (e) {
        console.error('Failed to sync tier to backend', e);
      }
    }

    setState(previousState);
  };

  const templates = [
    { name: 'Classic Professional', desc: 'Clean, traditional layout perfect for corporate and finance roles.', image: '/assets/template-classic.png', tier: 'Free' },
    { name: 'Modern Minimalist', desc: 'Sleek sidebar design for tech, design, and marketing.', image: '/assets/template-modern.png', tier: 'Pro' },
    { name: 'Executive Pro', desc: 'Powerful, authoritative layout for senior and leadership roles.', image: '/assets/template-executive.png', tier: 'Pro' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)]">
      <Header tier={tier} onPricingClick={goToPricing} />

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        <AnimatePresence mode="wait">

          {/* LANDING PAGE */}
          {state === 'upload' && (
            <motion.div
              key="upload"
              ref={scrollRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-20"
            >
              <div className="text-center space-y-6 max-w-3xl mx-auto px-2">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-display leading-[1.1] text-[var(--color-text-primary)]">
                  Land your dream job with <span className="gradient-text">Resume Analyzer</span>
                </h1>
                <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] leading-relaxed">
                  Upload your resume and get instant AI-powered feedback, scoring, and professional improvement suggestions in seconds.
                </p>
              </div>

              <ResumeUpload onUpload={handleUpload} isAnalyzing={false} />

              {/* HOW IT WORKS */}
              <section id="how-it-works" className="scroll-reveal py-16 md:py-20 bg-[var(--color-dark-surface)] rounded-[2rem] border border-[var(--color-dark-border)] flex flex-col items-center justify-center p-6 md:p-12">
                <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
                  <h2 className="text-3xl font-bold text-[var(--color-text-primary)] font-display">How it works</h2>
                  <p className="text-[var(--color-text-secondary)] text-lg">Your path to a perfect resume in 3 simple steps.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 w-full stagger-children">
                  {[
                    { icon: FileText, title: '1. Upload Resume', desc: 'Drag and drop your existing PDF, DOCX, or TXT file into our secure analyzer.' },
                    { icon: Target, title: '2. Select Industry', desc: 'Choose your target field of work so the AI knows exactly what recruiters look for.' },
                    { icon: Zap, title: '3. AI Optimization', desc: 'Get an instant score, detailed breakdown, and interactive rewrite suggestions.' },
                  ].map((feature, i) => (
                    <div key={i} className="glass-card rounded-2xl p-6 md:p-8 space-y-4 relative overflow-hidden group hover-lift cursor-default">
                      <div className="h-14 w-14 rounded-xl bg-[var(--color-accent-glow)] flex items-center justify-center text-[var(--color-accent)] mb-4">
                        <feature.icon className="h-7 w-7" />
                      </div>
                      <h3 className="font-bold text-xl text-[var(--color-text-primary)]">{feature.title}</h3>
                      <p className="text-[var(--color-text-secondary)] leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* TEMPLATES */}
              <section id="templates" className="scroll-reveal py-16 md:py-20">
                <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
                  <h2 className="text-3xl font-bold text-[var(--color-text-primary)] font-display">Professional Templates</h2>
                  <p className="text-[var(--color-text-secondary)] text-lg">Start fresh with our ATS-optimized resume layouts designed for impact.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 stagger-children">
                  {templates.map((tpl, i) => (
                    <div key={i} className="group relative rounded-2xl border border-[var(--color-dark-border)] bg-[var(--color-dark-card)] p-2 hover:border-[var(--color-accent)]/40 hover:shadow-xl hover:shadow-[var(--color-accent-glow)] transition-all duration-300 cursor-pointer hover-lift">
                      <div className="w-full aspect-[1/1.4] rounded-xl overflow-hidden mb-4 border border-[var(--color-dark-border)] group-hover:border-[var(--color-accent)]/40 transition-all relative">
                        <img src={tpl.image} alt={tpl.name} className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy" />
                        {tpl.tier !== 'Free' && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-[var(--color-accent)] text-white text-xs font-bold px-2 py-1 rounded-full">
                            <Lock className="h-3 w-3" /> {tpl.tier}
                          </div>
                        )}
                      </div>
                      <div className="px-3 pb-4 space-y-2">
                        <h3 className="font-bold text-[var(--color-text-primary)]">{tpl.name}</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">{tpl.desc}</p>
                        <button onClick={(e) => { e.stopPropagation(); window.open(tpl.image, '_blank'); }} className="text-sm font-bold text-[var(--color-accent)] mt-2 hover:underline">Preview Layout →</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* PRICING */}
              <LandingPricingSection onUpgrade={goToPricing} />

            </motion.div>
          )}

          {/* ANALYZING SPINNER */}
          {state === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-8"
            >
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-[var(--color-dark-border)] border-t-[var(--color-accent)] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-[var(--color-accent)] animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] font-display">Analyzing your resume...</h2>
                <p className="text-[var(--color-text-muted)]">Our AI is scanning for keywords, impact, and ATS compatibility.</p>
              </div>
            </motion.div>
          )}

          {/* RESULTS */}
          {state === 'results' && analysis && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <button
                  onClick={() => setState('upload')}
                  className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Upload
                </button>
                <div className="text-sm font-medium text-[var(--color-text-muted)]">Analysis Complete</div>
              </div>

              <AnalysisDashboard
                analysis={analysis}
                onContinue={() => setState('editor')}
              />
            </motion.div>
          )}

          {/* EDITOR */}
          {state === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <button
                  onClick={() => setState('results')}
                  className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </button>
                <div className="flex items-center gap-3">
                  {hasInterviewPrep && (
                    <button
                      onClick={() => setState('interview')}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold hover:bg-amber-500/20 transition-all"
                    >
                      <BookOpen className="h-4 w-4" /> Interview Prep
                    </button>
                  )}
                  <h2 className="text-xl font-bold text-[var(--color-text-primary)] font-display">AI Resume Editor</h2>
                </div>
              </div>

              <ResumeEditor
                initialContent={resumeText}
                analysis={analysis}
                isPremium={isPremium}
                onPricingClick={goToPricing}
              />
            </motion.div>
          )}

          {/* INTERVIEW PREP */}
          {state === 'interview' && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <InterviewPrepModule field={resumeField} onBack={() => setState('editor')} />
            </motion.div>
          )}

          {/* PRICING PAGE */}
          {state === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <button
                onClick={() => setState(previousState)}
                className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              <PricingPage
                onSelectPlan={handleSelectPlan}
                onBack={() => setState(previousState)}
              />
            </motion.div>
          )}

          {/* PAYMENT */}
          {state === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PaymentForm
                onComplete={handlePaymentComplete}
                onBack={() => setState('pricing')}
                selectedTier={selectedTierForPayment}
              />
            </motion.div>
          )}

          {/* SUCCESS */}
          {state === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <PaymentSuccess onReturn={() => setState(tier === 'elite' ? 'interview' : 'editor')} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
