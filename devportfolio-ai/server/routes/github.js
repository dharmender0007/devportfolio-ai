const express = require('express');
const { getGithubUser, getGithubRepos, importGithubData } = require('../controllers/githubController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/user/:username', protect, getGithubUser);
router.get('/repos/:username', protect, getGithubRepos);
router.post('/import', protect, importGithubData);

module.exports = router;
