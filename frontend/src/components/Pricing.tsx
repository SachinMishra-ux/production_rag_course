import React, { useState } from 'react';
import { Check, ShieldCheck, ArrowRight, Clock, Users, Tag, Sparkles, Copy, CheckCheck } from 'lucide-react';

interface PricingProps {
  onOpenPayment: () => void;
  seatsRemaining?: number;
}

export const Pricing: React.FC<PricingProps> = ({ onOpenPayment, seatsRemaining = 35 }) => {
  const [promoInput, setPromoInput] = useState('EARLYBIRD10');
  const [isPromoApplied, setIsPromoApplied] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [promoError, setPromoError] = useState('');

  const basePrice = 8999;
  const originalPrice = 19999;
  const discountAmount = isPromoApplied ? Math.round(basePrice * 0.10) : 0;
  const finalPrice = basePrice - discountAmount;

  const handleApplyPromo = (codeToApply?: string) => {
    const code = (codeToApply || promoInput).trim().toUpperCase();
    if (code === 'EARLYBIRD10' || code === 'EARLYBIRD' || code === 'RAG10' || code === 'SACHIN10') {
      setIsPromoApplied(true);
      setPromoError('');
    } else {
      setIsPromoApplied(false);
      setPromoError('Invalid promo code. Use EARLYBIRD10 for 10% off.');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('EARLYBIRD10');
    setCopiedCode(true);
    setIsPromoApplied(true);
    setPromoError('');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="pricing" className="py-20 bg-slate-50/70 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-mono text-xs mb-3">
            <Clock className="w-3.5 h-3.5" /> EARLY BIRD REGISTRATION OPEN
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cohort All-Access Tuition
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Strictly limited to 35 engineers per cohort so every student receives direct code reviews, architecture feedback, and career positioning from Sachin Mishra.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-xl mx-auto">
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 p-7 sm:p-10 space-y-6">
            
            {/* Header */}
            <div className="border-b border-slate-100 pb-6 text-center">
              <span className="text-[11px] font-mono text-teal-700 font-semibold bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                LIVE INTERACTIVE COHORT
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">Full Masterclass Pass</h3>
              <p className="text-xs font-mono text-slate-500 mt-1">4 Weeks Live • Production Codebase • 20-30 LPA Interview Kit • Freelance Retainers</p>
              
              {/* Price Display */}
              <div className="mt-5 flex items-baseline justify-center gap-3 font-mono">
                <span className="text-slate-400 line-through text-lg sm:text-xl">₹{originalPrice.toLocaleString('en-IN')}</span>
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 font-semibold">INR</span>
              </div>

              {isPromoApplied ? (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Code <strong>EARLYBIRD10</strong> Applied: Extra 10% Off (-₹{discountAmount.toLocaleString('en-IN')})</span>
                </div>
              ) : (
                <div className="text-xs text-slate-500 font-mono mt-2">
                  Standard Price: ₹{basePrice.toLocaleString('en-IN')} INR
                </div>
              )}

              <div className="text-xs text-slate-500 font-mono mt-1.5">
                (International Students: $99 USD via Stripe / Card)
              </div>

              <div className="mt-3.5 inline-flex items-center gap-2 text-xs font-mono text-slate-700 bg-teal-50/70 py-1.5 px-3.5 rounded-full border border-teal-200">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                <span>Cohort Cap: 35 Seats • <strong className="text-teal-800 font-bold">{seatsRemaining} seats remaining</strong></span>
              </div>

              {/* Promo Code Input & Copy Box */}
              <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-600 font-mono flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-teal-600" /> Have an Early Bird Promo Code?
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="text-teal-600 hover:text-teal-700 font-mono text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    {copiedCode ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Applied!' : 'Copy: EARLYBIRD10'}</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="ENTER PROMO CODE"
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-800 placeholder-slate-400 uppercase focus:outline-none focus:border-teal-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPromo()}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-mono text-xs font-semibold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <div className="text-rose-600 text-[11px] font-mono mt-1.5">{promoError}</div>
                )}
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1 rounded text-xs font-mono text-slate-600">
                <Users className="w-3.5 h-3.5 text-teal-600" /> 8 of 35 Early Bird Seats Remaining
              </div>
            </div>

            {/* What is Included List */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="font-mono text-xs uppercase text-slate-500 tracking-wider font-semibold">
                Included in Your Enrollment:
              </div>
              
              {[
                "4 Weeks of Live Weekend Interactive Coding Sessions with Sachin Mishra",
                "Complete Production Codebase: FastAPI + ColPali + Hybrid Vector DB + Redis + Docker",
                "Scanned MiG-29 Manual & 200+ Heavy Technical Document Stress-Test Dataset",
                "Production Deployment Configurations for Docker, AWS & GCP",
                "Freelance Consulting Playbook: SOWs, RFP Templates & Client Pitches (₹15k-₹50k+)",
                "Senior AI Engineer (20-30 LPA) Interview System Design Kit",
                "Private VIP Discord Community for 1:1 Code Reviews & Discussions",
                "Lifetime Access to All Class Recordings, Notebooks & Architecture Slides"
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs text-slate-600 leading-snug">{feat}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                onClick={onOpenPayment}
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm font-mono shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Enroll in Cohort 1 Now (₹{finalPrice.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-2.5 text-center text-[11px] text-slate-500 font-mono flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Instant Discord Invite • 7-Day 100% Money-Back Guarantee</span>
              </div>
            </div>

            {/* Guarantee Box */}
            <div className="rounded-xl p-3.5 bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800">7-Day Guarantee:</span> Attend the first week of live classes. If you feel the depth and codebase do not meet your expectations, request a 100% full refund immediately with no questions asked.
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
