import React, { useState, useEffect } from 'react';
import { 
  User, 
  Users, 
  Home as HomeIcon, 
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
  Zap,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const REFERRAL_URL = "https://danielplotner.legalshieldassociate.com/legal?utm_source=pbls&utm_medium=referral&utm_campaign=Share+Links&utm_content=623+WALS+Marketing+Site";

// --- Quiz Data ---
const QUESTIONS = [
  {
    id: 'q1',
    text: "What describes your current situation best?",
    options: [
      { value: 'single', label: "I'm on my own", icon: <User size={20} /> },
      { value: 'couple', label: "Married or partnered", icon: <Users size={20} /> },
      { value: 'family', label: "I have kids at home", icon: <Users size={20} /> },
      { value: 'empty_nest', label: "Kids are grown", icon: <HomeIcon size={20} /> },
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

export const Quiz = () => {
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
      path = 'personal'; 
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
      const results = calculateResults();
      const urlParams = new URLSearchParams(window.location.search);
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.firstName,
          email: leadForm.email,
          quizData: { score: results.healthScore, recommendation: results.plan, path: results.path },
          utm_source: urlParams.get('utm_source') || '',
          utm_medium: urlParams.get('utm_medium') || '',
          utm_campaign: urlParams.get('utm_campaign') || '',
          utm_term: urlParams.get('utm_term') || '',
          utm_content: urlParams.get('utm_content') || ''
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

export const PlanCard = ({ plan }) => (
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
      {plan.features.map((f, i) => (
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

export const FAQItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-gold transition-colors"
      >
        <span className="text-lg font-bold pr-4">{q}</span>
        <ChevronRight className={cn("shrink-0 transition-transform", isOpen && "rotate-90 text-gold")} size={24} />
      </button>
      {isOpen && (
        <div className="pb-6 text-gray-text leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
};
