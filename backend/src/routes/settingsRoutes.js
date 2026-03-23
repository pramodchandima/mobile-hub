const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authenticateToken = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/settings', settingsController.getSettings);
router.post('/admin/settings/hero', authenticateToken, upload.array('images', 5), settingsController.updateHeroImages);
router.post('/admin/settings/video', authenticateToken, upload.single('video'), settingsController.updatePromoVideo);

module.exports = router;
