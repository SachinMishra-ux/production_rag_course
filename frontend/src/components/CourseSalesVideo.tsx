import React from 'react';
import { Play, Sparkles, Zap, Calendar, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface CourseSalesVideoProps {
  onOpenPayment: () => void;
}

export const CourseSalesVideo: React.FC<CourseSalesVideoProps> = ({ onOpenPayment }) => {
  return (
    <section id="sales-video" className="py-16 sm:py-24 bg-gradient-to-b from-slate-100/60 via-white to-slate-50 relative border-t border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 font-mono text-xs font-bold mb-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span>OFFICIAL COURSE OVERVIEW &amp; SALES VIDEO</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Watch the Complete Cohort Walkthrough
          </h2>

          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Sachin Mishra breaks down why 95% of RAG pipelines fail on real enterprise documents, what we build live line-by-line across 4 weeks, and why this cohort is engineered for real production systems.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="bg-white rounded-3xl p-3 sm:p-5 border border-slate-200/90 shadow-2xl shadow-slate-200/70">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-slate-800 shadow-inner">
            <iframe
              className="w-full h-full"
              src="https://www.youtube-nocookie.com/embed/LR_apdFp62E?rel=0"
              title="Production RAG Live Masterclass - Official Course Overview & Sales Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>

          {/* Under-Video Highlights & Quick Enrollment Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-slate-600">
              <span className="flex items-center gap-1.5 text-teal-800 font-bold">
                <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Starts Sun, 27 Dec 2026 (3:00 PM IST)</span>
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Weekends Live Online</span>
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>7-Day 100% Refund Guarantee</span>
              </span>
            </div>

            <button
              onClick={onOpenPayment}
              className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 group shrink-0"
            >
              <Zap className="w-3.5 h-3.5 fill-white text-white" />
              <span>Enroll Now (₹8,099 • EARLYBIRD10)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
