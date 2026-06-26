import { pool } from './index';

export const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clusters table
    await client.query(`
      CREATE TABLE IF NOT EXISTS clusters (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        kubeconfig TEXT NOT NULL,
        server_url VARCHAR(255),
        kubernetes_version VARCHAR(50),
        status VARCHAR(50) DEFAULT 'disconnected',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Activity Logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        cluster_id UUID REFERENCES clusters(id) ON DELETE CASCADE,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(100) NOT NULL,
        resource_name VARCHAR(255),
        namespace VARCHAR(255),
        status VARCHAR(50),
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Dashboard Settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS dashboard_settings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        theme VARCHAR(50) DEFAULT 'dark',
        refresh_interval INTEGER DEFAULT 15,
        default_namespace VARCHAR(255) DEFAULT 'default',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure at least one settings row exists
    await client.query(`
      INSERT INTO dashboard_settings (theme)
      SELECT 'dark'
      WHERE NOT EXISTS (SELECT 1 FROM dashboard_settings);
    `);

    await client.query('COMMIT');
    console.log('Database initialized successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};
