import React from 'react';
import { Terminal, Shield, ArrowUp, Zap, Linkedin, Youtube, ExternalLink, Calendar } from 'lucide-react';

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
              <div className="text-[11px] font-mono text-teal-700 flex flex-col gap-1">
                <div>Direct Contact: <a href="mailto:sachin19566@gmail.com" className="underline hover:text-slate-900 font-semibold">sachin19566@gmail.com</a></div>
                <div>WhatsApp: <a href="https://wa.me/918928450584" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-900 font-semibold">+91 8928450584</a></div>
              </div>

              {/* Social Channels with Official Logos */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href="https://www.linkedin.com/in/sachin-mishra19566/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] font-semibold text-xs transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 fill-current" />
                  <span>LinkedIn Profile</span>
                </a>

                <a
                  href="https://www.youtube.com/@LocData"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF0000]/10 hover:bg-[#FF0000]/20 text-[#FF0000] font-semibold text-xs transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5 fill-current" />
                  <span>YouTube: @LocData</span>
                </a>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <div className="font-semibold text-slate-900 font-mono uppercase tracking-wider text-xs mb-3">
                Curriculum & Labs
              </div>
              <ul className="space-y-2 font-mono text-xs">
                <li><a href="#sales-video" className="hover:text-teal-600 font-semibold text-slate-700">Course Overview Video</a></li>
                <li><a href="#video-overview" className="hover:text-teal-600">Architecture Demo</a></li>
                <li><a href="#curriculum" className="hover:text-teal-600">4-Week Syllabus</a></li>
                <li><a href="#monetization" className="hover:text-teal-600">Career & Freelancing ROI</a></li>
                <li><a href="#mentor" className="hover:text-teal-600">Instructor Bio</a></li>
                <li><a href="#pricing" className="hover:text-teal-600">Pricing & Guarantee</a></li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=ODjK9O4I-aA&t=12s"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-600 text-red-600/90 font-semibold flex items-center gap-1"
                  >
                    <Youtube className="w-3 h-3 fill-current shrink-0" />
                    <span>Watch Live Demo Video</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                </li>
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
                <li>
                  <a
                    href="https://discord.gg/fKXBsdr4H"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 font-semibold text-slate-700 flex items-center gap-1 transition-colors"
                  >
                    <span>Direct Code Reviews &amp; Discord VIP</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                </li>
                <li>Privacy Policy & Code of Conduct</li>
              </ul>
            </div>

          </div>

          {/* Cohort December Schedule Announcement Banner */}
          <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-teal-50/90 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs shadow-sm">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    Starts Sunday, 27 December 2026 (3:00 PM IST)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    Official Launch Date
                  </span>
                </div>
                <p className="text-slate-600 text-xs font-sans leading-relaxed">
                  We are officially starting Cohort #1 on <strong>Sunday, 27 December 2026, from 3:00 PM IST onwards</strong>. Live weekend coding sessions, multimodal RAG architecture breakdowns, and direct code reviews with Sachin Mishra. Secure your seat before early bird closes!
                </p>
              </div>
            </div>

            <button
              onClick={onOpenPayment}
              className="shrink-0 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-sm text-center flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-white text-white" />
              <span>Enroll &amp; Reserve Seat</span>
            </button>
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
              <span className="text-slate-900 font-semibold">Cohort #1 Starts Sun, 27 Dec 2026 (3:00 PM IST)</span>
              <span className="text-slate-500 ml-2">Weekend Sessions • Use Code <strong className="text-teal-700 font-bold">EARLYBIRD10</strong></span>
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
