import { useCallback, useState, useMemo } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle2, Loader2, Tag, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ResumeUploadProps {
  onUpload: (file: File, field: string) => void;
  isAnalyzing: boolean;
}

interface FieldItem {
  id: number;
  name: string;
  category: string;
  description: string;
}

const CATEGORY_COLORS: Record<string, { accent: string; glow: string; icon: string }> = {
  'Technology & Digital Infrastructure': { accent: '#6366f1', glow: 'rgba(99,102,241,0.15)', icon: '💻' },
  'Energy & Sustainability':             { accent: '#10b981', glow: 'rgba(16,185,129,0.15)', icon: '⚡' },
  'Healthcare & Life Sciences':          { accent: '#ec4899', glow: 'rgba(236,72,153,0.15)', icon: '🧬' },
  'Finance & Professional Services':     { accent: '#f59e0b', glow: 'rgba(245,158,11,0.15)', icon: '💼' },
  'Consumer, Logistics & Manufacturing': { accent: '#ef4444', glow: 'rgba(239,68,68,0.15)',  icon: '🏭' },
};

export function ResumeUpload({ onUpload, isAnalyzing }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Technology & Digital Infrastructure']));

  const fields: FieldItem[] = (window as any).AppConfig?.fieldsOfWork || [];

  // Group by category
  const grouped = useMemo(() => {
    const filtered = fields.filter(f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.category?.toLowerCase().includes(search.toLowerCase())
    );
    const map = new Map<string, FieldItem[]>();
    for (const f of filtered) {
      const cat = f.category || 'Other';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(f);
    }
    return map;
  }, [fields, search]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const onDrop = useCallback((acceptedFiles: File[], _fileRejections: FileRejection[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const dropzoneOptions: any = {
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    disabled: isAnalyzing
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);
  const selectedField = fields.find(f => f.name === selectedTag);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Industry Selector */}
      <div className="rounded-3xl border border-[var(--color-dark-border)] bg-[var(--color-dark-card)] p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h3 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text-primary)] font-display">
            <Tag className="h-5 w-5 text-[var(--color-accent)]" />
            Select Target Industry
          </h3>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search industries..."
              value={search}
              onChange={e => { setSearch(e.target.value); setExpandedCategories(new Set(Array.from(grouped.keys()))); }}
              className="pl-9 pr-4 py-2 rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors w-52"
            />
          </div>
        </div>

        {/* Category Groups */}
        <div className="space-y-3">
          {Array.from(grouped.entries()).map(([category, items]) => {
            const colorInfo = CATEGORY_COLORS[category] ?? { accent: '#6366f1', glow: 'rgba(99,102,241,0.15)', icon: '🏷️' };
            const isOpen = expandedCategories.has(category);

            return (
              <div
                key={category}
                className="rounded-2xl border border-[var(--color-dark-border)] overflow-hidden transition-all duration-300"
                style={{ boxShadow: isOpen ? `0 0 20px ${colorInfo.glow}` : 'none' }}
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-[var(--color-dark-hover)] transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{colorInfo.icon}</span>
                    <span className="font-bold text-[var(--color-text-primary)] text-sm">{category}</span>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: colorInfo.glow, color: colorInfo.accent }}
                    >
                      {items.length}
                    </span>
                  </div>
                  {isOpen
                    ? <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" />
                    : <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
                  }
                </button>

                {/* Tags */}
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 flex flex-wrap gap-2 bg-[var(--color-dark-surface)]/40">
                    {items.map(field => {
                      const isSelected = selectedTag === field.name;
                      return (
                        <button
                          key={field.id}
                          onClick={() => setSelectedTag(field.name)}
                          disabled={isAnalyzing}
                          className={cn(
                            'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border',
                            isSelected
                              ? 'text-white shadow-md'
                              : 'bg-[var(--color-dark-card)] text-[var(--color-text-secondary)] border-[var(--color-dark-border)] hover:text-[var(--color-text-primary)]',
                            isAnalyzing && 'opacity-50 cursor-not-allowed'
                          )}
                          style={isSelected ? {
                            background: colorInfo.accent,
                            borderColor: colorInfo.accent,
                            boxShadow: `0 4px 14px ${colorInfo.glow}`,
                          } : { borderColor: 'var(--color-dark-border)' }}
                          onMouseEnter={e => {
                            if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = colorInfo.accent;
                          }}
                          onMouseLeave={e => {
                            if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-dark-border)';
                          }}
                        >
                          {field.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {grouped.size === 0 && (
            <p className="text-center text-sm text-[var(--color-text-muted)] py-6">No industries match your search.</p>
          )}
        </div>

        {/* Selected Description */}
        {selectedField && (
          <div
            className="mt-4 p-4 rounded-xl border text-sm text-[var(--color-text-secondary)] transition-all duration-300"
            style={{
              background: CATEGORY_COLORS[selectedField.category]?.glow ?? 'var(--color-accent-glow)',
              borderColor: `${CATEGORY_COLORS[selectedField.category]?.accent ?? 'var(--color-accent)'}33`,
            }}
          >
            <span className="font-bold" style={{ color: CATEGORY_COLORS[selectedField.category]?.accent }}>
              {selectedField.name}:
            </span>{' '}
            {selectedField.description}
          </div>
        )}
      </div>

      {/* Dropzone + LinkedIn — side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* ── LEFT: Upload dropzone ── */}
        {!file ? (
          <div
            {...getRootProps()}
            className={cn(
              'relative group cursor-pointer rounded-3xl border-2 border-dashed p-8 transition-all duration-300 ease-in-out',
              isDragActive
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-glow)]'
                : 'border-[var(--color-dark-border)] bg-[var(--color-dark-card)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-dark-hover)]',
              isAnalyzing && 'opacity-50 cursor-not-allowed'
            )}
            style={{ minHeight: '260px' }}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className={cn(
                'mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
                isDragActive ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' : 'bg-[var(--color-dark-surface)] text-[var(--color-text-muted)]'
              )}>
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">
                {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
              </h3>
              <p className="mb-6 text-sm text-[var(--color-text-muted)] max-w-xs">
                Drag and drop your PDF, DOCX or TXT file here.
              </p>
              <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> PDF</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> DOCX</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> TXT</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-[var(--color-dark-border)] bg-[var(--color-dark-card)] p-6 shadow-lg flex flex-col gap-4 justify-between" style={{ minHeight: '260px' }}>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <FileText className="h-7 w-7" />
              </div>
              <div className="truncate flex-1">
                <h4 className="font-bold text-[var(--color-text-primary)] text-lg truncate">{file.name}</h4>
                <p className="text-sm text-[var(--color-text-muted)]">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              {!isAnalyzing && (
                <button
                  onClick={() => setFile(null)}
                  className="rounded-full p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-dark-hover)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => onUpload(file, selectedTag)}
              disabled={!file || !selectedTag || isAnalyzing}
              className={cn(
                'w-full px-8 py-3 rounded-full font-bold text-white transition-all duration-200',
                (!file || !selectedTag || isAnalyzing)
                  ? 'bg-[var(--color-dark-border)] text-[var(--color-text-muted)] cursor-not-allowed'
                  : 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-muted)] hover:shadow-lg hover:shadow-[var(--color-accent-glow)]'
              )}
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Analyzing...
                </span>
              ) : 'Analyze Resume'}
            </button>
          </div>
        )}

        {/* ── RIGHT: LinkedIn Generate Resume Box ── */}
        <LinkedInConnectBox selectedField={selectedTag} />
      </div>
    </div>
  );
}

/* ─── LinkedIn Generate Resume Box ──────────────────────────────────── */
function LinkedInConnectBox({ selectedField }: { selectedField: string }) {
  const AppConfig = (window as any).AppConfig;
  const baseUrl: string = AppConfig?.routes?.linkedinRedirect ?? '/auth/linkedin';

  // Pass the selected industry as a query param so the backend stores it for Gemini
  const redirectUrl = selectedField
    ? `${baseUrl}?field=${encodeURIComponent(selectedField)}`
    : baseUrl;

  return (
    <div
      className="rounded-3xl border border-[#0a66c2]/30 bg-[var(--color-dark-card)] p-8 flex flex-col justify-between gap-6 relative overflow-hidden"
      style={{ minHeight: '260px' }}
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute -top-10 -right-10 h-52 w-52 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #0a66c2 0%, transparent 70%)' }}
      />

      {/* OR divider — visual separator */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center h-8 w-8 rounded-full bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] text-xs font-bold text-[var(--color-text-muted)]">
        OR
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 relative z-10">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: 'linear-gradient(135deg,#0a66c2 0%,#0077b5 100%)' }}
        >
          <svg viewBox="0 0 24 24" fill="white" className="h-7 w-7">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
            Generate from LinkedIn
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
            No file needed. Our AI reads your LinkedIn profile and builds a professional, ATS-optimized resume instantly.
          </p>
        </div>
      </div>

      {/* Feature bullets */}
      <ul className="relative z-10 space-y-2">
        {[
          'Imports your work history & education',
          'AI writes & formats your resume for you',
          'Scored, analysed & editor-ready instantly',
        ].map((feat, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0a66c2]" />
            {feat}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="relative z-10 space-y-2">
        <a
          href={redirectUrl}
          id="btn-linkedin-generate"
          className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full font-bold text-white text-sm transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:shadow-[#0a66c2]/40 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#0a66c2 0%,#0077b5 100%)' }}
        >
          <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Generate Resume from LinkedIn
        </a>
        <p className="text-xs text-center text-[var(--color-text-muted)]">No account required · Powered by AI</p>
      </div>
    </div>
  );
}

