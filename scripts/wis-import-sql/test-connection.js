#!/usr/bin/env node

import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Client } = pg;

async function testConnections() {
  console.log('🔧 Testing Database Connections\n');
  console.log('════════════════════════════════\n');

  const connections = [
    {
      name: 'Direct Connection (Port 5432)',
      connectionString: 'postgresql://postgres:Thabomeanshappiness@db.ydevatqwkoccxhtejdor.supabase.co:5432/postgres'
    },
    {
      name: 'Transaction Pooler (Port 6543)',
      connectionString: 'postgres://postgres:Thabomeanshappiness@db.ydevatqwkoccxhtejdor.supabase.co:6543/postgres'
    },
    {
      name: 'Session Pooler (IPv4)',
      connectionString: 'postgresql://postgres.ydevatqwkoccxhtejdor:Thabomeanshappiness@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres'
    }
  ];

  for (const conn of connections) {
    console.log(`Testing: ${conn.name}`);
    console.log(`URL: ${conn.connectionString.replace('Thabomeanshappiness', '***')}`);
    
    const client = new Client({
      connectionString: conn.connectionString,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      const result = await client.query('SELECT version()');
      console.log(`✅ SUCCESS! Connected to PostgreSQL`);
      console.log(`   Version: ${result.rows[0].version.split(',')[0]}`);
      
      // Test wis_models table
      const tableCheck = await client.query(`
        SELECT COUNT(*) as count FROM information_schema.tables 
        WHERE table_name = 'wis_models'
      `);
      
      if (tableCheck.rows[0].count > 0) {
        const modelCount = await client.query('SELECT COUNT(*) FROM wis_models');
        console.log(`   wis_models table exists with ${modelCount.rows[0].count} records`);
      } else {
        console.log(`   wis_models table does not exist yet`);
      }
      
      await client.end();
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
    }
    
    console.log('─────────────────────────────────\n');
  }
}

testConnections();