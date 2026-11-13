import React from 'react';
import { Terminal, Shield, ArrowUp, Zap } from 'lucide-react';

interface FooterProps {
  onOpenPayment: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPayment }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-white border-t border-slate-200 pt-14 pb-28 sm:pb-14 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            
            {/* Col 1: Brand */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                  <Terminal className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 text-base font-mono">
                  PRODUCTION<span className="text-teal-600">.RAG</span>
                </span>
              </div>
              <p className="text-slate-600 max-w-sm leading-relaxed text-xs">
                A 3-4 week live intensive cohort on building, scaling, and deploying multimodal production RAG systems. Mentored by Sachin Mishra.
              </p>
              <div className="text-[11px] font-mono text-teal-700">
                Direct Contact: <a href="mailto:contact@productionrag.dev" className="underline hover:text-slate-900">contact@productionrag.dev</a>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <div className="font-semibold text-slate-900 font-mono uppercase tracking-wider text-xs mb-3">
                Curriculum & Labs
              </div>
              <ul className="space-y-2 font-mono text-xs">
                <li><a href="#video-overview" className="hover:text-teal-600">Architecture Demo</a></li>
                <li><a href="#curriculum" className="hover:text-teal-600">4-Week Syllabus</a></li>
                <li><a href="#monetization" className="hover:text-teal-600">Career & Freelancing ROI</a></li>
                <li><a href="#mentor" className="hover:text-teal-600">Instructor Bio</a></li>
                <li><a href="#pricing" className="hover:text-teal-600">Pricing & Guarantee</a></li>
              </ul>
            </div>

            {/* Col 3: Trust & Policies */}
            <div>
              <div className="font-semibold text-slate-900 font-mono uppercase tracking-wider text-xs mb-3">
                Guarantees
              </div>
              <ul className="space-y-2 font-mono text-xs">
                <li className="flex items-center gap-1.5 text-emerald-600">
                  <Shield className="w-3.5 h-3.5" /> 7-Day Money-Back Guarantee
                </li>
                <li>Secure 256-Bit SSL Checkout</li>
                <li>Direct Code Reviews & Discord VIP</li>
                <li>Privacy Policy & Code of Conduct</li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
            <div>
              © 2025-2026 Production RAG Masterclass by Sachin Mishra. All rights reserved.
            </div>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-500 hover:text-teal-600 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </footer>

      {/* Floating Bottom Sticky Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
            </span>
            <div className="text-xs font-mono">
              <span className="text-slate-900 font-semibold">Cohort #1 Live Classes</span>
              <span className="text-slate-500 ml-2">Weekend Sessions • Use Code <strong className="text-teal-700">EARLYBIRD10</strong> for 10% Off</span>
            </div>
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Cohort Tuition</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 font-mono">
                ₹8,099 <span className="text-xs text-slate-400 line-through">₹8,999</span>
              </div>
            </div>

            <button
              onClick={onOpenPayment}
              className="px-5 py-2 sm:py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm font-mono shadow-md transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-white text-white" />
              <span>Enroll Now</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
