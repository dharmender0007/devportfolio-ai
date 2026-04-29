const express = require('express');
const { deployPortfolio } = require('../controllers/deployController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, deployPortfolio);

module.exports = router;
