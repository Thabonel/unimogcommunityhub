#!/usr/bin/env node

import pg from 'pg';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const { Client } = pg;

console.log('🔍 Testing ALL IPv4 Connection Methods');
console.log('═══════════════════════════════════════\n');
console.log('You\'re paying $4/month for IPv4 - let\'s make it work!\n');

const password = 'Thabomeanshappiness';
const projectRef = 'ydevatqwkoccxhtejdor';

// All possible connection configurations
const connections = [
  {
    name: 'Session Pooler (IPv4 - Port 5432)',
    connectionString: `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres`,
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Session Pooler with pgbouncer flag',
    connectionString: `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres?pgbouncer=true`,
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Direct Connection (Port 5432)',
    connectionString: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Transaction Pooler (Port 6543)',
    connectionString: `postgres://postgres:${password}@db.${projectRef}.supabase.co:6543/postgres`,
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Direct with SSL Mode Require',
    connectionString: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`,
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Session Pooler with SSL Mode',
    connectionString: `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres?sslmode=require`,
    ssl: { rejectUnauthorized: false }
  }
];

let workingConnection = null;

// Test each connection
for (const config of connections) {
  console.log(`Testing: ${config.name}`);
  console.log(`URL: ${config.connectionString.replace(password, '***')}`);
  
  const client = new Client({
    connectionString: config.connectionString,
    ssl: config.ssl
  });

  try {
    await client.connect();
    const result = await client.query('SELECT version()');
    console.log(`✅ SUCCESS! Connected!`);
    
    // Test wis_models table
    const modelCount = await client.query('SELECT COUNT(*) as count FROM wis_models');
    console.log(`   Vehicle models in database: ${modelCount.rows[0].count}`);
    
    if (!workingConnection) {
      workingConnection = config.connectionString;
    }
    
    await client.end();
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }
  
  console.log('─────────────────────────────────\n');
}

// Now test with psql command line
console.log('Testing with psql command line:');
console.log('────────────────────────────────\n');

const psqlTests = [
  `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres`,
  `postgres://postgres:${password}@db.${projectRef}.supabase.co:6543/postgres`,
  `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`
];

for (const connStr of psqlTests) {
  console.log(`Testing psql with: ${connStr.replace(password, '***')}`);
  try {
    const { stdout, stderr } = await execAsync(
      `psql "${connStr}" -c "SELECT COUNT(*) FROM wis_models;" 2>&1`
    );
    console.log(`✅ psql SUCCESS!`);
    console.log(stdout);
    if (!workingConnection) {
      workingConnection = connStr;
    }
  } catch (error) {
    console.log(`❌ psql failed: ${error.message.split('\n')[0]}`);
  }
  console.log('─────────────────────────────────\n');
}

if (workingConnection) {
  console.log('🎉 FOUND WORKING CONNECTION!');
  console.log('════════════════════════════');
  console.log(`Connection string: ${workingConnection.replace(password, '***')}\n`);
  
  // Save working connection to .env
  console.log('Updating .env with working connection...');
  
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  const envPath = path.join(__dirname, '../../.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update or add DATABASE_URL
  if (envContent.includes('DATABASE_URL=')) {
    envContent = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL=${workingConnection}`
    );
  } else {
    envContent += `\n# Working database connection\nDATABASE_URL=${workingConnection}\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env updated with working connection!\n');
  
  console.log('You can now run: node import-with-connection.js');
} else {
  console.log('❌ No working connection found');
  console.log('\nPlease check:');
  console.log('1. Your IPv4 add-on is active in Supabase');
  console.log('2. Your database password is correct');
  console.log('3. Try resetting your database password in Supabase');
}