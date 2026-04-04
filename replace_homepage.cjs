const fs = require('fs');

const appTsxPath = 'c:\\Users\\acer\\Downloads\\dakstop\\AVSERC\\cresva\\src\\App.tsx';
let content = fs.readFileSync(appTsxPath, 'utf8');

const regex = /(interface HomePageContentProps {[\s\S]*?)(?=\/\/ --- MAIN APP ---)/;

const newComponentContent = `interface HomePageContentProps {
  setCurrentPage: (page: string) => void;
}

const HomePageContent: React.FC<HomePageContentProps> = ({ setCurrentPage }) => {
  const featuresSectionRef = useRef<HTMLElement>(null);
  const statsCardRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Original 11 Services - adjusted accents for light mode
  const businessFeatures = [
    { icon: QrCode, title: "Interactive QR Systems", description: "Seamless, fast, and real-time. High-performance digital interface systems.", accent: "#F03A47" },
    { icon: Layout, title: "Digital Architecture", description: "Premium, high-performance sites built to capture local search traffic and conversions.", accent: "#0D0D15" },
    { icon: Instagram, title: "Social Growth Strategy", description: "Curated aesthetic storytelling that turns audiences into brand loyalists.", accent: "#F03A47" },
    { icon: Zap, title: "Media Production", description: "High-energy short-form video content engineered to go viral locally.", accent: "#FCC8B2" },
    { icon: Database, title: "Retention Pipelines", description: "Capture data from every interaction. Own your direct customer relationship.", accent: "#F03A47" },
    { icon: MapPin, title: "Search Dominance", description: "Strategic optimization ensuring your brand dominates local search results.", accent: "#0D0D15" },
    { icon: ShoppingBag, title: "Direct Commerce", description: "Take control of your revenue. Bypass heavy third-party commissions.", accent: "#F03A47" },
    { icon: MessageCircle, title: "Automated Support", description: "Instant automated alerts and elite customer support via WhatsApp.", accent: "#FCC8B2" },
    { icon: Star, title: "Loyalty Ecosystems", description: "Gamify the customer routine. Turn one-time visitors into daily regulars.", accent: "#F03A47" },
    { icon: Camera, title: "Visual Storytelling", description: "Professional photography that makes your products and space irresistible.", accent: "#0D0D15" },
    { icon: Palette, title: "Brand Identity", description: "A cohesive visual voice that resonates with your community.", accent: "#F03A47" },
  ];

  const SERVICE_PILLARS = [
    { name: "QR Systems", icon: QrCode },
    { name: "Web Architecture", icon: Layout },
    { name: "Social Growth", icon: Instagram },
    { name: "Automation", icon: Zap },
    { name: "Brand Identity", icon: Palette },
    { name: "Performance", icon: TrendingUp },
  ];

  useEffect(() => {
    let gsapCtx: gsap.Context;
    
    const loadGSAP = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        gsapCtx = gsap.context(() => {
          if (!featuresSectionRef.current) return;

          // Hero Elements Animation
          const heroElements = featuresSectionRef.current.querySelectorAll('.engine-hero-animate');
          gsap.fromTo(heroElements,
            { opacity: 0, y: 30, skewY: 2 },
            {
              opacity: 1,
              y: 0,
              skewY: 0,
              duration: 1.2,
              stagger: 0.15,
              ease: "power4.out",
              scrollTrigger: {
                trigger: featuresSectionRef.current,
                start: "top 70%",
              }
            }
          );

          // Stats Card 3D Slide
          if (statsCardRef.current) {
            gsap.fromTo(statsCardRef.current,
              { opacity: 0, x: 50, rotateY: 15 },
              {
                opacity: 1,
                x: 0,
                rotateY: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: featuresSectionRef.current,
                  start: "top 60%",
                }
              }
            );
          }

          // Marquee Card Fade
          if (marqueeRef.current) {
            gsap.fromTo(marqueeRef.current,
              { opacity: 0, x: 30 },
              {
                opacity: 1,
                x: 0,
                duration: 1,
                delay: 0.3,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: featuresSectionRef.current,
                  start: "top 60%",
                }
              }
            );
          }

          // Service Cards Grid Stagger
          const validCards = cardsRef.current.filter(Boolean);
          if (validCards.length > 0) {
            gsap.fromTo(validCards,
              { opacity: 0, y: 40, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.05,
                ease: "back.out(1.2)",
                scrollTrigger: {
                  trigger: validCards[0],
                  start: "top 85%",
                }
              }
            );
          }

          // CTA Card Pulse Line
          const ctaCard = featuresSectionRef.current.querySelector('.engine-cta-card');
          if (ctaCard) {
            gsap.fromTo(ctaCard,
              { opacity: 0, scale: 0.9 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.8)",
                scrollTrigger: {
                  trigger: ctaCard,
                  start: "top 90%",
                }
              }
            );
          }
        }, featuresSectionRef);
      } catch (error) {
        console.error("GSAP load failed:", error);
      }
    };

    loadGSAP();
    return () => { if (gsapCtx) gsapCtx.revert(); };
  }, []);

  const engineStyles = \`
    .engine-hero-section {
      background: #FAF9F6;
    }
    @keyframes engine-fadeSlideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes engine-marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    .engine-marquee-track {
      animation: engine-marquee 35s linear infinite;
    }
    .engine-card {
      transition: all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
      position: relative;
      overflow: hidden;
    }
    .engine-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--card-accent, #F03A47), transparent);
      opacity: 0.15;
      transition: opacity 0.5s ease;
    }
    .engine-card:hover::before, .engine-card:active::before {
      opacity: 1;
    }
    .engine-card:hover, .engine-card:active {
      transform: translateY(-8px) scale(0.98);
      border-color: rgba(0, 0, 0, 0.15);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05), 0 0 40px var(--card-glow, rgba(0,0,0, 0.05));
    }
    .engine-card:hover .engine-icon, .engine-card:active .engine-icon {
      transform: scale(1.1) rotate(-5deg);
    }
    .engine-card:hover .engine-arrow, .engine-card:active .engine-arrow {
      opacity: 1;
      transform: translateX(0);
    }
    .engine-icon {
      transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
    }
    .engine-arrow {
      opacity: 0;
      transform: translateX(-8px);
      transition: all 0.4s ease;
    }
    @media (max-width: 640px) {
      .engine-arrow {
        opacity: 1;
        transform: translateX(0);
      }
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
    }
    .engine-progress-bar {
      background: linear-gradient(90deg, #F03A47, #0D0D15);
    }
  \`;

  return (
    <>
      <Hero 
        onContactClick={() => setCurrentPage('contact')}
        onEcosystemClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
      />

      <section 
        ref={featuresSectionRef}
        id="features" 
        className="engine-hero-section relative overflow-hidden"
      >
        <style>{engineStyles}</style>

        {/* Background Image with Gradient Mask */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: \`url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80')\`,
            maskImage: 'linear-gradient(180deg, transparent, black 0%, black 60%, transparent)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent, black 0%, black 60%, transparent)',
          }}
        />

        {/* Floating Orbs (Light Mode) */}
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#F03A47]/[0.05] blur-[200px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[15%] right-[8%] w-[400px] h-[400px] bg-[#0D0D15]/[0.03] blur-[180px] rounded-full pointer-events-none" />

        {/* ═══════════ GLASSMORPHISM HERO ═══════════ */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-14 md:pt-40 md:pb-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 items-start">
            
            {/* --- LEFT COLUMN (Copy) --- */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8 lg:pr-8">
              
              {/* Badge */}
              <div className="engine-hero-animate">
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/50 px-4 py-2 backdrop-blur-md transition-all hover:bg-white/80 hover:border-black/20 hover:shadow-sm">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#0D0D15] flex items-center gap-2">
                    Performance Agency
                    <Star className="w-3.5 h-3.5 text-[#F03A47] fill-[#F03A47]" />
                  </span>
                </div>
              </div>

              {/* Heading */}
              <h2 
                className="engine-hero-animate text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-[#0D0D15] uppercase"
                style={{
                  maskImage: "linear-gradient(180deg, black 0%, black 85%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(180deg, black 0%, black 85%, transparent 100%)"
                }}
              >
                The Digital<br />
                <span className="text-[#F03A47] italic pr-4">
                  Engine
                </span><br />
                That Scales
              </h2>

              {/* Description */}
              <p className="engine-hero-animate max-w-xl text-lg text-black/60 leading-relaxed font-bold">
                Every touchpoint of your digital presence engineered under one roof. Designed for growth, built for elite standards.
              </p>

              {/* CTA Buttons */}
              <div className="engine-hero-animate flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                <button 
                  onClick={() => setCurrentPage('work')}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0D0D15] px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-[#FAF9F6] transition-all active:scale-[0.98] hover:scale-[1.02] hover:bg-[#F03A47] shadow-xl w-full sm:w-auto"
                >
                  View Portfolio
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button 
                  onClick={() => setCurrentPage('contact')}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/50 px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-[#0D0D15] backdrop-blur-sm transition-all active:scale-[0.98] hover:bg-white hover:border-black/20 hover:shadow-lg w-full sm:w-auto"
                >
                  <Rocket className="w-4 h-4 text-[#F03A47]" />
                  Scale Your Brand
                </button>
              </div>
            </div>

            {/* --- RIGHT COLUMN (Stats + Marquee) --- */}
            <div className="lg:col-span-5 space-y-6 lg:mt-12 perspective-1000">
              
              {/* Stats Card */}
              <div 
                ref={statsCardRef}
                className="glass-card relative overflow-hidden rounded-[32px] border border-black/5 p-6 sm:p-8 shadow-2xl"
              >
                {/* Internal Card Glow Element */}
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#F03A47]/10 blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F03A47]/10 border border-[#F03A47]/20">
                      <Target className="h-6 w-6 text-[#F03A47]" />
                    </div>
                    <div>
                      <div className="text-4xl font-black tracking-tighter text-[#0D0D15]">11 Core</div>
                      <div className="text-xs font-black uppercase tracking-widest text-black/50 mt-1">Growth Services</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                      <span className="text-[#0D0D15]">Ecosystem Capacity</span>
                      <span className="text-[#F03A47]">∞</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-black/5 border border-black/5">
                      <div className="engine-progress-bar h-full w-[92%] rounded-full shadow-[0_0_10px_rgba(240,58,71,0.3)]" />
                    </div>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent mb-6" />

                  {/* Mini Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-lg sm:text-xl font-black text-[#0D0D15]">1</span>
                      <span className="text-[7.5px] sm:text-[9px] uppercase tracking-widest text-[#0D0D15]/50 mt-1">Ecosystem</span>
                    </div>
                    <div className="w-px h-full bg-black/10 mx-auto" />
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-lg sm:text-xl font-black text-[#0D0D15]">24/7</span>
                      <span className="text-[7.5px] sm:text-[9px] uppercase tracking-widest text-[#0D0D15]/50 mt-1">Automation</span>
                    </div>
                    <div className="w-px h-full bg-black/10 mx-auto" />
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-lg sm:text-xl font-black text-[#0D0D15]">100%</span>
                      <span className="text-[7.5px] sm:text-[9px] uppercase tracking-widest text-[#0D0D15]/50 mt-1">Ownership</span>
                    </div>
                  </div>

                  {/* Status Pills */}
                  <div className="mt-8 flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#0D0D15]/20 bg-[#0D0D15] px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#FAF9F6]">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FAF9F6] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FAF9F6]"></span>
                      </span>
                      System Active
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F03A47]/20 bg-[#F03A47]/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#F03A47]">
                      <Crown className="w-3 h-3 text-[#F03A47]" />
                      Premium
                    </div>
                  </div>
                </div>
              </div>

              {/* Marquee Card */}
              <div 
                ref={marqueeRef}
                className="glass-card relative overflow-hidden rounded-[32px] border border-black/5 py-8 shadow-xl"
              >
                <div className="flex items-center justify-between px-8 mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0D0D15]/50">Unified Service Ecosystem</h3>
                  <div className="h-1 w-1 rounded-full bg-black/20" />
                </div>
                
                <div 
                  className="relative flex overflow-hidden"
                  style={{
                    maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
                  }}
                >
                  <div className="engine-marquee-track flex gap-10 whitespace-nowrap px-4 w-max">
                    {/* Triple list for seamless loop */}
                    {[...SERVICE_PILLARS, ...SERVICE_PILLARS, ...SERVICE_PILLARS].map((pillar, i) => (
                      <div 
                        key={i}
                        className="flex items-center gap-3 opacity-60 transition-all duration-300 hover:opacity-100"
                      >
                        <pillar.icon className="h-5 w-5 text-[#0D0D15]" />
                        <span className="text-sm font-black uppercase tracking-widest text-[#0D0D15]">
                          {pillar.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ═══════════ SERVICES GRID ═══════════ */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
          
          <div className="flex items-center gap-4 mb-16 opacity-30 justify-center">
            <div className="h-px bg-black w-16" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0D0D15]">All 11 Services</span>
            <div className="h-px bg-black w-16" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
            {businessFeatures.map((feature, idx) => (
              <div
                key={idx}
                ref={el => cardsRef.current[idx] = el}
                className="engine-card group relative bg-white border border-black/5 p-6 sm:p-8 rounded-3xl active:scale-[0.98] transition-transform duration-300"
                style={{ 
                  '--card-accent': feature.accent,
                  '--card-glow': \`\${feature.accent}15\`
                } as React.CSSProperties}
              >
                {/* Subtle persistent mobile glow */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-10 sm:opacity-0 group-hover:opacity-30 mix-blend-multiply pointer-events-none transition-opacity duration-500"
                  style={{ background: \`radial-gradient(circle at 50% 100%, \${feature.accent}20 0%, transparent 60%)\` }}
                />

                <div className="relative z-10 flex justify-between items-start mb-8 sm:mb-10">
                  <div 
                    className="engine-icon w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 border border-black/5 group-hover:bg-white group-hover:border-[var(--card-accent)] group-active:border-[var(--card-accent)] shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all"
                    style={{ color: feature.accent }}
                  >
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black opacity-30 text-[#0D0D15] font-mono">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                
                <h4 className="relative z-10 text-base sm:text-lg font-black text-[#0D0D15] uppercase mb-2 sm:mb-3 leading-tight group-active:text-[var(--card-accent)] transition-colors">
                  {feature.title}
                </h4>
                <p className="relative z-10 text-xs sm:text-sm text-black/60 font-bold leading-relaxed mb-6 h-auto sm:h-16 tracking-tight">
                  {feature.description}
                </p>

                <div className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-100 sm:opacity-0 translate-y-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 mt-2 sm:mt-0" style={{ color: feature.accent }}>
                  <span>Explore</span>
                  <ArrowRight className="engine-arrow w-3 h-3 opacity-100 sm:opacity-0" />
                </div>
              </div>
            ))}
            
            <div 
              onClick={() => setCurrentPage('contact')}
              className="engine-cta-card group relative p-8 bg-[#F03A47] rounded-3xl transition-all duration-500 cursor-pointer flex flex-col justify-between hover:scale-[1.03] shadow-[0_20px_40px_rgba(240,58,71,0.2)] lg:col-span-1 border border-black/5"
            >
              <div className="flex justify-between items-start">
                <Rocket className="text-white w-8 h-8 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                <Plus className="text-white w-6 h-6 opacity-40 group-hover:rotate-90 transition-transform duration-500" />
              </div>
              <div className="mt-12 text-left text-white">
                <h4 className="text-2xl font-black leading-tight uppercase mb-2">Scale Now</h4>
                <p className="text-white/80 text-[10px] font-black uppercase tracking-widest border-b border-white/20 pb-1 inline-block">Apply for partnership</p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
};
`;

const result = content.replace(regex, newComponentContent + '\n\n');
fs.writeFileSync(appTsxPath, result);
console.log('Successfully replaced HomePageContent');
