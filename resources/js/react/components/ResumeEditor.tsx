import { useState } from 'react';
import html2pdf from 'html2pdf.js';
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
  Crown,
  Download,
  X,
  LogIn
} from 'lucide-react';
import { improveResumeSection, ResumeAnalysis } from '@/src/services/gemini';
import { cn } from '@/src/lib/utils';

interface ResumeEditorProps {
  initialContent: string;
  analysis?: ResumeAnalysis;
  isPremium: boolean;
  onPricingClick: () => void;
}

export function ResumeEditor({ initialContent, analysis, isPremium, onPricingClick }: ResumeEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isImproving, setIsImproving] = useState(false);
  const [isAutoImproving, setIsAutoImproving] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [selection, setSelection] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState('classic');

  const AppConfig = (window as any).AppConfig;
  const isAuthenticated = AppConfig?.isAuthenticated ?? false;

  const handleImprove = async () => {
    if (!selection) return;
    
    setIsImproving(true);
    try {
      const improved = await improveResumeSection(selection, "Rewrite this section to be highly professional, impactful, and concise. Use strong action verbs and quantify achievements. Ensure it fits a high-level executive one-page resume format.");
      setContent(prev => prev.replace(selection, improved));
    } catch (error) {
      console.error("Improvement failed:", error);
    } finally {
      setIsImproving(false);
    }
  };

  const handleAutoImprove = async () => {
    setIsAutoImproving(true);
    try {
      const improved = await improveResumeSection(content, "REWRITE THIS ENTIRE RESUME. It MUST be professional, impactful, and fit perfectly on ONE PAGE. Use a clear visual hierarchy. Use strong action verbs (e.g. Spearheaded, Engineered). Quantify all achievements. Format it with clear headers (SUMMARY, EXPERIENCE, EDUCATION, SKILLS). Ensure the output is clean, formatted, and ready for an executive role.");
      const oldLines = content.split('\n');
      const newLines = improved.split('\n');
      
      const changedIndices: number[] = [];
      newLines.forEach((line, i) => {
        if (!oldLines.includes(line)) {
          changedIndices.push(i);
        }
      });
      
      setContent(improved);
      setHighlightedIndices(changedIndices);
      
      setTimeout(() => setHighlightedIndices([]), 10000);
      
    } catch (error) {
      console.error("Auto-Improvement failed:", error);
    } finally {
      setIsAutoImproving(false);
    }
  };

  const handleSavePDF = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const rawLines = content.split('\n');
    let firstContentIdx = 0;
    while(firstContentIdx < rawLines.length && !rawLines[firstContentIdx].trim()) firstContentIdx++;
    
    const name = rawLines[firstContentIdx]?.trim() || 'Resume';
    let contactIdx = firstContentIdx + 1;
    while(contactIdx < rawLines.length && !rawLines[contactIdx].trim()) contactIdx++;
    const contactLine = rawLines[contactIdx]?.trim() || '';

    const lines = rawLines.slice(contactIdx + 1);

    let htmlBody = '';
    
    if (selectedTemplate === 'modern') {
       htmlBody = `
         <div style="display: flex; min-height: 1122px;">
           <div style="width: 33%; background: #1f2937; color: #ffffff; padding: 40px 20px;">
             <h1 style="font-size: 26pt; margin-bottom: 12px; font-weight: 700; line-height: 1.1;">${name}</h1>
             <p style="font-size: 10.5pt; color: #9ca3af; margin-bottom: 40px;">${contactLine}</p>
             <h2 style="font-size:11pt;text-transform:uppercase;letter-spacing:2px;color:#f3f4f6;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:4px;margin:20px 0 10px 0;font-weight:700;">Profile Highlights</h2>
             <p style="font-size:9.5pt; line-height: 1.6; color: #d1d5db;">Selected to emphasize strong capability and modern workflow adaptation.</p>
           </div>
           <div style="width: 67%; background: #ffffff; padding: 40px 30px;">
       `;
       for (let i = 0; i < lines.length; i++) {
         const trimmed = lines[i].trim();
         if (!trimmed) {
           htmlBody += `<div style="height: 8px;"></div>`;
         } else if (/^[A-Z][A-Z\s\/&]+$/.test(trimmed) && trimmed.length > 2) {
           htmlBody += `<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:2px;color:#e11d48;border-bottom:2px solid #f1f5f9;padding-bottom:4px;margin:18px 0 8px 0;font-weight:bold;">${trimmed}</h2>`;
         } else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
           htmlBody += `<p style="margin:2px 0;font-size:10pt;line-height:1.4;color:#334155;padding-left:16px;text-indent:-8px;">${trimmed}</p>`;
         } else if (trimmed.includes('|') || trimmed.includes('–') || trimmed.includes(' - ')) {
           // Likely a job title/date line
           htmlBody += `<p style="margin:4px 0;font-size:10.5pt;line-height:1.4;color:#111827;font-weight:700;">${trimmed}</p>`;
         } else {
           htmlBody += `<p style="margin:2px 0;font-size:10pt;line-height:1.4;color:#334155;">${trimmed}</p>`;
         }
       }
       htmlBody += `
           </div>
         </div>
       `; 
    } else if (selectedTemplate === 'executive') {
       htmlBody = `
         <div style="border-top: 6px solid #1f2937; padding-top: 30px; margin-bottom: 30px;">
           <h1 style="font-size: 32pt; text-align: center; margin-bottom: 8px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; color: #111;">${name}</h1>
           <p style="text-align: center; font-size: 11pt; color: #4b5563; font-weight: 500;">${contactLine}</p>
         </div>
       `;
       for (let i = 0; i < lines.length; i++) {
         const trimmed = lines[i].trim();
         if (!trimmed) {
           htmlBody += `<div style="height: 8px;"></div>`;
         } else if (/^[A-Z][A-Z\s\/&]+$/.test(trimmed) && trimmed.length > 2) {
           htmlBody += `
             <div style="display: flex; align-items: center; margin: 20px 0 10px 0;">
               <h2 style="font-size: 13pt; text-transform: uppercase; letter-spacing: 1.5px; color: #111; font-weight: 800; margin-right: 15px; white-space: nowrap;">${trimmed}</h2>
               <div style="flex: 1; height: 2px; background: #e5e7eb;"></div>
             </div>
           `;
         } else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
           htmlBody += `<p style="margin:3px 0;font-size:10.5pt;line-height:1.4;color:#1f2937;padding-left:16px;text-indent:-8px;">${trimmed}</p>`;
         } else if (trimmed.includes('|') || trimmed.includes('–') || trimmed.includes(' - ')) {
           htmlBody += `<p style="margin:5px 0;font-size:11pt;line-height:1.4;color:#000;font-weight:800;">${trimmed}</p>`;
         } else {
           htmlBody += `<p style="margin:3px 0;font-size:10.5pt;line-height:1.4;color:#1f2937;">${trimmed}</p>`;
         }
       }
    } else {
       htmlBody = `
         <div style="text-align: center; margin-bottom: 24px;">
           <h1 style="font-size: 28pt; margin-bottom: 4px; font-weight: normal; letter-spacing: 1px;">${name}</h1>
           <p style="font-size: 11pt; color: #555;">${contactLine}</p>
         </div>
       `;
       for (let i = 0; i < lines.length; i++) {
         const trimmed = lines[i].trim();
         if (!trimmed) {
           htmlBody += `<div style="height: 8px;"></div>`;
         } else if (/^[A-Z][A-Z\s\/&]+$/.test(trimmed) && trimmed.length > 2) {
           htmlBody += `<h2 style="font-size:12pt;text-transform:uppercase;letter-spacing:1px;color:#111;border-bottom:1px solid #ccc;padding-bottom:2px;margin:18px 0 6px 0;font-weight:bold;">${trimmed}</h2>`;
         } else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
           htmlBody += `<p style="margin:3px 0;font-size:10.5pt;line-height:1.4;color:#222;padding-left:16px;text-indent:-8px;">${trimmed}</p>`;
         } else if (trimmed.includes('|') || trimmed.includes('–') || trimmed.includes(' - ')) {
           htmlBody += `<p style="margin:4px 0;font-size:11pt;line-height:1.4;color:#000;font-weight:bold;">${trimmed}</p>`;
         } else {
           htmlBody += `<p style="margin:3px 0;font-size:10.5pt;line-height:1.4;color:#222;">${trimmed}</p>`;
         }
       }
    }

    const finalHtml = `
      <div style="width: 800px; background: #ffffff; color: #1a1a1a; font-family: ${selectedTemplate === 'modern' ? "'Inter', sans-serif" : "'Times New Roman', serif"}; padding: ${selectedTemplate === 'modern' ? '0' : '40px'};">
        ${htmlBody}
      </div>
    `;

    const opt = {
      margin:       0,
      filename:     `${name.replace(/\s+/g, '_')}_Resume.pdf`,
      image:        { type: 'jpeg', quality: 1.0 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'px', format: [800, 1122], orientation: 'portrait' }
    };

    html2pdf().set(opt).from(finalHtml).save();
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
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
                isAuthenticated
                  ? "bg-[var(--color-text-primary)] text-[var(--color-dark-bg)] hover:opacity-90"
                  : "bg-gradient-to-r from-rose-600 to-red-700 text-white hover:from-rose-500 hover:to-red-600 shadow-lg shadow-rose-900/30"
              )}
            >
              {isAuthenticated
                ? <><Save className="h-4 w-4" /> Save PDF</>
                : <><Lock className="h-4 w-4" /> Sign In to Download</>
              }
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 p-8 overflow-y-auto bg-[var(--color-dark-card)] custom-scrollbar relative">
            {view === 'edit' ? (
              <div className="relative w-full h-full min-h-[600px]">
                <div className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words leading-relaxed font-sans text-lg text-transparent" aria-hidden="true">
                  {content.split('\n').map((line, i) => (
                    <span key={i} className={highlightedIndices.includes(i) ? "bg-emerald-500/20 text-transparent rounded-sm px-1 -mx-1" : ""}>
                      {line === '' ? ' ' : line}{'\n'}
                    </span>
                  ))}
                </div>
                <textarea
                  className="absolute inset-0 w-full h-full resize-none border-none focus:ring-0 bg-transparent text-[var(--color-text-secondary)] leading-relaxed font-sans text-lg outline-none custom-scrollbar"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onMouseUp={() => setSelection(window.getSelection()?.toString() || '')}
                  placeholder="Paste your resume content here..."
                />
              </div>
            ) : (
              /* PREMIUM PREVIEW — blurred if not premium */
              <div className="relative">
                <div className={cn(
                  "whitespace-pre-wrap leading-relaxed text-lg space-y-6 transition-all duration-500",
                  !isPremium && "blur-[6px] select-none pointer-events-none"
                )}>
                  {/* Dynamic formatted resume preview */}
                  <div className="border border-[var(--color-dark-border)] rounded-2xl overflow-hidden bg-white shadow-inner">
                    {(() => {
                      const rawLines = content.split('\n');
                      let firstContentIdx = 0;
                      while(firstContentIdx < rawLines.length && !rawLines[firstContentIdx].trim()) firstContentIdx++;
                      const name = rawLines[firstContentIdx]?.trim() || 'Your Name';
                      
                      let contactIdx = firstContentIdx + 1;
                      while(contactIdx < rawLines.length && !rawLines[contactIdx].trim()) contactIdx++;
                      const contact = rawLines[contactIdx]?.trim() || 'Your Contact Info';

                      const contentLines = rawLines.slice(contactIdx + 1);

                      if (selectedTemplate === 'modern') {
                        return (
                          <div className="flex min-h-[600px] font-sans text-left">
                            <div className="w-1/3 bg-gray-800 text-white p-6 md:p-8">
                              <h1 className="text-2xl font-bold mb-2 leading-tight">{name}</h1>
                              <p className="text-xs text-gray-400 mb-8">{contact}</p>
                              <h2 className="text-xs uppercase tracking-widest border-b border-gray-600 pb-1 mt-5 mb-3 font-bold text-gray-100">Profile Highlights</h2>
                              <p className="text-xs text-gray-300 leading-relaxed">Selected to emphasize strong capability and modern workflow adaptation.</p>
                            </div>
                            <div className="w-2/3 p-6 md:p-8">
                              {contentLines.map((line, i) => {
                                const trimmed = line.trim();
                                if (!trimmed) return <div key={i} className="h-2" />;
                                if (/^[A-Z][A-Z\s\/&]+$/.test(trimmed) && trimmed.length > 2) {
                                  return <h2 key={i} className="text-xs uppercase tracking-widest text-rose-600 border-b-2 border-slate-100 pb-1 mt-5 mb-2 font-bold">{trimmed}</h2>;
                                }
                                const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ');
                                const isHierarchy = trimmed.includes('|') || trimmed.includes('–') || trimmed.includes(' - ');
                                return <p key={i} className={cn(
                                  "my-1 text-sm leading-relaxed text-slate-700", 
                                  isBullet && "pl-4 -indent-2",
                                  isHierarchy && "font-bold text-slate-900"
                                )}>{trimmed}</p>;
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (selectedTemplate === 'executive') {
                        return (
                          <div className="p-8 md:p-12 font-sans border-t-[8px] border-gray-800 text-left min-h-[600px]">
                            <div className="text-center mb-8">
                              <h1 className="text-3xl font-extrabold uppercase tracking-tight text-gray-900 mb-2">{name}</h1>
                              <p className="text-gray-600 font-medium text-sm">{contact}</p>
                            </div>
                            {contentLines.map((line, i) => {
                              const trimmed = line.trim();
                              if (!trimmed) return <div key={i} className="h-2" />;
                              if (/^[A-Z][A-Z\s\/&]+$/.test(trimmed) && trimmed.length > 2) {
                                return (
                                  <div key={i} className="flex items-center mt-6 mb-3">
                                    <h2 className="text-xs uppercase tracking-widest font-extrabold text-gray-900 mr-4 whitespace-nowrap">{trimmed}</h2>
                                    <div className="flex-1 h-0.5 bg-gray-200"></div>
                                  </div>
                                );
                              }
                              const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ');
                              const isHierarchy = trimmed.includes('|') || trimmed.includes('–') || trimmed.includes(' - ');
                              return <p key={i} className={cn(
                                "my-1 text-sm leading-relaxed text-gray-800", 
                                isBullet && "pl-4 -indent-2",
                                isHierarchy && "font-extrabold text-black"
                              )}>{trimmed}</p>;
                            })}
                          </div>
                        );
                      }

                      // Classic template
                      return (
                        <div className="p-8 md:p-12 font-serif text-left min-h-[600px]">
                          <div className="text-center mb-8">
                            <h1 className="text-3xl mb-1 font-normal tracking-wide text-black">{name}</h1>
                            <p className="text-gray-600 text-sm">{contact}</p>
                          </div>
                          {contentLines.map((line, i) => {
                            const trimmed = line.trim();
                            if (!trimmed) return <div key={i} className="h-2" />;
                            if (/^[A-Z][A-Z\s\/&]+$/.test(trimmed) && trimmed.length > 2) {
                              return <h2 key={i} className="text-sm uppercase tracking-widest border-b border-gray-300 pb-1 mt-5 mb-2 font-bold text-black">{trimmed}</h2>;
                            }
                            const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ');
                            const isHierarchy = trimmed.includes('|') || trimmed.includes('–') || trimmed.includes(' - ');
                            return <p key={i} className={cn(
                              "my-1 text-sm leading-relaxed text-gray-800", 
                              isBullet && "pl-4 -indent-2",
                              isHierarchy && "font-bold text-black"
                            )}>{trimmed}</p>;
                          })}
                        </div>
                      );
                    })()}
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
              {analysis?.weaknesses && analysis.weaknesses.length > 0 ? (
                analysis.weaknesses.slice(0, 3).map((weakness, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[var(--color-accent)]">
                      <Check className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-bold">Improvement Area</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed pl-6">
                      {weakness}
                    </p>
                  </div>
                ))
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[var(--color-accent)]">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-bold">Use Action Verbs</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed pl-6">
                    Instead of "Responsible for", use "Led", "Developed", or "Managed".
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--color-dark-border)] mb-6" />

            {/* Reduced Big Suggestions */}
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-5">Key Suggestions</h4>
            <div className="space-y-5 flex-1">
              {analysis?.suggestions && analysis.suggestions.length > 0 ? (
                analysis.suggestions.slice(0, 3).map((sugg, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] space-y-2">
                    <h5 className="text-sm font-bold text-[var(--color-text-primary)]">✨ {sugg.section}</h5>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      {sugg.improvement} <span className="opacity-70 mt-1 block">{sugg.reason}</span>
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] space-y-2">
                  <h5 className="text-sm font-bold text-[var(--color-text-primary)]">🔧 Build Technical Value</h5>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    Build a comprehensive Technical Skills section listing specific programming languages and tools.
                  </p>
                </div>
              )}
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

      {/* Visual Template Selector Row */}
      <div className="flex flex-col gap-4 mt-8 bg-[var(--color-dark-card)] p-6 rounded-3xl border border-[var(--color-dark-border)] shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] font-display">
            Select Template Design
          </h3>
          <span className="text-sm font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-3 py-1 rounded-full">
            PDF Outputs
          </span>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-4 custom-scrollbar">
          {/* Classic Template Select */}
          <button 
            onClick={() => setSelectedTemplate('classic')} 
            className="flex flex-col gap-3 group text-left flex-shrink-0"
          >
            <div className={cn(
              "w-56 h-72 rounded-2xl overflow-hidden transition-all duration-300 border-2 relative",
              selectedTemplate === 'classic' 
                ? "border-[var(--color-accent)] scale-105 shadow-2xl shadow-[var(--color-accent-glow)] ring-4 ring-[var(--color-accent)]/20" 
                : "border-[#333] opacity-70 group-hover:opacity-100 group-hover:border-[#555]"
            )}>
              <img src="/assets/template-classic.png" alt="Classic Template" className="w-full h-full object-cover object-top" />
              {selectedTemplate === 'classic' && (
                <div className="absolute top-3 right-3 bg-[var(--color-accent)] rounded-full p-1 text-white shadow-lg">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-[var(--color-text-primary)]">Classic Professional</p>
              <p className="text-xs text-[var(--color-text-muted)]">Perfect for traditional industries.</p>
            </div>
          </button>

          {/* Modern Template Select */}
          <button 
            onClick={() => setSelectedTemplate('modern')} 
            className="flex flex-col gap-3 group text-left flex-shrink-0"
          >
            <div className={cn(
              "w-56 h-72 rounded-2xl overflow-hidden transition-all duration-300 border-2 relative",
              selectedTemplate === 'modern' 
                ? "border-[var(--color-accent)] scale-105 shadow-2xl shadow-[var(--color-accent-glow)] ring-4 ring-[var(--color-accent)]/20" 
                : "border-[#333] opacity-70 group-hover:opacity-100 group-hover:border-[#555]"
            )}>
              <img src="/assets/template-modern.png" alt="Modern Template" className="w-full h-full object-cover object-top" />
              {selectedTemplate === 'modern' && (
                <div className="absolute top-3 right-3 bg-[var(--color-accent)] rounded-full p-1 text-white shadow-lg">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-[var(--color-text-primary)]">Modern Minimalist</p>
              <p className="text-xs text-[var(--color-text-muted)]">Sleek sidebar design for tech & creative.</p>
            </div>
          </button>

          {/* Executive Template Select */}
          <button 
            onClick={() => setSelectedTemplate('executive')} 
            className="flex flex-col gap-3 group text-left flex-shrink-0"
          >
            <div className={cn(
              "w-56 h-72 rounded-2xl overflow-hidden transition-all duration-300 border-2 relative",
              selectedTemplate === 'executive' 
                ? "border-[var(--color-accent)] scale-105 shadow-2xl shadow-[var(--color-accent-glow)] ring-4 ring-[var(--color-accent)]/20" 
                : "border-[#333] opacity-70 group-hover:opacity-100 group-hover:border-[#555]"
            )}>
              <img src="/assets/template-executive.png" alt="Executive Template" className="w-full h-full object-cover object-top" />
              {selectedTemplate === 'executive' && (
                <div className="absolute top-3 right-3 bg-[var(--color-accent)] rounded-full p-1 text-white shadow-lg">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-[var(--color-text-primary)]">Executive Pro</p>
              <p className="text-xs text-[var(--color-text-muted)]">Powerful corporate-ready layout.</p>
            </div>
          </button>
        </div>
      </div>

      {/* Large "Auto-Improve" Button */}
      <div className="flex justify-center">
        <button
          onClick={!isPremium ? onPricingClick : handleAutoImprove}
          disabled={isAutoImproving}
          className={cn(
            "group flex items-center gap-3 px-12 py-5 rounded-2xl text-white font-bold text-xl transition-all duration-300",
            isAutoImproving 
              ? "bg-gray-700 cursor-not-allowed opacity-80" 
              : !isPremium 
                ? "bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a78bfa] hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.03] active:scale-[0.98]"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-2xl hover:shadow-emerald-500/30 hover:scale-[1.03] active:scale-[0.98]"
          )}
        >
          {isAutoImproving ? <Loader2 className="h-6 w-6 animate-spin" /> : !isPremium ? <Crown className="h-6 w-6 group-hover:rotate-12 transition-transform" /> : <Sparkles className="h-6 w-6 group-hover:scale-125 transition-transform" />}
          {isAutoImproving ? 'AI is Rewriting...' : 'Auto-Improve Entire Resume'}
          {!isPremium && <Sparkles className="h-5 w-5 group-hover:scale-125 transition-transform" />}
        </button>
      </div>

      {/* ── Auth Gate Modal ── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAuthModal(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Card */}
          <div
            className="relative w-full max-width-sm rounded-3xl border border-[#333] bg-[#0e0e0e] p-8 shadow-2xl max-w-md"
            style={{ boxShadow: '0 0 60px rgba(225,29,72,0.2), 0 25px 50px rgba(0,0,0,0.7)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl bg-gradient-to-r from-transparent via-rose-600 to-transparent" />

            {/* Close button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Lock icon */}
            <div className="flex items-center justify-center mb-5">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(225,29,72,0.12)', border: '1px solid rgba(225,29,72,0.25)' }}>
                <Download className="h-8 w-8" style={{ color: '#e11d48' }} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
              Sign in to Download
            </h2>
            <p className="text-center text-sm mb-7" style={{ color: '#64748b' }}>
              Create a free account to download your AI-optimized resume as PDF.
            </p>

            {/* Register CTA */}
            <a
              href={(window as any).AppConfig?.routes?.register ?? '/register'}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-white transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #e11d48, #9f1239)', boxShadow: '0 4px 20px rgba(225,29,72,0.25)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
            >
              <LogIn className="h-4 w-4" />
              Create Free Account
            </a>

            <p className="text-center text-xs mt-4" style={{ color: '#475569' }}>
              Already have an account?{' '}
              <a href={(window as any).AppConfig?.routes?.login ?? '/login'} style={{ color: '#e11d48', fontWeight: 600 }}>
                Sign in
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
