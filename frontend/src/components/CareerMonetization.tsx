import React, { useState } from 'react';
import { DollarSign, Briefcase, Award, GraduationCap, TrendingUp, CheckCircle2, Calculator } from 'lucide-react';

export const CareerMonetization: React.FC = () => {
  const [consultingDeals, setConsultingDeals] = useState<number>(3);
  const [avgDealSizeINR, setAvgDealSizeINR] = useState<number>(35000); // 15k to 1L
  const [currentSalaryLakhs, setCurrentSalaryLakhs] = useState<number>(16);
  const [targetSalaryLakhs, setTargetSalaryLakhs] = useState<number>(26); // 20 to 30 LPA

  const totalFreelanceIncomeINR = consultingDeals * avgDealSizeINR;
  const salaryIncreaseLakhs = Math.max(0, targetSalaryLakhs - currentSalaryLakhs);

  return (
    <section id="monetization" className="py-20 bg-slate-50/70 relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
            <DollarSign className="w-3.5 h-3.5 text-teal-600" /> CAREER & MONETIZATION BLUEPRINT
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Converting Engineering Skills into Tangible Career ROI
          </h2>
          <p className="mt-3 text-slate-600 text-sm leading-relaxed">
            Building production-grade multimodal RAG is a high-value skill. This course prepares you to apply this capability directly for client consulting, internal promotions, and senior AI roles.
          </p>
        </div>

        {/* 4 Realistic Pathways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          
          {/* Card 1: Freelancing & Client Projects */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-semibold font-mono">
                ₹15,000 - ₹50,000 (Up to ₹1L)
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              1. Freelancing & Enterprise Client Projects
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              SMBs and enterprises have legacy manuals, policy documents, and contracts that need searchable RAG systems. We provide clear frameworks to scope, deliver, and maintain these systems.
            </p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Standardized scope-of-work (SOW) & proposal templates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Monthly maintenance retainer structures for continuous evaluation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Positioning yourself as a specialized GenAI implementation partner</span>
              </li>
            </ul>
          </div>

          {/* Card 2: AI Engineer & Senior AI Engineer Roles */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold font-mono">
                20 LPA - 30 LPA
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              2. Job Switches & Promotions in AI Engineering
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              A realistic and competitive compensation range for skilled AI Engineers and Senior AI Engineers in product companies and tech firms is 20 to 30 LPA.
            </p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>How to demonstrate measurable latency & cost reduction on RAG pipelines</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Leading architectural reviews for vector database scaling & hybrid search</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Positioning for appraisal hikes and senior title transitions</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Cracking System Design Interviews */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold font-mono">
                INTERVIEW PREP
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              3. Cracking Gen AI System Design Interviews
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Master the trade-offs that interviewers test: vector quantization, chunking methods, re-ranking overhead, caching strategies, and grounding evaluation.
            </p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Vector index trade-offs: HNSW vs IVF-PQ vs DiskANN</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Handling multi-tenant document isolation and security RBAC</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Evaluation metrics: Faithfulness, Answer Relevancy & Context Recall</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Teaching & Building Workshops */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold font-mono">
                WORKSHOPS & MENTORING
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              4. Teaching, Workshops & Knowledge Sharing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Learn how Sachin structures hands-on workshops, develops compelling syllabi, and builds a reputable voice in the AI developer ecosystem.
            </p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Structuring hands-on technical labs that keep students engaged</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Creating high-quality open-source portfolio repositories</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Delivering technical talks and company brown-bag sessions</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Realistic ROI Calculator */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Career & Freelancing Upside Calculator</h4>
              <p className="text-xs text-slate-500">Simulate potential project revenue and compensation changes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Sliders */}
            <div className="space-y-5">
              
              {/* Freelance Deals */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-600">Client Projects / Freelance Gigs:</span>
                  <span className="text-teal-700 font-bold font-mono">{consultingDeals} projects</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={consultingDeals}
                  onChange={(e) => setConsultingDeals(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              {/* Deal Size */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-600">Average Project Value:</span>
                  <span className="text-teal-700 font-bold font-mono">₹{avgDealSizeINR.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="100000"
                  step="5000"
                  value={avgDealSizeINR}
                  onChange={(e) => setAvgDealSizeINR(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>₹15,000 (Basic RAG)</span>
                  <span>₹50,000 (Enterprise)</span>
                  <span>₹1,00,000 (Custom Multimodal)</span>
                </div>
              </div>

              {/* Target Salary */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-600">Target Role Compensation (LPA):</span>
                  <span className="text-emerald-700 font-bold font-mono">{targetSalaryLakhs} LPA</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="30"
                  step="1"
                  value={targetSalaryLakhs}
                  onChange={(e) => setTargetSalaryLakhs(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>20 LPA (AI Engineer)</span>
                  <span>30 LPA (Senior AI Engineer)</span>
                </div>
              </div>

            </div>

            {/* Projections Display */}
            <div className="rounded-2xl p-5 bg-slate-50 border border-slate-200/80 text-center space-y-4 font-mono">
              <div>
                <div className="text-xs text-teal-800 font-semibold uppercase tracking-wider">
                  Projected Freelance Revenue
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">
                  ₹{totalFreelanceIncomeINR.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Across {consultingDeals} client engagements
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                  Target Salary Band
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">
                  {targetSalaryLakhs} LPA
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Realistic range for Senior Gen AI Engineers
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 font-sans leading-relaxed">
                Cohort tuition is <strong className="text-slate-900">₹8,999</strong> (<strong className="text-teal-700 font-semibold">₹8,099</strong> with code <span className="font-mono bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 text-teal-800 font-bold">EARLYBIRD10</span>). Completing a single freelance project at ₹15,000+ pays back the entire investment multiple times over.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
