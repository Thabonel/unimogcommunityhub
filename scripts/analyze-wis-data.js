#!/usr/bin/env node

/**
 * Analyze WIS Data Structure
 *
 * This script analyzes the U435 parts database to understand:
 * 1. Hierarchical structure and taxonomy
 * 2. Parts distribution across systems
 * 3. Relationship patterns
 * 4. Data completeness
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Analyze component taxonomy structure
 */
function analyzeTaxonomy(partsData) {
    const analysis = {
        systems: {},
        categories: new Set(),
        totalParts: 0,
        systemStats: []
    };

    Object.entries(partsData).forEach(([systemKey, systemData]) => {
        if (systemKey === 'metadata') return;

        const systemAnalysis = {
            systemName: systemKey,
            subsystems: {},
            totalParts: 0,
            categories: new Set()
        };

        Object.entries(systemData).forEach(([subsystemKey, subsystemData]) => {
            if (typeof subsystemData !== 'object' || !subsystemData.parts) return;

            const subsystemAnalysis = {
                subsystemName: subsystemKey,
                partCount: subsystemData.parts.length,
                categories: new Set(),
                priceRange: { min: Infinity, max: 0 },
                availabilityStats: {},
                yearRange: { min: Infinity, max: 0 }
            };

            subsystemData.parts.forEach(part => {
                analysis.totalParts++;
                systemAnalysis.totalParts++;

                // Categories
                if (part.category) {
                    analysis.categories.add(part.category);
                    systemAnalysis.categories.add(part.category);
                    subsystemAnalysis.categories.add(part.category);
                }

                // Price analysis
                if (part.price_eur && part.price_eur > 0) {
                    subsystemAnalysis.priceRange.min = Math.min(subsystemAnalysis.priceRange.min, part.price_eur);
                    subsystemAnalysis.priceRange.max = Math.max(subsystemAnalysis.priceRange.max, part.price_eur);
                }

                // Availability stats
                const availability = part.availability || 'Unknown';
                subsystemAnalysis.availabilityStats[availability] = (subsystemAnalysis.availabilityStats[availability] || 0) + 1;

                // Year range
                if (part.compatible_years && part.compatible_years.length > 0) {
                    const minYear = Math.min(...part.compatible_years);
                    const maxYear = Math.max(...part.compatible_years);
                    subsystemAnalysis.yearRange.min = Math.min(subsystemAnalysis.yearRange.min, minYear);
                    subsystemAnalysis.yearRange.max = Math.max(subsystemAnalysis.yearRange.max, maxYear);
                }
            });

            // Fix infinite values
            if (subsystemAnalysis.priceRange.min === Infinity) subsystemAnalysis.priceRange.min = 0;
            if (subsystemAnalysis.yearRange.min === Infinity) subsystemAnalysis.yearRange.min = 0;

            subsystemAnalysis.categories = Array.from(subsystemAnalysis.categories);
            systemAnalysis.subsystems[subsystemKey] = subsystemAnalysis;
        });

        systemAnalysis.categories = Array.from(systemAnalysis.categories);
        analysis.systems[systemKey] = systemAnalysis;
        analysis.systemStats.push({
            system: systemKey,
            parts: systemAnalysis.totalParts,
            categories: systemAnalysis.categories.length,
            subsystems: Object.keys(systemAnalysis.subsystems).length
        });
    });

    analysis.categories = Array.from(analysis.categories);
    analysis.systemStats.sort((a, b) => b.parts - a.parts);

    return analysis;
}

/**
 * Analyze relationships and dependencies
 */
function analyzeRelationships(partsData) {
    const relationships = {
        totalRelationships: 0,
        relationshipTypes: {
            bearings: 0,
            superseded: 0,
            crossReference: 0,
            technical: 0
        },
        networkStats: {
            mostConnectedParts: [],
            isolatedParts: 0
        }
    };

    const partConnections = new Map();

    Object.values(partsData).forEach(systemData => {
        if (typeof systemData !== 'object') return;

        Object.values(systemData).forEach(subsystemData => {
            if (!subsystemData.parts) return;

            subsystemData.parts.forEach(part => {
                let connectionCount = 0;

                if (part.big_end_bearing) {
                    relationships.totalRelationships++;
                    relationships.relationshipTypes.bearings++;
                    connectionCount++;
                }

                if (part.main_bearing) {
                    relationships.totalRelationships++;
                    relationships.relationshipTypes.bearings++;
                    connectionCount++;
                }

                if (part.superseded_by) {
                    relationships.totalRelationships++;
                    relationships.relationshipTypes.superseded++;
                    connectionCount++;
                }

                if (part.cross_reference && part.cross_reference.length > 0) {
                    relationships.totalRelationships += part.cross_reference.length;
                    relationships.relationshipTypes.crossReference += part.cross_reference.length;
                    connectionCount += part.cross_reference.length;
                }

                // Count technical relationships
                const techFields = ['torque_spec_nm', 'sequence', 'bore_mm', 'stroke_mm'];
                const hasSpecs = techFields.some(field => part[field] !== undefined);
                if (hasSpecs) {
                    relationships.relationshipTypes.technical++;
                }

                partConnections.set(part.part_number, connectionCount);
            });
        });
    });

    // Find most connected parts
    const sortedConnections = Array.from(partConnections.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    relationships.networkStats.mostConnectedParts = sortedConnections;
    relationships.networkStats.isolatedParts = Array.from(partConnections.values()).filter(count => count === 0).length;

    return relationships;
}

/**
 * Generate sample taxonomy entries for database
 */
function generateSampleTaxonomy(analysis) {
    const taxonomyEntries = [];

    // Generate system-level entries
    Object.entries(analysis.systems).forEach(([systemKey, systemData]) => {
        taxonomyEntries.push({
            system_name: systemKey,
            subsystem_name: null,
            component_category: systemKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            parent_category: null,
            level: 1,
            description: `${systemKey.replace('_', ' ')} components and assemblies`,
            metadata: {
                total_parts: systemData.totalParts,
                subsystem_count: Object.keys(systemData.subsystems).length,
                category_count: systemData.categories.length
            }
        });

        // Generate subsystem entries
        Object.entries(systemData.subsystems).forEach(([subsystemKey, subsystemData]) => {
            taxonomyEntries.push({
                system_name: systemKey,
                subsystem_name: subsystemKey,
                component_category: subsystemKey.toUpperCase().replace('_', ' '),
                parent_category: systemKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                level: 2,
                description: `${subsystemKey.toUpperCase().replace('_', ' ')} components`,
                metadata: {
                    part_count: subsystemData.partCount,
                    categories: subsystemData.categories,
                    price_range: subsystemData.priceRange,
                    year_range: subsystemData.yearRange,
                    availability_stats: subsystemData.availabilityStats
                }
            });
        });
    });

    return taxonomyEntries;
}

/**
 * Main analysis function
 */
function main() {
    console.log('🔍 Analyzing WIS Data Structure...');
    console.log('');

    try {
        // Read the JSON data
        const partsFilePath = path.join(__dirname, '..', 'u435_complete_parts_database.json');

        if (!fs.existsSync(partsFilePath)) {
            throw new Error(`Parts database file not found: ${partsFilePath}`);
        }

        console.log('📖 Reading parts database...');
        const rawData = fs.readFileSync(partsFilePath, 'utf8');
        const partsData = JSON.parse(rawData);

        console.log('📊 Database Metadata:');
        console.log(`  • Source: ${partsData.metadata.extraction_source}`);
        console.log(`  • Version: ${partsData.metadata.database_version}`);
        console.log(`  • Model: ${partsData.metadata.model_series}`);
        console.log(`  • Total parts: ${partsData.metadata.total_parts}`);
        console.log(`  • Size: ${partsData.metadata.database_size_gb} GB`);
        console.log('');

        // Analyze taxonomy
        const taxonomyAnalysis = analyzeTaxonomy(partsData);

        console.log('🏗️ Taxonomy Analysis:');
        console.log(`  • Total parts found: ${taxonomyAnalysis.totalParts}`);
        console.log(`  • Total categories: ${taxonomyAnalysis.categories.length}`);
        console.log(`  • Major systems: ${Object.keys(taxonomyAnalysis.systems).length}`);
        console.log('');

        console.log('📊 Parts Distribution by System:');
        taxonomyAnalysis.systemStats.forEach(stat => {
            console.log(`  • ${stat.system}: ${stat.parts} parts, ${stat.categories} categories, ${stat.subsystems} subsystems`);
        });
        console.log('');

        console.log('🏷️ Component Categories:');
        const topCategories = taxonomyAnalysis.categories.slice(0, 15);
        topCategories.forEach(category => {
            console.log(`  • ${category}`);
        });
        if (taxonomyAnalysis.categories.length > 15) {
            console.log(`  • ... and ${taxonomyAnalysis.categories.length - 15} more`);
        }
        console.log('');

        // Analyze relationships
        const relationshipAnalysis = analyzeRelationships(partsData);

        console.log('🔗 Relationship Analysis:');
        console.log(`  • Total relationships: ${relationshipAnalysis.totalRelationships}`);
        console.log(`  • Bearing relationships: ${relationshipAnalysis.relationshipTypes.bearings}`);
        console.log(`  • Supersession relationships: ${relationshipAnalysis.relationshipTypes.superseded}`);
        console.log(`  • Cross-reference relationships: ${relationshipAnalysis.relationshipTypes.crossReference}`);
        console.log(`  • Parts with technical specs: ${relationshipAnalysis.relationshipTypes.technical}`);
        console.log(`  • Isolated parts: ${relationshipAnalysis.networkStats.isolatedParts}`);
        console.log('');

        console.log('🔌 Most Connected Parts:');
        relationshipAnalysis.networkStats.mostConnectedParts.slice(0, 5).forEach(([partNumber, connections]) => {
            console.log(`  • ${partNumber}: ${connections} connections`);
        });
        console.log('');

        // Generate sample taxonomy
        const sampleTaxonomy = generateSampleTaxonomy(taxonomyAnalysis);

        console.log('🏗️ Generated Taxonomy Structure:');
        console.log(`  • Total taxonomy entries: ${sampleTaxonomy.length}`);
        console.log(`  • Level 1 (Systems): ${sampleTaxonomy.filter(t => t.level === 1).length}`);
        console.log(`  • Level 2 (Subsystems): ${sampleTaxonomy.filter(t => t.level === 2).length}`);
        console.log('');

        console.log('📋 Sample Taxonomy Entries:');
        sampleTaxonomy.slice(0, 8).forEach(entry => {
            const indent = '  '.repeat(entry.level);
            console.log(`${indent}• [L${entry.level}] ${entry.component_category} (${entry.system_name})`);
        });
        console.log('');

        // Export analysis
        const outputPath = path.join(__dirname, '..', 'wis-analysis-results.json');
        const analysisResults = {
            metadata: partsData.metadata,
            taxonomy: taxonomyAnalysis,
            relationships: relationshipAnalysis,
            sampleTaxonomy
        };

        fs.writeFileSync(outputPath, JSON.stringify(analysisResults, null, 2));
        console.log(`💾 Analysis results saved to: ${outputPath}`);
        console.log('');

        console.log('✅ Analysis complete!');
        console.log('');
        console.log('📋 Next Steps:');
        console.log('  1. Apply the database migration (create_intelligent_wis_system.sql)');
        console.log('  2. Import taxonomy data using the analysis results');
        console.log('  3. Generate semantic embeddings for parts and descriptions');
        console.log('  4. Connect media files to parts using intelligent tagging');
        console.log('  5. Integrate with Barry for semantic search');

    } catch (error) {
        console.error('❌ Analysis failed:', error.message);
        process.exit(1);
    }
}

// Run the analysis
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}