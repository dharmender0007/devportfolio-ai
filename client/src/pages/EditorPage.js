import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import usePortfolioStore from '../hooks/usePortfolioStore';

const Section = ({ title, children }) => (
  <div className="card mb-6">
    <h3 className="text-lg font-semibold mb-4 pb-3 border-b border-gray-800">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
    {children}
  </div>
);

export default function EditorPage() {
  const { portfolio, fetchPortfolio, updatePortfolio, saving } = usePortfolioStore();
  const [form, setForm] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    fetchPortfolio();
  }, []);

  useEffect(() => {
    if (portfolio && !form) setForm(portfolio);
  }, [portfolio]);

  const setNested = (section, key, value) => {
    setForm((f) => ({ ...f, [section]: { ...f[section], [key]: value } }));
  };

  const handleSave = async () => {
    try {
      await updatePortfolio(form);
      toast.success('Portfolio saved!');
    } catch {
      toast.error('Failed to save');
    }
  };

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const skill = e.target.value.trim();
      if (!form.skills.includes(skill)) {
        setForm((f) => ({ ...f, skills: [...f.skills, skill] }));
      }
      e.target.value = '';
    }
  };

  const removeSkill = (skill) => {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
  };

  const toggleProject = (idx) => {
    const updated = [...form.projects];
    updated[idx].isVisible = !updated[idx].isVisible;
    setForm((f) => ({ ...f, projects: updated }));
  };

  const TABS = [
    { id: 'info', label: '👤 Personal Info' },
    { id: 'content', label: '✍️ Content' },
    { id: 'skills', label: '🛠 Skills' },
    { id: 'projects', label: '📦 Projects' },
    { id: 'seo', label: '🔍 SEO' },
  ];

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Loading editor…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-gray-950 z-10">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
          <span className="text-gray-700">|</span>
          <span className="font-semibold text-sky-400 font-mono">Portfolio Editor</span>
        </div>
        <div className="flex gap-3">
          {portfolio?.isPublished && (
            <a href={portfolio.liveUrl} target="_blank" rel="noreferrer" className="btn-ghost text-sm">
              🔗 View Live
            </a>
          )}
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
            {saving ? 'Saving…' : '💾 Save Changes'}
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-sky-500/10 border border-sky-500/40 text-sky-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Personal Info Tab */}
        {activeTab === 'info' && (
          <Section title="Personal Information">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                ['name', 'Full Name'],
                ['title', 'Professional Title'],
                ['email', 'Email'],
                ['location', 'Location'],
                ['website', 'Website URL'],
                ['linkedin', 'LinkedIn URL'],
                ['github', 'GitHub URL'],
                ['twitter', 'Twitter/X URL'],
              ].map(([key, label]) => (
                <Field key={key} label={label}>
                  <input
                    className="input-field"
                    value={form.personalInfo?.[key] || ''}
                    onChange={(e) => setNested('personalInfo', key, e.target.value)}
                    placeholder={label}
                  />
                </Field>
              ))}
            </div>
          </Section>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <>
            <Section title="AI-Generated Content">
              <Field label="Hero Tagline">
                <input
                  className="input-field"
                  value={form.aiContent?.tagline || ''}
                  onChange={(e) => setNested('aiContent', 'tagline', e.target.value)}
                  placeholder="e.g. Building tomorrow's web, today."
                />
              </Field>
              <Field label="Professional Bio">
                <textarea
                  className="input-field min-h-[140px] resize-y"
                  value={form.aiContent?.bio || ''}
                  onChange={(e) => setNested('aiContent', 'bio', e.target.value)}
                  placeholder="Your professional bio…"
                />
              </Field>
              <Field label="About Section">
                <textarea
                  className="input-field min-h-[180px] resize-y"
                  value={form.aiContent?.aboutSection || ''}
                  onChange={(e) => setNested('aiContent', 'aboutSection', e.target.value)}
                  placeholder="Extended about section…"
                />
              </Field>
            </Section>

            <Section title="Experience">
              {(form.experience || []).map((exp, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4 mb-3 grid md:grid-cols-2 gap-3">
                  {['company', 'role', 'duration', 'description'].map((f) => (
                    <input
                      key={f}
                      className="input-field text-sm"
                      placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                      value={exp[f] || ''}
                      onChange={(e) => {
                        const updated = [...form.experience];
                        updated[i] = { ...updated[i], [f]: e.target.value };
                        setForm((prev) => ({ ...prev, experience: updated }));
                      }}
                    />
                  ))}
                </div>
              ))}
              <button
                className="btn-ghost text-sm border border-dashed border-gray-700 w-full py-2"
                onClick={() => setForm((f) => ({
                  ...f,
                  experience: [...(f.experience || []), { company: '', role: '', duration: '', description: '' }],
                }))}
              >
                + Add Experience
              </button>
            </Section>
          </>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <Section title="Skills">
            <p className="text-gray-400 text-sm mb-4">Press Enter to add a skill.</p>
            <input
              className="input-field mb-4"
              placeholder="Type a skill and press Enter…"
              onKeyDown={handleSkillAdd}
            />
            <div className="flex flex-wrap gap-2">
              {(form.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="badge bg-sky-500/10 text-sky-400 border border-sky-500/20 cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                  onClick={() => removeSkill(skill)}
                  title="Click to remove"
                >
                  {skill} ×
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <Section title="Projects">
            <p className="text-gray-400 text-sm mb-4">Toggle visibility to show/hide projects in your portfolio.</p>
            <div className="space-y-3">
              {(form.projects || []).map((project, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                    project.isVisible ? 'border-gray-700 bg-gray-800' : 'border-gray-800 bg-gray-900 opacity-50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-medium text-sky-400 text-sm">{project.name}</span>
                      {project.language && (
                        <span className="badge bg-gray-700 text-gray-300 text-xs">{project.language}</span>
                      )}
                      <span className="text-gray-500 text-xs">⭐ {project.stars}</span>
                    </div>
                    <p className="text-gray-400 text-xs line-clamp-2">
                      {project.aiDescription || project.description || 'No description'}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleProject(i)}
                    className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      project.isVisible
                        ? 'border-green-500/30 text-green-400 bg-green-500/10'
                        : 'border-gray-700 text-gray-500'
                    }`}
                  >
                    {project.isVisible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              ))}
              {!form.projects?.length && (
                <p className="text-gray-500 text-center py-8">No projects yet. Import from GitHub first.</p>
              )}
            </div>
          </Section>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <Section title="SEO Settings">
            <Field label="Page Title">
              <input
                className="input-field"
                value={form.seo?.title || ''}
                onChange={(e) => setNested('seo', 'title', e.target.value)}
                placeholder="Jane Smith – Full Stack Developer"
              />
            </Field>
            <Field label="Meta Description">
              <textarea
                className="input-field min-h-[100px]"
                value={form.seo?.description || ''}
                onChange={(e) => setNested('seo', 'description', e.target.value)}
                placeholder="A brief description for search engines (150-160 chars)"
              />
            </Field>
            <Field label="Keywords (comma-separated)">
              <input
                className="input-field"
                value={(form.seo?.keywords || []).join(', ')}
                onChange={(e) =>
                  setNested('seo', 'keywords', e.target.value.split(',').map((k) => k.trim()).filter(Boolean))
                }
                placeholder="JavaScript, React, Node.js, Full Stack"
              />
            </Field>
          </Section>
        )}

        <div className="flex justify-end mt-4">
          <button onClick={handleSave} disabled={saving} className="btn-primary px-8">
            {saving ? 'Saving…' : '💾 Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
