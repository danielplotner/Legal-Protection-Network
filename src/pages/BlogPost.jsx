import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BLOG_POSTS } from '../blogData';
import { Clock, Calendar, ArrowLeft, Shield, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const REFERRAL_URL = "https://danielplotner.legalshieldassociate.com/?utm_source=pbls&utm_medium=referral&utm_campaign=Share%20Links&utm_content=623%20WALS%20Marketing%20Site";

export default function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = post.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', post.metaDescription);
      }
    }
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <article className="min-h-screen pt-32 pb-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-text mb-8 max-w-3xl mx-auto">
          <Link to="/" className="hover:text-navy transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/blog" className="hover:text-navy transition-colors">Blog</Link>
          <ChevronRight size={12} />
          <span className="text-navy line-clamp-1">{post.category}</span>
        </nav>

        <header className="max-w-3xl mx-auto mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 text-gray-text text-sm mb-6"
          >
            <span className="bg-gold/10 text-gold px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">
              {post.category}
            </span>
            <span className="flex items-center gap-1"><Calendar size={16} /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock size={16} /> {post.readingTime}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight mb-8"
          >
            {post.title}
          </motion.h1>
        </header>

        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg prose-navy max-w-none"
          >
            {post.content.map((block, idx) => {
              switch (block.type) {
                case 'p':
                  return (
                    <p key={idx} className="text-gray-text text-lg leading-relaxed mb-6">
                      {block.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-navy font-bold">{part}</strong> : part)}
                    </p>
                  );
                case 'h2':
                  return <h2 key={idx} className="text-3xl font-bold text-navy mt-12 mb-6">{block.text}</h2>;
                case 'h3':
                  return <h3 key={idx} className="text-2xl font-bold text-navy mt-8 mb-4">{block.text}</h3>;
                case 'list':
                  return (
                    <ul key={idx} className="space-y-4 mb-8">
                      {block.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-text text-lg">
                          <div className="mt-2 w-2 h-2 rounded-full bg-gold shrink-0" />
                          <span>{item.split('**').map((part, j) => j % 2 === 1 ? <strong key={j} className="text-navy font-bold">{part}</strong> : part)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                case 'table':
                  return (
                    <div key={idx} className="overflow-x-auto mb-10 mt-8 rounded-2xl border border-gray-100 shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-light">
                            {block.headers.map((h, i) => (
                              <th key={i} className="p-4 font-bold text-navy uppercase text-xs tracking-widest border-b border-gray-100">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.rows.map((row, i) => (
                            <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                              {row.map((cell, j) => (
                                <td key={j} className={cn("p-4 text-gray-text text-sm", j === 0 && "font-bold text-navy")}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                case 'cta':
                  return (
                    <div key={idx} className="my-12 p-8 rounded-[2.5rem] bg-navy text-white relative overflow-hidden text-center">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gold blur-[100px] opacity-10 -mr-32 -mt-32" />
                      <h3 className="text-2xl font-bold mb-6 relative z-10">Ready to Get Protected?</h3>
                      <a 
                        href={REFERRAL_URL} 
                        className="inline-flex items-center gap-2 bg-gold text-navy px-8 py-4 rounded-full font-bold hover:bg-white transition-all relative z-10"
                      >
                        {block.text}
                      </a>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </motion.div>

          <footer className="mt-20 pt-12 border-t border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <Link to="/blog" className="flex items-center gap-2 text-navy font-bold hover:text-gold transition-colors">
                <ArrowLeft size={20} /> Back to All Articles
              </Link>
              
              <div className="flex items-center gap-4">
                <Shield className="text-gold" size={32} />
                <div>
                  <div className="font-bold text-navy">Legal Protection Network</div>
                  <div className="text-xs text-gray-text">Protecting Families & Small Businesses</div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
