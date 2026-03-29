import { ResumeAnalysis } from '@/src/services/gemini';
import { TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadialBarChart, 
  RadialBar, 
  PolarAngleAxis 
} from 'recharts';

interface AnalysisDashboardProps {
  analysis: ResumeAnalysis;
  onContinue: () => void;
}

export function AnalysisDashboard({ analysis, onContinue }: AnalysisDashboardProps) {
  const chartData = [
    { name: 'Score', value: analysis.score, fill: '#6366f1' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Two-card layout: Summary + Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Card — AI Summary ONLY */}
        <div className="glass-card rounded-3xl p-10 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-6 w-6 text-amber-400 fill-amber-400" />
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] font-display">AI Summary</h3>
          </div>
          <p className="text-[var(--color-text-secondary)] leading-relaxed text-[15px] flex-1">
            {analysis.summary}
          </p>
          <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent-glow)] text-[var(--color-accent)] text-sm font-medium border border-[var(--color-accent)]/20 w-fit">
            <TrendingUp className="h-4 w-4" />
            ATS Compatibility: {analysis.atsCompatibility}%
          </div>
        </div>

        {/* Right Card — Score ONLY */}
        <div className="glass-card rounded-3xl p-10 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-8">Overall Score</h3>
          <div className="relative h-56 w-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                innerRadius="78%" 
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
              <span className="text-7xl font-bold text-[var(--color-text-primary)] font-display">{analysis.score}</span>
              <span className="text-base font-medium text-[var(--color-text-muted)] mt-1">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Single CTA */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onContinue}
          className="flex items-center gap-3 px-10 py-4 rounded-full bg-[var(--color-accent)] text-white font-bold text-lg hover:bg-[var(--color-accent-muted)] transition-all duration-200 shadow-xl shadow-[var(--color-accent-glow)] hover:shadow-2xl hover:scale-[1.02]"
        >
          Continue to Editor & Suggestions
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
