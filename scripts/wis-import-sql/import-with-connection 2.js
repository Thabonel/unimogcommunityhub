#!/usr/bin/env node

/**
 * Import WIS data using direct database connection (IPv4)
 * This is MUCH faster than running SQL chunks manually
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Client } = pg;

// Connection options for IPv4
const connectionOptions = {
  // Option 1: Direct connection string (IPv4)
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.[project-ref]:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres',
  
  // Option 2: Connection components (IPv4)
  // host: 'aws-0-us-west-1.pooler.supabase.com',
  // port: 6543,
  // database: 'postgres',
  // user: 'postgres.ydevatqwkoccxhtejdor',
  // password: 'your-database-password',
  
  ssl: {
    rejectUnauthorized: false
  }
};

// Helper function to read SQL file
function readSQLFile(filename) {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
}

// Helper function to execute SQL with progress
async function executeSQLWithProgress(client, sql, description) {
  console.log(`\n📋 ${description}`);
  const startTime = Date.now();
  
  try {
    const result = await client.query(sql);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Completed in ${duration}s - Affected rows: ${result.rowCount || 0}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    throw error;
  }
}

// Main import function
async function importWISData() {
  const client = new Client(connectionOptions);
  
  try {
    console.log('🔌 Connecting to database (IPv4)...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Start transaction
    await client.query('BEGIN');
    console.log('🔄 Transaction started\n');

    // Step 1: Create vehicle models
    console.log('═══════════════════════════════════════');
    console.log('STEP 1: Creating Vehicle Models');
    console.log('═══════════════════════════════════════');
    
    const vehicleSQL = readSQLFile('01-create-vehicle-models-fixed.sql');
    await executeSQLWithProgress(client, vehicleSQL, 'Creating 42 Unimog vehicle models');

    // Step 2: Import procedures (from chunks)
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 2: Importing Procedures');
    console.log('═══════════════════════════════════════');
    
    const chunksDir = path.join(__dirname, 'procedures-chunks');
    const chunkFiles = fs.readdirSync(chunksDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    console.log(`Found ${chunkFiles.length} procedure chunks to import`);
    
    for (let i = 0; i < chunkFiles.length; i++) {
      const chunkFile = chunkFiles[i];
      const chunkSQL = fs.readFileSync(path.join(chunksDir, chunkFile), 'utf8');
      await executeSQLWithProgress(
        client, 
        chunkSQL, 
        `Chunk ${i + 1}/${chunkFiles.length}: ${chunkFile}`
      );
    }

    // Step 3: Import parts
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 3: Importing Parts');
    console.log('═══════════════════════════════════════');
    
    const partsSQL = readSQLFile('03-import-parts.sql');
    await executeSQLWithProgress(client, partsSQL, 'Importing Mercedes parts database');

    // Step 4: Import bulletins
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 4: Importing Bulletins');
    console.log('═══════════════════════════════════════');
    
    const bulletinsSQL = readSQLFile('04-import-bulletins.sql');
    await executeSQLWithProgress(client, bulletinsSQL, 'Importing technical bulletins');

    // Verification
    console.log('\n═══════════════════════════════════════');
    console.log('VERIFICATION');
    console.log('═══════════════════════════════════════');
    
    const verifyResult = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM wis_models) as models,
        (SELECT COUNT(*) FROM wis_procedures) as procedures,
        (SELECT COUNT(*) FROM wis_parts) as parts,
        (SELECT COUNT(*) FROM wis_bulletins) as bulletins
    `);
    
    const counts = verifyResult.rows[0];
    console.log('\n📊 Import Summary:');
    console.log(`   Vehicle Models: ${counts.models}`);
    console.log(`   Procedures: ${counts.procedures}`);
    console.log(`   Parts: ${counts.parts}`);
    console.log(`   Bulletins: ${counts.bulletins}`);

    // Commit transaction
    await client.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!');
    
    console.log('\n🎉 WIS data import completed successfully!');

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    
    // Rollback transaction
    try {
      await client.query('ROLLBACK');
      console.log('🔄 Transaction rolled back');
    } catch (rollbackError) {
      console.error('Failed to rollback:', rollbackError.message);
    }
    
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

// Alternative: Import using psql command line
async function importUsingPSQL() {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);
  
  console.log('🚀 Using psql command-line import...\n');
  
  const connectionString = process.env.DATABASE_URL || 
    'postgresql://postgres.ydevatqwkoccxhtejdor:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres';
  
  const files = [
    '01-create-vehicle-models-fixed.sql',
    '03-import-parts.sql',
    '04-import-bulletins.sql'
  ];
  
  // Add all procedure chunks
  const chunksDir = path.join(__dirname, 'procedures-chunks');
  const chunkFiles = fs.readdirSync(chunksDir)
    .filter(f => f.endsWith('.sql'))
    .sort()
    .map(f => path.join('procedures-chunks', f));
  
  files.splice(1, 0, ...chunkFiles);
  
  for (const file of files) {
    const filePath = path.join(__dirname, file);
    console.log(`📋 Importing ${file}...`);
    
    try {
      const { stdout, stderr } = await execAsync(
        `psql "${connectionString}" -f "${filePath}"`
      );
      
      if (stderr) {
        console.error(`⚠️ Warnings: ${stderr}`);
      }
      console.log(`✅ Completed: ${file}\n`);
    } catch (error) {
      console.error(`❌ Failed to import ${file}: ${error.message}`);
      process.exit(1);
    }
  }
  
  console.log('🎉 All files imported successfully!');
}

// Check command line arguments
const args = process.argv.slice(2);
const usePSQL = args.includes('--psql');

// Display connection options
console.log('🔧 WIS Data Import Tool (IPv4 Connection)');
console.log('==========================================\n');

if (!process.env.DATABASE_URL) {
  console.log('⚠️  DATABASE_URL not found in .env file');
  console.log('\n📝 Please add one of these to your .env file:\n');
  console.log('For Transaction Pooler (Port 6543):');
  console.log('DATABASE_URL=postgresql://postgres.ydevatqwkoccxhtejdor:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres\n');
  console.log('For Session Pooler (Port 5432):');
  console.log('DATABASE_URL=postgresql://postgres.ydevatqwkoccxhtejdor:[password]@aws-0-us-west-1.pooler.supabase.com:5432/postgres\n');
  console.log('For Direct Connection (Port 5432):');
  console.log('DATABASE_URL=postgresql://postgres:[password]@db.ydevatqwkoccxhtejdor.supabase.co:5432/postgres\n');
  console.log('You can find your database password in:');
  console.log('https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/settings/database\n');
  process.exit(1);
}

// Run appropriate import method
if (usePSQL) {
  importUsingPSQL();
} else {
  importWISData();
}