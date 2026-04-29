import React from 'react';

const ProjectCard = ({ project, index }) => {
  const colors = [
    'from-violet-500/20 to-indigo-500/20 border-violet-500/30',
    'from-rose-500/20 to-orange-500/20 border-rose-500/30',
    'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    'from-sky-500/20 to-blue-500/20 border-sky-500/30',
    'from-amber-500/20 to-yellow-500/20 border-amber-500/30',
    'from-pink-500/20 to-fuchsia-500/20 border-pink-500/30',
  ];
  const color = colors[index % colors.length];

  return (
    <a
      href={project.githubUrl || project.url || '#'}
      target="_blank"
      rel="noreferrer"
      className={`block bg-gradient-to-br ${color} border rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-white text-base">{project.name}</h3>
        <span className="text-white/50 group-hover:text-white transition-colors text-lg">↗</span>
      </div>
      <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
        {project.aiDescription || project.description || 'A creative project.'}
      </p>
      <div className="flex items-center gap-3 text-xs text-white/50 flex-wrap">
        {project.language && (
          <span className="px-2 py-0.5 bg-white/10 rounded-full">{project.language}</span>
        )}
        {project.stars > 0 && <span>⭐ {project.stars}</span>}
        {(project.topics || []).slice(0, 2).map((t) => (
          <span key={t} className="px-2 py-0.5 bg-white/10 rounded-full">#{t}</span>
        ))}
      </div>
    </a>
  );
};

export default function CreativeModernTheme({ portfolio }) {
  const p = portfolio;
  const info = p.personalInfo || {};
  const ai = p.aiContent || {};
  const visibleProjects = (p.projects || []).filter((pr) => pr.isVisible).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white overflow-x-hidden">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 px-8 py-6 flex items-center justify-between max-w-6xl mx-auto">
        <span className="font-bold text-xl bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          {info.name?.split(' ')[0] || 'Dev'}
        </span>
        <div className="flex gap-8 text-sm text-white/50">
          {['about', 'projects', 'contact'].map((s) => (
            <a key={s} href={`#${s}`} className="hover:text-white capitalize transition-colors">{s}</a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-24">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/60 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for new projects
          </div>

          <h1 className="text-6xl md:text-7xl font-black leading-[0.95] mb-6">
            <span className="block text-white">{info.name || 'Your Name'}</span>
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              {info.title || 'Developer'}
            </span>
          </h1>

          {ai.tagline && (
            <p className="text-xl text-white/60 mb-6 font-light">{ai.tagline}</p>
          )}

          <p className="text-white/60 text-lg leading-relaxed max-w-xl mb-10">
            {ai.bio || 'I craft exceptional digital experiences that live at the intersection of design and technology.'}
          </p>

          <div className="flex gap-4 flex-wrap">
            {info.github && (
              <a href={info.github} target="_blank" rel="noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
                View GitHub →
              </a>
            )}
            {info.email && (
              <a href={`mailto:${info.email}`}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white/80 font-semibold rounded-xl hover:bg-white/10 transition-colors">
                Get in touch
              </a>
            )}
          </div>
        </div>

        {/* Stats */}
        {(p.skills?.length || visibleProjects.length) > 0 && (
          <div className="flex gap-8 mt-16 pt-8 border-t border-white/10">
            {visibleProjects.length > 0 && (
              <div>
                <div className="text-3xl font-black text-white">{visibleProjects.length}+</div>
                <div className="text-white/40 text-sm">Projects</div>
              </div>
            )}
            {p.skills?.length > 0 && (
              <div>
                <div className="text-3xl font-black text-white">{p.skills.length}</div>
                <div className="text-white/40 text-sm">Technologies</div>
              </div>
            )}
            {p.experience?.filter((e) => e.company).length > 0 && (
              <div>
                <div className="text-3xl font-black text-white">
                  {p.experience.filter((e) => e.company).length}
                </div>
                <div className="text-white/40 text-sm">Roles</div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* About */}
      {(ai.aboutSection || p.skills?.length > 0) && (
        <section id="about" className="relative z-10 py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-8 h-px bg-gradient-to-r from-violet-500 to-indigo-500" />
              <span className="text-white/40 text-sm uppercase tracking-widest">About Me</span>
            </div>
            <div className="grid md:grid-cols-2 gap-16">
              {ai.aboutSection && (
                <p className="text-white/60 leading-relaxed text-lg whitespace-pre-line">
                  {ai.aboutSection}
                </p>
              )}
              {p.skills?.length > 0 && (
                <div>
                  <h3 className="font-bold text-white mb-6">My Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {p.skills.map((s) => (
                      <span key={s}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/70 text-sm rounded-lg hover:border-violet-500/50 hover:text-white transition-all">
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
        <section id="projects" className="relative z-10 py-24">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-8 h-px bg-gradient-to-r from-violet-500 to-indigo-500" />
              <span className="text-white/40 text-sm uppercase tracking-widest">Featured Work</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleProjects.map((proj, i) => (
                <ProjectCard key={proj.name} project={proj} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience */}
      {p.experience?.filter((e) => e.company).length > 0 && (
        <section className="relative z-10 py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-8 h-px bg-gradient-to-r from-violet-500 to-indigo-500" />
              <span className="text-white/40 text-sm uppercase tracking-widest">Experience</span>
            </div>
            <div className="space-y-4">
              {p.experience.filter((e) => e.company).map((exp, i) => (
                <div key={i} className="flex items-start gap-6 p-6 bg-white/3 border border-white/5 rounded-2xl hover:border-violet-500/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center text-violet-400 font-bold flex-shrink-0">
                    {(exp.company || 'C')[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-white">{exp.role || 'Developer'}</div>
                        <div className="text-violet-400 text-sm">{exp.company}</div>
                      </div>
                      {exp.duration && <span className="text-white/30 text-sm">{exp.duration}</span>}
                    </div>
                    {exp.description && <p className="text-white/50 text-sm mt-2">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="relative z-10 py-24 border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto px-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-px bg-gradient-to-r from-violet-500 to-indigo-500" />
            <span className="text-white/40 text-sm uppercase tracking-widest">Contact</span>
            <div className="w-8 h-px bg-gradient-to-l from-violet-500 to-indigo-500" />
          </div>
          <h2 className="text-4xl font-black mb-4">
            Got a project?<br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Let's talk.
            </span>
          </h2>
          <p className="text-white/50 mb-10">I'm always open to discussing new projects and opportunities.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {info.email && (
              <a href={`mailto:${info.email}`}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity">
                Send me an email →
              </a>
            )}
            {info.linkedin && (
              <a href={info.linkedin} target="_blank" rel="noreferrer"
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors">
                LinkedIn
              </a>
            )}
          </div>
          {info.location && <p className="text-white/30 text-sm mt-8">📍 {info.location}</p>}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-white/20 text-sm">
        {info.name} · Made with DevPortfolio AI
      </footer>
    </div>
  );
}
