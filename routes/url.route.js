const express = require('express');
const { handleGenerateNewShortUrl, handleGetAnalytics } = require('../controllers/url.controller')

const router = express.Router();

router.post('/', handleGenerateNewShortUrl)
router.get("/analytics/:shortId", handleGetAnalytics)

module.exports = router;