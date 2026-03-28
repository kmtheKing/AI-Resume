import { useState } from 'react';
import { 
  Sparkles, 
  Save, 
  Undo2, 
  Redo2, 
  Type as TypeIcon,
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
    <div className="flex flex-col h-[700px] bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
            <button 
              onClick={() => setView('edit')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                view === 'edit' ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Layout className="h-4 w-4" /> Editor
            </button>
            <button 
              onClick={() => setView('preview')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                view === 'preview' ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Eye className="h-4 w-4" /> Preview
            </button>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all"><Undo2 className="h-4 w-4" /></button>
            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all"><Redo2 className="h-4 w-4" /></button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleImprove}
            disabled={!selection || isImproving}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
              selection 
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            {isImproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            AI Improve
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-white custom-scrollbar">
          {view === 'edit' ? (
            <textarea
              className="w-full h-full resize-none border-none focus:ring-0 text-slate-700 leading-relaxed font-sans text-lg"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onMouseUp={() => setSelection(window.getSelection()?.toString() || '')}
              placeholder="Paste your resume content here..."
            />
          ) : (
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
                {content}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Tips */}
        <div className="w-72 border-l border-slate-100 bg-slate-50/30 p-6 hidden xl:block">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Writing Tips</h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600">
                <Check className="h-4 w-4" />
                <span className="text-sm font-bold">Use Action Verbs</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instead of "Responsible for", use "Led", "Developed", or "Managed".
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600">
                <Check className="h-4 w-4" />
                <span className="text-sm font-bold">Quantify Impact</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add numbers like "Increased sales by 20%" or "Saved $5k monthly".
              </p>
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-xs text-blue-700 font-medium leading-relaxed">
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
