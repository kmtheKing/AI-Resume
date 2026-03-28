/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ResumeUpload } from './components/ResumeUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ResumeEditor } from './components/ResumeEditor';
import { analyzeResume, ResumeAnalysis } from './services/gemini';
import { Sparkles, ArrowLeft, FileText, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AppState = 'upload' | 'analyzing' | 'results' | 'editor';

/* Scroll-reveal hook: observes elements and adds .revealed class */
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

export default function App() {
  const [state, setState] = useState<AppState>('upload');
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const scrollRef = useScrollReveal();

  const handleUpload = async (file: File, field: string) => {
    setState('analyzing');
    try {
      const responsePayload = await analyzeResume(file, field);
      setAnalysis(responsePayload.result);
      setResumeText(responsePayload.parsedText);
      setState('results');
    } catch (error: any) {
      console.error("Analysis failed:", error);
      setState('upload');
      alert(error.message || "Failed to analyze resume. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)]">
      <Header />
      
      <main className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        <AnimatePresence mode="wait">
          {state === 'upload' && (
            <motion.div 
              key="upload"
              ref={scrollRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-20"
            >
              {/* Hero */}
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display leading-[1.1] text-[var(--color-text-primary)]">
                  Land your dream job with <span className="gradient-text">ResumeAI</span>
                </h1>
                <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
                  Upload your resume and get instant AI-powered feedback, scoring, and professional improvement suggestions in seconds.
                </p>
              </div>
              
              <ResumeUpload onUpload={handleUpload} isAnalyzing={false} />
              
              {/* HOW IT WORKS */}
              <section id="how-it-works" className="scroll-reveal py-20 bg-[var(--color-dark-surface)] rounded-[2rem] border border-[var(--color-dark-border)] flex flex-col items-center justify-center p-8 md:p-12">
                <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
                  <h2 className="text-3xl font-bold text-[var(--color-text-primary)] font-display">How it works</h2>
                  <p className="text-[var(--color-text-secondary)] text-lg">Your path to a perfect resume in 3 simple steps.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full stagger-children">
                  {[
                    { icon: FileText, title: "1. Upload Resume", desc: "Drag and drop your existing PDF, DOCX, or TXT file into our secure analyzer." },
                    { icon: Target, title: "2. Select Industry", desc: "Choose your target field of work so the AI knows exactly what recruiters look for." },
                    { icon: Zap, title: "3. AI Optimization", desc: "Get an instant score, detailed breakdown, and interactive rewrite suggestions." }
                  ].map((feature, i) => (
                    <div key={i} className="glass-card rounded-2xl p-8 space-y-4 relative overflow-hidden group hover-lift cursor-default">
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
              <section id="templates" className="scroll-reveal py-20">
                <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
                  <h2 className="text-3xl font-bold text-[var(--color-text-primary)] font-display">Professional Templates</h2>
                  <p className="text-[var(--color-text-secondary)] text-lg">Start fresh with our ATS-optimized resume layouts designed for impact.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
                  {[
                    { name: "The Executive", desc: "Clean, traditional layout perfect for corporate and finance roles.", color: "bg-[#818cf8]" },
                    { name: "The Creative", desc: "Modern, slightly colorful design for tech, design, and marketing.", color: "bg-[var(--color-accent)]" },
                    { name: "The Standard", desc: "The ultimate ATS parser friendly layout. Functional and direct.", color: "bg-emerald-500" }
                  ].map((tpl, i) => (
                    <div key={i} className="group relative rounded-2xl border border-[var(--color-dark-border)] bg-[var(--color-dark-card)] p-2 hover:border-[var(--color-accent)]/40 hover:shadow-xl hover:shadow-[var(--color-accent-glow)] transition-all duration-300 cursor-pointer hover-lift">
                      <div className={`w-full aspect-[1/1.4] rounded-xl ${tpl.color} opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-300 mb-4`} />
                      <div className="px-4 pb-4 space-y-2">
                        <h3 className="font-bold text-[var(--color-text-primary)]">{tpl.name}</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">{tpl.desc}</p>
                        <button className="text-sm font-bold text-[var(--color-accent)] mt-2 hover:underline">Preview Layout →</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* PRICING */}
              <section id="pricing" className="scroll-reveal py-20 bg-[var(--color-dark-surface)] rounded-[2rem] text-white px-8 md:px-16 border border-[var(--color-dark-border)]">
                <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
                  <h2 className="text-3xl font-bold font-display text-[var(--color-text-primary)]">Simple, transparent pricing</h2>
                  <p className="text-[var(--color-text-muted)] text-lg">Choose the perfect plan to accelerate your career.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
                  <div className="rounded-3xl bg-[var(--color-dark-card)] p-8 border border-[var(--color-dark-border)] flex flex-col hover-lift">
                    <h3 className="font-bold text-2xl mb-2 text-[var(--color-text-primary)]">Free</h3>
                    <div className="text-4xl font-display font-bold mb-6 text-[var(--color-text-primary)]">$0<span className="text-lg text-[var(--color-text-muted)] font-normal">/mo</span></div>
                    <ul className="space-y-4 mb-8 flex-1 text-[var(--color-text-secondary)]">
                      <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-[var(--color-accent)]" /> Basic AI Analysis</li>
                      <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-[var(--color-accent)]" /> 1 ATS Score Check</li>
                      <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-[var(--color-accent)]" /> Export PDF</li>
                    </ul>
                    <button className="w-full py-3 rounded-full bg-[var(--color-dark-hover)] border border-[var(--color-dark-border)] font-bold hover:bg-[var(--color-dark-border)] transition-colors text-[var(--color-text-primary)]">Get Started</button>
                  </div>
                  
                  <div className="rounded-3xl bg-[var(--color-accent)] p-8 border border-[#818cf8] shadow-2xl shadow-[var(--color-accent-glow)] flex flex-col relative transform md:-translate-y-4 hover-lift">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#a78bfa] text-[var(--color-dark-bg)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                    <h3 className="font-bold text-2xl mb-2">Pro</h3>
                    <div className="text-4xl font-display font-bold mb-6">$15<span className="text-lg text-indigo-200 font-normal">/mo</span></div>
                    <ul className="space-y-4 mb-8 flex-1 text-indigo-100">
                      <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-white" /> Advanced Analysis</li>
                      <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-white" /> Interactive AI Editor</li>
                      <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-white" /> Unlimited Checks</li>
                      <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-white" /> All Templates</li>
                    </ul>
                    <button className="w-full py-3 rounded-full bg-white text-[var(--color-accent-muted)] font-bold hover:bg-indigo-50 transition-colors">Upgrade to Pro</button>
                  </div>

                  <div className="rounded-3xl bg-[var(--color-dark-card)] p-8 border border-[var(--color-dark-border)] flex flex-col hover-lift">
                    <h3 className="font-bold text-2xl mb-2 text-[var(--color-text-primary)]">Enterprise</h3>
                    <div className="text-4xl font-display font-bold mb-6 text-[var(--color-text-primary)]">$49<span className="text-lg text-[var(--color-text-muted)] font-normal">/mo</span></div>
                    <ul className="space-y-4 mb-8 flex-1 text-[var(--color-text-secondary)]">
                      <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-[var(--color-accent)]" /> Everything in Pro</li>
                      <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-[var(--color-accent)]" /> Career Coaching Tools</li>
                      <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-[var(--color-accent)]" /> Custom System Branding</li>
                    </ul>
                    <button className="w-full py-3 rounded-full bg-[var(--color-dark-hover)] border border-[var(--color-dark-border)] font-bold hover:bg-[var(--color-dark-border)] transition-colors text-[var(--color-text-primary)]">Contact Sales</button>
                  </div>
                </div>
              </section>

            </motion.div>
          )}

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

          {state === 'results' && analysis && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
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
                onEdit={() => setState('editor')} 
              />
            </motion.div>
          )}

          {state === 'editor' && (
            <motion.div 
              key="editor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setState('results')}
                  className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </button>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] font-display">AI Resume Editor</h2>
              </div>
              
              <ResumeEditor initialContent={resumeText} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
