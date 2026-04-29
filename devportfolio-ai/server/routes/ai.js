const express = require('express');
const {
  generateBio,
  generateProjectDescriptions,
  generateAbout,
  generateTagline,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/generate-bio', protect, generateBio);
router.post('/generate-project-descriptions', protect, generateProjectDescriptions);
router.post('/generate-about', protect, generateAbout);
router.post('/generate-tagline', protect, generateTagline);

module.exports = router;
