import React, { useState } from 'react';
import { BookOpen, Layers, Cpu, TrendingUp, CheckCircle, ChevronDown, ChevronUp, Code, Sparkles } from 'lucide-react';

export const Curriculum: React.FC = () => {
  const [openWeek, setOpenWeek] = useState<number>(0);

  const curriculumData = [
    {
      week: "WEEK 1",
      title: "Multimodal Ingestion & Complex Document Engineering",
      subtitle: "Solving the Scanned Manual Crisis (The MiG-29 Challenge)",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
      activeBorder: "border-teal-500 ring-1 ring-teal-500/20",
      deliverable: "Multimodal Ingestion Pipeline capable of parsing 200+ heavy scanned PDFs without missing a single diagram or table.",
      modules: [
        {
          title: "Session 1: The Anatomy of RAG Failures in Production",
          topics: [
            "Why standard tutorials (PyPDFLoader, TextSplitter) return 0 characters on real enterprise documents",
            "Analyzing the 77-page MiG-29 flight manual: raster layers, complex cockpit gauges & technical schematics",
            "Naive chunking failure modes: context fragmentation, lost cross-page references, and hallucination propagation"
          ]
        },
        {
          title: "Session 2: ColPali & Vision Document Embeddings",
          topics: [
            "Introduction to ColPali (ColBERT + PaliGemma): Patch-level late-interaction visual embeddings",
            "Bypassing text extraction entirely: embedding scanned pages directly as visual tokens",
            "Indexing charts, cockpit dials, electrical wiring, and flowcharts with spatial coordinates"
          ]
        },
        {
          title: "Session 3: Layout-Aware Parsing & Hierarchical Chunking",
          topics: [
            "Hybrid layout extraction: LayoutLM, Surya, and Vision LLM table-to-markdown parsers",
            "Parent-Child & Propositional Chunking: Keeping parent document context while retrieving precision sentences",
            "Metadata enrichment: auto-generating page, section, chapter, and diagram bounding box tags"
          ]
        },
        {
          title: "Session 4: Bulk Ingestion Lab (100-200 PDFs Concurrently)",
          topics: [
            "Architecting parallel batch ingestion for 200+ heavy technical manuals (multi-gigabyte workloads)",
            "Memory management: preventing out-of-memory (OOM) crashes during heavy rasterization",
            "Building our automated preprocessing pipeline with checkpointing and error resumption"
          ]
        }
      ]
    },
    {
      week: "WEEK 2",
      title: "Advanced Retrieval & Scaling to Millions of Vectors",
      subtitle: "Sub-Second Latency Across Massive Multi-Tenant Vector Stores",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      activeBorder: "border-emerald-500 ring-1 ring-emerald-500/20",
      deliverable: "High-throughput Hybrid Vector Search Engine capable of querying 1M+ embeddings in < 60ms.",
      modules: [
        {
          title: "Session 5: Vector Indexing & Optimization at Scale",
          topics: [
            "Deep dive into HNSW (Hierarchical Navigable Small World) graphs: M, efConstruction, and efSearch trade-offs",
            "Vector quantization: Scalar Quantization (SQ8) & Product Quantization (PQ) to slash RAM by 75%",
            "Benchmarking Qdrant, Milvus, pgvector, and Pinecone for enterprise cost vs performance"
          ]
        },
        {
          title: "Session 6: Hybrid Search Mastery (Dense + Sparse Fusion)",
          topics: [
            "Why dense embeddings fail on exact part numbers (e.g., 'MiG-29 Valve 14-B')",
            "Combining Sparse BM25 / SPLADE with Dense ColPali / BGE vectors",
            "Reciprocal Rank Fusion (RRF) and Relative Score Fusion (RSF) with tuned weights"
          ]
        },
        {
          title: "Session 7: Two-Stage Re-ranking with Cross-Encoders",
          topics: [
            "Cross-Encoder architectures: Cohere Rerank 3 and BGE-Reranker-Large in production",
            "Context window compression: filtering the top-100 candidates down to top-5 ultra-grounded passages",
            "Reducing token consumption and slashing LLM inference costs by 65%"
          ]
        },
        {
          title: "Session 8: Multi-Tenancy, Sharding & Security RBAC",
          topics: [
            "Hard multi-tenant isolation vs soft namespace filtering in vector databases",
            "Role-Based Access Control (RBAC): ensuring users only retrieve documents they are authorized to see",
            "Horizontal vector sharding and failover replicas for 99.99% uptime"
          ]
        }
      ]
    },
    {
      week: "WEEK 3",
      title: "High-Concurrency Async APIs & Production Deployment",
      subtitle: "Serving Thousands of Users with Sub-200ms Response Times",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      activeBorder: "border-blue-500 ring-1 ring-blue-500/20",
      deliverable: "Production-ready FastAPI microservice with SSE streaming, Redis semantic caching, Docker & Cloud deployment.",
      modules: [
        {
          title: "Session 9: High-Performance Async FastAPI Backend",
          topics: [
            "Why synchronous Python locks up under 50 users: writing truly asynchronous async/await endpoints",
            "Server-Sent Events (SSE) streaming tokens to the frontend with token-by-token citations",
            "Pydantic V2 validation, structured JSON outputs, and OpenAPI documentation"
          ]
        },
        {
          title: "Session 10: Background Worker Queues (Celery & Redis Streams)",
          topics: [
            "Decoupling heavy 200-PDF ingestion from user query requests",
            "Building distributed worker queues with Celery, Redis Streams, and Ray",
            "Real-time ingestion progress webhooks and retry backoff strategies"
          ]
        },
        {
          title: "Session 11: Semantic Caching & Latency Optimization",
          topics: [
            "Implementing Redis Semantic Cache: answering recurring queries in 8ms with zero LLM API cost",
            "Dynamic cache invalidation when underlying manuals or policies update",
            "Connection pooling, batch embedding lookups, and latency profiling (p50, p95, p99)"
          ]
        },
        {
          title: "Session 12: Docker, Cloud Deployment & Kubernetes",
          topics: [
            "Multi-stage Docker builds optimized for minimal GPU/CPU container size",
            "Deploying on AWS ECS / GCP Cloud Run / Kubernetes with Horizontal Pod Autoscaling (HPA)",
            "Environment configuration, secrets management, and automated CI/CD deployment pipelines"
          ]
        }
      ]
    },
    {
      week: "WEEK 4",
      title: "Stress Testing, Grounding Evaluation & Monetization Blueprint",
      subtitle: "Turn Your Engineering Mastery into Clients, Promotions & Cohorts",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      activeBorder: "border-amber-500 ring-1 ring-amber-500/20",
      deliverable: "Complete Evaluation Suite + Ready-to-Send Enterprise Consulting Proposals + Senior AI Interview Kit.",
      modules: [
        {
          title: "Session 13: Automated Evaluation & Red-Teaming (Ragas & TruLens)",
          topics: [
            "Building an automated CI/CD evaluation harness: Faithfulness, Answer Relevancy, Context Recall",
            "Synthetic test set generation: generating 500 edge-case test questions from raw documents",
            "Guardrails & Red-Teaming: preventing prompt injection, toxic outputs, and unauthorized document leaks"
          ]
        },
        {
          title: "Session 14: The ₹15k-₹50k Freelance Consulting Playbook",
          topics: [
            "How to find SMB & enterprise clients who need legacy manual search & internal RAG",
            "The exact RFP proposal template & SOW agreement used for ₹15,000 to ₹50,000+ gigs (up to ₹1 Lakh)",
            "Pricing your services: fixed deliverables vs monthly maintenance retainers"
          ]
        },
        {
          title: "Session 15: Salary Hike & Senior Gen AI Promotion Strategy (20-30 LPA)",
          topics: [
            "How to position yourself internally as the Lead / Senior Gen AI Engineer",
            "Quantifying RAG business impact: demonstrating cost reduction, speed gains, and risk mitigation",
            "Interview strategy for 20 to 30 LPA salary bands in top AI tech firms"
          ]
        },
        {
          title: "Session 16: Cracking System Design Interviews & Launching Cohorts",
          topics: [
            "Live Mock Interview: 'Design a Real-Time Multi-Tenant RAG System for 10M Documents'",
            "Whiteboarding trade-offs: latency vs accuracy, vector DB choices, failure mitigation",
            "How to build your personal brand, teach your own workshops, and create recurring education revenue"
          ]
        }
      ]
    }
  ];

  return (
    <section id="curriculum" className="py-20 bg-white border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-teal-600" /> 4-WEEK LIVE INTENSIVE SYLLABUS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Production Curriculum</span>
          </h2>
          <p className="mt-3 text-slate-600 text-sm leading-relaxed">
            No toy scripts. No 10-line tutorial hand-waving. Every session is a live interactive coding masterclass where you build real-world, enterprise-ready systems.
          </p>
        </div>

        {/* 4 Weeks Accordion / Cards */}
        <div className="space-y-4 max-w-5xl mx-auto">
          {curriculumData.map((weekData, idx) => {
            const isOpen = openWeek === idx;
            return (
              <div
                key={idx}
                className={`bg-slate-50/70 border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen ? `bg-white ${weekData.activeBorder} shadow-md` : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Header Toggle */}
                <button
                  onClick={() => setOpenWeek(isOpen ? -1 : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${weekData.badgeColor}`}>
                      {weekData.week}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        {weekData.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
                        {weekData.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 shrink-0 shadow-sm">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded Content */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 bg-white space-y-5">
                    
                    {/* Deliverable Callout */}
                    <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/70 flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
                          Key Deliverable
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-slate-800 mt-0.5">
                          {weekData.deliverable}
                        </div>
                      </div>
                    </div>

                    {/* Modules Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {weekData.modules.map((mod, mIdx) => (
                        <div key={mIdx} className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/70">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2 mb-2">
                            <Code className="w-3.5 h-3.5 text-teal-600" />
                            {mod.title}
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-600">
                            {mod.topics.map((t, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2">
                                <span className="text-teal-600 font-bold">•</span>
                                <span className="leading-relaxed">{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

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
