import React from 'react';
import { Play, CheckCircle2, FileText, Database, Cpu, TrendingUp, ArrowRight, ShieldCheck, Layers, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenPayment: () => void;
  onScrollToVideo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPayment, onScrollToVideo }) => {
  return (
    <section className="relative pt-12 pb-20 bg-gradient-to-b from-white via-slate-50 to-slate-100/60 border-b border-slate-200/70">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cohort Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-xs font-medium">
              3 to 4-Week Live Intensive Cohort • Weekends Live Online
            </span>
            <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
              BATCH #1
            </span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Why 95% of RAG Fails in Production —
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600">
              And How to Build Systems That Scale.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Standard RAG tutorials break when faced with real enterprise challenges: scanned PDFs with zero extractable text, complex technical schematics, multi-hundred document bulk ingestion, and high-concurrency traffic.
          </p>

          <p className="mt-3 text-sm text-teal-800 font-medium max-w-2xl mx-auto bg-teal-50/80 border border-teal-200/70 py-1.5 px-4 rounded-xl">
            Ingest 100-200+ heavy PDFs • Scale to millions of vectors • Deliver sub-200ms latency via async APIs • Monetize via freelance retainers (₹15k-₹50k) and senior AI roles (20-30 LPA).
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onOpenPayment}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm tracking-tight shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Enroll in Cohort (₹8,999 • Code EARLYBIRD10 for 10% Off)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onScrollToVideo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2.5"
            >
              <Play className="w-4 h-4 text-teal-600 fill-teal-600" />
              <span>Watch Architecture Walkthrough</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Complete Production Codebase Included
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" /> Live Weekend Classes + Lifetime Recordings
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" /> 1:1 Code Reviews with Sachin Mishra
            </span>
          </div>

        </div>

        {/* 4 Professional Metric Cards — Styled like Screenshot 2 */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">100-200+ PDFs</div>
            <div className="text-xs font-semibold text-teal-700 mt-0.5">Scanned Multimodal Ingestion</div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Handles dense technical manuals (e.g. 77-page MiG-29 manual) where standard OCR & extractors fail.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">1,000,000+</div>
            <div className="text-xs font-semibold text-emerald-700 mt-0.5">Vectors at Scale</div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Distributed HNSW vector indexing, hybrid BM25 + dense search, and cross-encoder reranking.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">&lt; 200 ms</div>
            <div className="text-xs font-semibold text-blue-700 mt-0.5">FastAPI & Async Streaming</div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Handles high concurrency with Celery worker queues, Redis semantic caching, and Docker.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">20-30 LPA</div>
            <div className="text-xs font-semibold text-amber-700 mt-0.5">Freelance & Job Switches</div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Target ₹15k-₹50k freelance gigs and 20-30 LPA compensation in AI Engineer & Senior AI roles.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
