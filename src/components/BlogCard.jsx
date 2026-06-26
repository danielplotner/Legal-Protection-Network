import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function BlogCard({ post }) {
  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="h-48 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy/40 z-10" />
        <div className="absolute inset-0 flex items-center justify-center text-white/10 font-black text-6xl select-none group-hover:scale-110 transition-transform duration-500">
          {post.category.split(' ')[0]}
        </div>
        <div className="absolute top-4 left-4 z-20 bg-gold text-navy text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
          {post.category}
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-gray-text text-xs mb-4">
          <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
          <span className="flex items-center gap-1"><Clock size={14} /> {post.readingTime}</span>
        </div>
        
        <h3 className="text-xl font-bold text-navy mb-4 group-hover:text-gold transition-colors leading-tight">
          {post.title}
        </h3>
        
        <p className="text-gray-text text-sm mb-6 flex-grow line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center gap-2 text-navy font-bold text-sm">
          Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
