import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  ChevronRight, 
  Menu, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Users, 
  Home, 
  Briefcase, 
  PenTool, 
  Building2, 
  Rocket, 
  FileText, 
  Calendar, 
  Check, 
  XCircle, 
  AlertTriangle, 
  Lock, 
  Car, 
  DollarSign, 
  Plus, 
  ChevronDown,
  Star,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const REFERRAL_URL = "https://danielplotner.legalshieldassociate.com/?utm_source=pbls&utm_medium=referral&utm_campaign=Share%20Links&utm_content=623%20WALS%20Marketing%20Site";

// Utility for Tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Quiz Data ---
const QUESTIONS = [
  {
    id: 'q1',
    text: "What describes your current situation best?",
    options: [
      { value: 'single', label: "I'm on my own", icon: <User size={20} /> },
      { value: 'couple', label: "Married or partnered", icon: <Users size={20} /> },
      { value: 'family', label: "I have kids at home", icon: <Users size={20} /> },
      { value: 'empty_nest', label: "Kids are grown", icon: <Home size={20} /> },
    ]
  },
  {
    id: 'q2',
    text: "Do you own a business or freelance?",
    options: [
      { value: 'no_biz', label: "No, I'm employed or retired", icon: <Briefcase size={20} /> },
      { value: 'freelance', label: "Yes — freelancer or solopreneur", icon: <PenTool size={20} /> },
      { value: 'small_biz', label: "Yes — I run a small business", icon: <Building2 size={20} /> },
      { value: 'startup', label: "Yes — I'm starting something new", icon: <Rocket size={20} /> },
    ]
  },
  {
    id: 'q3',
    text: "Do you have a current will or estate plan?",
    options: [
      { value: 'no_will', label: "No, nothing in place", icon: <XCircle size={20} /> },
      { value: 'old_will', label: "Yes, but it's over 3 years old", icon: <Calendar size={20} /> },
      { value: 'has_will', label: "Yes, current and updated", icon: <CheckCircle2 size={20} /> },
    ]
  },
  {
    id: 'q4',
    text: "How often do you sign contracts or agreements?",
    options: [
      { value: 'never', label: "Rarely or never", icon: <XCircle size={20} /> },
      { value: 'few_year', label: "A few times a year", icon: <FileText size={20} /> },
      { value: 'monthly', label: "Monthly", icon: <FileText size={20} /> },
      { value: 'weekly', label: "Weekly or more", icon: <FileText size={20} /> },
    ]
  },
  {
    id: 'q5',
    text: "Have you ever been a victim of identity theft or fraud?",
    options: [
      { value: 'yes_victim', label: "Yes, it happened to me", icon: <AlertTriangle size={20} /> },
      { value: 'close_call', label: "Close call — almost got scammed", icon: <AlertTriangle size={20} /> },
      { value: 'no_fraud', label: "No, but I'm worried about it", icon: <ShieldCheck size={20} /> },
      { value: 'secure', label: "No, and I feel confident", icon: <Lock size={20} /> },
    ]
  },
  {
    id: 'q6',
    text: "What keeps you up at night?",
    options: [
      { value: 'financial', label: "Getting sued or losing money", icon: <DollarSign size={20} /> },
      { value: 'family_legal', label: "My family's safety and future", icon: <Users size={20} /> },
      { value: 'identity', label: "Identity theft or data breach", icon: <Lock size={20} /> },
      { value: 'contracts', label: "Signing something that hurts me", icon: <FileText size={20} /> },
      { value: 'tickets', label: "Traffic tickets or license issues", icon: <Car size={20} /> },
    ]
  },
  {
    id: 'q7',
    text: "Monthly investment in legal protection?",
    options: [
      { value: 'budget_min', label: "Under $15/month", icon: <DollarSign size={20} /> },
      { value: 'budget_mid', label: "$15–$30/month", icon: <DollarSign size={20} /> },
      { value: 'budget_prem', label: "$30–$60/month", icon: <DollarSign size={20} /> },
      { value: 'budget_max', label: "Whatever it takes", icon: <Zap size={20} /> },
    ]
  }
];

const SCORING = {
  q1: { single: { p: 2, f: 0, b: 0, i: 1 }, couple: { p: 1, f: 2, b: 0, i: 1 }, family: { p: 0, f: 3, b: 0, i: 2 }, empty_nest: { p: 1, f: 1, b: 0, i: 2 } },
  q2: { no_biz: { p: 2, f: 1, b: 0, i: 1 }, freelance: { p: 1, f: 0, b: 3, i: 1 }, small_biz: { p: 0, f: 0, b: 3, i: 1 }, startup: { p: 1, f: 0, b: 3, i: 1 } },
  q3: { no_will: { p: 3, f: 2, b: 1, i: 0 }, old_will: { p: 1, f: 1, b: 0, i: 0 }, has_will: { p: 0, f: 0, b: 0, i: 0 } },
  q4: { never: { p: 0, f: 0, b: 0, i: 0 }, few_year: { p: 1, f: 0, b: 1, i: 0 }, monthly: { p: 1, f: 0, b: 2, i: 0 }, weekly: { p: 2, f: 0, b: 3, i: 0 } },
  q5: { yes_victim: { p: 0, f: 0, b: 0, i: 3 }, close_call: { p: 0, f: 0, b: 0, i: 2 }, no_fraud: { p: 1, f: 0, b: 0, i: 2 }, secure: { p: 0, f: 0, b: 0, i: 0 } },
  q6: { financial: { p: 2, f: 1, b: 1, i: 1 }, family_legal: { p: 1, f: 3, b: 0, i: 1 }, identity: { p: 0, f: 0, b: 0, i: 3 }, contracts: { p: 1, f: 0, b: 2, i: 0 }, tickets: { p: 2, f: 1, b: 0, i: 0 } },
  q7: { budget_min: { p: 0, f: 0, b: 0, i: 1 }, budget_mid: { p: 2, f: 0, b: 0, i: 2 }, budget_prem: { p: 1, f: 1, b: 3, i: 1 }, budget_max: { p: 1, f: 2, b: 2, i: 3 } }
};

// --- Components ---

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-sm h-16" : "bg-transparent h-20"
    )}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="text-gold" size={32} />
          <span className="font-heading text-xl font-bold text-navy">Legal Protection Network</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#quiz" className="text-navy font-medium hover:text-gold transition-colors">Quiz</a>
          <a href="#plans" className="text-navy font-medium hover:text-gold transition-colors">Plans</a>
          <a href="#about" className="text-navy font-medium hover:text-gold transition-colors">About</a>
          <a href={REFERRAL_URL} className="bg-gold text-navy px-6 py-2 rounded-full font-bold shadow-button hover:bg-gold-light transition-all flex items-center gap-2">
            Get Protected <ChevronRight size={18} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-navy" onClick={() => setIsOpen(!isOpen)}>
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
            <a href="#quiz" className="text-navy font-medium p-2" onClick={() => setIsOpen(false)}>Quiz</a>
            <a href="#plans" className="text-navy font-medium p-2" onClick={() => setIsOpen(false)}>Plans</a>
            <a href="#about" className="text-navy font-medium p-2" onClick={() => setIsOpen(false)}>About</a>
            <a href={REFERRAL_URL} className="bg-gold text-navy p-4 rounded-xl font-bold text-center shadow-button">
              Get Protected Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Quiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadForm, setLeadForm] = useState({ firstName: '', email: '' });
  const [submittedLead, setSubmittedLead] = useState(false);

  const handleSelect = value => {
    const qId = QUESTIONS[step].id;
    setAnswers({ ...answers, [qId]: value });
  };

  const next = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const calculateResults = () => {
    let scores = { p: 0, f: 0, b: 0, i: 0 };
    Object.entries(answers).forEach(([qId, val]) => {
      const points = SCORING[qId]?.[val];
      if (points) {
        scores.p += points.p;
        scores.f += points.f;
        scores.b += points.b;
        scores.i += points.i;
      }
    });

    const rawTotal = scores.p + scores.f + scores.b + scores.i;
    let healthScore = 2;
    if (rawTotal <= 5) healthScore = 2;
    else if (rawTotal <= 10) healthScore = 4;
    else if (rawTotal <= 20) healthScore = 5;
    else if (rawTotal <= 30) healthScore = 7;
    else if (rawTotal <= 40) healthScore = 8;
    else healthScore = 10;

    // Recommendation logic
    let plan = 'Personal Plan';
    let path = 'personal';
    const budget = answers.q7;

    if (scores.b >= 8 && (budget === 'budget_prem' || budget === 'budget_max')) {
      plan = 'Small Business Plan';
      path = 'business';
    } else if (scores.f >= 6 && scores.i >= 4) {
      plan = 'Family Plan + IDShield';
      path = 'personal'; // Actually family is often personal page but selected
    } else if (scores.i >= 8 && budget === 'budget_min') {
      plan = 'IDShield Identity Protection';
      path = 'idshield';
    } else if (scores.f >= 6) {
      plan = 'Family Protection Plan';
      path = 'personal';
    } else if (scores.p >= 5 && scores.i >= 3) {
      plan = 'Personal Plan + IDShield';
      path = 'personal';
    } else if (scores.i >= 5) {
      plan = 'IDShield Only';
      path = 'idshield';
    }

    return { healthScore, plan, path, scores };
  };

  const handleSubmitLead = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: leadForm.firstName,
          email: leadForm.email,
          quizData: answers
        })
      });
      if (res.ok) setSubmittedLead(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const results = calculateResults();

  if (showResults) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 shadow-card border border-gray-100 max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-text mb-2">Your Legal Health Score</h3>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
              <motion.circle 
                cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={364}
                initial={{ strokeDashoffset: 364 }}
                animate={{ strokeDashoffset: 364 - (364 * results.healthScore / 10) }}
                className={cn(
                  results.healthScore <= 3 ? "text-danger" : 
                  results.healthScore <= 6 ? "text-warning" : 
                  results.healthScore <= 8 ? "text-success" : "text-gold"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold">{results.healthScore}</span>
              <span className="text-xl text-gray-text">/10</span>
            </div>
          </div>
          <p className="text-xl font-bold">
            {results.healthScore <= 3 ? "Critical Gaps 🔴" : 
             results.healthScore <= 6 ? "Some Exposure 🟡" : 
             results.healthScore <= 8 ? "Good Shape 🟢" : "Well Protected 🏆"}
          </p>
        </div>

        <div className="bg-gray-light rounded-2xl p-6 mb-8 border border-gray-mid/30">
          <h4 className="font-bold text-navy mb-4 border-b border-gray-mid/30 pb-2 uppercase text-xs tracking-widest">Recommended Plan</h4>
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-gold p-3 rounded-xl text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h5 className="font-bold text-lg leading-tight">{results.plan}</h5>
              <p className="text-gray-text text-sm">Tailored for your specific situation.</p>
            </div>
          </div>
          <a 
            href={REFERRAL_URL}
            className="w-full bg-navy text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-navy-dark transition-all"
          >
            Get This Plan Now <ArrowRight size={20} />
          </a>
        </div>

        {!submittedLead ? (
          <form onSubmit={handleSubmitLead} className="space-y-4">
            <h4 className="font-bold text-navy text-center">Get Your Full Legal Health PDF</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" required placeholder="First Name" 
                className="p-4 rounded-xl border border-gray-mid focus:outline-none focus:ring-2 focus:ring-gold"
                value={leadForm.firstName} onChange={e => setLeadForm({...leadForm, firstName: e.target.value})}
              />
              <input 
                type="email" required placeholder="Email Address" 
                className="p-4 rounded-xl border border-gray-mid focus:outline-none focus:ring-2 focus:ring-gold"
                value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})}
              />
            </div>
            <button 
              disabled={isSubmitting}
              className="w-full bg-gold text-navy p-4 rounded-xl font-bold shadow-button hover:bg-gold-light disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Me My Free Checklist →"}
            </button>
          </form>
        ) : (
          <div className="text-center p-6 bg-success/10 rounded-2xl border border-success/20">
            <CheckCircle2 className="mx-auto text-success mb-2" size={32} />
            <p className="font-bold text-success">Checklist Sent! Check your inbox.</p>
          </div>
        )}

        <button onClick={() => {setStep(0); setShowResults(false); setAnswers({});}} className="w-full text-gray-text mt-8 text-sm hover:underline">
          Take Quiz Again
        </button>
      </motion.div>
    );
  }

  const currentQ = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold text-gray-text uppercase tracking-widest">Question {step + 1} of {QUESTIONS.length}</span>
          <span className="text-xs font-bold text-navy">{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white rounded-3xl p-6 md:p-10 shadow-card border border-gray-100"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-navy mb-8">{currentQ.text}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {currentQ.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left",
                answers[currentQ.id] === opt.value 
                  ? "bg-gold border-gold text-white shadow-button scale-[1.02]" 
                  : "bg-gray-light border-transparent text-navy hover:border-gray-mid"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg",
                answers[currentQ.id] === opt.value ? "bg-white/20" : "bg-white"
              )}>
                {opt.icon}
              </div>
              <span className="font-bold">{opt.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button 
            onClick={back}
            className={cn("text-gray-text font-bold hover:text-navy transition-colors", step === 0 && "opacity-0 pointer-events-none")}
          >
            ← Back
          </button>
          <button 
            disabled={!answers[currentQ.id]}
            onClick={next}
            className="bg-gold text-navy px-8 py-3 rounded-full font-bold shadow-button hover:bg-gold-light disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {step === QUESTIONS.length - 1 ? "Get My Score" : "Next Question"} <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const PlanCard = ({ plan }) => (
  <div className={cn(
    "relative bg-white rounded-3xl p-8 shadow-card border border-gray-100 flex flex-col transition-all hover:-translate-y-2 hover:shadow-xl",
    plan.featured && "border-gold border-2"
  )}>
    {plan.featured && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-navy text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-sm">
        {plan.tag}
      </div>
    )}
    <div className="mb-6">
      <div className="text-navy/50 mb-1">{plan.bestFor}</div>
      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-navy">{plan.price}</span>
        <span className="text-gray-text text-sm">/mo</span>
      </div>
    </div>
    
    <ul className="space-y-3 mb-8 flex-grow">
      {plan.features.map(f, i => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-text">
          <Check className="text-success shrink-0" size={18} />
          <span>{f}</span>
        </li>
      ))}
    </ul>

    <a 
      href={plan.link}
      className={cn(
        "w-full p-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2",
        plan.featured ? "bg-gold text-navy hover:bg-gold-light" : "bg-navy text-white hover:bg-navy-dark"
      )}
    >
      {plan.cta} <ArrowRight size={18} />
    </a>
  </div>
);

const FAQItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-gold transition-colors"
      >
        <span className="text-lg font-bold pr-4">{q}</span>
        <ChevronDown className={cn("shrink-0 transition-transform", isOpen && "rotate-180 text-gold")} size={24} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-text leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const plans = [
    {
      name: "Personal & Family",
      price: "$24.95",
      bestFor: "Individuals and families",
      featured: true,
      tag: "Most Popular",
      features: [
        "Unlimited law firm calls",
        "Contract & document review",
        "Will & estate plan preparation",
        "Traffic ticket defense",
        "IRS audit assistance",
        "Debt collection defense"
      ],
      link: REFERRAL_URL,
      cta: "Protect My Family"
    },
    {
      name: "Small Business",
      price: "$49",
      bestFor: "Freelancers & Business Owners",
      featured: false,
      features: [
        "Everything in Personal, plus:",
        "Unlimited business contract reviews",
        "Debt collection for invoices",
        "Business consultations",
        "15+ standard business forms",
        "1,000+ trial defense hours"
      ],
      link: REFERRAL_URL,
      cta: "Protect My Business"
    },
    {
      name: "IDShield Protection",
      price: "$14.95",
      bestFor: "Essential Add-On",
      featured: false,
      features: [
        "24/7 dark web monitoring",
        "Full-service identity restoration",
        "Guaranteed 100% cleanup work",
        "Lost wallet assistance",
        "Up to $1M fraud insurance",
        "Credit score monitoring"
      ],
      link: REFERRAL_URL,
      cta: "Secure My Identity"
    }
  ];

  const faqs = [
    { q: "How fast can I start using my plan?", a: "Immediately. Once you enroll, you'll receive your member ID and law firm assignment within minutes. You can call your attorney the same day." },
    { q: "Is there a long-term contract?", a: "No. All plans are month-to-month. You can cancel anytime with no penalties or hidden fees." },
    { q: "Can I really call my lawyer about anything?", a: "Yes — as long as it's a personal legal matter. Traffic tickets, landlord disputes, contract questions, starting a business — your lawyer is there to help." },
    { q: "Can my whole family be covered under one plan?", a: "Yes! The Family Plan covers you, your spouse, and all dependent children (including college students) under one low monthly fee." }
  ];

  return (
    <div className="min-h-screen selection:bg-gold/30">
      <Nav />
      
      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/family-protection-hero.png" alt="Family protection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Your Family. <br />
              Your Business. <br />
              <span className="text-gold">Your Peace of Mind.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed"
            >
              Affordable legal protection and identity theft recovery — backed by a 50-year-old network of top-rated attorneys.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href="#quiz" className="bg-gold text-navy px-8 py-5 rounded-full font-black text-lg shadow-hero hover:bg-gold-light hover:scale-105 transition-all flex items-center justify-center gap-2">
                Take the Free Legal Health Check <ArrowRight size={20} />
              </a>
              <a href="#plans" className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all text-center">
                See Plans & Pricing
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex items-center gap-6 text-white/60 text-sm"
            >
              <div className="flex items-center gap-2"><Star className="text-gold fill-gold" size={16} /> 4.5/5 Star Rating</div>
              <div className="w-px h-4 bg-white/20" />
              <div>1.8M+ Members</div>
              <div className="w-px h-4 bg-white/20" />
              <div>50+ Years experience</div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Social Proof Bar */}
      <section className="bg-navy py-12 relative z-20">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-24 opacity-60">
          <img src="/plpn-logo.png" alt="Partner" className="h-8 grayscale brightness-0 invert" />
          <img src="/plpn-logo.png" alt="Partner" className="h-8 grayscale brightness-0 invert" />
          <img src="/plpn-logo.png" alt="Partner" className="h-8 grayscale brightness-0 invert" />
          <img src="/plpn-logo.png" alt="Partner" className="h-8 grayscale brightness-0 invert" />
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Most Americans Are One Lawsuit Away from Financial Ruin
              </h2>
              <p className="text-lg text-gray-text mb-8 leading-relaxed">
                60% of Americans don't have a will. 78% can't afford a $1,000/hour attorney. And identity theft happens every 3 seconds.
                <br /><br />
                But here's the truth: you don't need to be rich to have a lawyer in your corner. For less than your monthly streaming subscription, you can have a dedicated law firm on speed dial.
              </p>
              <div className="space-y-6">
                {[
                  { title: "No Will or Estate Plan", desc: "Your family fights in probate court for years", solution: "Full preparation included" },
                  { title: "Traffic Tickets & Speeding", desc: "Fines and insurance spikes", solution: "Full representation included" },
                  { title: "Identity Theft", desc: "Average $1,200 out-of-pocket loss", solution: "100% Managed restoration" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-light transition-colors">
                    <div className="bg-success/10 p-2 rounded-lg text-success shrink-0 h-fit">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy">{item.title}</h4>
                      <p className="text-gray-text text-sm mb-1">{item.desc}</p>
                      <p className="text-success text-sm font-bold">The Solution: {item.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-gold rounded-full blur-3xl opacity-10 animate-pulse" />
              <img src="/legal-checklist.png" alt="Legal checklist" className="relative rounded-3xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section id="quiz" className="py-24 bg-gray-light">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Are You Legally Protected?</h2>
            <p className="text-xl text-gray-text">Answer 7 quick questions and get your personalized legal protection score.</p>
          </div>
          <Quiz />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-16">Three Steps to Total Peace of Mind</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { step: 1, title: "Check Your Score", desc: "Take our 60-second Legal Health Check." },
              { step: 2, title: "Get Matched", desc: "We'll recommend the exact plan that fills your gaps." },
              { step: 3, title: "Activate", desc: "Enroll in under 5 minutes. Firm ready same day." }
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="w-16 h-16 bg-navy text-gold rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-card">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                <p className="text-gray-text">{s.desc}</p>
                {s.step < 3 && <ChevronRight className="absolute top-8 -right-6 text-gray-mid hidden md:block" size={32} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-24 bg-gray-light">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">The Right Protection for Every Stage</h2>
            <p className="text-xl text-gray-text">No hidden fees. No long-term contracts. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((p, i) => <PlanCard key={i} plan={p} />)}
          </div>
        </div>
      </section>

      {/* Associate Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 bg-navy rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold blur-[150px] opacity-10 -mr-48 -mt-48" />
            <div className="lg:w-1/2 relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">Build Your Future with Us</h2>
              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                "I started this network because I believe everyone deserves access to quality legal protection — not just the wealthy. We're here to help you find the plan that fits your life and to show motivated individuals how to build a meaningful business helping others do the same."
              </p>
              <ul className="space-y-4 mb-10">
                {["Free access to Associate platform", "Residual income from commissions", "Work from anywhere", "Full training provided"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="text-gold" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href={REFERRAL_URL} className="inline-flex items-center gap-2 bg-white text-navy px-8 py-4 rounded-full font-bold hover:bg-gold transition-all">
                Learn About the Opportunity <ArrowRight size={20} />
              </a>
            </div>
            <div className="lg:w-1/2">
              <img src="/associate-opportunity.png" alt="Associate opportunity" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-light">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Real People. Real Protection.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { q: "I used to lie awake worrying about my kids. LegalShield helped me write my will in one weekend. I sleep better now.", n: "Sarah M.", d: "Member since 2023" },
              { q: "As a freelance designer, I was signing contracts I barely understood. My attorney caught three red flags. Saved me thousands.", n: "James T.", d: "Business Member" },
              { q: "Someone filed a fraudulent tax return in my name. IDShield handled EVERYTHING. I didn't have to make a single call.", n: "Patricia R.", d: "IDShield Member" }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex gap-1 text-gold mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-text italic mb-6 flex-grow">"{t.q}"</p>
                <div className="font-bold text-navy">{t.n}</div>
                <div className="text-sm text-gray-text">{t.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-16">Questions? We've Got Answers.</h2>
          <div className="bg-white rounded-3xl p-4 md:p-8 border border-gray-100">
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gold relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/legal-checklist.png')] opacity-5 grayscale bg-cover bg-center" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-navy mb-8">Don't Wait Until You Need a Lawyer.</h2>
          <p className="text-xl md:text-2xl text-navy/80 mb-12 max-w-2xl mx-auto font-medium">
            For less than a dollar a day, you can have a law firm in your corner, a will in place, and your identity protected.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#quiz" className="bg-navy text-white px-10 py-5 rounded-full font-bold text-xl shadow-hero hover:scale-105 transition-all">
              Take the Free Check Now
            </a>
            <a href={REFERRAL_URL} className="bg-white text-navy px-10 py-5 rounded-full font-bold text-xl hover:bg-navy hover:text-white transition-all">
              Browse All Plans
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
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
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-all cursor-pointer">
                  <Star size={20} />
                </div>
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-all cursor-pointer">
                  <Award size={20} />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Plans</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-gold">Personal & Family</a></li>
                <li><a href="#" className="hover:text-gold">Small Business</a></li>
                <li><a href="#" className="hover:text-gold">IDShield</a></li>
                <li><a href="#" className="hover:text-gold">Associate Opportunity</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#about" className="hover:text-gold">About Us</a></li>
                <li><a href="#quiz" className="hover:text-gold">Legal Health Quiz</a></li>
                <li><a href={REFERRAL_URL} className="hover:text-gold">Contact Us</a></li>
                <li><a href="#" className="hover:text-gold">Member Support</a></li>
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
