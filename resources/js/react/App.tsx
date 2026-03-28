/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { ResumeUpload } from './components/ResumeUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ResumeEditor } from './components/ResumeEditor';
import { analyzeResume, ResumeAnalysis } from './services/gemini';
import { Sparkles, ArrowLeft, FileText, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AppState = 'upload' | 'analyzing' | 'results' | 'editor';

export default function App() {
  const [state, setState] = useState<AppState>('upload');
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const handleUpload = async (file: File, field: string) => {
    setState('analyzing');
    try {
      const responsePayload = await analyzeResume(file, field);
      setAnalysis(responsePayload.result);
      setResumeText(responsePayload.parsedText); // Captures parsed text securely from the backend PDF parser
      setState('results');
    } catch (error: any) {
      console.error("Analysis failed:", error);
      setState('upload');
      alert(error.message || "Failed to analyze resume. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <main className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        <AnimatePresence mode="wait">
          {state === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4 max-w-3xl mx-auto">

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 font-display leading-[1.1]">
                  Land your dream job with <span className="text-blue-600">ResumeAI</span>
                </h1>
                <p className="text-xl text-slate-500 leading-relaxed">
                  Upload your resume and get instant AI-powered feedback, scoring, and professional improvement suggestions in seconds.
                </p>
              </div>
              
              <ResumeUpload onUpload={handleUpload} isAnalyzing={false} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                {[
                  { icon: FileText, title: "Smart Analysis", desc: "Get a detailed score based on industry standards and ATS algorithms." },
                  { icon: Target, title: "Actionable Tips", desc: "Receive specific suggestions to improve your wording and impact." },
                  { icon: Zap, title: "AI Improvement", desc: "Rewrite weak sections instantly with our professional AI editor." }
                ].map((feature, i) => (
                  <div key={i} className="glass-card rounded-2xl p-6 space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-900">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
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
                <div className="h-24 w-24 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-blue-600 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 font-display">Analyzing your resume...</h2>
                <p className="text-slate-500">Our AI is scanning for keywords, impact, and ATS compatibility.</p>
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
                  className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Upload
                </button>
                <div className="text-sm font-medium text-slate-400">Analysis Complete</div>
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
                  className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </button>
                <h2 className="text-xl font-bold text-slate-900 font-display">AI Resume Editor</h2>
              </div>
              
              <ResumeEditor initialContent={resumeText} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      

    </div>
  );
}

