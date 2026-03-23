const { getPool } = require('../config/db');

exports.getApprovedReviews = async (req, res) => {
    try {
        const pool = getPool();
        const [reviews] = await pool.query(
            'SELECT review_id, customer_name, rating, comment, created_at, source FROM reviews WHERE is_approved = 1 ORDER BY created_at DESC'
        );
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getProductReviews = async (req, res) => {
    try {
        const pool = getPool();
        const [reviews] = await pool.query(
            'SELECT review_id, customer_name, rating, comment, created_at, source FROM reviews WHERE product_id = ? AND is_approved = 1 ORDER BY created_at DESC',
            [req.params.productId]
        );
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.addReview = async (req, res) => {
    try {
        const { customer_name, customer_email, customer_phone, rating, comment, source } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, error: "Rating must be between 1 and 5" });
        }
        const pool = getPool();
        const [result] = await pool.query(
            'INSERT INTO reviews (product_id, customer_name, customer_email, customer_phone, rating, comment, is_approved, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.params.productId, customer_name || 'Anonymous', customer_email || null, customer_phone || null, rating, comment || '', 0, source || 'Website']
        );
        res.json({ success: true, id: result.insertId, message: "Thank you for your review! It will be visible after admin approval." });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const pool = getPool();
        const [reviews] = await pool.query(`
            SELECT r.*, p.product_name 
            FROM reviews r 
            LEFT JOIN products p ON r.product_id = p.product_id 
            ORDER BY r.created_at DESC
        `);
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.adminAddReview = async (req, res) => {
    try {
        const { product_id, customer_name, customer_email, customer_phone, rating, comment, source } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, error: "Rating must be between 1 and 5" });
        }
        const pool = getPool();
        const [result] = await pool.query(
            'INSERT INTO reviews (product_id, customer_name, customer_email, customer_phone, rating, comment, is_approved, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [product_id || null, customer_name || 'Anonymous', customer_email || null, customer_phone || null, rating, comment || '', 1, source || 'Website']
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.approveReview = async (req, res) => {
    try {
        const { is_approved } = req.body;
        const pool = getPool();
        await pool.query(
            'UPDATE reviews SET is_approved = ? WHERE review_id = ?',
            [is_approved ? 1 : 0, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const pool = getPool();
        await pool.query('DELETE FROM reviews WHERE review_id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { product_id, customer_name, customer_email, customer_phone, rating, comment, source } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, error: "Rating must be between 1 and 5" });
        }
        const pool = getPool();
        await pool.query(
            'UPDATE reviews SET product_id = ?, customer_name = ?, customer_email = ?, customer_phone = ?, rating = ?, comment = ?, is_approved = 1, source = ? WHERE review_id = ?',
            [product_id || null, customer_name || 'Anonymous', customer_email || null, customer_phone || null, rating, comment || '', source || 'Website', req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
