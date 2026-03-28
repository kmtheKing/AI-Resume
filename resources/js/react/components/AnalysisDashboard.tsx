import { ResumeAnalysis } from '@/src/services/gemini';
import { 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Target, 
  Zap, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadialBarChart, 
  RadialBar, 
  PolarAngleAxis 
} from 'recharts';
import { motion } from 'motion/react';

interface AnalysisDashboardProps {
  analysis: ResumeAnalysis;
  onEdit: () => void;
}

export function AnalysisDashboard({ analysis, onEdit }: AnalysisDashboardProps) {
  const chartData = [
    { name: 'Score', value: analysis.score, fill: '#6366f1' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score Card */}
        <div className="lg:col-span-1 glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-6">Overall Score</h3>
          <div className="relative h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                innerRadius="80%" 
                outerRadius="100%" 
                data={chartData} 
                startAngle={90} 
                endAngle={450}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: 'var(--color-dark-surface)' }} dataKey="value" cornerRadius={10} angleAxisId={0} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-[var(--color-text-primary)] font-display">{analysis.score}</span>
              <span className="text-sm font-medium text-[var(--color-text-muted)]">/ 100</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent-glow)] text-[var(--color-accent)] text-sm font-medium border border-[var(--color-accent)]/20">
            <TrendingUp className="h-4 w-4" />
            ATS Compatibility: {analysis.atsCompatibility}%
          </div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] font-display">AI Summary</h3>
          </div>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
            {analysis.summary}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Strengths
              </h4>
              <ul className="space-y-3">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Areas to Improve
              </h4>
              <ul className="space-y-3">
                {analysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-[var(--color-accent)]" />
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] font-display">Actionable Suggestions</h3>
          </div>
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] hover:text-[#818cf8] transition-colors"
          >
            Open Editor <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {analysis.suggestions.map((s, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -4 }}
              className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-2xl p-6 hover:border-[var(--color-accent)]/30 hover:shadow-lg hover:shadow-[var(--color-accent-glow)] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-lg bg-[var(--color-dark-surface)] text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider">
                  {s.section}
                </span>
                <ChevronRight className="h-4 w-4 text-[var(--color-dark-border)]" />
              </div>
              <h4 className="font-bold text-[var(--color-text-primary)] mb-2">{s.improvement}</h4>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{s.reason}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
