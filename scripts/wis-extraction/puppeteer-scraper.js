#!/usr/bin/env node

/**
 * Mercedes XENTRY WIS Portal Scraper using Puppeteer
 * Extracts Unimog procedures from the online portal
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration
const config = {
  portal: {
    url: 'https://xentry.mercedes-benz.com/home/',
    ispUrl: 'https://b2bconnect.mercedes-benz.com/gb/shop/workshop-solutions/xentry-wis'
  },
  supabase: {
    url: process.env.VITE_SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  outputDir: '/Volumes/UnimogManuals/wis-scraped-data'
};

// Initialize Supabase
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

/**
 * Launch browser and scrape WIS data
 */
async function scrapeWIS() {
  console.log('🚀 Launching Puppeteer browser...');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for production
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('📋 Navigating to XENTRY Portal...');
    await page.goto(config.portal.url, { waitUntil: 'networkidle2' });
    
    // Take screenshot for debugging
    await page.screenshot({ 
      path: `${config.outputDir}/xentry-homepage.png`,
      fullPage: true 
    });
    
    // Check if login is required
    const needsLogin = await page.$('input[type="password"]') !== null;
    
    if (needsLogin) {
      console.log('🔐 Login required. Please provide credentials...');
      
      // For demo/testing, we'll try the public ISP portal instead
      console.log('📋 Trying B2B Connect portal...');
      await page.goto(config.portal.ispUrl, { waitUntil: 'networkidle2' });
      
      await page.screenshot({ 
        path: `${config.outputDir}/b2b-connect.png`,
        fullPage: true 
      });
    }
    
    // Search for Unimog procedures
    console.log('🔍 Searching for Unimog procedures...');
    
    // Look for search box
    const searchSelectors = [
      'input[type="search"]',
      'input[name="search"]',
      'input[placeholder*="search" i]',
      'input[placeholder*="suche" i]',
      '#search',
      '.search-input'
    ];
    
    let searchBox = null;
    for (const selector of searchSelectors) {
      searchBox = await page.$(selector);
      if (searchBox) break;
    }
    
    if (searchBox) {
      console.log('✅ Found search box');
      await searchBox.type('Unimog U400');
      await page.keyboard.press('Enter');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }
    
    // Extract procedures from results
    const procedures = await extractProcedures(page);
    console.log(`📊 Found ${procedures.length} procedures`);
    
    // Save to database
    if (procedures.length > 0) {
      await saveProcedures(procedures);
    }
    
  } catch (error) {
    console.error('❌ Error during scraping:', error);
    
    // Take error screenshot
    await page.screenshot({ 
      path: `${config.outputDir}/error-screenshot.png`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

/**
 * Extract procedures from the page
 */
async function extractProcedures(page) {
  console.log('📑 Extracting procedures from page...');
  
  // Common selectors for procedure lists
  const procedureSelectors = [
    '.procedure-item',
    '.wis-procedure',
    '.repair-instruction',
    'article.procedure',
    '[data-procedure-id]',
    '.result-item'
  ];
  
  let procedures = [];
  
  for (const selector of procedureSelectors) {
    const elements = await page.$$(selector);
    
    if (elements.length > 0) {
      console.log(`Found ${elements.length} items with selector: ${selector}`);
      
      for (const element of elements) {
        try {
          const procedure = await element.evaluate(el => {
            return {
              title: el.querySelector('h2, h3, .title')?.textContent?.trim() || '',
              code: el.querySelector('.code, .procedure-code')?.textContent?.trim() || '',
              description: el.querySelector('p, .description')?.textContent?.trim() || '',
              model: el.querySelector('.model')?.textContent?.trim() || 'Unimog',
              system: el.querySelector('.system')?.textContent?.trim() || '',
              url: el.querySelector('a')?.href || ''
            };
          });
          
          if (procedure.title) {
            procedures.push(procedure);
          }
        } catch (err) {
          console.warn('Error extracting procedure:', err);
        }
      }
    }
  }
  
  // If no procedures found, try extracting all text content
  if (procedures.length === 0) {
    console.log('⚠️ No structured procedures found, extracting page content...');
    
    const pageContent = await page.evaluate(() => {
      const content = document.body.innerText;
      const lines = content.split('\n').filter(line => line.trim());
      
      // Look for procedure-like content
      const procedures = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('Unimog') || line.includes('U300') || line.includes('U400') || line.includes('U500')) {
          procedures.push({
            title: line,
            description: lines[i + 1] || '',
            model: 'Unimog',
            system: 'General'
          });
        }
      }
      return procedures;
    });
    
    procedures = pageContent;
  }
  
  return procedures;
}

/**
 * Save procedures to Supabase
 */
async function saveProcedures(procedures) {
  console.log(`💾 Saving ${procedures.length} procedures to database...`);
  
  const formatted = procedures.map((p, index) => ({
    procedure_code: p.code || `SCRAPED-${Date.now()}-${index}`,
    title: p.title,
    model: p.model || 'Unimog',
    system: p.system || 'General',
    content: p.description || p.title,
    difficulty: 'medium',
    source_url: p.url || config.portal.url
  }));
  
  const { data, error } = await supabase
    .from('wis_procedures')
    .upsert(formatted, { onConflict: 'procedure_code' });
  
  if (error) {
    console.error('Error saving procedures:', error);
  } else {
    console.log('✅ Procedures saved successfully');
  }
  
  // Save to local file as backup
  await fs.mkdir(config.outputDir, { recursive: true });
  await fs.writeFile(
    path.join(config.outputDir, `procedures-${Date.now()}.json`),
    JSON.stringify(procedures, null, 2)
  );
}

/**
 * Alternative: Scrape from public sources
 */
async function scrapePublicSources() {
  console.log('🌐 Searching for public WIS data sources...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const sources = [
    'https://www.smartcarofamerica.com/threads/mercedes-wis-workshop-information-system.22571/',
    'https://expeditionportal.com/forum/threads/mercedes-wis-epc.220135/',
    'https://www.benzworld.org/threads/wis-documents.2558449/'
  ];
  
  const allData = [];
  
  for (const url of sources) {
    try {
      console.log(`📖 Checking ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // Extract any Unimog-related content
      const content = await page.evaluate(() => {
        const text = document.body.innerText;
        const unimogContent = [];
        
        // Look for Unimog mentions
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].toLowerCase().includes('unimog')) {
            unimogContent.push({
              context: lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 3)).join('\n'),
              source: window.location.href
            });
          }
        }
        
        return unimogContent;
      });
      
      allData.push(...content);
    } catch (err) {
      console.warn(`Error scraping ${url}:`, err.message);
    }
  }
  
  await browser.close();
  
  console.log(`📊 Found ${allData.length} Unimog-related snippets`);
  
  if (allData.length > 0) {
    await fs.mkdir(config.outputDir, { recursive: true });
    await fs.writeFile(
      path.join(config.outputDir, `public-unimog-data.json`),
      JSON.stringify(allData, null, 2)
    );
  }
  
  return allData;
}

/**
 * Main execution
 */
async function main() {
  console.log('====================================');
  console.log('Mercedes WIS Puppeteer Scraper');
  console.log('====================================\n');
  
  // Create output directory
  await fs.mkdir(config.outputDir, { recursive: true });
  
  // Try official portal first
  try {
    await scrapeWIS();
  } catch (error) {
    console.error('Official portal scraping failed:', error);
    
    // Fallback to public sources
    console.log('\n📚 Trying public sources as fallback...');
    await scrapePublicSources();
  }
  
  console.log('\n✅ Scraping complete!');
  console.log(`Results saved to: ${config.outputDir}`);
}

// Run the scraper
main().catch(console.error);