import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import usePortfolioStore from '../../hooks/usePortfolioStore';

export default function AIGenerator({ portfolio, onDone }) {
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});
  const { fetchPortfolio } = usePortfolioStore();

  const setLoadingKey = (key, val) => setLoading((p) => ({ ...p, [key]: val }));

  const generateBio = async () => {
    setLoadingKey('bio', true);
    try {
      const { data } = await api.post('/ai/generate-bio', {
        name: portfolio?.personalInfo?.name,
        skills: portfolio?.skills,
        experience: (portfolio?.experience || []).map((e) => e.company || e.role || ''),
        projects: portfolio?.projects,
      });
      setResults((p) => ({ ...p, bio: data.bio }));
      await fetchPortfolio();
      toast.success('Bio generated!');
    } catch {
      toast.error('Failed to generate bio. Check your Groq API key.');
    } finally {
      setLoadingKey('bio', false);
    }
  };

  const generateProjectDescriptions = async () => {
    setLoadingKey('projects', true);
    try {
      const { data } = await api.post('/ai/generate-project-descriptions', {
        projects: portfolio?.projects?.slice(0, 6),
      });
      setResults((p) => ({ ...p, projects: data.descriptions }));
      await fetchPortfolio();
      toast.success(`${data.descriptions.length} project descriptions generated!`);
    } catch {
      toast.error('Failed to generate descriptions');
    } finally {
      setLoadingKey('projects', false);
    }
  };

  const generateTaglines = async () => {
    setLoadingKey('tagline', true);
    try {
      const { data } = await api.post('/ai/generate-tagline', {
        name: portfolio?.personalInfo?.name,
        title: portfolio?.personalInfo?.title,
        skills: portfolio?.skills,
      });
      setResults((p) => ({ ...p, taglines: data.taglines }));
      toast.success('Taglines generated!');
    } catch {
      toast.error('Failed to generate taglines');
    } finally {
      setLoadingKey('tagline', false);
    }
  };

  const AI_ACTIONS = [
    {
      key: 'bio',
      icon: '✍️',
      title: 'Generate Bio',
      desc: 'A compelling professional bio based on your GitHub + resume data.',
      action: generateBio,
      result: results.bio,
    },
    {
      key: 'projects',
      icon: '🔥',
      title: 'Generate Project Descriptions',
      desc: `AI-writes descriptions for your top ${Math.min(portfolio?.projects?.length || 0, 6)} projects.`,
      action: generateProjectDescriptions,
      result: results.projects ? `${results.projects.length} descriptions generated ✓` : null,
    },
    {
      key: 'tagline',
      icon: '💬',
      title: 'Generate Hero Taglines',
      desc: '3 punchy hero section taglines to choose from.',
      action: generateTaglines,
      result: results.taglines,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">AI Content Generation</h2>
      <p className="text-gray-400 text-sm mb-6">
        Let AI write your portfolio content based on your GitHub and resume data.
      </p>

      <div className="space-y-4 mb-6">
        {AI_ACTIONS.map(({ key, icon, title, desc, action, result }) => (
          <div key={key} className="bg-gray-800 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <span>{icon}</span> {title}
                </div>
                <p className="text-gray-400 text-sm">{desc}</p>
                {result && (
                  <div className="mt-3 text-sm text-gray-300 bg-gray-900 rounded-lg p-3 max-h-40 overflow-y-auto">
                    {Array.isArray(result)
                      ? result.map((r, i) => (
                          <p key={i} className="mb-1">
                            • {typeof r === 'string' ? r : (r.aiDescription || r.name || JSON.stringify(r))}
                          </p>
                        ))
                      : <p className="whitespace-pre-wrap">{result}</p>
                    }
                  </div>
                )}
              </div>
              <button
                onClick={action}
                disabled={loading[key]}
                className="btn-primary whitespace-nowrap flex-shrink-0 text-sm"
              >
                {loading[key] ? '✨ Generating…' : '✨ Generate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onDone} className="btn-primary">Next: Choose Theme →</button>
        <button onClick={onDone} className="btn-ghost text-gray-400">Skip →</button>
      </div>
    </div>
  );
}