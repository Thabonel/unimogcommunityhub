const { Pool } = require('pg');
const cron = require('node-cron');
const winston = require('winston');

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'guacamole-db',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'guacamole_db',
  user: process.env.DB_USER || 'guacamole_user',
  password: process.env.DB_PASSWORD
});

// Configuration
const CLEANUP_INTERVAL = process.env.CLEANUP_INTERVAL || 300; // 5 minutes
const MAX_SESSION_DURATION = parseInt(process.env.MAX_SESSION_DURATION) || 14400; // 4 hours
const MAX_IDLE_TIME = parseInt(process.env.MAX_IDLE_TIME) || 1800; // 30 minutes

class WISCleanupService {
  constructor() {
    this.startTime = new Date();
    this.cleanupCount = 0;
  }

  async cleanupExpiredSessions() {
    try {
      const client = await pool.connect();

      // Clean up sessions that exceed maximum duration
      const expiredByDuration = await client.query(`
        UPDATE guacamole_connection_history
        SET end_date = CURRENT_TIMESTAMP
        WHERE end_date IS NULL
        AND start_date < CURRENT_TIMESTAMP - INTERVAL '${MAX_SESSION_DURATION} seconds'
        RETURNING history_id, username, connection_name
      `);

      if (expiredByDuration.rows.length > 0) {
        logger.info(`Closed ${expiredByDuration.rows.length} sessions due to maximum duration exceeded`, {
          sessions: expiredByDuration.rows
        });
        this.cleanupCount += expiredByDuration.rows.length;
      }

      // Clean up idle sessions (would need custom tracking for this)
      // For now, we'll just log active sessions
      const activeSessions = await client.query(`
        SELECT history_id, username, connection_name, start_date,
               EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - start_date)) as duration_seconds
        FROM guacamole_connection_history
        WHERE end_date IS NULL
        ORDER BY start_date DESC
      `);

      if (activeSessions.rows.length > 0) {
        logger.info(`Active sessions: ${activeSessions.rows.length}`, {
          sessions: activeSessions.rows.map(s => ({
            id: s.history_id,
            user: s.username,
            connection: s.connection_name,
            duration: Math.floor(s.duration_seconds / 60) + ' minutes'
          }))
        });
      }

      client.release();

    } catch (error) {
      logger.error('Error during cleanup:', error);
    }
  }

  async syncWithSupabase() {
    // This would sync session data with our main Supabase database
    // For now, we'll just log the intent
    try {
      logger.info('Syncing session data with Supabase (placeholder)');

      // Future implementation:
      // 1. Get active sessions from Guacamole
      // 2. Update wis_sessions table in Supabase
      // 3. Clean up expired sessions in both databases

    } catch (error) {
      logger.error('Error syncing with Supabase:', error);
    }
  }

  async getStats() {
    try {
      const client = await pool.connect();

      const stats = await client.query(`
        SELECT
          COUNT(*) FILTER (WHERE end_date IS NULL) as active_sessions,
          COUNT(*) FILTER (WHERE end_date IS NOT NULL) as completed_sessions,
          COUNT(DISTINCT username) as unique_users,
          AVG(EXTRACT(EPOCH FROM (COALESCE(end_date, CURRENT_TIMESTAMP) - start_date))) as avg_session_duration
        FROM guacamole_connection_history
        WHERE start_date > CURRENT_TIMESTAMP - INTERVAL '24 hours'
      `);

      client.release();
      return stats.rows[0];

    } catch (error) {
      logger.error('Error getting stats:', error);
      return null;
    }
  }

  start() {
    logger.info('WIS Cleanup Service starting...', {
      cleanupInterval: CLEANUP_INTERVAL,
      maxSessionDuration: MAX_SESSION_DURATION,
      maxIdleTime: MAX_IDLE_TIME
    });

    // Run cleanup every configured interval
    const cronExpression = `*/${Math.floor(CLEANUP_INTERVAL / 60)} * * * *`;

    cron.schedule(cronExpression, async () => {
      await this.cleanupExpiredSessions();
      await this.syncWithSupabase();
    });

    // Log stats every hour
    cron.schedule('0 * * * *', async () => {
      const stats = await this.getStats();
      if (stats) {
        logger.info('Hourly stats', {
          ...stats,
          totalCleanupsToday: this.cleanupCount,
          uptime: Math.floor((Date.now() - this.startTime.getTime()) / 1000 / 60) + ' minutes'
        });
      }
    });

    // Initial cleanup on startup
    setTimeout(() => {
      this.cleanupExpiredSessions();
    }, 30000); // Wait 30 seconds after startup

    logger.info('WIS Cleanup Service started successfully');
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  pool.end(() => {
    logger.info('Database pool closed');
    process.exit(0);
  });
});

// Start the service
const service = new WISCleanupService();
service.start();