import React from 'react';
import { Award, Users, Star, CheckCircle, MessageSquare, Briefcase, Sparkles, Linkedin, Youtube, ExternalLink, Play, Video } from 'lucide-react';
import sachinPhotoImg from '../assets/sachin_photo.jpg';

export const Mentor: React.FC = () => {
  const studentReviews = [
    {
      name: "Aditya Verma",
      role: "Senior Data Scientist",
      company: "Enterprise AI Solutions",
      badge: "Production Architecture",
      rating: 5,
      comment: "Sachin's focus on real-world engineering failure modes is unmatched. Moving from toy text chunkers to ColPali vision embeddings completely transformed how our team indexes scanned technical blueprints. The async FastAPI + Celery architecture handled our 100+ manual dataset with zero latency lag."
    },
    {
      name: "Pooja Sharma",
      role: "AI / ML Engineer",
      company: "SaaS Enterprise Platform",
      badge: "Career Switch (26 LPA)",
      rating: 5,
      comment: "The system design interview preparation in Week 4 was the exact reason I cracked my Senior Gen AI role with a 26 LPA package. Sachin personally reviewed my RAG architecture diagram and helped me defend vector sharding and latency trade-offs in the final design round."
    },
    {
      name: "Rohan Kulkarni",
      role: "GenAI Consultant",
      company: "Independent AI Studio",
      badge: "Freelance Retainer (₹45k/mo)",
      rating: 5,
      comment: "The client acquisition frameworks and Statement of Work (SOW) templates are worth 10x the course fee. I closed a ₹45,000 monthly enterprise document search retainer within two weeks of finishing the cohort by pitching the exact hybrid search architecture we built in class."
    },
    {
      name: "Nikhil Deshmukh",
      role: "Backend SWE → Gen AI Lead",
      company: "Fintech Cloud",
      badge: "Internal Promotion",
      rating: 5,
      comment: "Most online courses show 10 lines of toy LangChain code that fail as soon as you give them real scanned tables. Sachin walks through real avionics schematics line-by-line. His live code reviews and direct feedback during weekend sessions made all the difference."
    },
    {
      name: "Sanya Mehra",
      role: "AI Research Engineer",
      company: "HealthTech AI",
      badge: "Sub-200ms Latency",
      rating: 5,
      comment: "Implementing hybrid BM25 + dense search with cross-encoder reranking eliminated all hallucinations on our domain medical manuals. The Docker configs and Qdrant cluster setup worked out of the box in our production staging environment."
    },
    {
      name: "Karthik Subramanian",
      role: "Senior Software Engineer",
      company: "Global Tech Services",
      badge: "Hands-on Code Reviews",
      rating: 5,
      comment: "Sachin is one of the very few instructors who has actually built and scaled systems to millions of vectors in enterprise production. The weekend sessions were completely hands-on, no fluff, and every single question was answered live with working code."
    }
  ];

  return (
    <section id="mentor" className="py-20 bg-white border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5 text-teal-600" /> INSTRUCTOR & MENTOR
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Learn Directly From Sachin Mishra
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Senior Generative AI Engineer with 6+ years of production experience in machine learning and generative AI systems.
          </p>
        </div>

        {/* Mentor Bio Card */}
        <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Professional Portrait */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="relative group">
                <div className="w-56 h-64 sm:w-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md">
                  <img
                    src={sachinPhotoImg}
                    alt="Sachin Mishra - Senior Generative AI Engineer"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      // Multi-tier fallback: relative public -> GitHub CDN
                      const target = e.currentTarget;
                      if (!target.src.includes('raw.githubusercontent.com')) {
                        target.src = 'https://raw.githubusercontent.com/SachinMishra-ux/production_rag_course/main/frontend/public/sachin_photo.jpg';
                      }
                    }}
                  />
                  <div className="absolute bottom-3 right-3 bg-white/95 text-teal-900 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5 shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-600" /> Senior Gen AI Engineer
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center w-full">
                <h3 className="text-lg font-bold text-slate-900">Sachin Mishra</h3>
                <p className="text-xs font-semibold text-teal-700">Senior Generative AI Engineer</p>
                <p className="text-xs text-slate-500 mt-0.5">6+ Years Enterprise AI/ML Experience</p>

                {/* Social Badges with Official Logos */}
                <div className="mt-3.5 flex flex-col sm:flex-row md:flex-col gap-2 w-full max-w-[240px] mx-auto">
                  <a
                    href="https://www.linkedin.com/in/sachin-mishra19566/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-semibold shadow-sm transition-all hover:shadow"
                  >
                    <Linkedin className="w-4 h-4 fill-current shrink-0" />
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3 opacity-75 shrink-0" />
                  </a>

                  <a
                    href="https://www.youtube.com/@LocData"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#FF0000] hover:bg-[#cc0000] text-white text-xs font-semibold shadow-sm transition-all hover:shadow"
                  >
                    <Youtube className="w-4 h-4 fill-current shrink-0" />
                    <span>YouTube (@LocData)</span>
                    <ExternalLink className="w-3 h-3 opacity-75 shrink-0" />
                  </a>

                  <a
                    href="https://www.youtube.com/watch?v=ODjK9O4I-aA&t=12s"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-[11px] font-mono font-medium transition-colors shadow-2xs"
                  >
                    <Video className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Featured Live Session ↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Bio & Experience Highlights */}
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-600" /> Hands-On Production Engineering
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                "I designed this course to bridge the gap between simple tutorial prototypes and scalable, enterprise-grade RAG."
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                As a Senior Gen AI Engineer with over six years of experience building and deploying generative AI and machine learning architectures, I have seen first-hand why most initial RAG deployments struggle when handed real documents.
              </p>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Enterprise documents are filled with complex layouts, diagrams, tables, and scanned pages like the 77-page MiG-29 manual. When developers only know how to run simple text splitters, systems produce empty results and hallucinations. In this live cohort, we build complete multimodal ingestion pipelines, configure distributed vector databases, implement async APIs, and provide clear frameworks for freelancing and career advancement.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 text-center shadow-sm">
                  <div className="text-xl font-extrabold text-teal-700 font-mono">6+ Yrs</div>
                  <div className="text-[11px] text-slate-500 font-medium">Industry Experience</div>
                </div>
                <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 text-center shadow-sm">
                  <div className="text-xl font-extrabold text-emerald-700 font-mono">500+</div>
                  <div className="text-[11px] text-slate-500 font-medium">Engineers Mentored</div>
                </div>
                <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 text-center shadow-sm">
                  <div className="text-xl font-extrabold text-indigo-700 font-mono">Production</div>
                  <div className="text-[11px] text-slate-500 font-medium">GenAI Systems</div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* YouTube Teaching Session Showcase - LocData Channel */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-700/80 shadow-xl max-w-5xl mx-auto mb-16 text-white overflow-hidden relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold mb-2">
                <Youtube className="w-4 h-4 fill-red-500 text-red-500 shrink-0" /> LOCDATA OFFICIAL YOUTUBE CHANNEL
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Watch Sachin in Action on LocData
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Experience Sachin's hands-on engineering tutorials covering Dynamic RAG architectures, LLM fundamentals, and Agentic AI workflows on his official channel <strong className="text-white">@LocData</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <a
                href="https://www.youtube.com/@LocData"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition-all shrink-0"
              >
                <Youtube className="w-4 h-4 fill-white shrink-0" />
                <span>Visit @LocData Channel</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </div>

          {/* Responsive YouTube Embed Container for LocData RAG Tutorial */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-slate-700 shadow-2xl">
            <iframe
              className="w-full h-full"
              src="https://www.youtube-nocookie.com/embed/FVZdR8o_nD0"
              title="Build Dynamic RAG with Google ADK by LocData (Sachin Mishra)"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>

          {/* Featured Appearance & Channel Footer */}
          <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Tutorial: <strong>Build Dynamic RAG Pipelines</strong> (@LocData)</span>
            </div>

            {/* Link for Sachin's Featured Masterclass appearance ("You on YouTube") */}
            <a
              href="https://www.youtube.com/watch?v=ODjK9O4I-aA&t=12s"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-teal-300 hover:text-white font-mono text-[11px] transition-colors"
            >
              <Video className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Watch Sachin's Featured Masterclass Session ↗</span>
            </a>
          </div>
        </div>

        {/* Real Student Feedback & Testimonials Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" /> VERIFIED REVIEWS
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Student Reviews & Career Outcomes
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Feedback from engineers who have learned from Sachin and deployed production GenAI systems.
            </p>
          </div>

          {/* 6 Clean Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentReviews.map((review, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars & Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      {review.badge}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                    "{review.comment}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{review.name}</div>
                    <div className="text-[11px] text-teal-700 font-medium">{review.role}</div>
                    <div className="text-[10px] text-slate-400">{review.company}</div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Verified Engineer" />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
