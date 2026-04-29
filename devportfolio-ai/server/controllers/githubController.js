const axios = require('axios');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');

const GITHUB_API = 'https://api.github.com';

const githubHeaders = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
};

/**
 * GET /api/github/user/:username
 * Fetch GitHub user profile
 */
exports.getGithubUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { data } = await axios.get(`${GITHUB_API}/users/${username}`, {
      headers: githubHeaders,
    });
    res.json({
      login: data.login,
      name: data.name,
      bio: data.bio,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      location: data.location,
      blog: data.blog,
      company: data.company,
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'GitHub user not found.' });
    }
    next(error);
  }
};

/**
 * GET /api/github/repos/:username
 * Fetch user repositories
 */
exports.getGithubRepos = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { sort = 'stars', limit = 12 } = req.query;
    const { data } = await axios.get(
      `${GITHUB_API}/users/${username}/repos?sort=${sort}&per_page=${limit}&type=owner`,
      { headers: githubHeaders }
    );
    const repos = data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: repo.topics || [],
      updatedAt: repo.updated_at,
      isForked: repo.fork,
    }));
    res.json({ repos });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'GitHub user not found.' });
    }
    next(error);
  }
};

/**
 * POST /api/github/import
 * Import GitHub data into user's portfolio
 * Only updates GitHub-specific fields — does NOT overwrite resume data
 */
exports.importGithubData = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'GitHub username is required.' });
    }

    // Fetch profile + repos concurrently
    const [profileRes, reposRes] = await Promise.all([
      axios.get(`${GITHUB_API}/users/${username}`, { headers: githubHeaders }),
      axios.get(`${GITHUB_API}/users/${username}/repos?sort=stars&per_page=20&type=owner`, {
        headers: githubHeaders,
      }),
    ]);

    const profile = profileRes.data;
    const repos = reposRes.data;

    // Format repos for portfolio
    const projects = repos
      .filter((r) => !r.fork)
      .map((repo) => ({
        name: repo.name,
        description: repo.description || '',
        url: repo.homepage || '',
        githubUrl: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || '',
        topics: repo.topics || [],
        isVisible: true,
      }));

    // Only update GitHub-specific fields — preserve resume skills/experience/education
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          'personalInfo.name': profile.name || username,
          'personalInfo.github': profile.html_url,
          'personalInfo.location': profile.location || '',
          'personalInfo.website': profile.blog || '',
          projects,
        },
      },
      { new: true, upsert: true }
    );

    // Update user's github username and avatar
    await User.findByIdAndUpdate(req.user._id, {
      githubUsername: username,
      avatar: profile.avatar_url,
    });

    res.json({
      message: 'GitHub data imported successfully.',
      projectsImported: projects.length,
      portfolio,
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'GitHub user not found.' });
    }
    next(error);
  }
};