import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '⚡', title: 'GitHub Integration', desc: 'Auto-import your repos, stars, and languages instantly.' },
  { icon: '🤖', title: 'AI Content Generation', desc: 'GPT-4 writes your bio, project descriptions, and about section.' },
  { icon: '📄', title: 'Resume Parsing', desc: 'Upload your PDF resume — skills and experience extracted automatically.' },
  { icon: '🎨', title: '3 Pro Themes', desc: 'Minimal, Dark Developer, or Creative Modern. All fully responsive.' },
  { icon: '🚀', title: 'One-Click Deploy', desc: 'Get a live portfolio URL in seconds. Share it anywhere.' },
  { icon: '✏️', title: 'Full Editor', desc: 'Edit every detail before publishing. SEO meta tags included.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <span className="text-xl font-bold text-sky-400 font-mono">DevPortfolio AI</span>
        <div className="flex gap-3">
          <Link to="/login" className="btn-ghost text-sm">Log in</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-1.5 text-sky-400 text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          AI-powered portfolio builder
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Your developer portfolio,
          <br />
          <span className="text-sky-400">built in minutes.</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Connect GitHub, upload your resume, and let AI generate a stunning portfolio website.
          No coding required.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register" className="btn-primary text-base px-8 py-3">
            Build My Portfolio →
          </Link>
          <Link to="/p/demo" className="btn-secondary text-base px-8 py-3">
            View Demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="card hover:border-gray-700 transition-colors">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-800 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to stand out?</h2>
        <p className="text-gray-400 mb-8">Join thousands of developers with AI-powered portfolios.</p>
        <Link to="/register" className="btn-primary text-base px-10 py-3">
          Start for Free
        </Link>
      </section>
          

         
         
    

        
      <footer className="border-t border-gray-800 py-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} DevPortfolio AI. Built with ❤️ .
      </footer>
    </div>
  );
}
