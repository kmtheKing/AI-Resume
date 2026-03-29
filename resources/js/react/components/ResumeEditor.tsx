import { useState } from 'react';
import { 
  Sparkles, 
  Save, 
  Undo2, 
  Redo2, 
  Layout,
  Eye,
  Loader2,
  Check,
  Lock,
  Crown
} from 'lucide-react';
import { improveResumeSection } from '@/src/services/gemini';
import { cn } from '@/src/lib/utils';

interface ResumeEditorProps {
  initialContent: string;
  isPremium: boolean;
  onPricingClick: () => void;
}

export function ResumeEditor({ initialContent, isPremium, onPricingClick }: ResumeEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isImproving, setIsImproving] = useState(false);
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [selection, setSelection] = useState('');

  const handleImprove = async () => {
    if (!selection) return;
    
    setIsImproving(true);
    try {
      const improved = await improveResumeSection(selection, "Make it more professional and impact-oriented.");
      setContent(prev => prev.replace(selection, improved));
    } catch (error) {
      console.error("Improvement failed:", error);
    } finally {
      setIsImproving(false);
    }
  };

  const handleSavePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Parse content into structured sections for professional formatting
    const lines = content.split('\n').filter(l => l.trim());
    let htmlBody = '';
    for (const line of lines) {
      const trimmed = line.trim();
      // Detect section headings (all caps or known keywords)
      if (/^[A-Z][A-Z\s\/&]+$/.test(trimmed) && trimmed.length > 2) {
        htmlBody += `<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:2px;color:#6366f1;border-bottom:1.5px solid #e2e2e2;padding-bottom:4px;margin:18px 0 8px 0;font-weight:700;">${trimmed}</h2>`;
      } else {
        htmlBody += `<p style="margin:3px 0;font-size:11pt;line-height:1.55;color:#1a1a1a;">${trimmed}</p>`;
      }
    }

    // Extract name (first line) for the header
    const name = lines[0] || 'Resume';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${name} - Resume</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @page { size: A4; margin: 20mm 18mm; }
          body { font-family: 'Inter', sans-serif; color: #1a1a1a; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${htmlBody}
        <script>setTimeout(() => { window.print(); }, 300);<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col h-[700px] bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-3xl overflow-hidden shadow-2xl">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-dark-border)] bg-[var(--color-dark-surface)]">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] rounded-lg p-1">
              <button 
                onClick={() => setView('edit')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                  view === 'edit' ? "bg-[var(--color-accent)] text-white shadow-sm" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                )}
              >
                <Layout className="h-4 w-4" /> Editor
              </button>
              <button 
                onClick={() => setView('preview')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                  view === 'preview' ? "bg-[var(--color-accent)] text-white shadow-sm" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                )}
              >
                <Eye className="h-4 w-4" /> Preview
              </button>
            </div>
            <div className="h-6 w-px bg-[var(--color-dark-border)] mx-2" />
            <div className="flex items-center gap-1">
              <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-dark-hover)] rounded-lg transition-all"><Undo2 className="h-4 w-4" /></button>
              <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-dark-hover)] rounded-lg transition-all"><Redo2 className="h-4 w-4" /></button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleImprove}
              disabled={!selection || isImproving}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
                selection 
                  ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-muted)] shadow-lg shadow-[var(--color-accent-glow)]" 
                  : "bg-[var(--color-dark-bg)] text-[var(--color-text-muted)] cursor-not-allowed"
              )}
            >
              {isImproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              AI Improve
            </button>
            <button 
              onClick={handleSavePDF}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-text-primary)] text-[var(--color-dark-bg)] rounded-xl text-sm font-bold hover:opacity-90 transition-all"
            >
              <Save className="h-4 w-4" /> Save PDF
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 p-8 overflow-y-auto bg-[var(--color-dark-card)] custom-scrollbar relative">
            {view === 'edit' ? (
              <textarea
                className="w-full h-full resize-none border-none focus:ring-0 bg-transparent text-[var(--color-text-secondary)] leading-relaxed font-sans text-lg outline-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onMouseUp={() => setSelection(window.getSelection()?.toString() || '')}
                placeholder="Paste your resume content here..."
              />
            ) : (
              /* PREMIUM PREVIEW — blurred if not premium */
              <div className="relative">
                <div className={cn(
                  "whitespace-pre-wrap leading-relaxed text-lg space-y-6 transition-all duration-500",
                  !isPremium && "blur-[6px] select-none pointer-events-none"
                )}>
                  {/* Fake formatted resume template */}
                  <div className="border border-[var(--color-dark-border)] rounded-2xl p-10 bg-[var(--color-dark-surface)]">
                    <div className="text-center mb-8 border-b border-[var(--color-dark-border)] pb-6">
                      <h2 className="text-3xl font-bold text-[var(--color-text-primary)] font-display">MOAYED ELSHAFIA</h2>
                      <p className="text-[var(--color-text-muted)] mt-2">Ludhiana, India • kamalmoayed@gmail.com</p>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] mb-2">Professional Summary</h3>
                        <p className="text-[var(--color-text-secondary)] text-sm">Driven Computer Science student with a focus on software engineering, seeking to leverage academic foundation and analytical skills in a challenging development role.</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] mb-2">Education</h3>
                        <p className="text-[var(--color-text-secondary)] text-sm"><strong className="text-[var(--color-text-primary)]">Bachelor of Computer Applications (BCA)</strong> — Chandigarh University, 2023–2026</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] mb-2">Technical Skills</h3>
                        <p className="text-[var(--color-text-secondary)] text-sm">Python, JavaScript, React, SQL, Git, Docker, REST APIs, Data Structures & Algorithms</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] mb-2">Projects</h3>
                        <p className="text-[var(--color-text-secondary)] text-sm"><strong className="text-[var(--color-text-primary)]">AI Resume Analyzer</strong> — Built a full-stack web application using Laravel and React to analyze resumes with Google Gemini API integration.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PREMIUM ONLY overlay */}
                {!isPremium && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="bg-[var(--color-dark-bg)]/80 backdrop-blur-sm rounded-2xl px-10 py-8 text-center border border-[var(--color-accent)]/30 shadow-2xl">
                      <Lock className="h-10 w-10 text-[var(--color-accent)] mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-[var(--color-text-primary)] font-display mb-2">PREMIUM ONLY</h3>
                      <p className="text-[var(--color-text-muted)] text-sm mb-6 max-w-xs">Upgrade to Pro to unlock professionally formatted resume templates and AI polishing.</p>
                      <button
                        onClick={onPricingClick}
                        className="flex items-center gap-2 mx-auto px-6 py-3 rounded-full bg-[var(--color-accent)] text-white font-bold hover:bg-[var(--color-accent-muted)] transition-all shadow-lg shadow-[var(--color-accent-glow)]"
                      >
                        <Crown className="h-4 w-4" /> Unlock Premium
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar — Writing Tips + 2 Big Suggestions */}
          <div className="w-80 border-l border-[var(--color-dark-border)] bg-[var(--color-dark-surface)] p-6 hidden xl:flex flex-col overflow-y-auto custom-scrollbar">
            <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-6">Writing Tips</h4>
            <div className="space-y-5 mb-8">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[var(--color-accent)]">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-bold">Use Action Verbs</span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed pl-6">
                  Instead of "Responsible for", use "Led", "Developed", or "Managed".
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[var(--color-accent)]">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-bold">Quantify Impact</span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed pl-6">
                  Add numbers like "Increased sales by 20%" or "Saved $5k monthly".
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--color-dark-border)] mb-6" />

            {/* Reduced Big Suggestions */}
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-5">Key Suggestions</h4>
            <div className="space-y-5 flex-1">
              <div className="p-4 rounded-2xl bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] space-y-2">
                <h5 className="text-sm font-bold text-[var(--color-text-primary)]">🔧 Build Technical Value</h5>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  Build a comprehensive Technical Skills section listing specific programming languages (e.g., Python, SQL, C++), frameworks (e.g., React), and tools. Detail existing class or personal projects with roles, tech stacks, challenges, and links to GitHub.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] space-y-2">
                <h5 className="text-sm font-bold text-[var(--color-text-primary)]">✨ Polish Professionalism</h5>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  Add a concise professional summary/career objective. Replace percentage-based soft skills with concrete examples within project descriptions. Prioritize technical, relevant certifications and remove unrelated ones.
                </p>
              </div>
            </div>

            {/* Highlight tip */}
            <div className="mt-6 p-4 bg-[var(--color-accent-glow)] rounded-2xl border border-[var(--color-accent)]/20">
              <p className="text-xs text-[var(--color-accent)] font-medium leading-relaxed">
                <Sparkles className="h-3 w-3 inline mr-1" />
                Highlight any text and click "AI Improve" to rewrite it professionally.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Large "AI Improve & Format" Premium Button */}
      {!isPremium && (
        <div className="flex justify-center">
          <button
            onClick={onPricingClick}
            className="group flex items-center gap-3 px-12 py-5 rounded-2xl bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a78bfa] text-white font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Crown className="h-6 w-6 group-hover:rotate-12 transition-transform" />
            AI Improve & Format
            <Sparkles className="h-5 w-5 group-hover:scale-125 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
