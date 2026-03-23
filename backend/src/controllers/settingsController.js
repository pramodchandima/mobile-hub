const { getPool } = require('../config/db');

exports.getSettings = async (req, res) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
        const settings = {};
        rows.forEach(row => {
            try {
                settings[row.setting_key] = JSON.parse(row.setting_value);
            } catch (e) {
                settings[row.setting_key] = row.setting_value;
            }
        });
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.updateHeroImages = async (req, res) => {
    try {
        const pool = getPool();
        let images = [];
        if (req.body.existingImages) {
            try {
                images = JSON.parse(req.body.existingImages);
            } catch (e) { }
        }
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
            images = [...images, ...newImages];
        }

        await pool.query(
            'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
            ['hero_images', JSON.stringify(images), JSON.stringify(images)]
        );
        res.json({ success: true, images });
    } catch (error) {
        console.error('Error updating hero images:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.updatePromoVideo = async (req, res) => {
    try {
        const pool = getPool();
        let videoUrl = req.body.existingVideo || '';
        if (req.file) {
            videoUrl = `/uploads/products/${req.file.filename}`;
        }

        await pool.query(
            'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
            ['promo_video', videoUrl, videoUrl]
        );
        res.json({ success: true, video: videoUrl });
    } catch (error) {
        console.error('Error updating promo video:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
