import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rotating user agents for anti-bot
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
];

// Default selectors for known sites
const DEFAULT_SELECTORS: Record<string, Record<string, string>> = {
  'wikiloc.com': {
    title: 'h1.trail-title, h1.title, .trail-name',
    description: '.trail-description, .description',
    difficulty: '.difficulty, .trail-difficulty',
    distance: '.distance, .trail-distance',
    elevation: '.elevation, .elevation-gain',
    rating: '.rating, .trail-rating',
    author: '.author, .trail-author',
    gpx_link: 'a[href*=".gpx"]',
    coordinates: '.coordinates',
  },
  'ioverlander.com': {
    title: '.place-name, h1, .location-name',
    description: '.place-description, .description',
    coordinates: '.coordinates',
    amenities: '.amenity-list li, .amenities span',
    rating: '.rating, .stars',
    comments: '.comment, .review',
  },
  'expeditionportal.com': {
    title: 'h1, .thread-title',
    description: '.post-content, .message-body',
    author: '.username, .author',
    coordinates: '.coordinates',
    images: '.post-content img, .attachment img',
  },
};

interface ScrapedTrip {
  title: string;
  description: string;
  gpx_data?: {
    coordinates: [number, number, number][];
    distance_km: number;
    elevation_gain_m: number;
  };
  difficulty?: string;
  vehicle_requirements?: string[];
  photos?: string[];
  ratings?: { score: number; count: number };
  comments?: { user: string; text: string; date: string }[];
  source_url: string;
  author?: string;
}

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
}

function getSelectorsForDomain(domain: string, customSelectors?: Record<string, string>): Record<string, string> {
  const defaultForDomain = DEFAULT_SELECTORS[domain] || DEFAULT_SELECTORS['wikiloc.com'];
  return { ...defaultForDomain, ...customSelectors };
}

// Simple HTML parser using regex (Deno edge functions don't have DOM)
function extractBySelector(html: string, selector: string): string | null {
  // Handle class selectors
  if (selector.startsWith('.')) {
    const className = selector.slice(1).split(',')[0].trim();
    const regex = new RegExp(`class="[^"]*${className}[^"]*"[^>]*>([^<]+)`, 'i');
    const match = html.match(regex);
    return match ? match[1].trim() : null;
  }

  // Handle tag selectors
  if (selector.match(/^[a-z]+$/i)) {
    const regex = new RegExp(`<${selector}[^>]*>([^<]+)</${selector}>`, 'i');
    const match = html.match(regex);
    return match ? match[1].trim() : null;
  }

  // Handle attribute selectors
  if (selector.includes('[')) {
    const attrMatch = selector.match(/\[([^\]=]+)(?:="([^"]+)")?\]/);
    if (attrMatch) {
      const attr = attrMatch[1];
      const regex = new RegExp(`${attr}="([^"]+)"`, 'i');
      const match = html.match(regex);
      return match ? match[1].trim() : null;
    }
  }

  return null;
}

function extractAllBySelector(html: string, selector: string): string[] {
  const results: string[] = [];

  if (selector.startsWith('.')) {
    const className = selector.slice(1).split(',')[0].trim();
    const regex = new RegExp(`class="[^"]*${className}[^"]*"[^>]*>([^<]+)`, 'gi');
    let match;
    while ((match = regex.exec(html)) !== null) {
      results.push(match[1].trim());
    }
  }

  return results;
}

function extractImages(html: string): string[] {
  const images: string[] = [];
  const imgRegex = /<img[^>]+src="([^"]+)"/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    if (!match[1].includes('avatar') && !match[1].includes('icon')) {
      images.push(match[1]);
    }
  }
  return images.slice(0, 10);
}

function extractCoordinates(html: string): [number, number][] {
  const coords: [number, number][] = [];
  const latLngRegex = /(?:lat|latitude)['":\s]+(-?\d+\.?\d*)[,\s]+(?:lng|lon|longitude)['":\s]+(-?\d+\.?\d*)/gi;
  let match;
  while ((match = latLngRegex.exec(html)) !== null) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      coords.push([lat, lng]);
    }
  }
  return coords;
}

function parseRating(ratingStr: string | null): { score: number; count: number } | undefined {
  if (!ratingStr) return undefined;
  const scoreMatch = ratingStr.match(/(\d+\.?\d*)/);
  const countMatch = ratingStr.match(/\((\d+)\)/);
  if (scoreMatch) {
    return {
      score: parseFloat(scoreMatch[1]),
      count: countMatch ? parseInt(countMatch[1]) : 0
    };
  }
  return undefined;
}

function parseDifficulty(diffStr: string | null): string | undefined {
  if (!diffStr) return undefined;
  const lower = diffStr.toLowerCase();
  if (lower.includes('easy') || lower.includes('beginner')) return 'easy';
  if (lower.includes('moderate') || lower.includes('medium')) return 'moderate';
  if (lower.includes('hard') || lower.includes('difficult')) return 'hard';
  if (lower.includes('extreme') || lower.includes('expert')) return 'extreme';
  return diffStr;
}

async function scrapeUrl(url: string, selectors: Record<string, string>): Promise<ScrapedTrip> {
  const userAgent = getRandomUserAgent();

  // Random delay (2-5 seconds)
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

  const response = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();

  const title = extractBySelector(html, selectors.title) || 'Untitled Trip';
  const description = extractBySelector(html, selectors.description) || '';
  const difficulty = parseDifficulty(extractBySelector(html, selectors.difficulty));
  const rating = parseRating(extractBySelector(html, selectors.rating));
  const author = extractBySelector(html, selectors.author);
  const photos = extractImages(html);
  const coordinates = extractCoordinates(html);

  const distanceStr = extractBySelector(html, selectors.distance);
  const elevationStr = extractBySelector(html, selectors.elevation);

  let gpx_data;
  if (coordinates.length > 0) {
    const distanceMatch = distanceStr?.match(/(\d+\.?\d*)/);
    const elevationMatch = elevationStr?.match(/(\d+\.?\d*)/);

    gpx_data = {
      coordinates: coordinates.map(c => [c[0], c[1], 0] as [number, number, number]),
      distance_km: distanceMatch ? parseFloat(distanceMatch[1]) : 0,
      elevation_gain_m: elevationMatch ? parseFloat(elevationMatch[1]) : 0,
    };
  }

  const commentTexts = extractAllBySelector(html, selectors.comments || '.comment');
  const comments = commentTexts.map(text => ({
    user: 'Anonymous',
    text: text.slice(0, 500),
    date: new Date().toISOString()
  }));

  return {
    title,
    description: description.slice(0, 5000),
    gpx_data,
    difficulty,
    photos,
    ratings: rating,
    comments: comments.slice(0, 20),
    source_url: url,
    author,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await req.json();
    const { source_id, url, selectors: customSelectors } = body;

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const domain = extractDomain(url);
    const selectors = getSelectorsForDomain(domain, customSelectors);

    console.log(`[scrape-trips] Scraping: ${url}`);

    const tripData = await scrapeUrl(url, selectors);

    // Generate embedding for semantic search
    let embedding = null;
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (openaiKey) {
      try {
        const embeddingText = `${tripData.title} ${tripData.description} ${tripData.difficulty || ''}`.slice(0, 8000);
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: embeddingText,
          }),
        });

        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json();
          embedding = embeddingData.data[0].embedding;
        }
      } catch (e) {
        console.warn('[scrape-trips] Failed to generate embedding:', e);
      }
    }

    // Upsert to scraped_content
    const { error } = await supabase
      .from('scraped_content')
      .upsert({
        source_id,
        url,
        content_type: 'trip',
        title: tripData.title,
        content: tripData.description,
        metadata: {
          gpx_data: tripData.gpx_data,
          difficulty: tripData.difficulty,
          vehicle_requirements: tripData.vehicle_requirements,
          photos: tripData.photos,
          ratings: tripData.ratings,
          comments: tripData.comments,
          author: tripData.author,
        },
        embedding,
        scraped_at: new Date().toISOString(),
      }, {
        onConflict: 'url'
      });

    if (error) throw error;

    // Update source last_scraped_at
    if (source_id) {
      await supabase
        .from('scrape_sources')
        .update({
          last_scraped_at: new Date().toISOString(),
          failure_count: 0,
        })
        .eq('id', source_id);
    }

    console.log(`[scrape-trips] Successfully scraped: ${tripData.title}`);

    return new Response(
      JSON.stringify({ success: true, data: tripData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[scrape-trips] Error:', error);

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
