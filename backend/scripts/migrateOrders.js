const { initializeDatabase, getPool } = require('../src/config/db');

async function fixOrdersTable() {
    try {
        await initializeDatabase();
        const pool = getPool();

        const columnsToAdd = [
            { name: 'customer_email', definition: 'VARCHAR(100) AFTER customer_name' },
            { name: 'customer_phone', definition: 'VARCHAR(100) AFTER customer_email' },
            { name: 'shipping_address', definition: 'TEXT AFTER customer_phone' }
        ];

        for (const col of columnsToAdd) {
            try {
                await pool.query(`ALTER TABLE orders ADD COLUMN ${col.name} ${col.definition}`);
                console.log(`✅ Added "${col.name}" column to orders table.`);
            } catch (e) {
                if (e.code === 'ER_DUP_FIELDNAME') {
                    console.log(`ℹ️ "${col.name}" column already exists in orders table.`);
                } else {
                    console.error(`❌ Failed to add "${col.name}":`, e.message);
                }
            }
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        process.exit(0);
    }
}

fixOrdersTable();
