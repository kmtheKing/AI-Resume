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
    { name: 'Score', value: analysis.score, fill: '#2563eb' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score Card */}
        <div className="lg:col-span-1 glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6">Overall Score</h3>
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
                <RadialBar background dataKey="value" cornerRadius={10} angleAxisId={0} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-slate-900 font-display">{analysis.score}</span>
              <span className="text-sm font-medium text-slate-500">/ 100</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            ATS Compatibility: {analysis.atsCompatibility}%
          </div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 font-display">AI Summary</h3>
          </div>
          <p className="text-slate-600 leading-relaxed mb-8">
            {analysis.summary}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Strengths
              </h4>
              <ul className="space-y-3">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Areas to Improve
              </h4>
              <ul className="space-y-3">
                {analysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
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
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900 font-display">Actionable Suggestions</h3>
          </div>
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Open Editor <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {analysis.suggestions.map((s, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                  {s.section}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{s.improvement}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{s.reason}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
