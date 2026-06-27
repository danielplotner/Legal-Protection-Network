import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  ChevronRight, 
  Menu, 
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Home from './pages/Home';
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';

const REFERRAL_URL = "https://danielplotner.legalshieldassociate.com/legal?utm_source=pbls&utm_medium=referral&utm_campaign=Share+Links&utm_content=623+WALS+Marketing+Site";
const ASSOCIATE_URL = "https://danielplotner.legalshieldassociate.com/associate?utm_source=pbls&utm_medium=referral&utm_campaign=Share+Links&utm_content=623+WALS+Marketing+Site";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', isHash: false },
    { name: 'Quiz', path: '/#quiz', isHash: true },
    { name: 'Plans', path: '/#plans', isHash: true },
    { name: 'About', path: '/#about', isHash: true },
    { name: 'Blog', path: '/blog', isHash: false },
  ];

  const handleLinkClick = (isHash) => {
    setIsOpen(false);
    if (isHash && !isHome) {
      // Logic handled by hash links usually, but if we're on blog, 
      // navigating to /#quiz will work via browser behavior.
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled || !isHome ? "bg-white/90 backdrop-blur-md shadow-sm h-16" : "bg-transparent h-20"
    )}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <Shield className="text-gold" size={32} />
          <span className={cn("font-heading text-xl font-bold transition-colors", scrolled ? "text-navy" : "text-white")}>Legal Protection Network</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.isHash ? (
              <a 
                key={link.name} 
                href={link.path} 
                className={cn("font-medium transition-colors", scrolled ? "text-navy hover:text-gold" : "text-white/80 hover:text-white")}
              >
                {link.name}
              </a>
            ) : (
              <Link 
                key={link.name} 
                to={link.path} 
                className={cn("font-medium transition-colors", scrolled ? "text-navy hover:text-gold" : "text-white/80 hover:text-white")}
              >
                {link.name}
              </Link>
            )
          ))}
          <a href={REFERRAL_URL} className="bg-gold text-navy px-6 py-2 rounded-full font-bold shadow-button hover:bg-gold-light transition-all flex items-center gap-2">
            Get Protected <ChevronRight size={18} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className={cn("md:hidden transition-colors", scrolled ? "text-navy" : "text-white")} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-t p-4 flex flex-col gap-4 shadow-xl md:hidden"
          >
            {navLinks.map((link) => (
              link.isHash ? (
                <a 
                  key={link.name} 
                  href={link.path} 
                  className="text-navy font-medium p-2" 
                  onClick={() => handleLinkClick(true)}
                >
                  {link.name}
                </a>
              ) : (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-navy font-medium p-2" 
                  onClick={() => handleLinkClick(false)}
                >
                  {link.name}
                </Link>
              )
            ))}
            <a href={REFERRAL_URL} className="bg-gold text-navy p-4 rounded-xl font-bold text-center shadow-button">
              Get Protected Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function App() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div className="min-h-screen selection:bg-gold/30">
      <Nav />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </main>

      {/* Footer (Simplified from Home but shared globally) */}
      <footer className="bg-navy-dark py-16 text-white/60">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 text-white mb-6">
                <Shield className="text-gold" size={24} />
                <span className="font-heading text-lg font-bold">Legal Protection Network</span>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                Knowledge is power. Protection is peace of mind. Providing affordable legal access for everyone since 2026.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Plans</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="/#plans" className="hover:text-gold">Personal & Family</a></li>
                <li><a href="/#plans" className="hover:text-gold">Small Business</a></li>
                <li><a href="/#plans" className="hover:text-gold">IDShield</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="/#about" className="hover:text-gold">About Us</a></li>
                <li><a href="/blog" className="hover:text-gold">Blog</a></li>
                <li><a href="/#quiz" className="hover:text-gold">Legal Health Quiz</a></li>
                <li><a href={REFERRAL_URL} className="hover:text-gold">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-gold">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gold">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gold">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between gap-6 text-xs text-center md:text-left">
            <p>© 2026 Legal Protection Network. All Rights Reserved. Powered by LegalShield® and IDShield®</p>
            <p>LegalShield plans provide access to legal services provided by a network of law firms. LegalShield is not a law firm.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
