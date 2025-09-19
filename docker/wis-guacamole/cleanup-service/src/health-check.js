const { Pool } = require('pg');

// Health check for the cleanup service
async function healthCheck() {
  try {
    const pool = new Pool({
      host: process.env.DB_HOST || 'guacamole-db',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'guacamole_db',
      user: process.env.DB_USER || 'guacamole_user',
      password: process.env.DB_PASSWORD,
      connectionTimeoutMillis: 5000
    });

    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    await pool.end();

    console.log('Health check passed');
    process.exit(0);

  } catch (error) {
    console.error('Health check failed:', error.message);
    process.exit(1);
  }
}

healthCheck();