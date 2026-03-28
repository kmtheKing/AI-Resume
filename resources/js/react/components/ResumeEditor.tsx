import { useState } from 'react';
import { 
  Sparkles, 
  Save, 
  Undo2, 
  Redo2, 
  Layout,
  Eye,
  Loader2,
  Check
} from 'lucide-react';
import { improveResumeSection } from '@/src/services/gemini';
import { cn } from '@/src/lib/utils';

interface ResumeEditorProps {
  initialContent: string;
}

export function ResumeEditor({ initialContent }: ResumeEditorProps) {
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

  return (
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
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-text-primary)] text-[var(--color-dark-bg)] rounded-xl text-sm font-bold hover:opacity-90 transition-all">
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-[var(--color-dark-card)] custom-scrollbar">
          {view === 'edit' ? (
            <textarea
              className="w-full h-full resize-none border-none focus:ring-0 bg-transparent text-[var(--color-text-secondary)] leading-relaxed font-sans text-lg outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onMouseUp={() => setSelection(window.getSelection()?.toString() || '')}
              placeholder="Paste your resume content here..."
            />
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-[var(--color-text-secondary)] leading-relaxed text-lg">
                {content}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Tips */}
        <div className="w-72 border-l border-[var(--color-dark-border)] bg-[var(--color-dark-surface)] p-6 hidden xl:block">
          <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-6">Writing Tips</h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[var(--color-accent)]">
                <Check className="h-4 w-4" />
                <span className="text-sm font-bold">Use Action Verbs</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Instead of "Responsible for", use "Led", "Developed", or "Managed".
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[var(--color-accent)]">
                <Check className="h-4 w-4" />
                <span className="text-sm font-bold">Quantify Impact</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Add numbers like "Increased sales by 20%" or "Saved $5k monthly".
              </p>
            </div>
            <div className="mt-8 p-4 bg-[var(--color-accent-glow)] rounded-2xl border border-[var(--color-accent)]/20">
              <p className="text-xs text-[var(--color-accent)] font-medium leading-relaxed">
                <Sparkles className="h-3 w-3 inline mr-1" />
                Highlight any text and click "AI Improve" to rewrite it professionally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
