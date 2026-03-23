const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/.env' });

async function purgeDummyData() {
    try {
        const pool = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'ecommerce_db',
            port: process.env.DB_PORT || 3306
        });

        console.log('Connected to DB. Removing dummy data...');

        // Find dummy categories
        const [categories] = await pool.query('SELECT category_id, category_name FROM categories WHERE category_name IN ("Men", "Women", "Kids", "Accessories", "New Arrivals")');

        for (const cat of categories) {
            console.log(`Deleting products from category: ${cat.category_name} (ID: ${cat.category_id})`);

            // Delete colors for those products
            await pool.query('DELETE pc FROM product_colors pc JOIN products p ON pc.product_id = p.product_id WHERE p.category_id = ?', [cat.category_id]);

            // Delete reviews for those products
            await pool.query('DELETE r FROM reviews r JOIN products p ON r.product_id = p.product_id WHERE p.category_id = ?', [cat.category_id]);

            // Delete order items for those products
            await pool.query('DELETE oi FROM order_items oi JOIN products p ON oi.product_id = p.product_id WHERE p.category_id = ?', [cat.category_id]);

            // Delete products
            await pool.query('DELETE FROM products WHERE category_id = ?', [cat.category_id]);

            // Delete category
            await pool.query('DELETE FROM categories WHERE category_id = ?', [cat.category_id]);
        }

        // Also delete any products having "Dummy" or clothing related buzzwords in them, or where category_id IS NULL if they got orphaned
        await pool.query(`DELETE FROM products WHERE product_name LIKE '%T-Shirt%' OR product_name LIKE '%Jacket%' OR product_name LIKE '%Sneakers%' OR product_name LIKE '%Dress%'`);

        console.log('Dummy data purged successfully.');
        await pool.end();
    } catch (e) {
        console.error('Error purging dummy data:', e);
        process.exit(1);
    }
}

purgeDummyData();
