const Portfolio = require('../models/Portfolio');

/**
 * POST /api/deploy
 * Simulate one-click deployment (generates a shareable URL)
 * In production: integrate with Vercel API using VERCEL_TOKEN
 */
exports.deployPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found.' });
    }

    if (!portfolio.isPublished) {
      return res.status(400).json({
        error: 'Portfolio must be published before deployment.',
      });
    }

    // --- PRODUCTION IMPLEMENTATION ---
    // To deploy via Vercel API:
    //
    // const vercel = require('@vercel/client');
    // const deployment = await vercel.createDeployment({
    //   token: process.env.VERCEL_TOKEN,
    //   files: generatePortfolioFiles(portfolio),
    //   projectSettings: { framework: 'create-react-app' }
    // });
    // const liveUrl = deployment.url;
    //
    // For now, we return the internal portfolio URL:

    const liveUrl = `${process.env.CLIENT_URL}/p/${portfolio.slug}`;

    await Portfolio.findByIdAndUpdate(portfolio._id, { liveUrl });

    res.json({
      message: 'Portfolio deployed successfully!',
      liveUrl,
      deployedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
