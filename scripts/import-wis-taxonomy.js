#!/usr/bin/env node

/**
 * Import WIS Component Taxonomy and Parts Catalog
 *
 * This script processes the U435 complete parts database and extracts:
 * 1. Component taxonomy (systems, subsystems, categories)
 * 2. Parts catalog with full specifications
 * 3. Component relationships and dependencies
 *
 * Usage: node scripts/import-wis-taxonomy.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase configuration');
    console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

/**
 * Extract component taxonomy from the hierarchical JSON structure
 */
function extractTaxonomy(partsData) {
    const taxonomy = [];
    const categories = new Set();

    // Process each system (engine_systems, transmission_systems, etc.)
    Object.entries(partsData).forEach(([systemKey, systemData]) => {
        if (systemKey === 'metadata') return;

        console.log(`📁 Processing system: ${systemKey}`);

        // Add system-level entry
        taxonomy.push({
            system_name: systemKey,
            subsystem_name: null,
            component_category: systemKey.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase()),
            parent_category: null,
            level: 1,
            description: `${systemKey.replace('_', ' ')} components and assemblies`,
            metadata: { system_type: 'root', original_key: systemKey }
        });

        // Process each subsystem (om352_engine, g85_transmission, etc.)
        Object.entries(systemData).forEach(([subsystemKey, subsystemData]) => {
            if (typeof subsystemData !== 'object' || !subsystemData.parts) return;

            console.log(`  📂 Processing subsystem: ${subsystemKey}`);

            const subsystemDisplayName = subsystemKey.toUpperCase().replace('_', ' ');

            // Add subsystem-level entry
            taxonomy.push({
                system_name: systemKey,
                subsystem_name: subsystemKey,
                component_category: subsystemDisplayName,
                parent_category: systemKey.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase()),
                level: 2,
                description: `${subsystemDisplayName} components`,
                metadata: {
                    ...subsystemData,
                    parts: undefined, // Don't duplicate parts in metadata
                    original_key: subsystemKey
                }
            });

            // Extract all unique categories from parts
            if (subsystemData.parts && Array.isArray(subsystemData.parts)) {
                subsystemData.parts.forEach(part => {
                    if (part.category && !categories.has(part.category)) {
                        categories.add(part.category);

                        taxonomy.push({
                            system_name: systemKey,
                            subsystem_name: subsystemKey,
                            component_category: part.category,
                            parent_category: subsystemDisplayName,
                            level: 3,
                            description: `${part.category} components for ${subsystemDisplayName}`,
                            metadata: { component_type: 'part_category' }
                        });
                    }
                });
            }
        });
    });

    console.log(`✅ Extracted ${taxonomy.length} taxonomy entries`);
    console.log(`✅ Found ${categories.size} unique component categories`);

    return taxonomy;
}

/**
 * Extract parts catalog with specifications and relationships
 */
function extractPartsCatalog(partsData) {
    const parts = [];
    const relationships = [];

    Object.entries(partsData).forEach(([systemKey, systemData]) => {
        if (systemKey === 'metadata') return;

        Object.entries(systemData).forEach(([subsystemKey, subsystemData]) => {
            if (typeof subsystemData !== 'object' || !subsystemData.parts) return;

            subsystemData.parts.forEach(part => {
                // Extract technical specifications into structured format
                const technicalSpecs = {};

                // Common technical fields
                const techFields = [
                    'weight_kg', 'price_eur', 'torque_spec_nm', 'sequence',
                    'bore_mm', 'compression_ratio', 'length_mm', 'big_end_bearing',
                    'stroke_mm', 'main_bearing', 'lift_intake_mm', 'lift_exhaust_mm',
                    'diameter_mm', 'displacement', 'power', 'torque', 'years'
                ];

                techFields.forEach(field => {
                    if (part[field] !== undefined) {
                        technicalSpecs[field] = part[field];
                    }
                });

                // Find related parts from technical specs
                const relatedParts = [];
                if (part.big_end_bearing) relatedParts.push(part.big_end_bearing);
                if (part.main_bearing) relatedParts.push(part.main_bearing);
                if (part.superseded_by) relatedParts.push(part.superseded_by);
                if (part.cross_reference) relatedParts.push(...part.cross_reference);

                const partEntry = {
                    part_number: part.part_number,
                    description: part.description,
                    category: part.category,
                    system_name: systemKey,
                    subsystem_name: subsystemKey,
                    weight_kg: part.weight_kg,
                    price_eur: part.price_eur,
                    availability: part.availability,
                    compatible_years: part.compatible_years || [],
                    superseded_by: part.superseded_by,
                    cross_reference: part.cross_reference || [],
                    technical_specs: technicalSpecs,
                    related_parts: relatedParts,
                    required_with: [], // Will be populated by relationship analysis
                    media_references: [] // Will be populated by media analysis
                };

                parts.push(partEntry);

                // Create relationships
                if (part.big_end_bearing) {
                    relationships.push({
                        source_part_number: part.part_number,
                        target_part_number: part.big_end_bearing,
                        relationship_type: 'requires',
                        description: 'Requires bearing for proper assembly',
                        strength: 0.9
                    });
                }

                if (part.main_bearing) {
                    relationships.push({
                        source_part_number: part.part_number,
                        target_part_number: part.main_bearing,
                        relationship_type: 'requires',
                        description: 'Requires main bearing for assembly',
                        strength: 0.9
                    });
                }

                if (part.superseded_by) {
                    relationships.push({
                        source_part_number: part.part_number,
                        target_part_number: part.superseded_by,
                        relationship_type: 'replaces_with',
                        description: 'Superseded by newer part',
                        strength: 1.0
                    });
                }

                if (part.cross_reference) {
                    part.cross_reference.forEach(refPart => {
                        relationships.push({
                            source_part_number: part.part_number,
                            target_part_number: refPart,
                            relationship_type: 'compatible_with',
                            description: 'Compatible cross-reference part',
                            strength: 0.8
                        });
                    });
                }
            });
        });
    });

    console.log(`✅ Extracted ${parts.length} parts`);
    console.log(`✅ Generated ${relationships.length} relationships`);

    return { parts, relationships };
}

/**
 * Import taxonomy data into Supabase
 */
async function importTaxonomy(taxonomy) {
    console.log('🔄 Importing component taxonomy...');

    const { data, error } = await supabase
        .from('wis_component_taxonomy')
        .upsert(taxonomy, {
            onConflict: 'system_name,component_category',
            ignoreDuplicates: false
        });

    if (error) {
        console.error('❌ Failed to import taxonomy:', error);
        throw error;
    }

    console.log(`✅ Imported ${taxonomy.length} taxonomy entries`);
    return data;
}

/**
 * Import parts catalog into Supabase
 */
async function importParts(parts) {
    console.log('🔄 Importing parts catalog...');

    // Import in batches to avoid timeout
    const batchSize = 100;
    let imported = 0;

    for (let i = 0; i < parts.length; i += batchSize) {
        const batch = parts.slice(i, i + batchSize);

        const { error } = await supabase
            .from('wis_parts_catalog')
            .upsert(batch, {
                onConflict: 'part_number',
                ignoreDuplicates: false
            });

        if (error) {
            console.error(`❌ Failed to import parts batch ${i + 1}-${i + batch.length}:`, error);
            throw error;
        }

        imported += batch.length;
        console.log(`  📦 Imported ${imported}/${parts.length} parts`);
    }

    console.log(`✅ Imported ${parts.length} parts`);
}

/**
 * Import component relationships into Supabase
 */
async function importRelationships(relationships) {
    console.log('🔄 Importing component relationships...');

    // Filter out relationships where target part doesn't exist in our dataset
    const validRelationships = relationships.filter(rel => {
        // This is a simplified check - in production you'd validate against actual DB
        return rel.source_part_number && rel.target_part_number;
    });

    console.log(`📊 Filtered ${relationships.length} → ${validRelationships.length} valid relationships`);

    if (validRelationships.length === 0) {
        console.log('⚠️ No valid relationships to import');
        return;
    }

    const { error } = await supabase
        .from('wis_component_relationships')
        .upsert(validRelationships, {
            onConflict: 'source_part_number,target_part_number,relationship_type',
            ignoreDuplicates: true
        });

    if (error) {
        console.error('❌ Failed to import relationships:', error);
        throw error;
    }

    console.log(`✅ Imported ${validRelationships.length} relationships`);
}

/**
 * Main execution function
 */
async function main() {
    console.log('🚀 Starting WIS taxonomy import...');
    console.log('');

    try {
        // Read and parse the JSON data
        const partsFilePath = path.join(__dirname, '..', 'u435_complete_parts_database.json');

        if (!fs.existsSync(partsFilePath)) {
            throw new Error(`Parts database file not found: ${partsFilePath}`);
        }

        console.log('📖 Reading parts database...');
        const rawData = fs.readFileSync(partsFilePath, 'utf8');
        const partsData = JSON.parse(rawData);

        console.log(`📊 Loaded database with ${partsData.metadata.total_parts} parts`);
        console.log(`📅 Database version: ${partsData.metadata.database_version}`);
        console.log(`🚛 Model series: ${partsData.metadata.model_series}`);
        console.log('');

        // Extract structured data
        const taxonomy = extractTaxonomy(partsData);
        const { parts, relationships } = extractPartsCatalog(partsData);

        console.log('');
        console.log('📊 Summary:');
        console.log(`  • ${taxonomy.length} taxonomy entries`);
        console.log(`  • ${parts.length} parts`);
        console.log(`  • ${relationships.length} relationships`);
        console.log('');

        // Import into Supabase
        await importTaxonomy(taxonomy);
        await importParts(parts);
        await importRelationships(relationships);

        console.log('');
        console.log('✅ WIS taxonomy import completed successfully!');
        console.log('');
        console.log('Next steps:');
        console.log('  1. Run semantic embedding generation');
        console.log('  2. Import media catalog');
        console.log('  3. Generate component relationships');
        console.log('  4. Test Barry integration');

    } catch (error) {
        console.error('❌ Import failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Run the import
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export {
    extractTaxonomy,
    extractPartsCatalog,
    importTaxonomy,
    importParts,
    importRelationships
};