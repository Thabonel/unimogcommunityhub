import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Lock, Star, Users, BookOpen, ArrowRight, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ManualChunk {
  id: string;
  manual_title: string;
  section_title: string;
  page_number: number;
  content: string;
  page_image_url: string | null;
}

interface ManualInfo {
  title: string;
  totalPages: number;
  publicPages: number;
  sections: string[];
}

export default function ManualPreview() {
  const { manualId } = useParams<{ manualId: string }>();
  const navigate = useNavigate();
  const [showFullContent, setShowFullContent] = useState(false);

  const { data: manualInfo, isLoading: infoLoading } = useQuery({
    queryKey: ['manual-info', manualId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manual_chunks')
        .select('manual_title, section_title, page_number')
        .ilike('manual_title', `%${manualId}%`)
        .order('page_number', { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Manual not found');

      const uniqueSections = [...new Set(data.map(c => c.section_title).filter(Boolean))];
      const publicPagesCount = data.filter(c => c.page_number <= 3).length;

      return {
        title: data[0].manual_title,
        totalPages: Math.max(...data.map(c => c.page_number)),
        publicPages: publicPagesCount,
        sections: uniqueSections as string[]
      } as ManualInfo;
    },
    enabled: !!manualId
  });

  const { data: previewChunks, isLoading: chunksLoading } = useQuery({
    queryKey: ['manual-preview', manualId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manual_chunks')
        .select('id, manual_title, section_title, page_number, content, page_image_url')
        .ilike('manual_title', `%${manualId}%`)
        .eq('is_public_preview', true)
        .order('page_number', { ascending: true })
        .limit(5);

      if (error) throw error;
      return data as ManualChunk[];
    },
    enabled: !!manualId
  });

  const isLoading = infoLoading || chunksLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!manualInfo || !previewChunks) {
    return (
      <Layout>
        <div className="container py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Manual not found</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-5xl">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">{manualInfo.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{manualInfo.totalPages} pages</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>Preview: {manualInfo.publicPages} pages</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              Free Preview
            </Badge>
          </div>

          <Card className="bg-gradient-to-r from-military-green/5 to-camo-brown/5 border-military-green/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Unlock Full Manual + Barry AI Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Get instant access to all {manualInfo.totalPages} pages plus our AI mechanic assistant
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-military-green" />
                      <span>Join 147 Unimog owners</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>4.8/5 from 47 reviews</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      onClick={() => navigate('/verify')}
                      className="bg-military-green hover:bg-military-green/90"
                    >
                      Verify Ownership
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate('/pricing')}
                    >
                      View Options
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Free forever for verified Unimog owners
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {manualInfo.sections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Table of Contents</CardTitle>
                <CardDescription>
                  This manual covers {manualInfo.sections.length} main sections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {manualInfo.sections.slice(0, 12).map((section, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground min-w-[2rem]">{idx + 1}.</span>
                      <span className="line-clamp-1">{section}</span>
                    </div>
                  ))}
                  {manualInfo.sections.length > 12 && (
                    <div className="col-span-full text-sm text-muted-foreground italic">
                      + {manualInfo.sections.length - 12} more sections
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Preview Content</h2>
              <Badge variant="outline" className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Limited Preview
              </Badge>
            </div>

            {previewChunks.map((chunk, idx) => (
              <Card key={chunk.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Page {chunk.page_number} {chunk.section_title && `- ${chunk.section_title}`}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      Page {chunk.page_number} of {manualInfo.totalPages}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`relative ${idx >= 2 ? 'max-h-[200px] overflow-hidden' : ''}`}>
                    {chunk.page_image_url && (
                      <img
                        src={chunk.page_image_url}
                        alt={`Page ${chunk.page_number}`}
                        className="w-full mb-4 rounded border"
                      />
                    )}
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                      {chunk.content.slice(0, idx >= 2 ? 500 : undefined)}
                      {idx >= 2 && chunk.content.length > 500 && '...'}
                    </div>
                    {idx >= 2 && (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
                    )}
                  </div>
                  {idx >= 2 && (
                    <div className="mt-4 text-center">
                      <Button
                        onClick={() => navigate('/pricing')}
                        className="bg-military-green hover:bg-military-green/90"
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Unlock Full Content
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator className="my-8" />

          <Card className="bg-military-green text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Ready to access the full manual?</h3>
              <p className="mb-6 text-white/90">
                Verify your Unimog ownership and get instant access to all 45+ manuals for free
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/verify')}
                >
                  Verify Ownership
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/about')}
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
