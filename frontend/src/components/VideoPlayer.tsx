import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Film, CheckCircle2, AlertTriangle, Zap, DollarSign, UserCheck } from 'lucide-react';

export const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(93.5);
  const [activeChapter, setActiveChapter] = useState(0);

  const chapters = [
    { time: 0, label: "01. Scanned Blueprint Failure", icon: AlertTriangle, desc: "Why standard text extractors return 0 characters on blueprints" },
    { time: 18.0, label: "02. Figure 1-1A & Concurrency Choke", icon: Zap, desc: "Multi-signal schematics & server bottlenecks under 100+ documents" },
    { time: 38.0, label: "03. Multimodal Vision Architecture", icon: CheckCircle2, desc: "ColPali vision indexing, hybrid search & sub-200ms async APIs" },
    { time: 60.5, label: "04. Career & Monetization Pathways", icon: DollarSign, desc: "20-30 LPA senior roles, freelance retainers & in-company impact" },
    { time: 78.5, label: "05. Live Cohort Details & Enrollment", icon: UserCheck, desc: "Tuition ₹8,999, code EARLYBIRD10 (10% off) & Sachin Mishra" },
  ];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);
      for (let i = chapters.length - 1; i >= 0; i--) {
        if (cur >= chapters[i].time - 0.5) {
          setActiveChapter(i);
          break;
        }
      }
    }
  };

  const seekTo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section id="video-overview" className="py-20 bg-slate-50/80 relative border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-mono text-xs mb-3">
            <Film className="w-3.5 h-3.5" /> SYSTEM ARCHITECTURE WALKTHROUGH
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            See the Core Concepts in Action
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Watch a technical walkthrough featuring real aircraft blueprints, Figure 1-1A engine control block diagrams, scaling bottlenecks, and our 3 career pathways.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="bg-white rounded-3xl p-3 sm:p-5 border border-slate-200/90 shadow-xl shadow-slate-200/50">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video shadow-inner group">
            
            <video
              ref={videoRef}
              src="/production_rag_promo.mp4"
              className="w-full h-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current) setDuration(videoRef.current.duration || 93.5);
              }}
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlay}
              playsInline
            />

            {/* Big Center Play Button (overlay when paused) */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-all hover:bg-black/30"
              >
                <div className="w-20 h-20 rounded-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shadow-2xl transition-transform transform group-hover:scale-110">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <div className="mt-4 px-4 py-1.5 rounded-full bg-white/95 text-slate-800 font-mono text-xs font-semibold shadow-md">
                  Click to Play Technical Walkthrough ({Math.round(duration)}s)
                </div>
              </div>
            )}

            {/* Custom Modern Video Control Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col gap-2 transition-opacity">
              {/* Progress Slider */}
              <div
                className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer relative overflow-hidden group/bar"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  seekTo(pos * duration);
                }}
              >
                <div
                  className="h-full bg-teal-400 rounded-full relative"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-white text-xs font-mono">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="text-slate-300 text-[11px]">
                    {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-teal-300 text-[11px] truncate max-w-xs">
                    {chapters[activeChapter]?.label}
                  </span>
                  <button
                    onClick={handleFullscreen}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Chapter Grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {chapters.map((ch, idx) => {
              const Icon = ch.icon;
              const isActive = activeChapter === idx;
              return (
                <button
                  key={idx}
                  onClick={() => seekTo(ch.time)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-teal-50 border-teal-500 shadow-sm ring-1 ring-teal-500/30'
                      : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-500'}`} />
                    <span className={`text-[11px] font-mono font-bold ${isActive ? 'text-teal-800' : 'text-slate-700'}`}>
                      {ch.label.split('.')[0]}. CH {idx + 1}
                    </span>
                  </div>
                  <div className={`text-xs font-medium line-clamp-1 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>
                    {ch.label.split('. ')[1]}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                    {ch.desc}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
