const express = require('express');
const {
  getMyPortfolio,
  updatePortfolio,
  publishPortfolio,
  getPublicPortfolio,
  toggleProjectVisibility,
  unpublishPortfolio,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.get('/me', protect, getMyPortfolio);
router.put('/me', protect, updatePortfolio);
router.post('/publish', protect, publishPortfolio);
router.put('/unpublish', protect, unpublishPortfolio);
router.put('/projects/:projectId/toggle', protect, toggleProjectVisibility);

// Public route
router.get('/:slug', getPublicPortfolio);

module.exports = router;
