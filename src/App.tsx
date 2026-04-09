/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { 
  Code2, 
  Smartphone, 
  Cloud, 
  Layers, 
  Send, 
  Github, 
  Twitter, 
  Linkedin, 
  ExternalLink,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";
import { AuthProvider } from "./AuthContext";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out
        ${scrolled ? "pt-4 px-4" : "pt-0 px-0"}`}
    >
      <div 
        className={`w-full max-w-7xl flex items-center justify-between transition-all duration-500 ease-in-out
          ${scrolled 
            ? "glass rounded-2xl px-8 py-3 shadow-2xl border-white/10" 
            : "bg-transparent px-8 py-8 border-transparent"}`}
      >
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-deep-violet flex items-center justify-center font-bold text-white">
              L
            </div>
            <span className="text-xl font-display font-bold tracking-tighter">lemedo.it</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#services" className="hover:text-neon-blue transition-colors">Services</a>
          <a href="#portfolio" className="hover:text-neon-blue transition-colors">Portfolio</a>
          <a href="#products" className="hover:text-neon-blue transition-colors">Products</a>
          <a href="#tech" className="hover:text-neon-blue transition-colors">Tech Stack</a>
          <a href="#contact" className="hover:text-neon-blue transition-colors">Contact</a>
          <button className="px-5 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-neon-blue hover:text-white transition-all">
            Get Started
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>

        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl p-6 flex flex-col gap-4 md:hidden"
          >
            <a href="#services" onClick={() => setIsOpen(false)}>Services</a>
            <a href="#portfolio" onClick={() => setIsOpen(false)}>Portfolio</a>
            <a href="#products" onClick={() => setIsOpen(false)}>Products</a>
            <a href="#tech" onClick={() => setIsOpen(false)}>Tech Stack</a>
            <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
            <button className="w-full py-3 rounded-xl bg-white text-black font-bold">Get Started</button>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-4xl"
      >
        <span className="inline-block px-4 py-1.5 rounded-full glass text-[10px] font-bold uppercase tracking-widest text-neon-blue mb-6">
          Next-Gen Software Solutions
        </span>
        <h1 className="text-5xl md:text-8xl font-display font-extrabold leading-[0.9] mb-8">
          We Build <span className="text-gradient">Digital</span> <br /> 
          Masterpieces.
        </h1>
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          lemedo.it is a boutique software house crafting high-fidelity web, mobile, and cloud experiences for forward-thinking brands.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold flex items-center justify-center gap-2 group hover:bg-neon-blue hover:text-white transition-all">
            Start a Project
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 rounded-full glass font-bold hover:bg-white/10 transition-all">
            View Our Work
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mt-20 relative w-full max-w-5xl aspect-video rounded-3xl glass overflow-hidden shadow-2xl shadow-neon-blue/10"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <img 
          src="https://picsum.photos/seed/software/1200/800" 
          alt="Dashboard Preview" 
          className="w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glass p-4 rounded-2xl flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center">
              <Code2 className="text-neon-blue" />
            </div>
            <div>
              <div className="h-2 w-24 bg-white/20 rounded mb-2" />
              <div className="h-2 w-16 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const LiquidGlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`relative overflow-hidden glass rounded-3xl p-8 group ${className}`}>
      {/* Liquid Glass Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="liquid-blob w-40 h-40 bg-neon-blue/30 top-[-10%] left-[-10%]"
        />
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -20, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="liquid-blob w-48 h-48 bg-deep-violet/30 bottom-[-15%] right-[-10%]"
        />
        <motion.div
          animate={{
            x: [0, 20, -40, 0],
            y: [0, 50, -30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="liquid-blob w-32 h-32 bg-cyan-400/20 top-[20%] right-[10%]"
        />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const Services = () => {
  const services = [
    {
      title: "Web Development",
      desc: "High-performance, scalable web applications built with modern frameworks and best practices.",
      icon: <Code2 className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-400"
    },
    {
      title: "Mobile Apps",
      desc: "Native and cross-platform mobile experiences that feel fluid and look stunning on any device.",
      icon: <Smartphone className="w-6 h-6" />,
      color: "from-purple-500 to-pink-400"
    },
    {
      title: "Cloud Solutions",
      desc: "Robust cloud infrastructure and serverless architectures designed for maximum reliability.",
      icon: <Cloud className="w-6 h-6" />,
      color: "from-indigo-500 to-violet-400"
    }
  ];

  return (
    <section id="services" className="py-24 px-4 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Services</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-neon-blue to-deep-violet rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="group cursor-default"
          >
            <LiquidGlassCard>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-6 shadow-lg shadow-white/5`}>
                {s.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-neon-blue transition-colors">{s.title}</h3>
              <p className="text-white/50 leading-relaxed">
                {s.desc}
              </p>
            </LiquidGlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Featured = () => {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <LiquidGlassCard className="p-12 md:p-20 overflow-visible">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="text-neon-blue font-bold text-xs uppercase tracking-widest mb-4 block">Innovation First</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Experience the <span className="text-gradient">Fluidity</span> of Modern Software.
            </h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              We don't just write code; we craft digital ecosystems that breathe and adapt. Our "Liquid Glass" approach combines aesthetic beauty with functional excellence.
            </p>
            <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-neon-blue hover:text-white transition-all">
              Explore Our Process
            </button>
          </div>
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                src="https://picsum.photos/seed/liquid/800/600" 
                alt="Liquid Interface" 
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative floating elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-24 h-24 glass rounded-2xl flex items-center justify-center z-20"
            >
              <Layers className="text-neon-blue w-8 h-8" />
            </motion.div>
          </div>
        </div>
      </LiquidGlassCard>
    </section>
  );
};

const Portfolio = () => {
  const projects = [
    {
      title: "EcoSphere Dashboard",
      category: "Web Application",
      image: "https://picsum.photos/seed/eco/800/600",
      link: "#"
    },
    {
      title: "Nova Mobile Banking",
      category: "Mobile App",
      image: "https://picsum.photos/seed/bank/800/600",
      link: "#"
    },
    {
      title: "Lumina AI Platform",
      category: "Cloud Solution",
      image: "https://picsum.photos/seed/ai/800/600",
      link: "#"
    },
    {
      title: "Zenith E-Commerce",
      category: "Web Application",
      image: "https://picsum.photos/seed/shop/800/600",
      link: "#"
    }
  ];

  return (
    <section id="portfolio" className="py-24 px-4 max-w-7xl mx-auto">
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Portfolio</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-neon-blue to-deep-violet rounded-full" />
        </div>
        <p className="text-white/50 max-w-md">
          A glimpse into the digital experiences we've crafted for our global clients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative aspect-[4/3] rounded-[32px] overflow-hidden glass"
          >
            <img 
              src={p.image} 
              alt={p.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
              <span className="text-neon-blue text-xs font-bold uppercase tracking-widest mb-2">{p.category}</span>
              <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span>View Project</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Products = () => {
  const products = [
    {
      title: "Lemedo CRM",
      desc: "An all-in-one customer relationship management tool for modern sales teams.",
      icon: <Layers className="w-6 h-6 text-neon-blue" />,
      tag: "SaaS"
    },
    {
      title: "Streamline Analytics",
      desc: "Real-time data visualization and processing for high-traffic applications.",
      icon: <Code2 className="w-6 h-6 text-deep-violet" />,
      tag: "Analytics"
    },
    {
      title: "SecureVault",
      desc: "Enterprise-grade encryption and storage solutions for sensitive digital assets.",
      icon: <Cloud className="w-6 h-6 text-cyan-400" />,
      tag: "Security"
    }
  ];

  return (
    <section id="products" className="py-24 px-4 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Products</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-neon-blue to-deep-violet rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <LiquidGlassCard className="h-full flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  {p.icon}
                </div>
                <span className="px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue text-[10px] font-bold uppercase tracking-widest">
                  {p.tag}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
              <p className="text-white/50 leading-relaxed mb-8 flex-grow">
                {p.desc}
              </p>
              <button className="w-full py-3 rounded-xl glass border-white/5 hover:bg-white/10 transition-all text-sm font-bold">
                Learn More
              </button>
            </LiquidGlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const TechStack = () => {
  const techs = [
    { name: "Laravel", icon: "https://cdn.worldvectorlogo.com/logos/laravel-2.svg" },
    { name: "React", icon: "https://cdn.worldvectorlogo.com/logos/react-2.svg" },
    { name: "Docker", icon: "https://cdn.worldvectorlogo.com/logos/docker-3.svg" },
    { name: "PostgreSQL", icon: "https://cdn.worldvectorlogo.com/logos/postgresql.svg" },
    { name: "TypeScript", icon: "https://cdn.worldvectorlogo.com/logos/typescript.svg" },
    { name: "Node.js", icon: "https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg" },
    { name: "Kotlin", icon: "https://cdn.worldvectorlogo.com/logos/kotlin-1.svg" },
    { name: "Java", icon: "https://cdn.worldvectorlogo.com/logos/java-4.svg" },
    { name: "Flutter", icon: "https://cdn.worldvectorlogo.com/logos/flutter.svg" },
    { name: "Swift", icon: "https://cdn.worldvectorlogo.com/logos/swift-15.svg" },
    { name: "Firebase", icon: "https://cdn.worldvectorlogo.com/logos/firebase-1.svg" },
    { name: "AWS", icon: "https://cdn.worldvectorlogo.com/logos/aws-2.svg" },
  ];

  // Double the techs for infinite loop
  const doubledTechs = [...techs, ...techs];

  return (
    <section id="tech" className="py-24 overflow-hidden bg-white/5">
      <div className="max-w-7xl mx-auto px-4 text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold">Our Tech Stack</h2>
      </div>
      
      <div className="relative flex overflow-hidden group">
        <motion.div 
          className="flex whitespace-nowrap gap-12 py-4"
          animate={{
            x: ["0%", "-50%"]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ width: "fit-content" }}
          // Pause animation on hover
          whileHover={{ animationPlayState: "paused" }}
        >
          {doubledTechs.map((t, i) => (
            <div 
              key={i}
              className="flex flex-col items-center gap-4 min-w-[120px] opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-default"
            >
              <img 
                src={t.icon} 
                alt={t.name} 
                className="w-16 h-16 grayscale hover:grayscale-0 transition-all" 
                referrerPolicy="no-referrer" 
              />
              <span className="text-[10px] font-bold uppercase tracking-widest">{t.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        status: 'new',
        createdAt: serverTimestamp()
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-deep-violet/10 blur-[120px] -z-10 rounded-full" />
      
      <div className="max-w-5xl mx-auto glass rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row gap-16">
        <div className="flex-1">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Let's build <br /> something <span className="text-gradient">epic</span>.</h2>
          <p className="text-white/60 mb-10 text-lg">
            Ready to transform your idea into a digital reality? Reach out and let's start the conversation.
          </p>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-neon-blue">
                <Send className="w-4 h-4" />
              </div>
              <span className="text-white/80">hello@lemedo.it</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-neon-blue">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-white/80">San Francisco, CA</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Name" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-neon-blue outline-none transition-all"
              />
              <input 
                type="email" 
                placeholder="Email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-neon-blue outline-none transition-all"
              />
            </div>
            <input 
              type="text" 
              placeholder="Subject" 
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-neon-blue outline-none transition-all"
            />
            <textarea 
              placeholder="Your Message" 
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-neon-blue outline-none transition-all resize-none"
            />
            <button 
              disabled={status === 'submitting'}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-neon-blue to-deep-violet font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
              <Send className="w-4 h-4" />
            </button>
            {status === 'error' && <p className="text-red-500 text-sm text-center">Failed to send message. Please try again.</p>}
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <LiquidGlassCard className="py-12 px-8 md:px-12 border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-deep-violet flex items-center justify-center font-bold text-white shadow-lg shadow-neon-blue/20 group-hover:shadow-neon-blue/40 transition-all">
                L
              </div>
              <span className="font-display font-bold tracking-tighter text-xl group-hover:text-neon-blue transition-colors">lemedo.it</span>
            </motion.div>

            <p className="text-white/40 text-sm font-medium">
              © 2026 lemedo.it. All rights reserved. • <Link to="/login" className="hover:text-neon-blue transition-colors">Admin</Link>
            </p>

            <div className="flex items-center gap-6">
              {[
                { Icon: Github, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Linkedin, href: "#" }
              ].map(({ Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  whileHover={{ y: -5, scale: 1.2 }}
                  className="text-white/40 hover:text-neon-blue transition-colors"
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </div>
        </LiquidGlassCard>
      </div>
    </footer>
  );
};

const LandingPage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <Services />
      <Featured />
      <Portfolio />
      <Products />
      <TechStack />
      <Contact />
    </main>
    <Footer />
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="selection:bg-neon-blue/30 relative min-h-screen">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
