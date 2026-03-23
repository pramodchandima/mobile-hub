const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middleware/auth');

router.get('/reviews', reviewController.getApprovedReviews);
router.get('/products/:productId/reviews', reviewController.getProductReviews);
router.post('/products/:productId/reviews', reviewController.addReview);
router.get('/admin/reviews', authenticateToken, reviewController.getAllReviews);
router.post('/admin/reviews', authenticateToken, reviewController.adminAddReview);
router.put('/admin/reviews/approve/:id', authenticateToken, reviewController.approveReview);
router.delete('/admin/reviews/:id', authenticateToken, reviewController.deleteReview);
router.put('/admin/reviews/:id', authenticateToken, reviewController.updateReview);

module.exports = router;
