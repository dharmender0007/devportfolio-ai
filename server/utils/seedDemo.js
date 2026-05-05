/**
 * Run once to create a demo portfolio:
 * cd server && node utils/seedDemo.js
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  await User.deleteOne({ email: 'demo@devportfolio.ai' });
  await Portfolio.deleteOne({ slug: 'demo' });

  const user = await User.create({
    name: 'Alex Rivera',
    email: 'demo@devportfolio.ai',
    password: 'demo123456',
  });

  const portfolio = await Portfolio.create({
    userId: user._id,
    slug: 'demo',
    isPublished: true,
    liveUrl: 'http://localhost:3000/p/demo',
    theme: 'creative-modern',
    personalInfo: {
      name: 'Alex Rivera',
      title: 'Full Stack Developer',
      email: 'alex@example.com',
      location: 'San Francisco, CA',
      website: 'https://alexrivera.dev',
      linkedin: 'https://linkedin.com/in/alexrivera',
      github: 'https://github.com/alexrivera',
    },
    aiContent: {
      tagline: 'Building the web, one commit at a time.',
      bio: `Alex Rivera is a Full Stack Developer with 4+ years of experience building scalable web applications. Specializing in React, Node.js, and cloud architecture, Alex has shipped products used by thousands of users worldwide.\n\nPassionate about clean code and open source, Alex enjoys turning complex problems into elegant solutions.`,
      aboutSection: `My journey into software development started with a simple curiosity about how websites worked. That curiosity turned into a passion, and that passion turned into a career.\n\nToday I work across the full stack, building everything from pixel-perfect UIs to robust backend APIs. I love the craft of software: the elegance of a well-designed system and the joy of a feature shipped.\n\nWhen not coding, you'll find me hiking, reading sci-fi, or contributing to open source projects.`,
    },
    skills: ['React','Node.js','TypeScript','MongoDB','PostgreSQL','AWS','Docker','GraphQL','Next.js','Tailwind CSS','Python','Git'],
    experience: [
      { company: 'TechCorp Inc.', role: 'Senior Full Stack Developer', duration: '2022 - Present', description: 'Built React/Node.js apps serving 50k+ daily users.' },
      { company: 'StartupXYZ', role: 'Frontend Developer', duration: '2020 - 2022', description: 'Led frontend migration from jQuery to React, improving performance by 40%.' },
      { company: 'Freelance', role: 'Web Developer', duration: '2019 - 2020', description: 'Built custom websites for 15+ clients.' },
    ],
    education: [
      { institution: 'University of California, Berkeley', degree: 'B.S. Computer Science', year: '2019' },
    ],
    projects: [
      { name: 'devportfolio-ai', aiDescription: 'An intelligent portfolio generator that uses AI to auto-write developer bios and project descriptions from GitHub data and resumes.', githubUrl: 'https://github.com/alexrivera/devportfolio-ai', stars: 142, forks: 28, language: 'JavaScript', topics: ['ai','react','nodejs'], isVisible: true },
      { name: 'taskflow', aiDescription: 'A real-time collaborative project management app with kanban boards, time tracking, and team analytics built with React and Socket.io.', githubUrl: 'https://github.com/alexrivera/taskflow', stars: 89, forks: 14, language: 'TypeScript', topics: ['react','websockets'], isVisible: true },
      { name: 'ml-price-predictor', aiDescription: 'A machine learning microservice that predicts real estate prices using XGBoost, deployed on AWS Lambda with a REST API.', githubUrl: 'https://github.com/alexrivera/ml-price-predictor', stars: 56, forks: 9, language: 'Python', topics: ['machine-learning','aws'], isVisible: true },
      { name: 'nextjs-starter', aiDescription: 'A production-ready Next.js starter with auth, dark mode, Tailwind CSS, and Prisma ORM — used by 500+ developers worldwide.', githubUrl: 'https://github.com/alexrivera/nextjs-starter', stars: 234, forks: 67, language: 'TypeScript', topics: ['nextjs','template'], isVisible: true },
    ],
    seo: {
      title: 'Alex Rivera – Full Stack Developer Portfolio',
      description: 'Full Stack Developer specializing in React, Node.js, and cloud architecture.',
      keywords: ['developer','react','nodejs','full stack','portfolio'],
    },
  });

  user.portfolioId = portfolio._id;
  await user.save({ validateBeforeSave: false });

  console.log('✅ Demo portfolio created!');
  console.log('   URL: http://localhost:3000/p/demo');
  console.log('   Login: demo@devportfolio.ai / demo123456');
  await mongoose.disconnect();
}

seed().catch(console.error);