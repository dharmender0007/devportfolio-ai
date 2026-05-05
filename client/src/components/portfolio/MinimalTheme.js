import React from 'react';

const ProjectCard = ({ project }) => (
  <a
    href={project.githubUrl || project.url || '#'}
    target="_blank"
    rel="noreferrer"
    className="block border border-gray-200 rounded-xl p-5 hover:border-gray-900 hover:shadow-md transition-all group"
  >
    <div className="flex items-start justify-between mb-2">
      <h3 className="font-semibold text-gray-900 group-hover:text-black font-mono text-sm">{project.name}</h3>
      <span className="text-gray-400 text-xs">↗</span>
    </div>
    <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-3">
      {project.aiDescription || project.description || 'No description available.'}
    </p>
    <div className="flex items-center gap-3 text-xs text-gray-400">
      {project.language && <span className="font-mono">{project.language}</span>}
      {project.stars > 0 && <span>⭐ {project.stars}</span>}
      {project.forks > 0 && <span>🍴 {project.forks}</span>}
    </div>
  </a>
);

export default function MinimalTheme({ portfolio }) {
  const p = portfolio;
  const info = p.personalInfo || {};
  const ai = p.aiContent || {};
  const visibleProjects = (p.projects || []).filter((pr) => pr.isVisible).slice(0, 6);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <span className="font-mono font-bold text-gray-900">{info.name || 'Developer'}</span>
        <div className="flex gap-6 text-sm text-gray-500">
          {['about', 'projects', 'contact'].map((s) => (
            <a key={s} href={`#${s}`} className="hover:text-gray-900 capitalize transition-colors">{s}</a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <p className="text-gray-400 font-mono text-sm mb-3">Hi, I'm</p>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">{info.name || 'Your Name'}</h1>
        <h2 className="text-2xl text-gray-500 mb-6">{info.title || 'Software Developer'}</h2>
        {ai.tagline && (
          <p className="text-lg text-gray-600 italic border-l-2 border-gray-200 pl-4 mb-8 max-w-xl">{ai.tagline}</p>
        )}
        <p className="text-gray-600 max-w-xl leading-relaxed mb-8">
          {ai.bio || 'Welcome to my portfolio. I build things for the web.'}
        </p>
        <div className="flex gap-4 flex-wrap">
          {info.github && (
            <a href={info.github} target="_blank" rel="noreferrer"
              className="px-5 py-2.5 border border-gray-900 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-900 hover:text-white transition-colors">
              GitHub →
            </a>
          )}
          {info.linkedin && (
            <a href={info.linkedin} target="_blank" rel="noreferrer"
              className="px-5 py-2.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:border-gray-500 transition-colors">
              LinkedIn
            </a>
          )}
          {info.email && (
            <a href={`mailto:${info.email}`}
              className="px-5 py-2.5 text-gray-500 text-sm hover:text-gray-900 transition-colors">
              {info.email}
            </a>
          )}
        </div>
      </section>

      {/* About */}
      {ai.aboutSection && (
        <section id="about" className="bg-gray-50 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-8">About</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{ai.aboutSection}</p>
              {p.skills?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {p.skills.map((s) => (
                      <span key={s} className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-sm rounded-full font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {visibleProjects.length > 0 && (
        <section id="projects" className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-8">Projects</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {visibleProjects.map((proj) => (
              <ProjectCard key={proj.name} project={proj} />
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {p.experience?.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-8">Experience</h2>
            <div className="space-y-6">
              {p.experience.filter((e) => e.company).map((exp, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-1 bg-gray-200 rounded-full flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">{exp.role || 'Role'}</div>
                    <div className="text-gray-500 text-sm">{exp.company} {exp.duration && `· ${exp.duration}`}</div>
                    {exp.description && <p className="text-gray-600 text-sm mt-1">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">Contact</h2>
        <h3 className="text-3xl font-bold mb-4">Let's work together</h3>
        <p className="text-gray-500 mb-8">I'm currently open to new opportunities.</p>
        {info.email && (
          <a href={`mailto:${info.email}`}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors inline-block">
            Say Hello →
          </a>
        )}
        {info.location && <p className="text-gray-400 text-sm mt-6">📍 {info.location}</p>}
      </section>

      <footer className="border-t border-gray-100 py-6 text-center text-gray-400 text-sm">
        Built with DevPortfolio AI · {info.name}
      </footer>
    </div>
  );
}
