import React, { useState } from 'react';
import { 
  Shield, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight, 
  Star,
  ShieldCheck,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Sub-components moved from App.jsx or kept here for Home
import { Quiz, PlanCard, FAQItem } from '../components/HomeComponents';

const PLANS_URL = "https://danielplotner.legalshieldassociate.com/legal?utm_source=pbls&utm_medium=referral&utm_campaign=Share+Links&utm_content=623+WALS+Marketing+Site";
const SMB_URL = "https://danielplotner.legalshieldassociate.com/smb?utm_source=pbls&utm_medium=referral&utm_campaign=Share+Links&utm_content=623+WALS+Marketing+Site";
const ASSOCIATE_URL = "https://danielplotner.legalshieldassociate.com/associate?utm_source=pbls&utm_medium=referral&utm_campaign=Share+Links&utm_content=623+WALS+Marketing+Site";
const BLOG_URL = "https://danielplotner.legalshieldassociate.com/blog?utm_source=pbls&utm_medium=referral&utm_campaign=Share+Links&utm_content=623+WALS+Marketing+Site";
const IDSHIELD_URL = "https://danielplotner.legalshieldassociate.com/identity?utm_source=pbls&utm_medium=referral&utm_campaign=Share+Links&utm_content=623+WALS+Marketing+Site";
const LAWYER_URL = "https://danielplotner.legalshieldassociate.com/lawyer-directory?utm_source=pbls&utm_medium=referral&utm_campaign=Share+Links&utm_content=623+WALS+Marketing+Site";

export default function Home() {
  const plans = [
    {
      name: "Preferred Plan",
      price: "$39.95",
      bestFor: "Families & Individuals",
      featured: true,
      tag: "Most Popular",
      features: [
        "Unlimited law firm calls",
        "Contract & document review",
        "Will & estate plan preparation",
        "Traffic ticket defense",
        "IRS audit assistance",
        "Debt collection defense",
        "Identity theft monitoring & restoration",
        "Up to $1M fraud insurance"
      ],
      link: PLANS_URL,
      cta: "Get Protected Now"
    },
    {
      name: "Personal & Family",
      price: "$29.95",
      bestFor: "Essential Coverage",
      featured: false,
      features: [
        "Unlimited law firm calls",
        "Contract & document review",
        "Will & estate plan preparation",
        "Traffic ticket defense",
        "IRS audit assistance",
        "Debt collection defense"
      ],
      link: PLANS_URL,
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
      link: SMB_URL,
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
      link: IDSHIELD_URL,
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
    <div className="pt-0">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <a href={ASSOCIATE_URL} className="inline-flex items-center gap-2 bg-white text-navy px-8 py-4 rounded-full font-bold hover:bg-gold transition-all">
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
            <a href={PLANS_URL} className="bg-white text-navy px-10 py-5 rounded-full font-bold text-xl hover:bg-navy hover:text-white transition-all">
              Browse All Plans
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
