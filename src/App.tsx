/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Instagram,
  Smartphone,
  BellRing,
  Layout,
  ChevronRight,
  TrendingUp,
  Database,
  ArrowRight,
  CheckCircle2,
  Menu as MenuIcon,
  X,
  MessageSquare,
  Zap,
  Globe,
  BarChart3,
  Layers,
  Sparkles,
  Rocket,
  ShoppingBag,
  MessageCircle,
  Star,
  Camera,
  Palette,
  MapPin,
  Plus,
  Minus,
  Video,
  ExternalLink,
  Code2,
  Cpu,
  Monitor,
  Target,
  Crown,
  Home,
  User,
  Briefcase,
  Calendar,
  Phone,
  Mail
} from "lucide-react";
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from "framer-motion";
import { allPortfolioData, getYouTubeID } from './data/portfolio';

/**
 * BRAND PALETTE:
 * Tea Green: #C1F7DC
 * Lavender Grey: #999AC6
 * Strawberry Red: #F03A47
 * Peach Fuzz: #FCC8B2
 * Deep Base: #0D0D15
 */

const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}

float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}

float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}

float clouds(vec2 p) {
	float d=1., t=.0;
	for (float i=.0; i<3.; i++) {
		float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
		t=mix(t,d,a);
		d=a;
		p*=2./(i+1.);
	}
	return t;
}

void main(void) {
	vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
	vec3 col=vec3(0);
	float bg=clouds(vec2(st.x+T*.2,-st.y));
	uv*=1.-.3*(sin(T*.1)*.5+.5);
    vec3 color1 = vec3(0.05, 0.05, 0.08); 
    vec3 color2 = vec3(0.75, 0.97, 0.86); 
    vec3 color3 = vec3(0.60, 0.60, 0.78);
  	for (float i=1.; i<12.; i++) {
		uv+=.12*cos(i*vec2(.15, .7)+i*i+T*.3+.15*uv.x);
		vec2 p=uv;
		float d=length(p);
		col+=.0018/d*(cos(sin(i)*vec3(0.2, 0.8, 0.6))+1.8) * mix(color2, color3, sin(T*0.5)*0.5+0.5);
		float b=noise(i+p+bg*1.2);
		col+=.0012*b/length(max(p,vec2(b*p.x*.01,p.y))) * color2;
		col=mix(col, color1 * bg, d * 0.4);
	}
	O=vec4(col,1);
}`;

// --- SUB-COMPONENTS ---

interface HeroProps {
  onContactClick: () => void;
  onEcosystemClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onContactClick, onEcosystemClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;
    let program: WebGLProgram;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const init = () => {
      const vs = createShader(gl, gl.VERTEX_SHADER, `#version 300 es
        in vec4 position;
        void main() { gl_Position = position; }`);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, defaultShaderSource);
      if (!vs || !fs) return;
      program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);
      const vertices = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      const posLoc = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    };

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (time: number) => {
      gl.useProgram(program);
      const resLoc = gl.getUniformLocation(program, 'resolution');
      const timeLoc = gl.getUniformLocation(program, 'time');
      if (resLoc) gl.uniform2f(resLoc, canvas.width, canvas.height);
      if (timeLoc) gl.uniform1f(timeLoc, time * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    init();
    resize();
    render(0);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0D0D15]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover touch-none opacity-70" />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-16 md:pt-28 text-white px-6 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 px-6 py-2 bg-[#C1F7DC]/10 backdrop-blur-md border border-[#C1F7DC]/20 rounded-full text-[10px] font-black tracking-[0.4em] text-[#C1F7DC] uppercase">
            Cresva Performance Agency
          </div>
        </motion.div>
        <div className="space-y-8 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[1.05] bg-gradient-to-br from-white via-[#C1F7DC] to-[#999AC6] bg-clip-text text-transparent uppercase"
          >
            Performance for <br />
            <span className="text-[#C1F7DC] italic font-serif tracking-normal lowercase opacity-90">modern brands</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-[#999AC6] font-light max-w-xl mx-auto leading-relaxed"
          >
            Cresva engineers the digital ecosystem your brand needs to dominate the market while you focus on your craft.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row gap-5 justify-center mt-12">
            <button onClick={onContactClick} className="group px-10 py-5 bg-[#C1F7DC] hover:bg-white text-[#0D0D15] rounded-full font-black text-base transition-all shadow-2xl shadow-[#C1F7DC]/10 flex items-center gap-3 active:scale-95">
              Scale Your Brand <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
    whileHover={{ y: -8 }}
    className="group relative p-8 bg-white border border-[#FCC8B2]/20 rounded-3xl transition-all duration-500 hover:border-[#F03A47]/30 hover:shadow-2xl flex flex-col items-center text-center overflow-hidden"
  >
    <style>{`
      @keyframes shooting-star {
        0% { transform: translate(-180%, -180%) rotate(45deg); opacity: 0; }
        10% { opacity: 1; }
        30% { transform: translate(180%, 180%) rotate(45deg); opacity: 0; }
        100% { transform: translate(180%, 180%) rotate(45deg); opacity: 0; }
      }
      .star-diagonal {
        position: absolute;
        width: 160px;
        height: 1.5px;
        background: linear-gradient(90deg, #F03A47, transparent);
        animation: shooting-star 5s linear infinite;
        pointer-events: none;
        z-index: 1;
        filter: blur(0.5px);
      }
    `}</style>
    
    <div className="star-diagonal top-[-10%] left-[-10%]" style={{ animationDelay: '0s' }}></div>
    <div className="star-diagonal top-[15%] left-[-25%]" style={{ animationDelay: '0.8s' }}></div>
    <div className="star-diagonal top-[45%] left-[-40%]" style={{ animationDelay: '1.6s' }}></div>
    <div className="star-diagonal top-[-30%] left-[20%]" style={{ animationDelay: '2.4s' }}></div>
    <div className="star-diagonal top-[10%] left-[30%]" style={{ animationDelay: '3.2s' }}></div>
    <div className="star-diagonal top-[50%] left-[-10%]" style={{ animationDelay: '4s' }}></div>

    <div className="relative z-10 w-full flex flex-col items-center">
      <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center mb-4 sm:mb-6">
        <div className="absolute inset-0 bg-[#F03A47]/5 rounded-xl sm:rounded-2xl group-hover:bg-[#F03A47] transition-all duration-500" />
        <Icon className="relative z-10 w-4 h-4 sm:w-6 sm:h-6 text-[#F03A47] group-hover:text-white transition-colors duration-500" />
      </div>
      <h3 className="text-xs sm:text-base font-black text-[#0D0D15] mb-1 sm:mb-2 tracking-tighter group-hover:text-[#F03A47] transition-colors uppercase leading-tight line-clamp-1">{title}</h3>
      <p className="text-[#0D0D15]/60 text-[9px] sm:text-[11px] font-medium leading-tight sm:leading-relaxed group-hover:text-[#0D0D15] transition-all line-clamp-2">{description}</p>
    </div>
  </motion.div>
);

interface ServiceItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ icon, title, description, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col group bg-white/40 p-6 rounded-2xl border border-white/20 backdrop-blur-sm"
      initial={{ y: 20, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.8)' }}
    >
      <div className="flex items-center gap-4 mb-3">
        <div className="text-[#0D0D15] bg-[#0D0D15]/10 p-3 rounded-xl">{icon}</div>
        <h3 className="text-lg font-black text-[#0D0D15] uppercase tracking-tight">{title}</h3>
      </div>
      <p className="text-xs text-[#0D0D15]/70 leading-relaxed font-medium">{description}</p>
    </motion.div>
  );
};

// --- PROOF OF WORK ---

interface ProofOfWorkPageProps {
  setCurrentPage: (page: string) => void;
}

const ProofOfWorkPage: React.FC<ProofOfWorkPageProps> = ({ setCurrentPage }) => {
  const [filter, setFilter] = useState('all');
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const filteredWorks = filter === 'all' ? allPortfolioData : allPortfolioData.filter(w => w.type === filter);

  return (
    <div className="pt-24 pb-32 bg-[#0D0D15] min-h-screen relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C1F7DC]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#F03A47]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-black tracking-[0.4em] text-[11px] uppercase mb-6 block text-[#C1F7DC]"
          >
            Proof of Work
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-none text-white"
          >
            The <span className="text-[#C1F7DC] italic">Portfolio</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#999AC6] max-w-2xl mx-auto font-light leading-relaxed"
          >
            A curated selection of digital assets and performance campaigns engineered for growth.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex justify-start sm:justify-center gap-3 sm:gap-4 mb-14 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full snap-x">
          {['all', 'website', 'ad', 'showcase'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 snap-center px-6 sm:px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                filter === f 
                  ? 'bg-[#C1F7DC] text-[#0D0D15] shadow-[0_0_15px_rgba(193,247,220,0.3)]' 
                  : 'bg-white/5 text-[#999AC6] hover:bg-white/10 border border-white/10'
              }`}
            >
              {f === 'all' ? 'Everything' : f === 'website' ? 'Digital Architecture' : f === 'ad' ? 'Performance Ads' : 'Website Showcase'}
            </button>
          ))}
        </div>

        {/* Grid */}
        {allPortfolioData.length === 0 ? (
          <div className="text-center py-20 text-[#999AC6]">
            <p>No projects uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredWorks.map((work, idx) => (
                <motion.div
                  key={work.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group relative bg-white/[0.03] border border-white/10 rounded-[32px] overflow-hidden hover:border-[#C1F7DC]/30 hover:bg-white/[0.05] active:scale-[0.98] transition-all duration-500 shadow-xl"
                >
                  {/* ───── SHOWCASE CARD ───── */}
                  {work.type === 'showcase' && work.websiteUrl ? (
                    <>
                      <div 
                        className="relative aspect-video overflow-hidden cursor-pointer bg-[#0D0D15] group"
                        onMouseEnter={() => setActiveVideo(work.id)}
                        onMouseLeave={() => setActiveVideo(null)}
                        onClick={() => window.open(work.websiteUrl, '_blank')}
                      >
                        {activeVideo === work.id ? (
                          <iframe
                            src={work.websiteUrl}
                            className="w-full h-full pointer-events-none opacity-90 scale-100"
                            title={work.title}
                            sandbox="allow-scripts allow-same-origin"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#0D0D15] via-[#999AC6]/20 to-[#C1F7DC]/10 flex items-center justify-center">
                            <div className="text-center">
                              <Globe className="w-10 h-10 text-[#C1F7DC]/40 mx-auto mb-3" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Hover to Preview</span>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D15] via-transparent to-transparent pointer-events-none" />
                        <div className="absolute top-6 left-6 pointer-events-none">
                          <span className="px-3 py-1 bg-[#0D0D15]/80 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#C1F7DC]">
                            showcase
                          </span>
                        </div>
                        {activeVideo !== work.id && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-black/20 sm:bg-transparent">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#C1F7DC] rounded-full flex items-center justify-center text-[#0D0D15] shadow-[0_0_30px_rgba(193,247,220,0.5)]">
                              <ExternalLink size={20} className="sm:hidden" />
                              <ExternalLink size={24} className="hidden sm:block" />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    /* ───── VIDEO CARD (website / ad) ───── */
                    <div 
                      className="relative aspect-video overflow-hidden cursor-pointer bg-[#0D0D15] group"
                      onMouseEnter={() => setActiveVideo(work.id)}
                      onMouseLeave={() => setActiveVideo(null)}
                      onClick={() => window.open(work.youtubeUrl, '_blank')}
                    >
                      {activeVideo === work.id && work.youtubeUrl && getYouTubeID(work.youtubeUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeID(work.youtubeUrl)}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${getYouTubeID(work.youtubeUrl)}`}
                          className="w-full h-[140%] -mt-[20%] pointer-events-none opacity-80"
                          allow="autoplay; encrypted-media"
                          frameBorder="0"
                        />
                      ) : (
                        <img 
                          src={`https://img.youtube.com/vi/${(work.youtubeUrl && getYouTubeID(work.youtubeUrl)) || ''}/maxresdefault.jpg`}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                          alt={work.title}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D15] via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-6 left-6 pointer-events-none">
                        <span className="px-3 py-1 bg-[#0D0D15]/80 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#C1F7DC]">
                          {work.type}
                        </span>
                      </div>
                      {activeVideo !== work.id && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-black/20 sm:bg-transparent">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#C1F7DC] rounded-full flex items-center justify-center text-[#0D0D15] shadow-[0_0_30px_rgba(193,247,220,0.5)]">
                            <Video size={20} className="sm:hidden" />
                            <Video size={24} className="hidden sm:block" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-4 sm:p-8">
                    <h3 className="text-sm sm:text-xl font-black text-white uppercase tracking-tight mb-1 sm:mb-2 group-hover:text-[#C1F7DC] transition-colors line-clamp-1">
                      {work.title}
                    </h3>
                    <p className="text-[9px] sm:text-sm text-[#999AC6] font-medium leading-tight sm:leading-relaxed mb-3 sm:mb-6 line-clamp-2">
                      {work.description}
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {work.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest text-[#C1F7DC]/80 border border-white/10 bg-white/5 shadow-sm px-1.5 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-12 bg-gradient-to-br from-[#C1F7DC]/10 to-transparent border border-[#C1F7DC]/20 rounded-[40px] text-center"
        >
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-6">Ready to see your brand here?</h3>
          <button 
            onClick={() => setCurrentPage('contact')}
            className="px-10 py-5 bg-[#C1F7DC] text-[#0D0D15] rounded-full font-black text-base hover:bg-white transition-all shadow-2xl shadow-[#C1F7DC]/20 active:scale-95"
          >
            Start Your Project
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// --- ADMIN PAGE REMOVED ---

// --- PAGES ---

const AboutPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const adityaRef = useRef<HTMLDivElement>(null);
  const madhavRef = useRef<HTMLDivElement>(null);

  // --- LOCAL IMAGE REFERENCES ---
  const IMAGES = {
    MADHAV: "/madhav.jpg",
    ADITYA: "/aditya.jpg"
  };

  const madhavServices = [
    { icon: <Palette size={20} />, title: "Brand Identity", description: "Developing cohesive visual languages, from logo typography to tactile product design." },
    { icon: <Video size={20} />, title: "Motion Graphics", description: "Bringing static concepts to life through dynamic animation and rhythmic editing." },
    { icon: <TrendingUp size={20} />, title: "Marketing Strategy", description: "Analyzing trends to create campaigns that resonate with modern, visual-first audiences." }
  ];

  const adityaServices = [
    { icon: <Code2 size={20} />, title: "Digital Infrastructure", description: "Building modern websites and digital menus that help businesses establish a strong presence." },
    { icon: <Cpu size={20} />, title: "Customer Automation", description: "Creating QR-based capture systems and SMS/WhatsApp integrations for efficient retention." },
    { icon: <Zap size={20} />, title: "Performance", description: "Ensuring fast-loading, mobile-friendly platforms that work smoothly across all devices." }
  ];

  useEffect(() => {
    let ctx = { revert: () => {} };

    const initGSAP = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current) return;

        ctx = gsap.context(() => {
          // Header reveal
          gsap.fromTo('.about-header > *',
            { y: 60, opacity: 0 },
            { 
              y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power4.out',
              scrollTrigger: {
                trigger: headerRef.current,
                start: 'top 85%',
              }
            }
          );

          // Aditya Section Reveal
          if (adityaRef.current) {
            gsap.fromTo(adityaRef.current.querySelectorAll('.aditya-reveal'),
              { opacity: 0, y: 50 },
              { 
                opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: {
                  trigger: adityaRef.current,
                  start: 'top 75%',
                }
              }
            );
          }

          // Madhav Section Reveal
          if (madhavRef.current) {
            gsap.fromTo(madhavRef.current.querySelectorAll('.madhav-reveal'),
              { opacity: 0, y: 50 },
              { 
                opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: {
                  trigger: madhavRef.current,
                  start: 'top 75%',
                }
              }
            );
          }

          // Image Parallax Effect
          gsap.utils.toArray('.img-parallax').forEach((img: any) => {
            gsap.fromTo(img, 
              { y: '-10%' },
              {
                y: '10%',
                ease: 'none',
                scrollTrigger: {
                  trigger: img.parentElement,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true
                }
              }
            );
          });
        }, sectionRef);
      } catch (err) {
        console.error('GSAP initialization failed', err);
      }
    };

    initGSAP();

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="pt-24 pb-32 bg-[#999AC6] overflow-hidden relative min-h-screen font-sans">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute -top-[20%] right-[-10%] w-[800px] h-[800px] bg-[#C1F7DC]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-white/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-white">
        
        {/* Header */}
        <div ref={headerRef} className="about-header text-center mb-32">
          <span className="inline-block px-5 py-2 border border-white/20 rounded-full font-black tracking-[0.3em] text-[10px] uppercase mb-8 bg-white/5 backdrop-blur-md shadow-xl text-white">
            The Architects
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-black mb-6 tracking-tighter uppercase leading-[0.9] text-white">
            Engineering<br />
            <span className="text-[#C1F7DC] italic font-serif lowercase tracking-tight opacity-90">Influence</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed mt-10">
            Cresva was founded by two engineers who realized that the gap between technical logic and visual storytelling is where exponential growth happens.
          </p>
        </div>

        <div className="space-y-40">
          
          {/* ADITYA SECTION (FIRST) */}
          <div ref={adityaRef} className="flex flex-col lg:flex-row gap-16 items-center lg:items-center relative">
            <div className="aditya-reveal absolute -left-12 lg:-left-20 top-0 text-[12rem] lg:text-[18rem] font-black text-white/5 pointer-events-none select-none z-0 leading-none">
              01
            </div>
            
            <div className="aditya-reveal relative group flex-shrink-0 w-full max-w-md lg:w-[450px] z-10">
              <div className="absolute inset-0 bg-[#C1F7DC] translate-x-4 translate-y-4 rounded-[40px] transition-all duration-500 ease-out group-hover:translate-x-6 group-hover:translate-y-6" />
              <div className="relative rounded-[40px] overflow-hidden aspect-[4/5] bg-[#0D0D15] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <img 
                  src={IMAGES.ADITYA} 
                  alt="Aditya" 
                  className="img-parallax w-full h-[120%] object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 hover:scale-105" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D15]/90 via-[#0D0D15]/20 to-transparent opacity-80" />
              </div>
            </div>

            <div className="flex-grow space-y-10 lg:pl-8 z-10 w-full">
              <div className="aditya-reveal mb-6">
                <div className="flex items-center gap-6 mb-6">
                  <h3 className="text-5xl md:text-6xl font-black uppercase text-white tracking-tighter shadow-sm">Aditya</h3>
                  <div className="h-[2px] w-16 bg-[#C1F7DC] hidden md:block" />
                </div>
                <div className="inline-block px-4 py-1.5 bg-[#C1F7DC]/10 border border-[#C1F7DC]/30 text-[#C1F7DC] font-black uppercase tracking-[0.2em] text-[10px] rounded-lg mb-6 shadow-sm">
                  Full-Stack & Systems Engineer
                </div>
                <p className="text-white/90 text-[1.1rem] font-medium leading-relaxed max-w-xl">
                  Full-stack developer and digital solutions builder. Aditya focuses on the infrastructure of growth, creating clean, practical, and high-performance systems that convert users into loyal customers.
                </p>
              </div>
              
              <div className="aditya-reveal grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
                {adityaServices.map((s, i) => (
                  <div key={i} className="group bg-white/5 border border-white/10 p-6 rounded-[24px] hover:bg-white/10 hover:border-[#C1F7DC]/40 transition-all duration-300 backdrop-blur-sm shadow-xl">
                    <div className="text-[#C1F7DC] mb-5 bg-[#C1F7DC]/10 w-14 h-14 flex items-center justify-center rounded-2xl group-hover:scale-110 group-hover:bg-[#C1F7DC] group-hover:text-[#0D0D15] transition-all duration-300">
                      {s.icon}
                    </div>
                    <h4 className="font-black text-white uppercase tracking-tight mb-2 text-sm">{s.title}</h4>
                    <p className="text-white/60 text-xs leading-relaxed font-medium">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MADHAV SECTION (SECOND) */}
          <div ref={madhavRef} className="flex flex-col lg:flex-row-reverse gap-16 items-center lg:items-center relative">
            <div className="madhav-reveal absolute -right-12 lg:-right-20 top-0 text-[12rem] lg:text-[18rem] font-black text-white/5 pointer-events-none select-none z-0 leading-none">
              02
            </div>

            <div className="madhav-reveal relative group flex-shrink-0 w-full max-w-md lg:w-[450px] z-10">
              <div className="absolute inset-0 bg-white translate-x-4 translate-y-4 rounded-[40px] transition-all duration-500 ease-out group-hover:translate-x-6 group-hover:translate-y-6" />
              <div className="relative rounded-[40px] overflow-hidden aspect-[4/5] bg-[#0D0D15] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <img 
                  src={IMAGES.MADHAV} 
                  alt="Madhav" 
                  className="img-parallax w-full h-[120%] object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 hover:scale-105" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D15]/90 via-[#0D0D15]/20 to-transparent opacity-80" />
              </div>
            </div>

            <div className="flex-grow space-y-10 lg:pr-8 lg:text-right z-10 w-full">
              <div className="madhav-reveal mb-6 flex flex-col lg:items-end">
                <div className="flex items-center gap-6 mb-6 justify-end flex-row-reverse lg:flex-row">
                  <div className="h-[2px] w-16 bg-white hidden md:block" />
                  <h3 className="text-5xl md:text-6xl font-black uppercase text-white tracking-tighter shadow-sm">Madhav</h3>
                </div>
                <div className="inline-block px-4 py-1.5 bg-white/10 border border-white/30 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-lg mb-6 shadow-sm shadow-white/5">
                  Design & Motion Engineer
                </div>
                <p className="text-white/90 text-[1.1rem] font-medium leading-relaxed max-w-xl">
                  Graphic designer and video editor with a background in engineering. Madhav approaches visual storytelling as a system, bridging the gap between technical logic and bold aesthetic impact.
                </p>
              </div>
              
              <div className="madhav-reveal grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl ml-auto text-left">
                {madhavServices.map((s, i) => (
                  <div key={i} className="group bg-white/5 border border-white/10 p-6 rounded-[24px] hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm shadow-xl">
                    <div className="text-white mb-5 bg-white/10 w-14 h-14 flex items-center justify-center rounded-2xl group-hover:scale-110 group-hover:bg-white group-hover:text-[#0D0D15] transition-all duration-300">
                      {s.icon}
                    </div>
                    <h4 className="font-black text-white uppercase tracking-tight mb-2 text-sm">{s.title}</h4>
                    <p className="text-white/60 text-xs leading-relaxed font-medium">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const EventsPage = () => {
  return (
    <div className="pt-20 pb-32 bg-[#FAF9F6] min-h-screen relative overflow-hidden font-sans">
      {/* Massive Background Text */}
      <div className="absolute top-10 left-0 right-0 w-full overflow-hidden pointer-events-none select-none z-0 flex justify-center">
        <span className="text-[28vw] font-black leading-[0.8] tracking-tighter text-[#DFFF00] whitespace-nowrap opacity-60 mix-blend-multiply">
          MAGAZINE<br />EVENTS
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 pt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
          <div className="max-w-2xl bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-black/5 shadow-2xl shadow-black/5">
            <span className="inline-block px-5 py-2 border border-black rounded-full font-black tracking-widest text-[10px] uppercase mb-6 bg-[#DFFF00] text-black">
              Experiential Performance
            </span>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-[0.9] text-black">
              Curating<br />
              <span className="italic font-serif lowercase tracking-tight">Memorable Experiences</span>
            </h2>
            <p className="text-xl md:text-2xl text-black/70 font-bold leading-relaxed max-w-lg tracking-tight">
              We provide premium musical bands and flawlessly organize events that leave a lasting impact on your audience.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[300px] sm:auto-rows-[400px]">
          {/* Magazine Grid Items */}
          {[
            { tag: "Live Music", title: "Premium Musical Bands for Special Occasions", date: "April 2026", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop" },
            { tag: "Events", title: "Corporate Galas & Launch Events Designed to Perfection", date: "May 2026", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop", span: "md:col-span-2 lg:col-span-2 lg:row-span-2" },
            { tag: "Experience", title: "Curated Audiovisual Productions That Command Attention", date: "June 2026", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop" },
            { tag: "Strategy", title: "Planning the Flow: How We Keep Audiences Engaged", date: "July 2026", img: "https://images.unsplash.com/photo-1470229722913-7c090be5c520?q=80&w=800&auto=format&fit=crop" },
            { tag: "Production", title: "State-of-the-Art Sound & Lighting Operations", date: "August 2026", img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop" },
          ].map((item, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               className={`group cursor-pointer ${item.span || ''}`}
             >
               <div className="w-full h-full relative overflow-hidden bg-white flex flex-col justify-end p-6 border-4 border-transparent hover:border-[#DFFF00] shadow-xl shadow-black/5 hover:shadow-2xl transition-all duration-300">
                 <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                 
                 <div className="relative z-10 max-w-sm">
                   <div className="text-black font-black text-[10px] uppercase tracking-widest mb-3 bg-[#DFFF00] self-start px-3 py-1 inline-block rounded-sm">
                     {item.tag}
                   </div>
                   <h3 className="text-white font-black text-2xl md:text-3xl leading-none mb-3 group-hover:opacity-100 transition-colors uppercase tracking-tighter">{item.title}</h3>
                   <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest border-t border-white/20 pt-2 block">{item.date}</span>
                 </div>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface HomePageContentProps {
  setCurrentPage: (page: string) => void;
}

const HomePageContent: React.FC<HomePageContentProps> = ({ setCurrentPage }) => {
  const featuresSectionRef = useRef<HTMLElement>(null);
  const statsCardRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Original 11 Services
  const businessFeatures = [
    { icon: QrCode, title: "Interactive QR Systems", description: "Seamless, fast, and real-time. High-performance digital interface systems.", accent: "#C1F7DC" },
    { icon: Layout, title: "Digital Architecture", description: "Premium, high-performance sites built to capture local search traffic and conversions.", accent: "#999AC6" },
    { icon: Instagram, title: "Social Growth Strategy", description: "Curated aesthetic storytelling that turns audiences into brand loyalists.", accent: "#F03A47" },
    { icon: Zap, title: "Media Production", description: "High-energy short-form video content engineered to go viral locally.", accent: "#FCC8B2" },
    { icon: Database, title: "Retention Pipelines", description: "Capture data from every interaction. Own your direct customer relationship.", accent: "#C1F7DC" },
    { icon: MapPin, title: "Search Dominance", description: "Strategic optimization ensuring your brand dominates local search results.", accent: "#999AC6" },
    { icon: ShoppingBag, title: "Direct Commerce", description: "Take control of your revenue. Bypass heavy third-party commissions.", accent: "#F03A47" },
    { icon: MessageCircle, title: "Automated Support", description: "Instant automated alerts and elite customer support via WhatsApp.", accent: "#FCC8B2" },
    { icon: Star, title: "Loyalty Ecosystems", description: "Gamify the customer routine. Turn one-time visitors into daily regulars.", accent: "#C1F7DC" },
    { icon: Camera, title: "Visual Storytelling", description: "Professional photography that makes your products and space irresistible.", accent: "#999AC6" },
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

  const engineStyles = `
    .engine-hero-section {
      background: #0D0D15;
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
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--card-accent, #C1F7DC), transparent);
      opacity: 0.15;
      transition: opacity 0.5s ease;
    }
    .engine-card:hover::before, .engine-card:active::before {
      opacity: 0.6;
    }
    .engine-card:hover, .engine-card:active {
      transform: translateY(-8px) scale(0.98);
      border-color: rgba(255, 255, 255, 0.15);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px var(--card-glow, rgba(255,255,255, 0.05));
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
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @media (max-width: 640px) {
      .engine-arrow {
        opacity: 1;
        transform: translateX(0);
      }
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
    }
    .engine-progress-bar {
      background: linear-gradient(90deg, #C1F7DC, #999AC6);
    }
  `;

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
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80')`,
            maskImage: 'linear-gradient(180deg, transparent, black 0%, black 60%, transparent)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent, black 0%, black 60%, transparent)',
          }}
        />

        {/* Floating Orbs */}
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#C1F7DC]/[0.03] blur-[200px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[15%] right-[8%] w-[400px] h-[400px] bg-[#F03A47]/[0.03] blur-[180px] rounded-full pointer-events-none" />

        {/* ═══════════ GLASSMORPHISM HERO ═══════════ */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-14 pb-14 md:pt-40 md:pb-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 items-start">
            
            {/* --- LEFT COLUMN (Copy) --- */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8 lg:pr-8">
              
              {/* Badge */}
              <div className="engine-hero-animate">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C1F7DC]/20 bg-[#C1F7DC]/5 px-4 py-2 backdrop-blur-md transition-all hover:bg-[#C1F7DC]/10 hover:border-[#C1F7DC]/40 hover:shadow-[0_0_20px_rgba(193,247,220,0.15)]">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#C1F7DC] flex items-center gap-2">
                    Performance Agency
                    <Star className="w-3.5 h-3.5 text-[#FCC8B2] fill-[#FCC8B2]" />
                  </span>
                </div>
              </div>

              {/* Heading */}
              <h2 
                className="engine-hero-animate text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-white uppercase"
                style={{
                  maskImage: "linear-gradient(180deg, black 0%, black 85%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(180deg, black 0%, black 85%, transparent 100%)"
                }}
              >
                The Digital<br />
                <span className="bg-gradient-to-br from-white via-[#C1F7DC] to-[#999AC6] bg-clip-text text-transparent italic pr-4">
                  Engine
                </span><br />
                That Scales
              </h2>

              {/* Description */}
              <p className="engine-hero-animate max-w-xl text-lg text-white/50 leading-relaxed font-medium">
                Every touchpoint of your digital presence engineered under one roof. Designed for growth, built for elite standards.
              </p>

              {/* CTA Buttons */}
              <div className="engine-hero-animate flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                <button 
                  onClick={() => setCurrentPage('work')}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C1F7DC] px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-[#0D0D15] transition-all active:scale-[0.98] hover:scale-[1.02] hover:bg-white hover:shadow-[0_0_30px_rgba(193,247,220,0.3)] w-full sm:w-auto"
                >
                  View Portfolio
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button 
                  onClick={() => setCurrentPage('contact')}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-white backdrop-blur-sm transition-all active:scale-[0.98] hover:bg-white/10 hover:border-white/20 w-full sm:w-auto"
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
                className="glass-card relative overflow-hidden rounded-[32px] border border-white/10 p-6 sm:p-8 shadow-2xl"
              >
                {/* Internal Card Glow Element */}
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#C1F7DC]/10 blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C1F7DC]/10 border border-[#C1F7DC]/20">
                      <Target className="h-6 w-6 text-[#C1F7DC]" />
                    </div>
                    <div>
                      <div className="text-4xl font-black tracking-tighter text-white">11 Core</div>
                      <div className="text-xs font-black uppercase tracking-widest text-[#999AC6] mt-1">Growth Services</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                      <span className="text-white/40">Ecosystem Capacity</span>
                      <span className="text-[#C1F7DC]">∞</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-black/40 border border-white/5">
                      <div className="engine-progress-bar h-full w-[92%] rounded-full shadow-[0_0_10px_rgba(193,247,220,0.5)]" />
                    </div>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                  {/* Mini Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-lg sm:text-xl font-black text-white">1</span>
                      <span className="text-[7.5px] sm:text-[9px] uppercase tracking-widest text-white/40 mt-1">Ecosystem</span>
                    </div>
                    <div className="w-px h-full bg-white/10 mx-auto" />
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-lg sm:text-xl font-black text-white">24/7</span>
                      <span className="text-[7.5px] sm:text-[9px] uppercase tracking-widest text-white/40 mt-1">Automation</span>
                    </div>
                    <div className="w-px h-full bg-white/10 mx-auto" />
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-lg sm:text-xl font-black text-white">100%</span>
                      <span className="text-[7.5px] sm:text-[9px] uppercase tracking-widest text-white/40 mt-1">Ownership</span>
                    </div>
                  </div>

                  {/* Status Pills */}
                  <div className="mt-8 flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#C1F7DC]/20 bg-[#C1F7DC]/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#C1F7DC]">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C1F7DC] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C1F7DC]"></span>
                      </span>
                      System Active
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FCC8B2]/20 bg-[#FCC8B2]/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#FCC8B2]">
                      <Crown className="w-3 h-3 text-[#FCC8B2]" />
                      Premium
                    </div>
                  </div>
                </div>
              </div>

              {/* Marquee Card */}
              <div 
                ref={marqueeRef}
                className="glass-card relative overflow-hidden rounded-[32px] border border-white/10 py-8 shadow-xl"
              >
                <div className="flex items-center justify-between px-8 mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999AC6]">Unified Service Ecosystem</h3>
                  <div className="h-1 w-1 rounded-full bg-white/20" />
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
                        className="flex items-center gap-3 opacity-40 transition-all duration-300 hover:opacity-100"
                      >
                        <pillar.icon className="h-5 w-5 text-white" />
                        <span className="text-sm font-black uppercase tracking-widest text-white">
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
            <div className="h-px bg-white/20 w-16" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">All 11 Services</span>
            <div className="h-px bg-white/20 w-16" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-center">
            {businessFeatures.map((feature, idx) => (
              <div
                key={idx}
                ref={el => cardsRef.current[idx] = el}
                className="engine-card group relative bg-white/[0.02] border border-white/5 p-6 sm:p-8 rounded-3xl active:scale-[0.98] transition-transform duration-300"
                style={{ 
                  '--card-accent': feature.accent,
                  '--card-glow': `${feature.accent}15`
                } as React.CSSProperties}
              >
                {/* Subtle persistent mobile glow */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-20 sm:opacity-0 group-hover:opacity-100 mix-blend-screen pointer-events-none transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 100%, ${feature.accent}15 0%, transparent 60%)` }}
                />

                <div className="relative z-10 flex justify-between items-start mb-8 sm:mb-10">
                  <div 
                    className="engine-icon w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-[var(--card-accent)] group-active:border-[var(--card-accent)] shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-all"
                    style={{ color: feature.accent }}
                  >
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black opacity-30 text-white font-mono">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                
                <h4 className="relative z-10 text-[11px] sm:text-lg font-black text-white uppercase mb-1 sm:mb-3 leading-tight group-active:text-[var(--card-accent)] transition-colors line-clamp-1">
                  {feature.title}
                </h4>
                <p className="relative z-10 text-[9px] sm:text-sm text-white/40 font-medium leading-tight sm:leading-relaxed mb-4 sm:mb-6 h-10 sm:h-16 line-clamp-2">
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
              className="engine-cta-card group relative p-8 bg-[#F03A47] rounded-3xl transition-all duration-500 cursor-pointer flex flex-col justify-between hover:scale-[1.03] shadow-[0_0_40px_rgba(240,58,71,0.2)] lg:col-span-1 border border-white/10"
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

// --- MAIN APP ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.title = "Cresva";
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileOpen(false);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#F03A47] selection:text-white overflow-x-hidden">
      {/* DESKTOP NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 hidden md:block ${scrolled ? 'bg-[#0D0D15]/90 backdrop-blur-xl border-b border-white/5 py-4 shadow-xl' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentPage('home')}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-lg text-[#0D0D15] bg-[#C1F7DC] group-hover:rotate-6 transition-all duration-500 ${currentPage === 'about' ? 'bg-white' : ''}`}>C</div>
            <span className="font-bold text-xl tracking-tighter text-white uppercase tracking-widest">Cresva</span>
          </div>
          <div className="flex items-center gap-12">
            <button onClick={() => setCurrentPage('home')} className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all ${currentPage === 'home' ? 'text-[#C1F7DC]' : 'text-[#999AC6] hover:text-[#C1F7DC]'}`}>Home</button>
            <button onClick={() => setCurrentPage('about')} className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all ${currentPage === 'about' ? 'text-[#C1F7DC]' : 'text-[#999AC6] hover:text-[#C1F7DC]'}`}>About</button>
            <button onClick={() => setCurrentPage('work')} className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all ${currentPage === 'work' ? 'text-[#C1F7DC]' : 'text-[#999AC6] hover:text-[#C1F7DC]'}`}>Work</button>
            <button onClick={() => setCurrentPage('events')} className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all ${currentPage === 'events' ? 'text-[#C1F7DC]' : 'text-[#999AC6] hover:text-[#C1F7DC]'}`}>Events</button>
          </div>
          <button onClick={() => setCurrentPage('contact')} className={`border-2 border-[#C1F7DC] text-[#C1F7DC] hover:bg-[#C1F7DC] hover:text-[#0D0D15] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === 'contact' ? 'bg-[#C1F7DC] text-[#0D0D15]' : ''}`}>Partnership</button>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] md:hidden w-[92%] max-w-sm">
        <div className="bg-[#0D0D15]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center justify-around">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'about', icon: User, label: 'About' },
            { id: 'work', icon: Briefcase, label: 'Work' },
            { id: 'events', icon: Calendar, label: 'Events' },
            { id: 'contact', icon: MessageSquare, label: 'Contact' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300 ${
                currentPage === item.id 
                  ? 'bg-[#C1F7DC] text-[#0D0D15] px-4' 
                  : 'text-[#999AC6] hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {currentPage === item.id && (
                <span className="text-[8px] font-black uppercase tracking-widest leading-none">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <main>
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HomePageContent setCurrentPage={setCurrentPage} />
            </motion.div>
          )}
          {currentPage === 'about' && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AboutPage />
            </motion.div>
          )}
          {currentPage === 'work' && (
            <motion.div key="work" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProofOfWorkPage setCurrentPage={setCurrentPage} />
            </motion.div>
          )}
          {currentPage === 'events' && (
            <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EventsPage />
            </motion.div>
          )}

          {currentPage === 'contact' && (
            <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="pt-32 pb-48 px-6 bg-[#FEF6F4] min-h-screen text-center">
                <h1 className="text-6xl md:text-8xl font-black mb-12 tracking-tighter leading-tight text-[#0D0D15] italic uppercase">Apply <span className="text-[#F03A47]">Directly.</span></h1>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16 text-[#0D0D15] font-black uppercase tracking-widest text-xs">
                  <a href="tel:+919971972652" className="flex items-center gap-3 hover:text-[#F03A47] transition-all"><Phone size={16} className="text-[#F03A47]" /> +91 99719 72652</a>
                  <a href="tel:+917011516021" className="flex items-center gap-3 hover:text-[#F03A47] transition-all"><Phone size={16} className="text-[#F03A47]" /> +91 70115 16021</a>
                  <a href="mailto:marhavffs@gmail.com" className="flex items-center gap-3 hover:text-[#F03A47] transition-all"><Mail size={16} className="text-[#F03A47]" /> marhavffs@gmail.com</a>
                </div>

                <form action="mailto:marhavffs@gmail.com" method="post" encType="text/plain" className="max-w-4xl mx-auto bg-white border border-[#FCC8B2]/30 p-12 rounded-[40px] space-y-6 text-left shadow-2xl">
                  <input type="text" name="Business" placeholder="Brand Name" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[#0D0D15] focus:border-[#F03A47] outline-none transition-all" />
                  <input type="email" name="Email" placeholder="Founder Email" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[#0D0D15] focus:border-[#F03A47] outline-none transition-all" />
                  <textarea name="Goals" placeholder="Describe your growth goals..." rows={5} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[#0D0D15] focus:border-[#F03A47] outline-none transition-all" />
                  <button type="submit" className="w-full py-6 bg-[#F03A47] text-white rounded-2xl font-black text-lg hover:bg-[#0D0D15] transition-all shadow-xl shadow-[#F03A47]/20">Submit Application</button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-[#0D0D15] text-white pt-32 pb-12 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className={`w-10 h-10 bg-[#C1F7DC] rounded-lg flex items-center justify-center font-black italic text-[#0D0D15] bg-[#C1F7DC] ${currentPage === 'about' ? 'bg-white' : ''}`}>C</div>
            <span className="font-bold text-2xl tracking-tighter uppercase tracking-widest">Cresva</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-[#999AC6] text-[10px] font-black tracking-[0.4em] uppercase opacity-40">Direct Contact</p>
            <div className="flex gap-6 text-[10px] font-black uppercase text-[#C1F7DC]">
              <a href="tel:+919971972652">+91 99719 72652</a>
              <a href="tel:+917011516021">7011516021</a>
            </div>
          </div>

          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-[#999AC6]">
            <span className="hover:text-[#C1F7DC] cursor-pointer transition-all">Instagram</span>
            <button onClick={() => setCurrentPage('work')} className="hover:text-[#C1F7DC] transition-all">Proof of Work</button>
            <button onClick={() => setCurrentPage('about')} className="hover:text-[#C1F7DC] transition-all">Founders</button>
            <button onClick={() => setCurrentPage('events')} className="hover:text-[#C1F7DC] transition-all">Events</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
