const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  aiDescription: String, // AI-generated description
  url: String,
  githubUrl: String,
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  language: String,
  topics: [String],
  isVisible: { type: Boolean, default: true },
});

const PortfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    isPublished: { type: Boolean, default: false },
    liveUrl: { type: String, default: '' },

    // --- Personal Info ---
    personalInfo: {
      name: String,
      title: String,       // e.g. "Full-Stack Developer"
      email: String,
      location: String,
      website: String,
      linkedin: String,
      github: String,
      twitter: String,
    },

    // --- AI Generated Content ---
    aiContent: {
      bio: String,
      aboutSection: String,
      tagline: String,
    },

    // --- Skills ---
    skills: [String],

    // --- Experience ---
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],

    // --- Education ---
    education: [
      {
        institution: String,
        degree: String,
        year: String,
      },
    ],

    // --- Projects (from GitHub + manual) ---
    projects: [ProjectSchema],

    // --- Theme ---
    theme: {
      type: String,
      enum: ['minimal', 'dark-developer', 'creative-modern'],
      default: 'minimal',
    },

    // --- SEO ---
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', PortfolioSchema);
