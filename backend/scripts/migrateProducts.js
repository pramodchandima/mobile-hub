const { initializeDatabase, getPool } = require('../src/config/db');

async function fixDb() {
    try {
        await initializeDatabase();
        const pool = getPool();

        // Add information column if missing
        try {
            await pool.query('ALTER TABLE products ADD COLUMN information TEXT AFTER description');
            console.log('✅ Added "information" column to products table.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ "information" column already exists in products table.');
            } else {
                throw e;
            }
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        process.exit(0);
    }
}

fixDb();
