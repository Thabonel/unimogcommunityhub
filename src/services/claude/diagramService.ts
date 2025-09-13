/**
 * Service for generating and managing diagrams for Barry AI
 */

export interface DiagramData {
  type: 'ascii' | 'svg' | 'mermaid' | 'image';
  content: string;
  title?: string;
  description?: string;
}

export class DiagramService {
  /**
   * Generate an ASCII diagram based on the description
   */
  static generateAsciiDiagram(type: string, details?: any): DiagramData | null {
    switch (type.toLowerCase()) {
      case 'portal_axle':
        return {
          type: 'ascii',
          title: 'Portal Axle Drain & Fill Plugs',
          content: `
    Portal Axle Assembly - Side View
    ================================
    
         [Wheel Hub]
             |
    +--------+--------+
    |                 |
    |    PORTAL       |
    |     BOX        |
    |                 |
    |  ○ <- Fill Plug |
    |     (top)       |
    |                 |
    |                 |
    |  ○ <- Drain     |
    |     Plug        |
    |    (bottom)     |
    +--------+--------+
             |
        [Main Axle]
    
    Note: Drain plug at lowest point
          Fill plug above oil level
          `,
          description: 'The drain plug is located at the lowest point of the portal box for complete drainage.'
        };

      case 'differential':
        return {
          type: 'ascii',
          title: 'Differential Lock System',
          content: `
    Differential Lock Engagement
    ============================
    
    Front Axle          Rear Axle
    +-------+           +-------+
    |   ○   |           |   ○   |
    | DIFF  |           | DIFF  |
    | LOCK  |           | LOCK  |
    +-------+           +-------+
        |                   |
        +------- ○ ---------+
           Transfer Case
           (Central Lock)
    
    Engagement Order:
    1. Rear differential lock
    2. Front differential lock  
    3. Central differential lock
          `,
          description: 'Engage locks in sequence: rear first, then front, finally central.'
        };

      case 'oil_circuit':
        return {
          type: 'ascii',
          title: 'Engine Oil Flow Diagram',
          content: `
    Engine Oil Circuit
    ==================
    
    Oil Pan/Sump
         |
    [Oil Pump]
         |
    [Oil Filter]
         |
    +----+----+----+
    |    |    |    |
    Main  Cam  Turbo
    Bear. shaft Cooling
         |
    [Oil Cooler]
         |
    Return to Sump
          `,
          description: 'Oil flows from sump through pump and filter to various engine components.'
        };

      default:
        return null;
    }
  }

  /**
   * Generate an SVG diagram
   */
  static generateSvgDiagram(type: string, details?: any): DiagramData | null {
    switch (type.toLowerCase()) {
      case 'portal_axle_detailed':
        return {
          type: 'svg',
          title: 'Portal Axle Detailed View',
          content: `
<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Portal Box Housing -->
  <rect x="100" y="150" width="200" height="250" 
        fill="none" stroke="#333" stroke-width="3" rx="10"/>
  
  <!-- Wheel Hub Connection -->
  <circle cx="200" cy="100" r="40" fill="#ddd" stroke="#333" stroke-width="2"/>
  <text x="200" y="105" text-anchor="middle" font-size="14">Wheel Hub</text>
  
  <!-- Main Axle -->
  <rect x="180" y="400" width="40" height="50" fill="#999" stroke="#333" stroke-width="2"/>
  <text x="200" y="435" text-anchor="middle" font-size="12">Axle</text>
  
  <!-- Fill Plug -->
  <circle cx="280" cy="200" r="15" fill="#666" stroke="#333" stroke-width="2"/>
  <text x="320" y="205" font-size="14">Fill Plug</text>
  <line x1="295" y1="200" x2="315" y2="200" stroke="#333" stroke-width="1"/>
  
  <!-- Oil Level Indicator -->
  <line x1="110" y1="250" x2="290" y2="250" stroke="#4CAF50" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="90" y="255" font-size="12" fill="#4CAF50">Oil Level</text>
  
  <!-- Drain Plug -->
  <circle cx="280" cy="370" r="15" fill="#444" stroke="#333" stroke-width="2"/>
  <text x="320" y="375" font-size="14">Drain Plug</text>
  <line x1="295" y1="370" x2="315" y2="370" stroke="#333" stroke-width="1"/>
  
  <!-- Gear representation -->
  <circle cx="200" cy="275" r="60" fill="none" stroke="#666" stroke-width="2" stroke-dasharray="10,5"/>
  <circle cx="200" cy="275" r="40" fill="none" stroke="#666" stroke-width="2"/>
  
  <!-- Labels -->
  <text x="200" y="30" text-anchor="middle" font-size="18" font-weight="bold">Portal Axle Assembly</text>
  <text x="200" y="480" text-anchor="middle" font-size="12" fill="#666">Side View - Not to Scale</text>
</svg>
          `,
          description: 'Detailed SVG diagram showing portal axle components and plug locations.'
        };

      case 'wiring_diagram':
        return {
          type: 'svg',
          title: 'Basic Electrical Circuit',
          content: `
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Battery -->
  <line x1="50" y1="100" x2="50" y2="200" stroke="#000" stroke-width="3"/>
  <line x1="35" y1="120" x2="65" y2="120" stroke="#000" stroke-width="2"/>
  <line x1="40" y1="180" x2="60" y2="180" stroke="#000" stroke-width="2"/>
  <text x="30" y="95" font-size="14">12V</text>
  
  <!-- Positive Line -->
  <line x1="50" y1="100" x2="400" y2="100" stroke="#ff0000" stroke-width="2"/>
  
  <!-- Fuse -->
  <rect x="120" y="95" width="40" height="10" fill="none" stroke="#000" stroke-width="2"/>
  <text x="125" y="120" font-size="12">Fuse</text>
  
  <!-- Switch -->
  <circle cx="250" cy="100" r="5" fill="#000"/>
  <line x1="250" y1="100" x2="270" y2="80" stroke="#000" stroke-width="2"/>
  <text x="240" y="70" font-size="12">Switch</text>
  
  <!-- Component -->
  <rect x="350" y="85" width="50" height="30" fill="#ffd700" stroke="#000" stroke-width="2"/>
  <text x="355" y="105" font-size="12">Light</text>
  
  <!-- Ground -->
  <line x1="50" y1="200" x2="400" y2="200" stroke="#000" stroke-width="2"/>
  <line x1="375" y1="115" x2="375" y2="200" stroke="#000" stroke-width="2"/>
  
  <!-- Ground Symbol -->
  <line x1="365" y1="200" x2="385" y2="200" stroke="#000" stroke-width="2"/>
  <line x1="370" y1="205" x2="380" y2="205" stroke="#000" stroke-width="2"/>
  <line x1="373" y1="210" x2="377" y2="210" stroke="#000" stroke-width="2"/>
</svg>
          `,
          description: 'Basic 12V electrical circuit with battery, fuse, switch, and light.'
        };

      default:
        return null;
    }
  }

  /**
   * Parse Barry's response to detect diagram requests
   */
  static parseResponseForDiagrams(response: string): DiagramData[] {
    const diagrams: DiagramData[] = [];
    
    // Check for common diagram keywords
    const diagramKeywords = {
      'portal axle': ['drain plug', 'fill plug', 'portal box'],
      'differential': ['diff lock', 'differential lock'],
      'oil circuit': ['oil flow', 'oil system', 'lubrication'],
      'wiring': ['electrical', 'circuit', 'wiring diagram']
    };

    const lowerResponse = response.toLowerCase();
    
    for (const [diagramType, keywords] of Object.entries(diagramKeywords)) {
      if (keywords.some(keyword => lowerResponse.includes(keyword))) {
        // Check if we should generate ASCII or SVG
        const useDetailedDiagram = lowerResponse.includes('detailed') || 
                                  lowerResponse.includes('show me') ||
                                  lowerResponse.includes('diagram');
        
        let diagram = null;
        if (useDetailedDiagram && diagramType === 'portal axle') {
          diagram = this.generateSvgDiagram('portal_axle_detailed');
        } else if (diagramType === 'wiring') {
          diagram = this.generateSvgDiagram('wiring_diagram');
        } else {
          diagram = this.generateAsciiDiagram(diagramType.replace(' ', '_'));
        }
        
        if (diagram) {
          diagrams.push(diagram);
        }
      }
    }

    return diagrams;
  }

  /**
   * Generate a Mermaid diagram from description
   */
  static generateMermaidDiagram(type: string, details?: any): DiagramData | null {
    switch (type.toLowerCase()) {
      case 'maintenance_schedule':
        return {
          type: 'mermaid',
          title: 'Maintenance Schedule',
          content: `
graph TD
    A[Daily Checks] --> B[Weekly Checks]
    B --> C[Monthly Checks]
    C --> D[Annual Service]
    
    A --> A1[Check Oil Level]
    A --> A2[Check Coolant]
    A --> A3[Visual Inspection]
    
    B --> B1[Tire Pressure]
    B --> B2[Battery Check]
    B --> B3[Brake Test]
    
    C --> C1[Air Filter]
    C --> C2[Grease Points]
    C --> C3[Belt Tension]
    
    D --> D1[Full Service]
    D --> D2[Replace Filters]
    D --> D3[Fluid Changes]
          `,
          description: 'Regular maintenance schedule for your Unimog'
        };

      default:
        return null;
    }
  }
}