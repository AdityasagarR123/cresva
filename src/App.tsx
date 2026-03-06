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
  Code2,
  Cpu,
  Monitor,
  Phone,
  Mail
} from "lucide-react";
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from "framer-motion";

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
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-28 text-white px-6 text-center">
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
            <button onClick={onEcosystemClick} className="px-10 py-5 bg-white/5 border border-white/10 hover:border-[#C1F7DC]/30 text-white rounded-full font-black text-base backdrop-blur-sm transition-all active:scale-95">
              Explore Ecosystem
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
      <div className="relative w-14 h-14 flex items-center justify-center mb-6">
        <div className="absolute inset-0 bg-[#F03A47]/5 rounded-2xl group-hover:bg-[#F03A47] transition-all duration-500" />
        <Icon className="relative z-10 w-6 h-6 text-[#F03A47] group-hover:text-white transition-colors duration-500" />
      </div>
      <h3 className="text-base font-black text-[#0D0D15] mb-2 tracking-tighter group-hover:text-[#F03A47] transition-colors uppercase leading-tight">{title}</h3>
      <p className="text-[#0D0D15]/60 text-[11px] font-medium leading-relaxed group-hover:text-[#0D0D15] transition-all">{description}</p>
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

interface Work {
  id: number;
  type: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  tags: string[];
}

interface ProofOfWorkPageProps {
  setCurrentPage: (page: string) => void;
}

const ProofOfWorkPage: React.FC<ProofOfWorkPageProps> = ({ setCurrentPage }) => {
  const [filter, setFilter] = useState('all');
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/works')
      .then(res => res.json())
      .then(data => {
        setWorks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredWorks = filter === 'all' ? works : works.filter(w => w.type === filter);

  return (
    <div className="pt-40 pb-32 bg-[#0D0D15] min-h-screen relative overflow-hidden">
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
        <div className="flex justify-center gap-4 mb-16">
          {['all', 'website', 'ad'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f 
                  ? 'bg-[#C1F7DC] text-[#0D0D15]' 
                  : 'bg-white/5 text-[#999AC6] hover:bg-white/10 border border-white/10'
              }`}
            >
              {f === 'all' ? 'Everything' : f === 'website' ? 'Digital Architecture' : 'Performance Ads'}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#C1F7DC] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-20 text-[#999AC6]">
            <p>No projects uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredWorks.map((work, idx) => (
                <motion.div
                  key={work.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group relative bg-white/5 border border-white/10 rounded-[32px] overflow-hidden hover:border-[#C1F7DC]/30 transition-all duration-500"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <video 
                      src={work.videoUrl} 
                      poster={work.thumbnail}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                      muted
                      loop
                      onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseOut={(e) => {
                        const video = e.target as HTMLVideoElement;
                        video.pause();
                        video.currentTime = 0;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D15] via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-[#0D0D15]/80 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#C1F7DC]">
                        {work.type}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="w-16 h-16 bg-[#C1F7DC] rounded-full flex items-center justify-center text-[#0D0D15] shadow-2xl">
                        <Video size={24} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-[#C1F7DC] transition-colors">
                      {work.title}
                    </h3>
                    <p className="text-sm text-[#999AC6] font-medium leading-relaxed mb-6">
                      {work.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/5 px-2 py-1 rounded-md">
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

// --- ADMIN PAGE ---

const AdminPage = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [formData, setFormData] = useState({
    type: 'website',
    title: '',
    description: '',
    tags: ''
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/works')
        .then(res => res.json())
        .then(setWorks);
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    const data = new FormData();
    data.append('type', formData.type);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('tags', formData.tags);
    if (videoFile) data.append('video', videoFile);
    if (thumbFile) data.append('thumbnail', thumbFile);

    try {
      const response = await fetch('/api/works', {
        method: 'POST',
        body: data
      });
      if (response.ok) {
        const result = await response.json();
        const tagsArray = formData.tags.split(',').map(t => t.trim());
        setWorks([{ 
          id: result.id, 
          type: formData.type, 
          title: formData.title, 
          description: formData.description, 
          videoUrl: result.videoUrl, 
          thumbnail: result.thumbnail, 
          tags: tagsArray 
        }, ...works]);
        setFormData({ type: 'website', title: '', description: '', tags: '' });
        setVideoFile(null);
        setThumbFile(null);
        alert('Project uploaded successfully!');
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const response = await fetch(`/api/works/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setWorks(works.filter(w => w.id !== id));
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="pt-64 pb-48 px-6 bg-[#0D0D15] min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white/5 border border-white/10 p-12 rounded-[40px] text-center">
          <h2 className="text-3xl font-black text-white uppercase mb-8">Admin Access</h2>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white mb-6 outline-none focus:border-[#C1F7DC]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            onClick={() => password === 'cresva2026' ? setIsLoggedIn(true) : alert('Incorrect Password')}
            className="w-full py-4 bg-[#C1F7DC] text-[#0D0D15] rounded-2xl font-black uppercase"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 bg-[#0D0D15] min-h-screen px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-[#C1F7DC] font-black tracking-[0.4em] text-[11px] uppercase mb-4 block">Admin Panel</span>
            <h2 className="text-5xl font-black text-white uppercase">Upload Work</h2>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="text-[#999AC6] font-black uppercase text-[10px] tracking-widest">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-10 rounded-[40px] border border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, type: 'website' })}
                className={`py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border transition-all ${formData.type === 'website' ? 'bg-[#C1F7DC] text-[#0D0D15] border-[#C1F7DC]' : 'bg-transparent text-white border-white/10'}`}
              >
                Website
              </button>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, type: 'ad' })}
                className={`py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border transition-all ${formData.type === 'ad' ? 'bg-[#C1F7DC] text-[#0D0D15] border-[#C1F7DC]' : 'bg-transparent text-white border-white/10'}`}
              >
                Ad Campaign
              </button>
            </div>
            <input 
              type="text" 
              placeholder="Project Title" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#C1F7DC]"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea 
              placeholder="Description" 
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#C1F7DC]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[#999AC6] tracking-widest ml-2">Video File (.mp4)</label>
              <input 
                type="file" 
                accept="video/mp4"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#C1F7DC] file:bg-[#C1F7DC] file:border-none file:rounded-lg file:px-4 file:py-1 file:mr-4 file:text-[10px] file:font-black file:uppercase"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[#999AC6] tracking-widest ml-2">Thumbnail Image</label>
              <input 
                type="file" 
                accept="image/*"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#C1F7DC] file:bg-[#C1F7DC] file:border-none file:rounded-lg file:px-4 file:py-1 file:mr-4 file:text-[10px] file:font-black file:uppercase"
                onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                required
              />
            </div>
            <input 
              type="text" 
              placeholder="Tags (comma separated: React, Node.js, etc.)" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#C1F7DC]"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              required
            />
            <button 
              type="submit" 
              disabled={uploading}
              className={`w-full py-6 bg-[#C1F7DC] text-[#0D0D15] rounded-2xl font-black text-lg uppercase shadow-xl shadow-[#C1F7DC]/10 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
            >
              {uploading ? 'Uploading...' : 'Publish to Portfolio'}
            </button>
          </form>

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white uppercase mb-8">Current Portfolio</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {works.map(work => (
                <div key={work.id} className="flex items-center justify-between bg-white/5 p-6 rounded-3xl border border-white/10 group">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-white/10">
                      <img src={work.thumbnail} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase text-sm">{work.title}</h4>
                      <p className="text-[#999AC6] text-[10px] uppercase tracking-widest">{work.type}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(work.id)} className="p-3 text-white/20 hover:text-[#F03A47] transition-colors">
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PAGES ---

const AboutPage = () => {
  // --- LOCAL IMAGE REFERENCES ---
  // Update these URLs when porting locally
  const IMAGES = {
    MADHAV: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    ADITYA: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
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

  return (
    <div className="pt-40 pb-20 bg-[#999AC6] overflow-hidden relative min-h-screen">
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-white">
        <div className="text-center mb-20">
          <span className="font-black tracking-[0.4em] text-[11px] uppercase mb-6 block drop-shadow-sm">THE ARCHITECTS</span>
          <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter italic uppercase leading-none text-white">Engineering Influence</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto font-light leading-relaxed">Cresva was founded by two engineers who realized that the gap between technical logic and visual storytelling is where growth happens.</p>
        </div>

        <div className="space-y-16">
          {/* Madhav Section */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Madhav Photo */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group flex-shrink-0"
            >
              <div className="absolute inset-0 border-2 border-white/30 rounded-2xl -m-2 transition-all duration-500 group-hover:border-white/50" />
              <div className="relative z-10 rounded-xl overflow-hidden w-32 h-32 bg-white/10 shadow-2xl">
                <img 
                  src={IMAGES.MADHAV} 
                  alt="Madhav" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                  referrerPolicy="no-referrer" 
                />
              </div>
            </motion.div>

            {/* Madhav Details */}
            <div className="flex-grow space-y-8">
              <div className="bg-white/10 p-8 rounded-[32px] border border-white/20 backdrop-blur-md">
                <div className="mb-4">
                  <h3 className="text-2xl font-black uppercase italic text-[#C1F7DC]">Madhav</h3>
                  <p className="text-white font-black uppercase tracking-widest text-[10px] opacity-60">Design & Motion Engineer</p>
                </div>
                <h4 className="text-[#C1F7DC] font-black text-[10px] uppercase tracking-widest mb-2 italic opacity-80">Abilities & Speciality</h4>
                <p className="text-white/80 text-base font-medium leading-relaxed">
                  Graphic Designer and Video Editor with a background in Engineering. Madhav approaches visual storytelling as a system, bridging the gap between technical logic and bold aesthetic impact.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {madhavServices.map((s, i) => (
                  <ServiceItem key={i} {...s} delay={i * 0.1} />
                ))}
              </div>
            </div>
          </div>

          {/* Aditya Section */}
          <div className="flex flex-col lg:flex-row-reverse gap-8 items-start">
            {/* Aditya Photo */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group flex-shrink-0"
            >
              <div className="absolute inset-0 border-2 border-white/30 rounded-2xl -m-2 transition-all duration-500 group-hover:border-white/50" />
              <div className="relative z-10 rounded-xl overflow-hidden w-32 h-32 bg-white/10 shadow-2xl">
                <img 
                  src={IMAGES.ADITYA} 
                  alt="Aditya" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                  referrerPolicy="no-referrer" 
                />
              </div>
            </motion.div>

            {/* Aditya Details */}
            <div className="flex-grow space-y-8">
              <div className="bg-white/10 p-8 rounded-[32px] border border-white/20 backdrop-blur-md lg:text-right">
                <div className="mb-4">
                  <h3 className="text-2xl font-black uppercase italic text-[#C1F7DC]">Aditya</h3>
                  <p className="text-white font-black uppercase tracking-widest text-[10px] opacity-60">Full-Stack & Systems Engineer</p>
                </div>
                <h4 className="text-[#C1F7DC] font-black text-[10px] uppercase tracking-widest mb-2 italic opacity-80">Bio & Systems Engineering</h4>
                <p className="text-white/80 text-base font-medium leading-relaxed">
                  Full-Stack Developer and Digital Solutions Builder. Aditya focuses on the infrastructure of growth, creating clean, practical, and high-performance systems that convert users into loyal customers.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {adityaServices.map((s, i) => (
                  <ServiceItem key={i} {...s} delay={i * 0.1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HomePageContentProps {
  setCurrentPage: (page: string) => void;
}

const HomePageContent: React.FC<HomePageContentProps> = ({ setCurrentPage }) => {
  const businessFeatures = [
    { icon: QrCode, title: "Interactive QR Systems", description: "Seamless, fast, and real-time. High-performance digital interface systems." },
    { icon: Layout, title: "Digital Architecture", description: "Premium, high-performance sites built to capture local search traffic and conversions." },
    { icon: Instagram, title: "Social Growth Strategy", description: "Curated aesthetic storytelling that turns audiences into brand loyalists." },
    { icon: Zap, title: "Media Production", description: "High-energy short-form video content engineered to go viral locally." },
    { icon: Database, title: "Retention Pipelines", description: "Capture data from every interaction. Own your direct customer relationship." },
    { icon: MapPin, title: "Search Dominance", description: "Strategic optimization ensuring your brand dominates local search results." },
    { icon: ShoppingBag, title: "Direct Commerce", description: "Take control of your revenue. Bypass heavy third-party commissions." },
    { icon: MessageCircle, title: "Automated Support", description: "Instant automated alerts and elite customer support via WhatsApp." },
    { icon: Star, title: "Loyalty Ecosystems", description: "Gamify the customer routine. Turn one-time visitors into daily regulars." },
    { icon: Camera, title: "Visual Storytelling", description: "Professional photography that makes your products and space irresistible." },
    { icon: Palette, title: "Brand Identity", description: "A cohesive visual voice that resonates with your community." },
  ];

  return (
    <>
      <Hero 
        onContactClick={() => setCurrentPage('contact')}
        onEcosystemClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
      />

      <section 
        id="features" 
        className="py-72 px-6 bg-[#FEF6F4] relative overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FCC8B2]/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-32"
          >
            <span className="text-[#F03A47] font-black tracking-[0.4em] text-[11px] uppercase mb-6 block opacity-80">Our Ecosystem</span>
            <h2 className="text-5xl md:text-8xl font-black text-[#0D0D15] mb-8 tracking-tighter leading-none uppercase">
              The Digital <span className="text-[#F03A47] italic">Engine</span>
            </h2>
            <p className="text-base text-[#0D0D15]/60 max-w-xl mx-auto font-light leading-relaxed">
              Every touchpoint of your digital presence engineered under one roof. Designed for growth, built for elite standards.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
            {businessFeatures.map((feature, idx) => (
              <FeatureCard key={idx} index={idx} {...feature} />
            ))}
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => setCurrentPage('contact')}
              className="group relative p-8 bg-[#F03A47] rounded-3xl transition-all duration-500 cursor-pointer flex flex-col justify-between hover:scale-[1.03] shadow-2xl shadow-[#F03A47]/20"
            >
              <div className="flex justify-between items-start">
                <Rocket className="text-white w-8 h-8" />
                <Plus className="text-white w-6 h-6 opacity-40 group-hover:rotate-90 transition-transform duration-500" />
              </div>
              <div className="mt-12 text-left text-white">
                <h4 className="text-lg font-black leading-tight uppercase mb-1">Scale Now</h4>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Apply for partnership</p>
              </div>
            </motion.div>
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
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-[#0D0D15]/90 backdrop-blur-xl border-b border-white/5 py-4 shadow-xl' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentPage('home')}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-lg text-[#0D0D15] bg-[#C1F7DC] group-hover:rotate-6 transition-all duration-500 ${currentPage === 'about' ? 'bg-white' : ''}`}>C</div>
            <span className="font-bold text-xl tracking-tighter text-white uppercase tracking-widest">Cresva</span>
          </div>
          <div className="hidden md:flex items-center gap-12">
            <button onClick={() => setCurrentPage('home')} className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all ${currentPage === 'home' ? 'text-[#C1F7DC]' : 'text-[#999AC6] hover:text-[#C1F7DC]'}`}>Home</button>
            <button onClick={() => setCurrentPage('about')} className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all ${currentPage === 'about' ? 'text-[#C1F7DC]' : 'text-[#999AC6] hover:text-[#C1F7DC]'}`}>About</button>
            <button onClick={() => setCurrentPage('work')} className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all ${currentPage === 'work' ? 'text-[#C1F7DC]' : 'text-[#999AC6] hover:text-[#C1F7DC]'}`}>Work</button>
          </div>
          <button onClick={() => setCurrentPage('contact')} className={`hidden sm:block border-2 border-[#C1F7DC] text-[#C1F7DC] hover:bg-[#C1F7DC] hover:text-[#0D0D15] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === 'contact' ? 'bg-[#C1F7DC] text-[#0D0D15]' : ''}`}>Partnership</button>
          <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}</button>
        </div>
        
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0D0D15] border-b border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-8 gap-6">
                <button onClick={() => setCurrentPage('home')} className="text-left text-white font-black uppercase tracking-widest text-sm">Home</button>
                <button onClick={() => setCurrentPage('about')} className="text-left text-white font-black uppercase tracking-widest text-sm">About</button>
                <button onClick={() => setCurrentPage('work')} className="text-left text-white font-black uppercase tracking-widest text-sm">Work</button>
                <button onClick={() => setCurrentPage('contact')} className="text-left text-[#C1F7DC] font-black uppercase tracking-widest text-sm">Partnership</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          {currentPage === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminPage />
            </motion.div>
          )}
          {currentPage === 'contact' && (
            <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="pt-64 pb-48 px-6 bg-[#FEF6F4] min-h-screen text-center">
                <h1 className="text-6xl md:text-8xl font-black mb-12 tracking-tighter leading-tight text-[#0D0D15] italic uppercase">Apply <span className="text-[#F03A47]">Directly.</span></h1>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16 text-[#0D0D15] font-black uppercase tracking-widest text-xs">
                  <a href="tel:+919971972652" className="flex items-center gap-3 hover:text-[#F03A47] transition-all"><Phone size={16} className="text-[#F03A47]" /> +91 99719 72652</a>
                  <a href="tel:+917011516021" className="flex items-center gap-3 hover:text-[#F03A47] transition-all"><Phone size={16} className="text-[#F03A47]" /> +91 70115 16021</a>
                  <a href="mailto:madhav.cresva@gmail.com" className="flex items-center gap-3 hover:text-[#F03A47] transition-all"><Mail size={16} className="text-[#F03A47]" /> madhav.cresva@gmail.com</a>
                </div>

                <form action="mailto:madhav.cresva@gmail.com" method="post" encType="text/plain" className="max-w-4xl mx-auto bg-white border border-[#FCC8B2]/30 p-12 rounded-[40px] space-y-6 text-left shadow-2xl">
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
            <button onClick={() => setCurrentPage('admin')} className="hover:text-[#C1F7DC] transition-all opacity-0 hover:opacity-100">Admin</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
