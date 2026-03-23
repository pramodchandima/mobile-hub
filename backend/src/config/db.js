const mysql = require('mysql2/promise');
const config = require('./env');

const dbConfig = {
  host: config.DB.HOST,
  user: config.DB.USER,
  password: config.DB.PASSWORD,
  database: config.DB.NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

async function initializeDatabase() {
  try {
    // 1. First connect without specifying a database to ensure it exists
    const connectionConfig = {
      host: config.DB.HOST,
      user: config.DB.USER,
      password: config.DB.PASSWORD,
    };

    const initialConnection = await mysql.createConnection(connectionConfig);
    await initialConnection.query(`CREATE DATABASE IF NOT EXISTS \`${config.DB.NAME}\``);
    await initialConnection.end();
    console.log(`✅ Database '${config.DB.NAME}' ready`);

    // 2. Now initialize the pool with the database
    pool = mysql.createPool(dbConfig);

    // Test connection
    const poolConnection = await pool.getConnection();
    console.log('✅ Pool connected successfully');
    poolConnection.release();

    // Create tables if they don't exist
    await createTables();

    return pool;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

async function createTables() {
  const connection = await pool.getConnection();
  try {
    // 1. Disable foreign key checks for the initialization process
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // 2. Create tables one by one without inline Foreign Keys
    // This ensures all tables exist before we try to link them.

    // admin_users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`admin_users\` (
        \`admin_id\` INT PRIMARY KEY AUTO_INCREMENT,
        \`username\` VARCHAR(50) UNIQUE NOT NULL,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`email\` VARCHAR(100),
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // categories
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`categories\` (
        \`category_id\` INT PRIMARY KEY AUTO_INCREMENT,
        \`category_name\` VARCHAR(100) NOT NULL,
        \`description\` TEXT,
        \`image_path\` VARCHAR(500),
        \`hover_image_path\` VARCHAR(500),
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // products
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`products\` (
        \`product_id\` INT PRIMARY KEY AUTO_INCREMENT,
        \`product_name\` VARCHAR(200) NOT NULL,
        \`description\` TEXT,
        \`information\` TEXT,
        \`base_price\` DECIMAL(10,2) NOT NULL,
        \`category_id\` INT,
        \`stock_quantity\` INT DEFAULT 0,
        \`image_path\` VARCHAR(500),
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`date_added\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // product_colors
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`product_colors\` (
        \`color_id\` INT PRIMARY KEY AUTO_INCREMENT,
        \`product_id\` INT,
        \`color_name\` VARCHAR(50) NOT NULL,
        \`color_code\` VARCHAR(7) DEFAULT '#000000',
        \`available\` TINYINT(1) DEFAULT 1
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // site_settings
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`site_settings\` (
        \`setting_key\` VARCHAR(50) PRIMARY KEY,
        \`setting_value\` TEXT NOT NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // home_sections
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`home_sections\` (
        \`section_id\` INT PRIMARY KEY AUTO_INCREMENT,
        \`title\` VARCHAR(100) NOT NULL,
        \`type\` ENUM('latest_products', 'category_products') NOT NULL,
        \`category_id\` INT NULL,
        \`order_index\` INT DEFAULT 0,
        \`is_active\` TINYINT(1) DEFAULT 1
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // reviews
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`reviews\` (
        \`review_id\` INT PRIMARY KEY AUTO_INCREMENT,
        \`product_id\` INT NULL,
        \`customer_name\` VARCHAR(100) NOT NULL,
        \`customer_email\` VARCHAR(100),
        \`customer_phone\` VARCHAR(20),
        \`rating\` INT NOT NULL CHECK (\`rating\` >= 1 AND \`rating\` <= 5),
        \`comment\` TEXT,
        \`is_approved\` TINYINT(1) DEFAULT 0,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`source\` VARCHAR(50) DEFAULT 'Website'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // 3. Establish Relationships via ALTER TABLE
    // We wrap these in try-catch because they might already exist

    // products -> categories
    try {
      await connection.query(`
        ALTER TABLE \`products\` 
        ADD CONSTRAINT \`products_category_fk\` 
        FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`category_id\`) ON DELETE SET NULL
      `);
    } catch (err) { /* Ignore if already exists */ }

    // product_colors -> products
    try {
      await connection.query(`
        ALTER TABLE \`product_colors\` 
        ADD CONSTRAINT \`colors_product_fk\` 
        FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`product_id\`) ON DELETE CASCADE
      `);
    } catch (err) { /* Ignore if already exists */ }

    // home_sections -> categories
    try {
      await connection.query(`
        ALTER TABLE \`home_sections\` 
        ADD CONSTRAINT \`home_sections_category_fk\` 
        FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`category_id\`) ON DELETE SET NULL
      `);
    } catch (err) { /* Ignore if already exists */ }

    // reviews -> products
    try {
      await connection.query(`
        ALTER TABLE \`reviews\` 
        ADD CONSTRAINT \`reviews_product_fk\` 
        FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`product_id\`) ON DELETE CASCADE
      `);
    } catch (err) { /* Ignore if already exists */ }

    // 4. Ensure an Admin user exists
    const [admins] = await connection.query('SELECT * FROM \`admin_users\` LIMIT 1');
    if (admins.length === 0) {
      const bcrypt = require('bcrypt');
      const adminUser = config.ADMIN_SETUP.USERNAME || 'admin123';
      const adminPass = config.ADMIN_SETUP.PASSWORD || '1111';
      const adminEmail = config.ADMIN_SETUP.EMAIL || 'admin@example.com';

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPass, salt);

      await connection.query(
        'INSERT INTO \`admin_users\` (\`username\`, \`password_hash\`, \`email\`) VALUES (?, ?, ?)',
        [adminUser, hashedPassword, adminEmail]
      );
      console.log(`👤 Default admin user created: ${adminUser}`);
    }

    // 5. Insert default settings
    await connection.query(`
      INSERT IGNORE INTO \`site_settings\` (\`setting_key\`, \`setting_value\`) VALUES 
      ('hero_images', '[]'),
      ('promo_video', '')
    `);

    console.log('✅ Database schema initialized successfully');

  } catch (error) {
    console.error('❌ Error initializing schema:', error.message);
    throw error;
  } finally {
    // 6. ALWAYS re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    connection.release();
  }
}

// Export the pool promise wrapper to ensure it's initialized before use
// Note: This pattern assumes initializeDatabase is called at startup
module.exports = {
  initializeDatabase,
  getPool: () => pool
};
