import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ThumbsUp, Book } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ValidatedAnswer {
  id: string;
  question: string;
  answer: string;
  manual_references: any[];
  created_at: string;
  user_email?: string;
}

export function ValidatedAnswers() {
  const [answers, setAnswers] = useState<ValidatedAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadValidatedAnswers();
  }, []);

  const loadValidatedAnswers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('barry_validated_answers')
        .select(`
          id,
          question,
          answer,
          manual_references,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (queryError) throw queryError;

      // Fetch user emails for each answer
      const answersWithEmails = await Promise.all(
        (data || []).map(async (answer) => {
          const { data: userData } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', answer.user_id)
            .single();

          return {
            ...answer,
            user_email: userData?.email || 'Unknown'
          };
        })
      );

      setAnswers(answersWithEmails);
    } catch (err) {
      console.error('Error loading validated answers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load validated answers');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Barry Validated Answers</h2>
          <p className="text-muted-foreground">User-validated helpful responses from Barry</p>
        </div>
        <div className="flex items-center gap-2">
          <ThumbsUp className="h-5 w-5 text-green-600" />
          <span className="text-lg font-semibold">{answers.length} validated answers</span>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4">
          {answers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No validated answers yet</p>
              </CardContent>
            </Card>
          ) : (
            answers.map((answer) => (
              <Card key={answer.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-green-600" />
                        Question
                      </CardTitle>
                      <p className="text-sm mt-2">{answer.question}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(answer.created_at), 'MMM d, yyyy HH:mm')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Barry's Answer</h4>
                    <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                      {answer.answer}
                    </p>
                  </div>

                  {answer.manual_references && answer.manual_references.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Book className="h-4 w-4" />
                        Manual References ({answer.manual_references.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {answer.manual_references.map((ref: any, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {ref.title || ref.filename} - Page {ref.pdf_page || ref.page_number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <span>Validated by: {answer.user_email}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
