import React from 'react';

export interface MasterPurposeSectionProps {
  badge?: string;
  items?: string[];
  description?: string;
  bgImageUrl?: string;
}

export const MasterPurposeSection: React.FC<MasterPurposeSectionProps> = ({
  badge = 'Tujuan Kami',
  items = [
    'Optimasi Sumber Daya',
    'Kemakmuran Indonesia',
    'Kehidupan Berkelanjutan',
  ],
  description = 'Mengamankan rantai pasok cadangan kritis nusantara guna menopang kemakmuran rakyat serta kedaulatan industri teknologi tinggi di tengah persaingan global.',
  bgImageUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1400&auto=format&fit=crop',
}) => {
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <section className="relative isolate overflow-hidden bg-[#020817] border-y border-white/10 py-24 sm:py-32">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-cyan-950" />

        {/* Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-3xl" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Globe Image */}
        <div className="absolute left-[-15%] top-1/2 -translate-y-1/2 w-[650px] h-[650px] opacity-40 hidden lg:block">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full border border-cyan-400/30 backdrop-blur-3xl bg-white/5 shadow-[0_0_120px_rgba(34,211,238,0.15)]" />

            <img
              src={bgImageUrl}
              alt="Globe"
              className="absolute inset-0 w-full h-full object-cover rounded-full mix-blend-screen grayscale contrast-125 brightness-90"
            />

            {/* Orbit */}
            <div className="absolute inset-[-40px] rounded-full border border-dashed border-cyan-400/20 animate-[spin_30s_linear_infinite]" />
            <div className="absolute inset-[50px] rounded-full border border-cyan-300/10 animate-[spin_20s_linear_infinite_reverse]" />
          </div>
        </div>
      </div>

      {/* CUSTOM STYLE */}
      <style>{`
        @keyframes marqueeVertical {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .animate-marquee-v {
          animation: marqueeVertical 32s linear infinite;
        }

        .mask-fade-vertical {
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent,
            white 15%,
            white 85%,
            transparent
          );
          mask-image: linear-gradient(
            to bottom,
            transparent,
            white 15%,
            white 85%,
            transparent
          );
        }

        .text-stroke {
  color: #0f172a; /* slate-900 / biru tua */
  -webkit-text-stroke: 1px rgba(255,255,255,0.08);
  transition: all 0.4s ease;
}

.text-stroke:hover {
  color: #67e8f9;
  -webkit-text-stroke: 1px transparent;
  text-shadow:
    0 0 10px rgba(103,232,249,0.5),
    0 0 30px rgba(103,232,249,0.35);
}

        .text-stroke:hover {
          color: #67e8f9;
          -webkit-text-stroke: 1px transparent;
          text-shadow:
            0 0 10px rgba(103,232,249,0.5),
            0 0 30px rgba(103,232,249,0.35);
        }
      `}</style>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-end">
          <div className="w-full max-w-3xl text-right">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 backdrop-blur-md mb-6">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-300">
                {badge}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl ml-auto border-r-2 border-cyan-400/30 pr-5 mb-12">
              {description}
            </p>

            {/* MARQUEE */}
            <div className="relative h-[260px] sm:h-[340px] overflow-hidden mask-fade-vertical">
              {/* Blur top */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#020817] to-transparent z-10 pointer-events-none" />

              {/* Blur bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020817] to-transparent z-10 pointer-events-none" />

              <div className="animate-marquee-v flex flex-col pt-10">
                {duplicatedItems.map((text, idx) => (
                  <div
                    key={idx}
                    className="group py-2 sm:py-3 transition-all duration-500"
                  >
                    <h2 className="text-stroke text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-0.05em] leading-none uppercase cursor-default">
                      {text}
                    </h2>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom line */}
            <div className="mt-10 flex justify-end">
              <div className="w-40 h-[1px] bg-gradient-to-l from-cyan-400 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};