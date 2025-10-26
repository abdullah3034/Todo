const { Pool } = require('pg');

// Use the same connection as db.js
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todo_app',
  password: 'Dita8220#',
  port: 5432,
});

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    // Check if table exists first
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'todos'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Creating todos table...');
      await pool.query(`
        CREATE TABLE todos (
          todo_id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          priority VARCHAR(20) DEFAULT 'medium',
          category VARCHAR(50) DEFAULT 'general',
          completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } else {
      console.log('Table exists, adding new columns...');
      
      // Add new columns if they don't exist
      await pool.query(`
        ALTER TABLE todos 
        ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium'
      `);
      
      await pool.query(`
        ALTER TABLE todos 
        ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'general'
      `);
      
      await pool.query(`
        ALTER TABLE todos 
        ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE
      `);
      
      await pool.query(`
        ALTER TABLE todos 
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
    }
    
    // Test the migration by inserting a test record
    console.log('Testing migration with sample data...');
    const testResult = await pool.query(`
      INSERT INTO todos (title, description, priority, category) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `, ['Test Todo', 'Test Description', 'high', 'health']);
    
    console.log('Test record created:', testResult.rows[0]);
    
    // Clean up test record
    await pool.query('DELETE FROM todos WHERE title = $1', ['Test Todo']);
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    console.error('Error details:', err.message);
    process.exit(1);
  }
}

migrate();
