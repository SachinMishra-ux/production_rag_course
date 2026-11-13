import React, { useState, useEffect } from 'react';
import { Terminal, Clock, Menu, X, Sparkles, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenPayment: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPayment }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 28, seconds: 14 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Top Announcement Banner */}
      <div className="bg-teal-50/90 text-teal-900 text-xs py-2 px-4 border-b border-teal-100 text-center flex items-center justify-center gap-2.5 sm:gap-3 sticky top-0 z-50 font-medium">
        <span className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0">
          <Sparkles className="w-3 h-3 text-teal-600" /> Cohort 1 Enrollment Open
        </span>
        <span className="hidden md:inline text-teal-800">
          Limited to 35 engineers for hands-on code reviews & live architecture sessions.
        </span>
        <span className="inline-flex items-center gap-1 text-teal-900 font-semibold text-[11px] sm:text-xs shrink-0">
          <Clock className="w-3.5 h-3.5 text-teal-600" /> Early Bird (Code: EARLYBIRD10): {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>

      {/* Main Clean Light Navbar */}
      <nav className={`sticky top-[33px] z-40 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-3 shadow-sm' : 'bg-white/90 backdrop-blur-sm border-b border-slate-200/60 py-3.5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-600/30 group-hover:bg-teal-700 transition-colors shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-tight text-base sm:text-lg text-slate-900 font-sans whitespace-nowrap">
                    Production<span className="text-teal-600">.RAG</span>
                  </span>
                  <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                    LIVE COHORT
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal hidden sm:block whitespace-nowrap">
                  By Sachin Mishra • Senior Gen AI Engineer
                </p>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-5 lg:gap-7 text-xs font-semibold uppercase tracking-wider text-slate-600 shrink-0">
              <a href="#video-overview" className="hover:text-teal-600 transition-colors whitespace-nowrap">Overview</a>
              <a href="#curriculum" className="hover:text-teal-600 transition-colors whitespace-nowrap">Curriculum</a>
              <a href="#monetization" className="hover:text-teal-600 transition-colors text-teal-700 whitespace-nowrap">Career ROI</a>
              <a href="#mentor" className="hover:text-teal-600 transition-colors whitespace-nowrap">Instructor</a>
              <a href="#pricing" className="hover:text-teal-600 transition-colors whitespace-nowrap">Pricing</a>
              <a href="#faq" className="hover:text-teal-600 transition-colors whitespace-nowrap">FAQ</a>
            </div>

            {/* Action CTA */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={onOpenPayment}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm tracking-tight transition-all shadow-sm hover:shadow flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap"
              >
                <span>Enroll Now</span>
                <span className="bg-teal-700/60 px-2 py-0.5 rounded-md text-[11px] font-mono hidden sm:inline">₹8,099</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-slate-600 hover:text-slate-900 p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-3 text-sm font-medium text-slate-700 shadow-lg">
            <a href="#video-overview" onClick={() => setMobileMenuOpen(false)} className="block hover:text-teal-600">Video Walkthrough</a>
            <a href="#curriculum" onClick={() => setMobileMenuOpen(false)} className="block hover:text-teal-600">Curriculum (4 Weeks)</a>
            <a href="#monetization" onClick={() => setMobileMenuOpen(false)} className="block text-teal-700 font-semibold">Career & Freelancing ROI</a>
            <a href="#mentor" onClick={() => setMobileMenuOpen(false)} className="block hover:text-teal-600">Instructor: Sachin Mishra</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block hover:text-teal-600">Pricing & Guarantee</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block hover:text-teal-600">FAQ</a>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenPayment(); }}
              className="w-full py-2.5 bg-teal-600 text-white font-semibold rounded-xl text-center shadow-sm"
            >
              Enroll Now (₹8,099 with code EARLYBIRD10)
            </button>
          </div>
        )}
      </nav>
    </>
  );
};
