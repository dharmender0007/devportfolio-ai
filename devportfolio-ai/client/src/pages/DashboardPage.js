import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../hooks/useAuthStore';
import usePortfolioStore from '../hooks/usePortfolioStore';
import api from '../utils/api';
import GitHubImport from '../components/dashboard/GitHubImport';
import ResumeUpload from '../components/dashboard/ResumeUpload';
import AIGenerator from '../components/dashboard/AIGenerator';

const STEPS = [
  { id: 'github', label: 'GitHub', icon: '⚡', desc: 'Import your repos' },
  { id: 'resume', label: 'Resume', icon: '📄', desc: 'Upload PDF' },
  { id: 'ai', label: 'AI Content', icon: '🤖', desc: 'Generate with AI' },
  { id: 'theme', label: 'Theme', icon: '🎨', desc: 'Choose your style' },
  { id: 'publish', label: 'Publish', icon: '🚀', desc: 'Go live' },
];

const THEMES = [
  { id: 'minimal', name: 'Minimal', desc: 'Clean, whitespace-focused, professional', preview: 'bg-white' },
  { id: 'dark-developer', name: 'Dark Developer', desc: 'Terminal-inspired dark theme', preview: 'bg-gray-950' },
  { id: 'creative-modern', name: 'Creative Modern', desc: 'Bold gradients, expressive layout', preview: 'bg-gradient-to-br from-violet-600 to-indigo-800' },
];

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const { portfolio, fetchPortfolio, updatePortfolio, publishPortfolio } = usePortfolioStore();
  const [activeStep, setActiveStep] = useState('github');
  const [publishing, setPublishing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchPortfolio(); }, []);

  const handleThemeSelect = async (themeId) => {
    try {
      await updatePortfolio({ theme: themeId });
      toast.success('Theme updated!');
    } catch {
      toast.error('Failed to update theme');
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const data = await publishPortfolio();
      toast.success('🎉 Portfolio published!');
      setActiveStep('published');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-sky-400 font-mono">DevPortfolio AI</span>
        <div className="flex items-center gap-4">
          <Link to="/editor" className="btn-secondary text-sm">✏️ Edit Portfolio</Link>
          {portfolio?.isPublished && portfolio?.liveUrl && (
            <a href={portfolio.liveUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm">
              🔗 View Live
            </a>
          )}
          <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost text-sm text-red-400">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-1">
            Hey, {user?.name?.split(' ')[0] || 'Developer'} 👋
          </h1>
          <p className="text-gray-400">Complete these steps to launch your portfolio.</p>
        </div>

        {/* Steps */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all
                ${activeStep === step.id
                  ? 'bg-sky-500/10 border-sky-500/40 text-sky-400'
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'}`}
            >
              <span>{step.icon}</span>
              <span>{step.label}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="card">
          {activeStep === 'github' && (
            <GitHubImport onDone={() => setActiveStep('resume')} />
          )}
          {activeStep === 'resume' && (
            <ResumeUpload onDone={() => setActiveStep('ai')} />
          )}
          {activeStep === 'ai' && (
            <AIGenerator portfolio={portfolio} onDone={() => setActiveStep('theme')} />
          )}
          {activeStep === 'theme' && (
            <div>
              <h2 className="text-xl font-bold mb-2">Choose Your Theme</h2>
              <p className="text-gray-400 mb-6 text-sm">Pick a visual style for your portfolio.</p>
              <div className="grid md:grid-cols-3 gap-4">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={`text-left p-4 rounded-xl border transition-all
                      ${portfolio?.theme === theme.id
                        ? 'border-sky-500 bg-sky-500/10'
                        : 'border-gray-700 hover:border-gray-600'}`}
                  >
                    <div className={`h-20 rounded-lg mb-3 ${theme.preview} border border-gray-700`} />
                    <div className="font-semibold">{theme.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{theme.desc}</div>
                    {portfolio?.theme === theme.id && (
                      <div className="text-sky-400 text-xs mt-2 font-medium">✓ Selected</div>
                    )}
                  </button>
                ))}
              </div>
              <button onClick={() => setActiveStep('publish')} className="btn-primary mt-6">
                Next: Publish →
              </button>
            </div>
          )}
          {activeStep === 'publish' && (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold mb-2">Ready to go live?</h2>
              <p className="text-gray-400 mb-8">
                Your portfolio will be published and a shareable link will be generated.
              </p>
              {portfolio?.isPublished ? (
                <div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                    <p className="text-green-400 font-medium mb-2">✅ Portfolio is live!</p>
                    <a
                      href={portfolio.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400 text-sm hover:underline break-all"
                    >
                      {portfolio.liveUrl}
                    </a>
                  </div>
                  <Link to="/editor" className="btn-secondary">
                    ✏️ Edit Portfolio
                  </Link>
                </div>
              ) : (
                <button onClick={handlePublish} disabled={publishing} className="btn-primary px-10 py-3 text-base">
                  {publishing ? 'Publishing…' : '🚀 Publish Portfolio'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
