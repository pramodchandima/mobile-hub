const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');
const authenticateToken = require('../middleware/auth');

router.get('/sections', sectionController.getSections);
router.post('/admin/sections', authenticateToken, sectionController.createSection);
router.put('/admin/sections/:id', authenticateToken, sectionController.updateSection);
router.delete('/admin/sections/:id', authenticateToken, sectionController.deleteSection);

module.exports = router;
