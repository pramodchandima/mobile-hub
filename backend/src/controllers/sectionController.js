const { getPool } = require('../config/db');

exports.getSections = async (req, res) => {
    try {
        const pool = getPool();
        const [sections] = await pool.query('SELECT * FROM home_sections ORDER BY order_index ASC');
        return res.json(sections);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.createSection = async (req, res) => {
    try {
        const { title, type, category_id, order_index, is_active } = req.body;
        const pool = getPool();
        const [result] = await pool.query(
            'INSERT INTO home_sections (title, type, category_id, order_index, is_active) VALUES (?, ?, ?, ?, ?)',
            [title, type, category_id || null, order_index || 0, is_active !== false]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.updateSection = async (req, res) => {
    try {
        const { title, type, category_id, order_index, is_active } = req.body;
        const pool = getPool();
        await pool.query(
            'UPDATE home_sections SET title=?, type=?, category_id=?, order_index=?, is_active=? WHERE section_id=?',
            [title, type, category_id || null, order_index || 0, is_active !== false, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const pool = getPool();
        await pool.query('DELETE FROM home_sections WHERE section_id=?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
