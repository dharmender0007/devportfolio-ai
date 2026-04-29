import React, { useState, useEffect } from 'react';

// Typewriter effect hook
const useTypewriter = (text, speed = 60) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text]);
  return displayed;
};

const Terminal = ({ lines }) => (
  <div className="bg-gray-950 border border-gray-800 rounded-xl font-mono text-sm overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-900">
      <span className="w-3 h-3 rounded-full bg-red-500/70" />
      <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
      <span className="w-3 h-3 rounded-full bg-green-500/70" />
      <span className="text-gray-500 text-xs ml-2">portfolio.sh</span>
    </div>
    <div className="p-4 space-y-1">
      {lines.map((line, i) => (
        <div key={i} className={line.color || 'text-gray-300'}>{line.text}</div>
      ))}
    </div>
  </div>
);

const ProjectCard = ({ project }) => (
  <a
    href={project.githubUrl || project.url || '#'}
    target="_blank"
    rel="noreferrer"
    className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-green-500/30 hover:bg-gray-800 transition-all group"
  >
    <div className="flex items-center gap-2 mb-2">
      <span className="text-green-400 font-mono text-xs">▸</span>
      <h3 className="font-mono font-bold text-green-400 text-sm">{project.name}</h3>
      {project.language && (
        <span className="ml-auto text-xs text-gray-500 font-mono">{project.language}</span>
      )}
    </div>
    <p className="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
      {project.aiDescription || project.description || '// No description'}
    </p>
    <div className="flex items-center gap-4 text-xs text-gray-600 font-mono">
      {project.stars > 0 && <span>★ {project.stars}</span>}
      {project.forks > 0 && <span>⑂ {project.forks}</span>}
      {(project.topics || []).slice(0, 2).map((t) => (
        <span key={t} className="text-gray-600">#{t}</span>
      ))}
    </div>
  </a>
);

export default function DarkDeveloperTheme({ portfolio }) {
  const p = portfolio;
  const info = p.personalInfo || {};
  const ai = p.aiContent || {};
  const typedName = useTypewriter(info.name || 'Developer', 80);
  const visibleProjects = (p.projects || []).filter((pr) => pr.isVisible).slice(0, 6);

  const terminalLines = [
    { text: '$ whoami', color: 'text-green-400' },
    { text: info.name || 'developer', color: 'text-white' },
    { text: '$ cat title.txt', color: 'text-green-400' },
    { text: info.title || 'Software Developer', color: 'text-sky-400' },
    ...(info.location ? [{ text: `$ echo $LOCATION`, color: 'text-green-400' }, { text: info.location, color: 'text-gray-300' }] : []),
    { text: `$ ls skills/ | wc -l`, color: 'text-green-400' },
    { text: `${p.skills?.length || 0} skills found`, color: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <span className="text-green-400 font-bold">
          <span className="text-gray-500">~/</span>{info.name?.toLowerCase().replace(/\s/g, '-') || 'dev'}
        </span>
        <div className="flex gap-6 text-sm text-gray-500">
          {['about', 'projects', 'contact'].map((s) => (
            <a key={s} href={`#${s}`} className="hover:text-green-400 transition-colors">
              ./{s}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-green-400 text-sm mb-3">
              <span className="text-gray-500">{'>'}</span> Hello World
            </p>
            <h1 className="text-4xl font-bold text-white mb-3">
              {typedName}<span className="animate-pulse text-green-400">_</span>
            </h1>
            <p className="text-sky-400 mb-4">{info.title || 'Software Developer'}</p>
            {ai.tagline && (
              <p className="text-gray-400 italic mb-6 border-l-2 border-green-500/30 pl-3">
                // {ai.tagline}
              </p>
            )}
            <p className="text-gray-400 leading-relaxed mb-8 text-sm">
              {ai.bio || 'Building robust, scalable applications. Passionate about clean code and great developer experiences.'}
            </p>
            <div className="flex gap-3 flex-wrap">
              {info.github && (
                <a href={info.github} target="_blank" rel="noreferrer"
                  className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded hover:bg-green-500/20 transition-colors">
                  GitHub →
                </a>
              )}
              {info.email && (
                <a href={`mailto:${info.email}`}
                  className="px-4 py-2 border border-gray-700 text-gray-400 text-sm rounded hover:border-gray-500 transition-colors">
                  Contact
                </a>
              )}
            </div>
          </div>
          <Terminal lines={terminalLines} />
        </div>
      </section>

      {/* Skills */}
      {p.skills?.length > 0 && (
        <section id="about" className="border-y border-gray-800 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-green-400 text-sm mb-6">
              <span className="text-gray-500">$</span> cat skills.json
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 font-mono text-sm">
              <span className="text-yellow-400">{'{'}</span>
              <br />
              <span className="text-gray-500 ml-4">"skills": [</span>
              <div className="ml-8 flex flex-wrap gap-2 my-2">
                {p.skills.map((s, i) => (
                  <span key={s} className="text-sky-400">
                    "{s}"{i < p.skills.length - 1 ? ',' : ''}
                  </span>
                ))}
              </div>
              <span className="text-gray-500 ml-4">]</span>
              <br />
              <span className="text-yellow-400">{'}'}</span>
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {visibleProjects.length > 0 && (
        <section id="projects" className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-green-400 text-sm mb-8">
            <span className="text-gray-500">$</span> ls projects/ <span className="text-gray-500">--sort=stars</span>
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleProjects.map((proj) => (
              <ProjectCard key={proj.name} project={proj} />
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {p.experience?.filter((e) => e.company).length > 0 && (
        <section className="border-t border-gray-800 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-green-400 text-sm mb-8">
              <span className="text-gray-500">$</span> cat experience.log
            </p>
            <div className="space-y-4">
              {p.experience.filter((e) => e.company).map((exp, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-green-400 font-bold">{exp.role || 'Developer'}</span>
                      <span className="text-gray-500 ml-2">@</span>
                      <span className="text-sky-400 ml-1">{exp.company}</span>
                    </div>
                    {exp.duration && <span className="text-gray-500 text-sm">{exp.duration}</span>}
                  </div>
                  {exp.description && <p className="text-gray-400 text-sm mt-2">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="border-t border-gray-800 py-20 text-center">
        <div className="max-w-xl mx-auto px-6">
          <p className="text-green-400 font-mono mb-4">
            <span className="text-gray-500">$</span> echo "Let's build something together"
          </p>
          <p className="text-3xl font-bold text-white mb-4">Let's build something together</p>
          <p className="text-gray-500 mb-8 text-sm">Open to remote opportunities worldwide.</p>
          {info.email && (
            <a href={`mailto:${info.email}`}
              className="px-8 py-3 bg-green-500 text-gray-950 font-bold rounded hover:bg-green-400 transition-colors inline-block">
              ./contact.sh
            </a>
          )}
        </div>
      </section>

      <footer className="border-t border-gray-800 py-6 text-center text-gray-600 text-xs font-mono">
        {info.name} · Built with DevPortfolio AI
      </footer>
    </div>
  );
}
