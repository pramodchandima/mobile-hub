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
    pool = mysql.createPool(dbConfig);

    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();

    // Create tables if they don't exist
    await createTables();

    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

async function createTables() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Create admin_users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        admin_id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        category_id INT PRIMARY KEY AUTO_INCREMENT,
        category_name VARCHAR(100) NOT NULL,
        description TEXT,
        image_path VARCHAR(500),
        hover_image_path VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        product_id INT PRIMARY KEY AUTO_INCREMENT,
        product_name VARCHAR(200) NOT NULL,
        description TEXT,
        information TEXT,
        base_price DECIMAL(10,2) NOT NULL,
        category_id INT,
        stock_quantity INT DEFAULT 0,
        image_path VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create product_colors table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_colors (
        color_id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT,
        color_name VARCHAR(50) NOT NULL,
        color_code VARCHAR(7) DEFAULT '#000000',
        available BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create site_settings table

    // Create site_settings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create home_sections table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS home_sections (
        section_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(100) NOT NULL,
        type ENUM('latest_products', 'category_products') NOT NULL,
        category_id INT NULL,
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create reviews table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        review_id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(100),
        customer_phone VARCHAR(20),
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        is_approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        source VARCHAR(50) DEFAULT 'Website',
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Ensure source column exists (if table already existed)
    try {
      await connection.query('ALTER TABLE reviews ADD COLUMN source VARCHAR(50) DEFAULT "Website"');
    } catch (err) {
      // Ignore error if column already exists
    }

    // Ensure product_id is nullable (for existing tables)
    try {
      await connection.query('ALTER TABLE reviews MODIFY product_id INT NULL');
    } catch (err) {
      console.warn("Could not modify product_id to NULL:", err.message);
    }

    // Insert default settings if they don't exist
    await connection.query(`
      INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES 
      ('hero_images', '[]'),
      ('promo_video', '')
    `);

    await connection.commit();
    console.log('✅ All tables created successfully');

  } catch (error) {
    await connection.rollback();
    console.error('❌ Error creating tables:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Export the pool promise wrapper to ensure it's initialized before use
// Note: This pattern assumes initializeDatabase is called at startup
module.exports = {
  initializeDatabase,
  getPool: () => pool
};
