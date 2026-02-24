/**
 * Barry OpenClaw Configuration
 * Centralized configuration for Barry AI guardrails and settings
 */

// Blocked topics for safety filter
// Each entry must describe a genuinely dangerous action, not routine maintenance.
// Routine procedures (remove fuel filter, change brakes) should pass through
// with safety disclaimers attached by the safety filter skill instead.
export const BLOCKED_TOPICS = [
  'disable safety systems',
  'bypass brake system',
  'permanently disable brake',
  'remove airbag',
  'modify emissions control',
  'defeat emissions',
  'skip torque specifications',
  'disable abs permanently',
  'bypass seatbelt interlock',
  'remove roll cage',
  'disable pto safety switch',
  'bypass hydraulic safety',
  'disable exhaust brake permanently',
  'remove safety guard',
  'bypass safety interlock',
  'defeat safety system'
];

// Required safety disclaimers by topic
export const SAFETY_DISCLAIMERS: Record<string, string> = {
  brake_work: 'Always use jack stands and chock wheels before working under vehicle. Never work on brakes without proper support.',
  electrical: 'Disconnect battery before electrical work. Wait 5 minutes for capacitors to discharge.',
  lifting: 'Never exceed rated capacity of lifting equipment. Use proper jack points.',
  hydraulic: 'Release hydraulic pressure before disconnecting lines. Use proper safety glasses.',
  pto: 'Ensure PTO is disengaged and vehicle is in neutral before maintenance. Never wear loose clothing near rotating parts.',
  fuel_system: 'Work in well-ventilated area. No smoking or open flames. Have fire extinguisher ready.',
  cooling_system: 'Never open radiator cap when hot. Allow engine to cool completely.',
  exhaust: 'Work in ventilated area. Exhaust gases are deadly in enclosed spaces.',
  suspension: 'Support vehicle properly before removing suspension components. Springs are under tension.',
  transmission: 'Use proper transmission jack. Support transmission before removing mount bolts.'
};

// Keywords that trigger safety disclaimers
export const SAFETY_DISCLAIMER_TRIGGERS: Record<string, string[]> = {
  brake_work: ['brake', 'brakes', 'braking', 'brake pad', 'brake fluid', 'brake line', 'caliper'],
  electrical: ['electrical', 'wiring', 'battery', 'alternator', 'starter', 'fuse', 'relay', 'voltage'],
  lifting: ['lift', 'jack', 'hoist', 'raise', 'support', 'jack stand'],
  hydraulic: ['hydraulic', 'power steering', 'brake line', 'clutch line', 'pressure'],
  pto: ['pto', 'power take-off', 'power takeoff', 'driveline', 'shaft'],
  fuel_system: ['fuel', 'diesel', 'fuel line', 'injector', 'fuel pump', 'tank'],
  cooling_system: ['coolant', 'radiator', 'thermostat', 'water pump', 'hose', 'antifreeze'],
  exhaust: ['exhaust', 'muffler', 'manifold', 'catalytic', 'dpf'],
  suspension: ['suspension', 'spring', 'shock', 'strut', 'coil spring', 'leaf spring'],
  transmission: ['transmission', 'gearbox', 'transfer case', 'clutch', 'gear']
};

// Domain containment - allowed topics
export const ALLOWED_DOMAINS = [
  'unimog',
  'mercedes-benz',
  'vehicle maintenance',
  'mechanical repair',
  'parts lookup',
  'torque specifications',
  'fluid capacities',
  'troubleshooting',
  'off-road driving',
  'expedition planning',
  'camping equipment',
  'recovery gear'
];

// Off-topic redirect message
export const OFF_TOPIC_REDIRECT = `I'm Barry, your Unimog specialist! I'm focused on helping with Unimog technical questions, maintenance, repairs, and parts. For questions outside this area, I'd recommend consulting a general resource. Is there something about your Unimog I can help with instead?`;

// Dangerous request block message
export const DANGEROUS_BLOCK_MESSAGE = `I can't help with requests that could compromise vehicle safety. Safety systems are designed to protect you and others. If you're having issues with a safety system, I'd recommend having it inspected by a qualified mechanic who can diagnose and properly repair any problems.`;

// Model configuration
export const MODEL_CONFIG = {
  intent: process.env.ANTHROPIC_MODEL_INTENT || 'claude-haiku-4-5',
  agentic: process.env.ANTHROPIC_MODEL_AGENTIC || 'claude-haiku-4-5',
  general: process.env.ANTHROPIC_MODEL_GENERAL || 'claude-haiku-4-5',
  vision: process.env.ANTHROPIC_MODEL_VISION || 'claude-haiku-4-5'
};

// Tool restrictions (MCP sandbox)
export const ALLOWED_TOOLS = [
  'supabase:read:manual_chunks',
  'supabase:read:rps_parts',
  'supabase:read:rps_groups',
  'supabase:read:rps_illustrations',
  'supabase:read:barry_knowledge_base',
  'supabase:read:rps_component_synonyms',
  'supabase:read:barry_manual_navigation',
  'supabase:write:barry_answer_feedback',
  'supabase:write:chat_logs'
];

export const BLOCKED_TOOLS = [
  'bash',
  'filesystem:write',
  'http:external'
];

// Routing keywords for technical detection (subset from routing-keywords.json)
export const TECHNICAL_KEYWORDS = new Set([
  'unimog', 'u435', 'u1300', 'u1300l', 'u1700', 'u1700l',
  'u404', 'u416', 'u900', 'u1000', 'u1400', 'u1550', 'u1600', 'u1800', 'u1850', 'u2150', 'u2450', 'u3000', 'u4000', 'u4023', 'u5000', 'u5023',
  'portal', 'hub', 'axle', 'differential', 'transfer', 'gearbox',
  'torque', 'spec', 'specification', 'capacity', 'fluid',
  'oil', 'change', 'drain', 'fill', 'level',
  'brake', 'clutch', 'steering', 'suspension',
  'engine', 'turbo', 'turbocharger', 'injector', 'fuel',
  'pto', 'driveline', 'driveshaft',
  'seal', 'bearing', 'gasket', 'filter',
  'remove', 'install', 'replace', 'adjust', 'repair',
  'diagram', 'exploded', 'view', 'illustration', 'schematic',
  'part', 'number', 'niin', 'nsn', 'rps',
  'manual', 'workshop', 'procedure', 'steps',
  'ecu', 'can-bus', 'canbus', 'obd', 'diagnostic', 'fault', 'sensor',
  'edc', 'abs', 'module', 'relay', 'fuse', 'wiring', 'harness',
  'alternator', 'starter', 'voltage', 'ampere', 'connector'
]);

// Feature flags
export const FEATURE_FLAGS = {
  learningCache: process.env.FEATURE_FLAG_LEARNING_CACHE === 'true',
  webSearch: process.env.FEATURE_FLAG_WEB_SEARCH === 'true',
  weather: process.env.FEATURE_FLAG_WEATHER === 'true',
  rpsDeterministic: process.env.FEATURE_FLAG_RPS_DETERMINISTIC === 'true',
  rpsClarify: process.env.FEATURE_FLAG_RPS_CLARIFY === 'true'
};

// Cache TTL in seconds
export const CACHE_TTL_SECONDS = parseInt(process.env.FEATURE_CACHE_TTL_SECONDS || '86400');

// Barry personality prompt
export const BARRY_PERSONA = `You are Barry, a gruff but friendly Unimog mechanic with 40+ years of experience. You've worked on everything from U404s to modern U5000s, but your specialty is the U435 series (U1300L, U1700L, and related models).

Your personality:
- Practical and direct - you don't waste words
- Helpful but realistic about what DIY mechanics can tackle
- You use proper technical terms but explain them when needed
- You always emphasize safety
- You have stories from decades of Unimog work but keep them brief

CRITICAL RULES:
1. ALWAYS cite specific page numbers from the manual when giving technical advice
2. ALWAYS recommend proper safety precautions
3. If you're not sure about something, say so - don't guess on safety-critical specs
4. Keep responses focused on the specific question asked
5. When showing exploded views or diagrams, use markdown image syntax`;
