import { supabase } from '@/lib/supabase-client';
import { ClaudeService } from '@/services/claude/claudeService';

export interface DocumentGenerationRequest {
  title: string;
  type: 'excel' | 'powerpoint' | 'pdf' | 'checklist';
  sourceQuery: string;
  vehicleModel?: string;
  wisContext?: any[];
  userPreferences?: {
    includeImages?: boolean;
    includeSteps?: boolean;
    includeWarnings?: boolean;
    format?: 'detailed' | 'concise' | 'checklist';
  };
}

export interface GeneratedDocument {
  id: string;
  title: string;
  filename: string;
  content: any;
  metadata: {
    generatedAt: Date;
    sourceQuery: string;
    vehicleModel?: string;
    documentType: string;
    wisReferences: string[];
  };
}

export class BarryDocumentGenerator {
  private claudeService: ClaudeService;

  constructor() {
    this.claudeService = new ClaudeService();
  }

  /**
   * Auto-generate documents based on Barry's WIS response
   * This is triggered automatically when Barry provides certain types of responses
   */
  async autoGenerateFromBarryResponse(
    barryResponse: string,
    originalQuery: string,
    wisContext: any[],
    vehicleModel?: string
  ): Promise<GeneratedDocument[]> {
    const documents: GeneratedDocument[] = [];

    // Analyze Barry's response to determine what documents would be helpful
    const suggestedDocs = this.analyzeSuggestedDocuments(barryResponse, originalQuery);

    for (const suggestion of suggestedDocs) {
      try {
        const doc = await this.generateDocument({
          title: suggestion.title,
          type: suggestion.type,
          sourceQuery: originalQuery,
          vehicleModel,
          wisContext,
          userPreferences: suggestion.preferences
        });

        documents.push(doc);
      } catch (error) {
        console.error(`Failed to generate ${suggestion.type} document:`, error);
      }
    }

    return documents;
  }

  /**
   * Generate a specific document based on request
   */
  async generateDocument(request: DocumentGenerationRequest): Promise<GeneratedDocument> {
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    switch (request.type) {
      case 'excel':
        return this.generateExcelDocument(documentId, request);
      case 'powerpoint':
        return this.generatePowerPointDocument(documentId, request);
      case 'pdf':
        return this.generatePDFDocument(documentId, request);
      case 'checklist':
        return this.generateChecklistDocument(documentId, request);
      default:
        throw new Error(`Unsupported document type: ${request.type}`);
    }
  }

  /**
   * Analyze Barry's response to suggest helpful documents
   */
  private analyzeSuggestedDocuments(
    barryResponse: string,
    originalQuery: string
  ): Array<{
    title: string;
    type: 'excel' | 'powerpoint' | 'checklist';
    preferences: any;
  }> {
    const suggestions = [];
    const lowerResponse = barryResponse.toLowerCase();
    const lowerQuery = originalQuery.toLowerCase();

    // Parts-related responses suggest Excel parts catalogs
    if (
      lowerQuery.includes('part') ||
      lowerQuery.includes('component') ||
      lowerResponse.includes('part number') ||
      lowerResponse.includes('component')
    ) {
      suggestions.push({
        title: `Parts List for: ${originalQuery}`,
        type: 'excel' as const,
        preferences: {
          includeImages: true,
          format: 'detailed'
        }
      });
    }

    // Procedure-related responses suggest maintenance checklists
    if (
      lowerQuery.includes('procedure') ||
      lowerQuery.includes('maintenance') ||
      lowerQuery.includes('service') ||
      lowerQuery.includes('repair') ||
      lowerResponse.includes('step') ||
      lowerResponse.includes('procedure')
    ) {
      suggestions.push({
        title: `Maintenance Checklist: ${originalQuery}`,
        type: 'checklist' as const,
        preferences: {
          includeSteps: true,
          includeWarnings: true,
          format: 'checklist'
        }
      });
    }

    // Complex responses suggest PowerPoint presentations
    if (
      barryResponse.length > 500 &&
      (lowerQuery.includes('explain') ||
       lowerQuery.includes('how') ||
       lowerResponse.includes('system') ||
       lowerResponse.includes('overview'))
    ) {
      suggestions.push({
        title: `Technical Overview: ${originalQuery}`,
        type: 'powerpoint' as const,
        preferences: {
          includeImages: true,
          includeSteps: true,
          format: 'detailed'
        }
      });
    }

    return suggestions;
  }

  /**
   * Generate Excel parts catalog
   */
  private async generateExcelDocument(
    documentId: string,
    request: DocumentGenerationRequest
  ): Promise<GeneratedDocument> {
    const claudePrompt = `Create an Excel spreadsheet structure for: "${request.title}"

Context:
- Original query: ${request.sourceQuery}
- Vehicle model: ${request.vehicleModel || 'Unimog'}
- WIS context: ${request.wisContext?.length || 0} related items

Generate a detailed Excel structure with:
1. Parts list with columns: Part Number, Description, Quantity, Notes, Compatibility
2. Include specific part numbers from WIS database when available
3. Add maintenance intervals and service notes
4. Include safety warnings and special tools required

Format as structured data that can be converted to Excel.`;

    const claudeResponse = await this.claudeService.sendMessage(claudePrompt);

    // Store document generation request
    await this.storeDocumentRequest(documentId, request, claudeResponse);

    return {
      id: documentId,
      title: request.title,
      filename: `${request.title.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`,
      content: claudeResponse,
      metadata: {
        generatedAt: new Date(),
        sourceQuery: request.sourceQuery,
        vehicleModel: request.vehicleModel,
        documentType: 'excel',
        wisReferences: this.extractWISReferences(request.wisContext || [])
      }
    };
  }

  /**
   * Generate PowerPoint presentation
   */
  private async generatePowerPointDocument(
    documentId: string,
    request: DocumentGenerationRequest
  ): Promise<GeneratedDocument> {
    const claudePrompt = `Create a PowerPoint presentation structure for: "${request.title}"

Context:
- Original query: ${request.sourceQuery}
- Vehicle model: ${request.vehicleModel || 'Unimog'}
- WIS context: ${request.wisContext?.length || 0} related items

Generate slides with:
1. Title slide with overview
2. Safety warnings and prerequisites
3. Step-by-step procedure slides
4. Parts and tools required
5. Troubleshooting common issues
6. Summary and next steps

Format as slide-by-slide content with bullet points and notes.`;

    const claudeResponse = await this.claudeService.sendMessage(claudePrompt);

    await this.storeDocumentRequest(documentId, request, claudeResponse);

    return {
      id: documentId,
      title: request.title,
      filename: `${request.title.replace(/[^a-zA-Z0-9]/g, '_')}.pptx`,
      content: claudeResponse,
      metadata: {
        generatedAt: new Date(),
        sourceQuery: request.sourceQuery,
        vehicleModel: request.vehicleModel,
        documentType: 'powerpoint',
        wisReferences: this.extractWISReferences(request.wisContext || [])
      }
    };
  }

  /**
   * Generate PDF guide
   */
  private async generatePDFDocument(
    documentId: string,
    request: DocumentGenerationRequest
  ): Promise<GeneratedDocument> {
    const claudePrompt = `Create a comprehensive PDF guide for: "${request.title}"

Context:
- Original query: ${request.sourceQuery}
- Vehicle model: ${request.vehicleModel || 'Unimog'}
- WIS context: ${request.wisContext?.length || 0} related items

Generate a detailed technical guide with:
1. Executive summary
2. Safety warnings and prerequisites
3. Detailed procedures with steps
4. Parts catalog and specifications
5. Troubleshooting section
6. References and additional resources

Format as structured document content with sections and subsections.`;

    const claudeResponse = await this.claudeService.sendMessage(claudePrompt);

    await this.storeDocumentRequest(documentId, request, claudeResponse);

    return {
      id: documentId,
      title: request.title,
      filename: `${request.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      content: claudeResponse,
      metadata: {
        generatedAt: new Date(),
        sourceQuery: request.sourceQuery,
        vehicleModel: request.vehicleModel,
        documentType: 'pdf',
        wisReferences: this.extractWISReferences(request.wisContext || [])
      }
    };
  }

  /**
   * Generate maintenance checklist
   */
  private async generateChecklistDocument(
    documentId: string,
    request: DocumentGenerationRequest
  ): Promise<GeneratedDocument> {
    const claudePrompt = `Create a maintenance checklist for: "${request.title}"

Context:
- Original query: ${request.sourceQuery}
- Vehicle model: ${request.vehicleModel || 'Unimog'}
- WIS context: ${request.wisContext?.length || 0} related items

Generate a practical checklist with:
1. Pre-work safety checks
2. Tools and parts required
3. Step-by-step procedure with checkboxes
4. Quality control checks
5. Post-work verification
6. Documentation requirements

Format as a clear, printable checklist with checkboxes and notes sections.`;

    const claudeResponse = await this.claudeService.sendMessage(claudePrompt);

    await this.storeDocumentRequest(documentId, request, claudeResponse);

    return {
      id: documentId,
      title: request.title,
      filename: `${request.title.replace(/[^a-zA-Z0-9]/g, '_')}_checklist.pdf`,
      content: claudeResponse,
      metadata: {
        generatedAt: new Date(),
        sourceQuery: request.sourceQuery,
        vehicleModel: request.vehicleModel,
        documentType: 'checklist',
        wisReferences: this.extractWISReferences(request.wisContext || [])
      }
    };
  }

  /**
   * Store document generation request in database
   */
  private async storeDocumentRequest(
    documentId: string,
    request: DocumentGenerationRequest,
    generatedContent: string
  ): Promise<void> {
    try {
      const { error } = await supabase.from('user_documents').insert({
        id: documentId,
        title: request.title,
        filename: `${request.title.replace(/[^a-zA-Z0-9]/g, '_')}.${request.type}`,
        file_type: request.type,
        document_category: 'barry_generated',
        vehicle_model: request.vehicleModel,
        metadata: {
          sourceQuery: request.sourceQuery,
          generatedBy: 'barry_ai',
          generatedAt: new Date().toISOString(),
          wisReferences: request.wisContext?.map(item => item.id || item.code) || []
        },
        is_public: false,
        created_at: new Date().toISOString()
      });

      if (error) {
        console.error('Failed to store document request:', error);
      }
    } catch (error) {
      console.error('Error storing document:', error);
    }
  }

  /**
   * Extract WIS references from context
   */
  private extractWISReferences(wisContext: any[]): string[] {
    return wisContext
      .map(item => item.code || item.number || item.procedure_code || item.part_number)
      .filter(Boolean);
  }
}