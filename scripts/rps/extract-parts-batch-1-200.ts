/**
 * RPS Parts List Extraction - Pages 1-200
 * Agent 1: Systematic extraction of all parts list data
 *
 * This script processes PNG files and extracts structured parts data
 * organized by GROUP_CODE with complete field information.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface PartItem {
  item_number: string;
  designation: string;
  nsn: string;
  manufacturer_code: string;
  supplier_code: string;
  quantity_per_assembly: string;
  unit_of_issue: string;
  repair_grade: string;
  notes: string;
}

interface GroupData {
  group_code: string;
  group_title: string;
  items: PartItem[];
  pages: number[];
  total_items: number;
}

interface ExtractionResult {
  metadata: {
    extraction_date: string;
    agent: string;
    page_range: string;
    total_pages_processed: number;
    total_groups: number;
    total_items: number;
  };
  groups: Record<string, GroupData>;
  skipped_pages: number[];
  missing_files: number[];
}

const INPUT_DIR = '/Users/thabonel/Code/unimogcommunityhub/scripts/rps/output/ai_illustrations';
const OUTPUT_FILE = '/Users/thabonel/Code/unimogcommunityhub/scripts/rps/extracted-parts-pages-1-200.json';

// Pages to skip (NIIN Index and known missing files)
const SKIP_PAGES = [
  19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, // NIIN Index
  46, 48, 52, 56, 58, 64, 66, 68, 74 // Missing files
];

// Manual extraction data from visual inspection
// GROUP A - ENGINE
const GROUP_A: GroupData = {
  group_code: 'A',
  group_title: 'ENGINE',
  items: [
    {
      item_number: '001',
      designation: 'ENGINE,DIESEL 6 CYLINDER,124 KW AT 2800RPM,97 MM BORE DIA,500 KG APPROX DRY WT,C/W STARTER MOTOR,TURBO CHARGER,AIR COMPRESSOR,LESS CLUTCH ASSY;C/W (ALWAYS QUOTE ENGINE SERIAL NUMBER, TO ENSURE CORRECT PARTS ARE OBTAINED, FOR ENGINE REPAIR.)',
      nsn: '2815 66-112-9387',
      manufacturer_code: 'Z4067/353 010 25 00 21 62 44',
      supplier_code: 'Z4067/353 010 25 00 21 62 44',
      quantity_per_assembly: '1',
      unit_of_issue: 'EA',
      repair_grade: 'N',
      notes: 'H*'
    }
  ],
  pages: [45],
  total_items: 1
};

// GROUP AA - CRANKCASE AND TIMING CASE
const GROUP_AA: GroupData = {
  group_code: 'AA',
  group_title: 'CRANKCASE AND TIMING CASE',
  items: [
    {
      item_number: '001',
      designation: 'CRANKCASE (INCLUDES AA 002 TO AA 024)',
      nsn: '',
      manufacturer_code: 'Z4067/353 010 27 08',
      supplier_code: 'Z4067/353 010 27 08',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '002',
      designation: 'SCREW PLUG',
      nsn: '',
      manufacturer_code: 'Z4067/352 011 01 35',
      supplier_code: 'Z4067/352 011 01 35',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '003',
      designation: 'SEAL RING',
      nsn: '',
      manufacturer_code: 'Z4067/352 011 00 59',
      supplier_code: 'Z4067/352 011 00 59',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '004',
      designation: 'SCREW PLUG',
      nsn: '',
      manufacturer_code: 'Z4067/352 011 03 35',
      supplier_code: 'Z4067/352 011 03 35',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '005',
      designation: 'SLEEVE',
      nsn: '',
      manufacturer_code: 'Z4067/321 992 00 25',
      supplier_code: 'Z4067/321 992 00 25',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '006',
      designation: 'SCREW PLUG, HEX SOCKET, M 36 BY 1.5',
      nsn: '',
      manufacturer_code: 'Z4067/000906 036000',
      supplier_code: 'Z4067/000906 036000',
      quantity_per_assembly: '2',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '007',
      designation: 'EXPANSION PLUG, 13 MM, GALV',
      nsn: '',
      manufacturer_code: 'D8046/000443 013002',
      supplier_code: 'D8046/000443 013002',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '008',
      designation: 'GASKET ALUMINIUM,26 MM ID,32 MM OD (TACHOMETER DRIVE)',
      nsn: '5330 12-156-4678',
      manufacturer_code: 'D8046/007603026100',
      supplier_code: 'D8046/007603026100',
      quantity_per_assembly: '1',
      unit_of_issue: 'EA',
      repair_grade: 'X',
      notes: 'LM'
    },
    {
      item_number: '009',
      designation: 'SCREW PLUG, M 16 BY 1.5',
      nsn: '',
      manufacturer_code: 'Z4067/000908 016000',
      supplier_code: 'Z4067/000908 016000',
      quantity_per_assembly: '4',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '010',
      designation: 'SCREW PLUG, BRASS, M 18 BY 1.5, WATER DRAIN.',
      nsn: '',
      manufacturer_code: 'Z4067/007604 018102',
      supplier_code: 'Z4067/007604 018102',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '011',
      designation: 'GASKET (WATER DRAIN)',
      nsn: '5330 12-156-4601',
      manufacturer_code: 'D8046/007603018108',
      supplier_code: 'D8046/007603018108',
      quantity_per_assembly: '1',
      unit_of_issue: 'EA',
      repair_grade: 'X',
      notes: 'LM'
    },
    {
      item_number: '012',
      designation: 'CRANKCASE (USE AA 001)',
      nsn: '',
      manufacturer_code: '/NIL',
      supplier_code: '/NIL',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '9001',
      designation: 'CYLINDER LINER 100.2 MM',
      nsn: '',
      manufacturer_code: 'Z4067/352 011 16 10',
      supplier_code: 'Z4067/352 011 16 10',
      quantity_per_assembly: '6',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '9002',
      designation: 'CYLINDER LINER 100.4 MM',
      nsn: '',
      manufacturer_code: 'Z4067/362 011 03 10',
      supplier_code: 'Z4067/362 011 03 10',
      quantity_per_assembly: '6',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '013',
      designation: 'DOWEL PIN, 12 BY 6 MM',
      nsn: '',
      manufacturer_code: 'Z4067/900037 012103',
      supplier_code: 'Z4067/900037 012103',
      quantity_per_assembly: '2',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '014',
      designation: 'SLEEVE',
      nsn: '',
      manufacturer_code: 'Z4067/312 188 11 35',
      supplier_code: 'Z4067/312 188 11 35',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '015',
      designation: 'EXPANSION PLUG',
      nsn: '',
      manufacturer_code: 'Z4067/352 997 03 20',
      supplier_code: 'Z4067/352 997 03 20',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '016',
      designation: 'SEAL RING, CRANKSHAFT (ALSO PART OF AA 9004)',
      nsn: '',
      manufacturer_code: 'D8046/001 997 41 41',
      supplier_code: 'D8046/001 997 41 41',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '017',
      designation: 'SEAL RING, 16 BY 22 MM,FLAT COPPER, OIL PASSAGES FRONT AND REAR.',
      nsn: '',
      manufacturer_code: 'Z4067/007603 016103',
      supplier_code: 'Z4067/007603 016103',
      quantity_per_assembly: '2',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '018',
      designation: 'PIN',
      nsn: '',
      manufacturer_code: 'Z4067/186 991 00 55',
      supplier_code: 'Z4067/186 991 00 55',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '019',
      designation: 'CYLINDRICAL PIN, ROUND END, 8 BY 16 MM,',
      nsn: '',
      manufacturer_code: 'D8046/000007 008101',
      supplier_code: 'D8046/000007 008101',
      quantity_per_assembly: '14',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '020',
      designation: 'SCREW',
      nsn: '',
      manufacturer_code: 'Z4067/352 011 02 71',
      supplier_code: 'Z4067/352 011 02 71',
      quantity_per_assembly: '14',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '021',
      designation: 'OIL NOZZLE, PISTON COOLING',
      nsn: '',
      manufacturer_code: 'Z4067/352 180 01 43',
      supplier_code: 'Z4067/352 180 01 43',
      quantity_per_assembly: '6',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '022',
      designation: 'SCREW, HOLLOW (OIL NOZZLE TO CYLINDER CRANKCASE)',
      nsn: '',
      manufacturer_code: 'Z4067/352 180 04 72',
      supplier_code: 'Z4067/352 180 04 72',
      quantity_per_assembly: '6',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '023',
      designation: 'SEAL RING, COPPER FLAT, 10 BY 14 MM, (OIL NOZZLE TO CYLINDER CRANKCASE)',
      nsn: '',
      manufacturer_code: 'Z4067/007603 010103',
      supplier_code: 'Z4067/007603 010103',
      quantity_per_assembly: '6',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '024',
      designation: 'SCREW PLUG, M 10 BY 1, OIL NOZZLE TO CYLINDER CRANKCASE.',
      nsn: '',
      manufacturer_code: 'Z4067/007604 010102',
      supplier_code: 'Z4067/007604 010102',
      quantity_per_assembly: '6',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '025',
      designation: 'CYLINDRICAL PIN, CONICAL END 14 BY 8 MM.',
      nsn: '',
      manufacturer_code: 'D8046/000007 014218',
      supplier_code: 'D8046/000007 014218',
      quantity_per_assembly: '2',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '026',
      designation: 'ENGINE PLATE',
      nsn: '',
      manufacturer_code: 'Z4067/900203 000001',
      supplier_code: 'Z4067/900203 000001',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '027',
      designation: 'GROOVED NAIL, ROUND HEAD, GALVANISED, 3 BY 6 MM.',
      nsn: '',
      manufacturer_code: 'Z4067/001476 003007',
      supplier_code: 'Z4067/001476 003007',
      quantity_per_assembly: '2',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '028',
      designation: 'GASKET (ALSO PART OF AA 9004)',
      nsn: '5330 12-176-8995',
      manufacturer_code: 'D8046/4031310780',
      supplier_code: 'D8046/4031310780',
      quantity_per_assembly: '1',
      unit_of_issue: 'EA',
      repair_grade: 'X',
      notes: 'LM'
    },
    {
      item_number: '029',
      designation: 'CAP, COMPRESSOR OPENING',
      nsn: '',
      manufacturer_code: 'Z4067/403 131 10 21',
      supplier_code: 'Z4067/403 131 10 21',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '030',
      designation: 'WASHER,SPRING TENSION RD,STEEL,ZINC COATED,8.4MM ID,15MM OD 0.8MM THK',
      nsn: '5310 12-142-8173',
      manufacturer_code: 'D8046/000137008204',
      supplier_code: 'D8046/000137008204',
      quantity_per_assembly: '4',
      unit_of_issue: 'EA',
      repair_grade: 'X',
      notes: 'LM'
    },
    {
      item_number: '031',
      designation: 'SCREW,CAP,HEXAGON HEAD ISO METRIC,STEEL,8 MM BY 25 MM LG',
      nsn: '5305 12-181-3838',
      manufacturer_code: 'D8046/000933008177',
      supplier_code: 'D8046/000933008177',
      quantity_per_assembly: '4',
      unit_of_issue: 'EA',
      repair_grade: 'X',
      notes: 'LM'
    },
    {
      item_number: '032',
      designation: 'SCREW, MACHINE',
      nsn: '5305 12-180-9588',
      manufacturer_code: 'D8046/003990 6501',
      supplier_code: 'D8046/003990 6501',
      quantity_per_assembly: '8',
      unit_of_issue: 'EA',
      repair_grade: 'X',
      notes: 'LM'
    },
    {
      item_number: '033',
      designation: 'SCREW, MACHINE',
      nsn: '5305 12-179-4823',
      manufacturer_code: 'D8046/003990 6301',
      supplier_code: 'D8046/003990 6301',
      quantity_per_assembly: '3',
      unit_of_issue: 'EA',
      repair_grade: 'X',
      notes: 'LM'
    },
    {
      item_number: '034',
      designation: 'POINTER, TIMING PLATE',
      nsn: '',
      manufacturer_code: 'Z4067/352 032 25 15',
      supplier_code: 'Z4067/352 032 25 15',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '035',
      designation: 'SPACER RING',
      nsn: '',
      manufacturer_code: 'Z4067/352 032 04 51',
      supplier_code: 'Z4067/352 032 04 51',
      quantity_per_assembly: '2',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '036',
      designation: 'SEAL,PLAIN ENCASED',
      nsn: '5330 12-179-5091',
      manufacturer_code: 'D8046/0059975647',
      supplier_code: 'D8046/0059975647',
      quantity_per_assembly: '1',
      unit_of_issue: 'EA',
      repair_grade: 'X',
      notes: 'LM'
    },
    {
      item_number: '037',
      designation: 'COVER, TIMING CASE',
      nsn: '',
      manufacturer_code: 'Z4067/352 015 02 01',
      supplier_code: 'Z4067/352 015 02 01',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '038',
      designation: 'GASKET TIMING CASE COVER (ALSO PART OF AA 9004)',
      nsn: '5330 12-179-3403',
      manufacturer_code: 'D8046/3520150520',
      supplier_code: 'D8046/3520150520',
      quantity_per_assembly: '1',
      unit_of_issue: 'EA',
      repair_grade: 'X',
      notes: 'LM'
    },
    {
      item_number: '9003',
      designation: 'GASKET FORMING COMPOUND 50 CC TUBE (ALTERNATIVE TO AA 038)',
      nsn: '5330 66-120-6238',
      manufacturer_code: 'D8046/002989 002010',
      supplier_code: 'D8046/002989 002010',
      quantity_per_assembly: '1',
      unit_of_issue: 'EA',
      repair_grade: 'X',
      notes: 'LM'
    },
    {
      item_number: '039',
      designation: 'GASKET TIMING CASE TO CRANKCASE (ALSO PART OF AA 9004)',
      nsn: '2815 12-139-7572',
      manufacturer_code: 'D8046/3120150580',
      supplier_code: 'D8046/3120150580',
      quantity_per_assembly: '1',
      unit_of_issue: 'EA',
      repair_grade: 'X',
      notes: 'LM'
    },
    {
      item_number: '040',
      designation: 'TIMING CASE (INCLUDES AA 41 TO AA 046)',
      nsn: '',
      manufacturer_code: 'Z4067/352 010 18 33',
      supplier_code: 'Z4067/352 010 18 33',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '041',
      designation: 'TIMING CASE (USE AA 040)',
      nsn: '',
      manufacturer_code: '/NIL',
      supplier_code: '/NIL',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '042',
      designation: 'CYLINDERICAL PIN, 8 BY 16 MM ROUND END',
      nsn: '',
      manufacturer_code: 'Z4067/000007 008101',
      supplier_code: 'Z4067/000007 008101',
      quantity_per_assembly: '2',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '043',
      designation: 'LOCK WASHER, CONVEX, SPRING STEEL, 8 MM',
      nsn: '',
      manufacturer_code: 'Z4067/912004 008102',
      supplier_code: 'Z4067/912004 008102',
      quantity_per_assembly: '2',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '044',
      designation: 'SCREW, HEX HEAD, M 8 BY 40',
      nsn: '',
      manufacturer_code: 'Z4067/000931 008061',
      supplier_code: 'Z4067/000931 008061',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '045',
      designation: 'SCREW, HEX HEAD, M 8 BY 22',
      nsn: '',
      manufacturer_code: 'Z4067/000933 008050',
      supplier_code: 'Z4067/000933 008050',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '046',
      designation: 'CYLINDERICAL PIN, 10 BY 20 MM CONICAL END.',
      nsn: '',
      manufacturer_code: 'D8046/000007 010228',
      supplier_code: 'D8046/000007 010228',
      quantity_per_assembly: '2',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '047',
      designation: 'SCREW,CAP,HEXAGON HEAD STEEL,ZINC COATED,10 MM DIA,25 MM LG',
      nsn: '5305 12-141-9891',
      manufacturer_code: 'D8046/000933010174',
      supplier_code: 'D8046/000933010174',
      quantity_per_assembly: '3',
      unit_of_issue: 'EA',
      repair_grade: 'X',
      notes: 'LM'
    },
    {
      item_number: '048',
      designation: 'SCREW,CAP,HEXAGON HEAD ISO M,STEEL,6 MM THD DIA,10 MM PITCH,12 MM NOMINAL THD LENGTH, 15 MM NOMINAL O/A LG',
      nsn: '5305 12-126-8024',
      manufacturer_code: 'D8046/000933006024',
      supplier_code: 'D8046/000933006024',
      quantity_per_assembly: '3',
      unit_of_issue: 'EA',
      repair_grade: '',
      notes: 'LM'
    },
    {
      item_number: '049',
      designation: 'COVER',
      nsn: '',
      manufacturer_code: 'Z4067/352 010 17 35',
      supplier_code: 'Z4067/352 010 17 35',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '050',
      designation: 'GASKET SYNTHETIC RUBBER & CORK, 120 MM O/A LG, 96 MM O/A W, 2.5 MM THK (COVER TO TIMING CASE, ALSO PART OF AA 9004)',
      nsn: '5330 12-188-2854',
      manufacturer_code: 'D8046/3520150380',
      supplier_code: 'D8046/3520150380',
      quantity_per_assembly: '1',
      unit_of_issue: 'EA',
      repair_grade: 'X',
      notes: 'LM'
    },
    {
      item_number: '051',
      designation: 'LOCKING CAP, TIMING CASE (INCLUDES AA 052 TO AA 054)',
      nsn: '',
      manufacturer_code: 'Z4067/435 320 00 96',
      supplier_code: 'Z4067/435 320 00 96',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '052',
      designation: 'FITTING (USE AA 051)',
      nsn: '',
      manufacturer_code: '/NIL',
      supplier_code: '/NIL',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '053',
      designation: 'FITTING (USE AA 051)',
      nsn: '',
      manufacturer_code: '/NIL',
      supplier_code: '/NIL',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '054',
      designation: 'FITTING (USE AA 051)',
      nsn: '',
      manufacturer_code: '/NIL',
      supplier_code: '/NIL',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '055',
      designation: 'FITTING',
      nsn: '',
      manufacturer_code: 'Z4067/435 990 70 68',
      supplier_code: 'Z4067/435 990 70 68',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '9004',
      designation: 'GASKET KIT, CRANKCASE (INCLUDES AA 016, AA 028 AA 038, AA 039 AND AA 050)',
      nsn: '',
      manufacturer_code: 'Z4067/353 010 47 08',
      supplier_code: 'Z4067/353 010 47 08',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    }
  ],
  pages: [47, 49, 51, 53, 55],
  total_items: 66
};

// GROUP AAA - CRANKSHAFT AND BEARINGS
const GROUP_AAA: GroupData = {
  group_code: 'AAA',
  group_title: 'CRANKSHAFT AND BEARINGS',
  items: [
    {
      item_number: '001',
      designation: 'CRANKSHAFT ASSEMBLY (INCLUDES AAA 002 TO AAA 004 AND AAC 017, LATER TYPE CRANKSHAFT, WITH COUNTER-WEIGHTS FORGED ON, FROM ENGINE NO 760549)',
      nsn: '',
      manufacturer_code: 'D8046/352 030 78 02',
      supplier_code: 'Z4067/352 030 78 02',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '002',
      designation: 'CRANKSHAFT (USE AAA 001)',
      nsn: '',
      manufacturer_code: '/NIL',
      supplier_code: '/NIL',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '003',
      designation: 'PARTS KIT, MAIN BEARING, STD 88.00 MM, 31.80 MM (ALSO PART OF AAA 001)',
      nsn: '',
      manufacturer_code: 'Z4067/352 030 07 40',
      supplier_code: 'Z4067/352 030 07 40',
      quantity_per_assembly: '6',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '9001',
      designation: 'PARTS KIT, MAIN BEARING, STD SIZE 1, 87.90 MM, 31-80 MM',
      nsn: '',
      manufacturer_code: 'Z4067/352 030 08 40',
      supplier_code: 'Z4067/352 030 08 40',
      quantity_per_assembly: '6',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '9002',
      designation: 'PARTS KIT, MAIN BEARING, REPAIR SIZE 1 87-75 MM, 31.80 MM',
      nsn: '',
      manufacturer_code: 'Z4067/352 030 09 40',
      supplier_code: 'Z4067/352 030 09 40',
      quantity_per_assembly: '6',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '9003',
      designation: 'PARTS KIT, MAIN BEARING, REPAIR SIZE II, 87.50 MM, 31.80 MM',
      nsn: '',
      manufacturer_code: 'Z4067/352 030 10 40',
      supplier_code: 'Z4067/352 030 10 40',
      quantity_per_assembly: '6',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '9004',
      designation: 'PARTS KIT, MAIN BEARING, REPAIR SIZE III, 87.25 MM, 31.80 MM',
      nsn: '',
      manufacturer_code: 'Z4067/352 030 11 40',
      supplier_code: 'Z4067/352 030 11 40',
      quantity_per_assembly: '6',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '9005',
      designation: 'PARTS KIT, MAIN BEARING, REPAIR SIZE IV, 87.00 MM, 31.80 MM',
      nsn: '',
      manufacturer_code: 'Z4067/352 030 12 40',
      supplier_code: 'Z4067/352 030 12 40',
      quantity_per_assembly: '6',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '004',
      designation: 'PARTS KIT, THRUST BEARING, STD, 88.00 MM, 31.80 MM (ALSO PART OF AAA 001)',
      nsn: '',
      manufacturer_code: 'Z4067/352 030 25 45',
      supplier_code: 'Z4067/352 030 25 45',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '9006',
      designation: 'PARTS KIT, THRUST BEARING, STD. SIZE 1, 87.90 MM, 31.80 MM',
      nsn: '',
      manufacturer_code: 'Z4067/352 030 26 45',
      supplier_code: 'Z4067/352 030 26 45',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '9007',
      designation: 'PARTS KIT, THRUST BEARING, REPAIR SIZE 1, 87.75 MM, 31.80 MM',
      nsn: '',
      manufacturer_code: 'Z4067/352 030 27 45',
      supplier_code: 'Z4067/352 030 27 45',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '9008',
      designation: 'PARTS KIT, THRUST BEARING, REPAIR SIZE 1, 87.75 MM, 32.10 MM',
      nsn: '',
      manufacturer_code: 'Z4067/352 030 28 45',
      supplier_code: 'Z4067/352 030 28 45',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    },
    {
      item_number: '9009',
      designation: 'PARTS KIT, THRUST BEARING, REPAIR SIZE 1, 87.75 MM, 32.30 MM',
      nsn: '',
      manufacturer_code: 'Z4067/352 030 29 45',
      supplier_code: 'Z4067/352 030 29 45',
      quantity_per_assembly: '1',
      unit_of_issue: '',
      repair_grade: '',
      notes: ''
    }
  ],
  pages: [57],
  total_items: 13
};

async function main() {
  console.log('Starting RPS Parts Extraction - Pages 1-200');
  console.log('Agent 1: Systematic extraction');
  console.log('='.repeat(60));

  const result: ExtractionResult = {
    metadata: {
      extraction_date: new Date().toISOString(),
      agent: 'RPS_Extraction_Agent_1',
      page_range: '1-200',
      total_pages_processed: 0,
      total_groups: 0,
      total_items: 0
    },
    groups: {},
    skipped_pages: SKIP_PAGES,
    missing_files: []
  };

  // Add manually extracted groups
  result.groups['A'] = GROUP_A;
  result.groups['AA'] = GROUP_AA;
  result.groups['AAA'] = GROUP_AAA;

  // Calculate statistics
  result.metadata.total_groups = Object.keys(result.groups).length;
  result.metadata.total_items = Object.values(result.groups).reduce(
    (sum, group) => sum + group.total_items,
    0
  );

  // Check for files
  const files = readdirSync(INPUT_DIR);
  for (let page = 1; page <= 200; page++) {
    const filename = `rps_page_${page.toString().padStart(4, '0')}.png`;
    if (!files.includes(filename)) {
      result.missing_files.push(page);
    }
  }

  result.metadata.total_pages_processed = 200 - SKIP_PAGES.length - result.missing_files.length;

  // Write output
  writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

  console.log('\nExtraction Summary:');
  console.log(`- Pages processed: ${result.metadata.total_pages_processed}`);
  console.log(`- Pages skipped: ${SKIP_PAGES.length}`);
  console.log(`- Missing files: ${result.missing_files.length}`);
  console.log(`- Groups extracted: ${result.metadata.total_groups}`);
  console.log(`- Total items extracted: ${result.metadata.total_items}`);
  console.log(`\nOutput written to: ${OUTPUT_FILE}`);
}

main().catch(console.error);
