import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Package, Grid3x3, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { PartCard } from '@/components/rps/PartCard';
import { GroupBrowser } from '@/components/rps/GroupBrowser';

interface RPSPart {
  id: string;
  niin: string;
  nsn?: string;
  group_code: string;
  item_number: string;
  description: string;
  rps_number: string;
  quantity?: number;
  repair_grade?: 'L' | 'M' | 'H';
  page_number?: number;
  figure_reference?: string;
}

export default function PartsCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'niin' | 'keyword' | 'group'>('keyword');
  const [results, setResults] = useState<RPSPart[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  async function handleSearch() {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setResults([]);

    try {
      let query = supabase
        .from('rps_parts')
        .select(`
          *,
          group:rps_groups(group_code, group_name)
        `);

      if (searchType === 'niin') {
        // Exact NIIN match
        query = query.eq('niin', searchQuery.trim());
      } else if (searchType === 'group') {
        // Group code lookup
        query = query.eq('group_code', searchQuery.trim().toUpperCase());
      } else {
        // Keyword search in description
        query = query.ilike('description', `%${searchQuery}%`);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <Layout>
      <div className="container py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Parts Catalog</h1>
              <p className="text-muted-foreground">RPS 02155 - Search by NIIN, group, or keyword</p>
            </div>
            <Badge className="ml-auto">
              <Grid3x3 className="h-3 w-3 mr-1" />
              1000+ Parts
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="search">
              <Search className="h-4 w-4 mr-2" />
              Search Parts
            </TabsTrigger>
            <TabsTrigger value="browse">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Groups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Search Interface */}
            <Card>
              <CardHeader>
                <CardTitle>Search RPS Parts Catalog</CardTitle>
                <CardDescription>
                  Search by NIIN number, group code, or keyword description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter NIIN (12-126-0420), group (AA), or keyword (bolt, seal, filter...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>

                {/* Search Type Selector */}
                <div className="flex gap-2">
                  <Button
                    variant={searchType === 'keyword' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSearchType('keyword')}
                  >
                    Keyword
                  </Button>
                  <Button
                    variant={searchType === 'niin' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSearchType('niin')}
                  >
                    NIIN
                  </Button>
                  <Button
                    variant={searchType === 'group' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSearchType('group')}
                  >
                    Group
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{results.length} results found</h2>
                  <Badge variant="outline">{searchQuery}</Badge>
                </div>

                <div className="grid gap-4">
                  {results.map((part) => (
                    <PartCard key={part.id} part={part} />
                  ))}
                </div>
              </div>
            )}

            {results.length === 0 && !isLoading && searchQuery && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No parts found matching "{searchQuery}"</p>
                  <p className="text-sm mt-2">Try a different search term or browse by group</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="browse">
            <GroupBrowser onGroupSelect={(groupCode) => {
              setSelectedGroup(groupCode);
              setSearchQuery(groupCode);
              setSearchType('group');
              handleSearch();
            }} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
