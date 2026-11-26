import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number>(0);

  const faqs = [
    {
      q: "Why should I take this live cohort instead of free YouTube RAG tutorials?",
      a: "99% of online tutorials build 'toy RAG'—they take a clean 2-page text file, use RecursiveCharacterTextSplitter, insert 10 embeddings into ChromaDB, and call it a day. In the real world, documents are 77-page scanned manuals (like the MiG-29 manual in our repo) where standard extractors return 0 characters. Real production systems choke under 100+ document uploads and concurrency. This course teaches you multimodal vision indexing (ColPali), hybrid search, reranking, async FastAPI architectures, and evaluation systems that survive production."
    },
    {
      q: "When does the cohort start and what is the schedule?",
      a: "Cohort #1 officially begins on Sunday, 27 December 2026, from 3:00 PM IST onwards. Live interactive sessions are conducted on weekends (Saturdays and Sundays, 2.5 hours each) with live coding, Q&A, and direct repository reviews by Sachin Mishra. All live sessions are recorded with lifetime access."
    },
    {
      q: "What if I miss a live session due to work or personal commitments?",
      a: "Every single session is recorded and uploaded within 2 hours with timestamped chapters, Jupyter notebooks, Docker configs, and presentation slides. You have lifetime access to all recordings and future updates."
    },
    {
      q: "What are the technical prerequisites for this cohort?",
      a: "You should have basic-to-intermediate proficiency in Python (functions, classes, basic async/await concepts). You do NOT need a Ph.D. in mathematics or prior low-level C++ experience. We focus on production engineering: ColPali, vector databases, FastAPI, Docker, and distributed job queues."
    },
    {
      q: "How does the Career & Monetization module work?",
      a: "We dedicate entire sessions to turning your engineering superpower into income: (1) Ready-to-send ₹15,000 to ₹50,000+ client proposals and contract templates; (2) The internal promotion blueprint to switch or get promoted to Senior Gen AI Engineer (targeting 20-30 LPA); (3) System design mock interview drills; (4) The playbook to launch your own workshops and cohorts."
    },
    {
      q: "How does the payment integration work (UPI, GPay, PhonePe, Cards)?",
      a: "We support seamless 1-click Razorpay checkout (Google Pay, PhonePe, Paytm, Cards, NetBanking, EMI) for Indian students, direct scan-and-pay UPI QR codes, and Stripe for international students ($99 USD). Instant invoice and VIP Discord access are granted immediately upon payment."
    },
    {
      q: "What is your refund policy?",
      a: "We offer a 7-Day 100% No-Questions-Asked Money-Back Guarantee. Attend Week 1 live. If you don't feel the depth, multimodal architecture, and production repository are worth at least 10x what you paid, send us an email and receive a full 100% refund immediately."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white relative border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-mono text-xs mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Got Questions? We Have Answers.
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Everything you need to know about the live sessions, curriculum, and enrollment guarantee.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-slate-900">
                    {faq.q}
                  </span>
                  <div className="p-1 rounded-lg bg-slate-100 text-slate-600">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-teal-600" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
