import React, { useEffect } from 'react';
import { BLOG_POSTS } from '../blogData';
import BlogCard from '../components/BlogCard';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BlogIndex() {
  useEffect(() => {
    document.title = "Legal Insights & Protection Guides | Legal Protection Network";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', "Read our latest guides on estate planning, small business legal protection, and identity theft restoration. Expert insights for families and entrepreneurs.");
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-light min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        <header className="max-w-3xl mx-auto text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-gold font-bold text-sm mb-6"
          >
            <Shield size={18} /> Legal Protection Network Blog
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-navy mb-6"
          >
            Knowledge is Your Best <span className="text-gold">Defense</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-text"
          >
            Stay informed with our latest articles on personal and business legal security.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {BLOG_POSTS.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 3) }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-navy font-bold hover:text-gold transition-colors">
            <ArrowLeft size={20} /> Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
