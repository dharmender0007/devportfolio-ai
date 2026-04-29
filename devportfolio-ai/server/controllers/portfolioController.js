const Portfolio = require('../models/Portfolio');
const slugify = require('slugify');

/**
 * GET /api/portfolio/me
 * Get current user's portfolio
 */
exports.getMyPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found.' });
    }
    res.json({ portfolio });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/portfolio/me
 * Update current user's portfolio
 */
exports.updatePortfolio = async (req, res, next) => {
  try {
    const allowedFields = [
      'personalInfo', 'aiContent', 'skills', 'experience',
      'education', 'projects', 'theme', 'seo',
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true, upsert: true }
    );

    res.json({ portfolio });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/portfolio/publish
 * Publish portfolio and generate a slug URL
 */
exports.publishPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found.' });
    }

    // Generate slug from name
    const name = portfolio.personalInfo?.name || req.user.name || 'developer';
    let slug = slugify(name, { lower: true, strict: true });

    // Ensure slug uniqueness
    const existing = await Portfolio.findOne({ slug, _id: { $ne: portfolio._id } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const liveUrl = `${process.env.CLIENT_URL}/p/${slug}`;

    await Portfolio.findByIdAndUpdate(portfolio._id, {
      isPublished: true,
      slug,
      liveUrl,
    });

    res.json({
      message: 'Portfolio published successfully!',
      slug,
      liveUrl,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/portfolio/:slug
 * Get a published portfolio by slug (public)
 */
exports.getPublicPortfolio = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const portfolio = await Portfolio.findOne({ slug, isPublished: true });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found or not published.' });
    }

    res.json({ portfolio });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/portfolio/projects/:projectId
 * Toggle project visibility
 */
exports.toggleProjectVisibility = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    const project = portfolio.projects.id(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    project.isVisible = !project.isVisible;
    await portfolio.save();

    res.json({ project });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/portfolio/me
 * Unpublish portfolio
 */
exports.unpublishPortfolio = async (req, res, next) => {
  try {
    await Portfolio.findOneAndUpdate(
      { userId: req.user._id },
      { isPublished: false, liveUrl: '' }
    );
    res.json({ message: 'Portfolio unpublished.' });
  } catch (error) {
    next(error);
  }
};
