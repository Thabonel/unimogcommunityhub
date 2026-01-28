import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize Supabase with service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize OpenAI
const openaiApiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

interface BarryRequest {
  question: string;
  modelPrefix?: string;
}

interface BarryResponse {
  answer: string;
  references: DocumentReference[];
  media: MediaItem[];
  error?: string;
}

interface DocumentReference {
  doc_id: string;
  doc_type: string;
  ref: string;
  title: string;
  chunks?: any[];
}

interface MediaItem {
  type: string;
  bucket: string;
  file_name: string;
  description: string;
  signed_url?: string;
}

// Barry's system prompt
const BARRY_SYSTEM_PROMPT = `You are Barry, an experienced AI mechanic who specializes in Mercedes-Benz Unimog vehicles. You've been working on these vehicles for over 40 years and have access to official workshop manuals and technical documentation.

Your personality:
- Friendly Australian mechanic ("G'day!")
- Practical, hands-on approach
- Uses clear, simple language
- Always prioritizes safety
- References official documentation when possible

When answering questions:
1. Give practical, actionable advice
2. Reference specific procedures, parts, or bulletins when relevant
3. Include safety warnings where appropriate
4. Mention when professional help might be needed
5. Keep responses conversational but informative

You have access to Mercedes-Benz Workshop Information System (WIS) data including:
- Repair procedures and step-by-step instructions
- Parts catalogs with part numbers and descriptions
- Service bulletins and technical updates
- Wiring diagrams and schematics
- Torque specifications and fluid requirements

Always cite your sources using the doc_id references provided in the context.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<BarryResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      answer: "Sorry mate, I only respond to POST requests!",
      references: [],
      media: [],
      error: 'Method not allowed'
    });
  }

  const { question, modelPrefix = "U1700L OM366 435" }: BarryRequest = req.body;

  if (!question?.trim()) {
    return res.status(400).json({
      answer: "G'day! What can I help you with today? Ask me anything about your Unimog!",
      references: [],
      media: [],
      error: 'No question provided'
    });
  }

  try {
    // Step 1: Check validated knowledge base first
    const queryKeywords = question.toLowerCase().split(/\s+/).filter(k => k.length > 3);

    const { data: validatedAnswers, error: kbError } = await supabase
      .from('barry_knowledge_base')
      .select('*')
      .eq('validated_by_user', true)
      .order('confidence_score', { ascending: false })
      .order('validation_count', { ascending: false })
      .limit(3);

    if (kbError) {
      console.error('Knowledge base query error:', kbError);
    }

    // Check if we have a validated answer for this question
    let useValidated = false;
    if (validatedAnswers && validatedAnswers.length > 0) {
      const keywordsMatch = validatedAnswers.filter(answer => {
        if (!answer.search_keywords) return false;
        return answer.search_keywords.some((kw: string) =>
          queryKeywords.some(qk => kw.toLowerCase() === qk.toLowerCase())
        );
      });

      if (keywordsMatch.length > 0) {
        useValidated = true;
        // Use the highest-rated validated answer
        return res.status(200).json({
          answer: keywordsMatch[0].barry_response_template,
          references: keywordsMatch[0].manual_references || [],
          media: []
        });
      }
    }

    // Step 2: If no validated answer, use comprehensive search
    let searchResults: any[] = [];
    let searchMethod = 'wis_keyword';

    if (!useValidated) {
      console.log('[Barry] No validated answer found, performing comprehensive search');

      // Fallback to regular WIS search first
      const searchQuery = `${modelPrefix} ${question}`;
      const { data: wisResults, error: wisError } = await supabase.rpc('wis_search', {
        q: searchQuery,
        limit_rows: 10
      });

      if (wisError) {
        console.error('WIS search error:', wisError);
      } else if (wisResults && wisResults.length > 0) {
        searchResults = wisResults;
      } else {
        // If WIS search returns empty, try comprehensive manual search
        console.log('[Barry] WIS search empty, trying comprehensive manual search');
        searchMethod = 'comprehensive_manual';

        const { data: compResults, error: compError } = await supabase.rpc('search_all_manual_content', {
          user_query: question,
          max_results: 25
        });

        if (compError) {
          console.error('Comprehensive search error:', compError);
        } else if (compResults) {
          searchResults = compResults;
        }
      }
    }

    // Step 2: Process search results and prepare context
    const references: DocumentReference[] = [];
    const media: MediaItem[] = [];
    let contextText = '';

    if (searchResults && searchResults.length > 0) {
      if (searchMethod === 'comprehensive_manual') {
        // Handle comprehensive manual search results
        contextText = searchResults.map((result: any) =>
          `Page ${result.page_number} - ${result.section_title}\n` +
          result.content+
          '\n---\n'
        ).join('');

        references.push(...searchResults.map((result: any) => ({
          doc_id: result.chunk_id,
          doc_type: 'manual_chunk',
          ref: `Page ${result.page_number}`,
          title: result.manual_title,
          chunks: [{
            content: result.content,
            chunk_index: 0
          }]
        })));
      } else {
        // Handle WIS search results (group by document)
        const docMap = new Map<string, any>();

        searchResults.forEach((result: any) => {
          if (!docMap.has(result.doc_id)) {
            docMap.set(result.doc_id, {
              doc_id: result.doc_id,
              doc_type: result.doc_type,
              ref: result.ref,
              title: result.title,
              chunks: [],
              media: result.media || []
            });
          }

        const doc = docMap.get(result.doc_id);
        doc.chunks.push({
            content: result.content,
            chunk_index: result.chunk_index
          });

          // Collect media items
          if (result.media && Array.isArray(result.media)) {
            result.media.forEach((mediaItem: any) => {
            const exists = media.some(m =>
              m.bucket === mediaItem.bucket && m.file_name === mediaItem.file_name
              );
              if (!exists) {
                media.push(mediaItem);
              }
            });
          }
        });

        // Convert to references array
        references.push(...Array.from(docMap.values()));

        // Build context for AI
        contextText = references.map(ref => {
          const chunks = ref.chunks || [];
          return `Document: ${ref.title} (${ref.ref})\n` +
            chunks.map((chunk: any) => chunk.content).join('\n') +
            '\n---\n';
        }).join('');
      }
    }

    // Step 3: Generate Barry's response using OpenAI
    let barryAnswer = '';
    
    if (!openai) {
      // Fallback response when OpenAI is not configured
      barryAnswer = `G'day! I found some relevant info in the workshop manuals about "${question}". ` +
        `Check the references below for detailed procedures and specifications. ` +
        `${references.length > 0 ? `I found ${references.length} relevant document(s) that should help you out.` : 'Unfortunately, I couldn\'t find specific documentation for this query.'} ` +
        `Always remember to follow safety procedures and use proper tools!`;
    } else {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: BARRY_SYSTEM_PROMPT },
            { 
              role: 'user', 
              content: `Context from Mercedes WIS documentation:\n\n${contextText}\n\nUser question: ${question}\n\nPlease provide a helpful response as Barry the mechanic.`
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        });

        barryAnswer = completion.choices[0]?.message?.content || 
          "G'day! I'm having a bit of trouble with my response system right now. Check the manual references below for the info you need!";
      } catch (openaiError) {
        console.error('OpenAI error:', openaiError);
        barryAnswer = `G'day! I found some relevant info in the workshop manuals about "${question}". ` +
          `My AI processing is having a hiccup, but check the references below for detailed procedures. ` +
          `Always follow safety procedures and don't hesitate to ask if you need clarification!`;
      }
    }

    // Step 4: Generate signed URLs for media (if any)
    const mediaWithUrls = await Promise.all(
      media.slice(0, 5).map(async (mediaItem) => {
        try {
          // Try to generate signed URL using storage API
          const { data, error } = await supabase.storage
            .from(mediaItem.bucket)
            .createSignedUrl(mediaItem.file_name, 3600);
            
          return {
            ...mediaItem,
            signed_url: data?.signedUrl || 
              `${supabaseUrl}/storage/v1/object/public/${mediaItem.bucket}/${mediaItem.file_name}`
          };
        } catch (error) {
          console.warn('Failed to generate signed URL for', mediaItem.file_name);
          return {
            ...mediaItem,
            signed_url: `${supabaseUrl}/storage/v1/object/public/${mediaItem.bucket}/${mediaItem.file_name}`
          };
        }
      })
    );

    // Return successful response
    const response = {
      answer: barryAnswer,
      references: references.slice(0, 5), // Limit to top 5 references
      media: mediaWithUrls,
      metadata: {
        searchMethod,
        searchResultsCount: searchResults.length,
        usedValidatedAnswer: useValidated
      }
    };

    // Record the search in chat_logs for future feedback
    try {
      const start = Date.now();
      await supabase.from('chat_logs').insert({
        user_id: (req as any).session?.user?.id || 'anonymous',
        user_query: question,
        barry_response: response,
        search_query: `${modelPrefix} ${question}`,
        search_results: searchResults,
        response_time: Date.now() - start
      });
    } catch (logError) {
      console.error('Failed to log chat:', logError);
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('Barry API error:', error);
    
    return res.status(200).json({
      answer: "G'day! I'm having some technical difficulties accessing the workshop manuals right now. " +
        "Give me a moment to sort things out, and in the meantime, make sure you're following basic safety procedures! " +
        "If it's urgent, don't hesitate to consult a qualified mechanic.",
      references: [],
      media: [],
      error: 'Internal server error'
    });
  }
}