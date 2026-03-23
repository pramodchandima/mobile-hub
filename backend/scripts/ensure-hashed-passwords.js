const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function ensureHashedPasswords() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'mobileHub'
    });

    try {
        console.log('--- Password Hashing Audit Started ---');

        // 1. Get all admins
        const [admins] = await connection.execute('SELECT * FROM admin_users');
        console.log(`Found ${admins.length} admin users.`);

        for (const admin of admins) {
            const pass = admin.password_hash;

            // Check if it's already a bcrypt hash (standard length and prefix)
            const isHashed = pass.startsWith('$2a$') || pass.startsWith('$2b$') && pass.length === 60;

            if (!isHashed) {
                console.log(`Hashing plain-text password for user: ${admin.username}`);
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(pass, salt);

                await connection.execute(
                    'UPDATE admin_users SET password_hash = ? WHERE admin_id = ?',
                    [hash, admin.admin_id]
                );
                console.log(`User ${admin.username} updated.`);
            } else {
                console.log(`User ${admin.username} already has a secure hash.`);
            }
        }

        // 2. Ensure admin from .env exists and is hashed
        const envUsername = process.env.ADMIN_USERNAME || 'admin';
        const envPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
        const envEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

        const [existing] = await connection.execute('SELECT * FROM admin_users WHERE username = ?', [envUsername]);

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(envPassword, salt);

        if (existing.length === 0) {
            console.log(`Creating default admin from .env: ${envUsername}`);
            await connection.execute(
                'INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)',
                [envUsername, hash, envEmail]
            );
        } else {
            console.log(`Environment admin ${envUsername} already exists. Updating hash to match .env password.`);
            await connection.execute(
                'UPDATE admin_users SET password_hash = ? WHERE username = ?',
                [hash, envUsername]
            );
        }

        console.log('--- Audit Completed Successfully ---');
    } catch (error) {
        console.error('Audit failed:', error);
    } finally {
        await connection.end();
    }
}

ensureHashedPasswords();
