const Groq = require('groq-sdk');
const Portfolio = require('../models/Portfolio');

// Lazy-initialize Groq client
let groq;
const getGroq = () => {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in your server/.env file');
    }
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

/**
 * Helper - call Groq (llama-3.3-70b - fast and FREE)
 */
const callGroq = async (prompt) => {
  const response = await getGroq().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
    temperature: 0.7,
  });
  return response.choices[0].message.content.trim();
};

exports.generateBio = async (req, res, next) => {
  try {
    const { name, skills, experience, githubBio, projects } = req.body;
    const topProjects = (projects || []).slice(0, 5).map((p) => p.name).join(', ');
    const prompt = `You are a professional copywriter for developer portfolios.
Write a compelling, first-person professional bio for a developer with these details:
- Name: ${name}
- Top skills: ${(skills || []).join(', ')}
- Experience: ${(experience || []).slice(0, 2).join(' | ')}
- GitHub bio: ${githubBio || 'Not provided'}
- Notable projects: ${topProjects || 'Not provided'}
Requirements: 2-3 short paragraphs, professional yet personable tone, no fluff, do NOT start with "I am" or "Meet"`;

    const bio = await callGroq(prompt);
    await Portfolio.findOneAndUpdate({ userId: req.user._id }, { 'aiContent.bio': bio });
    res.json({ bio });
  } catch (error) {
    next(error);
  }
};

exports.generateProjectDescriptions = async (req, res, next) => {
  try {
    const { projects } = req.body;
    if (!projects || projects.length === 0) {
      return res.status(400).json({ error: 'No projects provided.' });
    }
    const targetProjects = projects.slice(0, 6);
    const descriptions = await Promise.all(
      targetProjects.map(async (project) => {
        const prompt = `Write a concise, impressive 2-sentence project description for a developer portfolio.
Project: "${project.name}"
Original description: "${project.description || 'Not provided'}"
Language: ${project.language || 'Unknown'}
Topics: ${(project.topics || []).join(', ') || 'None'}
Make it technical, specific, and highlight the impact. No fluff.`;
        const description = await callGroq(prompt);
        return { name: project.name, aiDescription: description };
      })
    );
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (portfolio) {
      descriptions.forEach(({ name, aiDescription }) => {
        const project = portfolio.projects.find((p) => p.name === name);
        if (project) project.aiDescription = aiDescription;
      });
      await portfolio.save();
    }
    res.json({ descriptions });
  } catch (error) {
    next(error);
  }
};

exports.generateAbout = async (req, res, next) => {
  try {
    const { name, skills, experience, education, interests } = req.body;
    const prompt = `Write an engaging "About Me" section for a developer portfolio.
Name: ${name}, Skills: ${(skills || []).join(', ')}
Experience: ${(experience || []).slice(0, 3).join(' | ')}
Education: ${(education || []).join(' | ')}
Interests: ${interests || 'Not provided'}
Write 3-4 paragraphs with warm, authentic voice. Talk about coding journey, expertise, and what they are excited about.`;
    const aboutSection = await callGroq(prompt);
    await Portfolio.findOneAndUpdate({ userId: req.user._id }, { 'aiContent.aboutSection': aboutSection });
    res.json({ aboutSection });
  } catch (error) {
    next(error);
  }
};

exports.generateTagline = async (req, res, next) => {
  try {
    const { name, skills, title } = req.body;
    const prompt = `Create 3 short punchy taglines (max 10 words each) for a developer portfolio hero section.
Developer: ${name}, ${title || 'Software Developer'}
Top skills: ${(skills || []).slice(0, 5).join(', ')}
Return ONLY a numbered list 1. 2. 3. Nothing else.`;
    const response = await callGroq(prompt);
    const taglines = response.split('\n').filter((l) => l.trim()).map((l) => l.replace(/^\d+\.\s*/, '').trim()).filter((l) => l.length > 0);
    res.json({ taglines });
  } catch (error) {
    next(error);
  }
};