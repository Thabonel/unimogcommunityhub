import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';

interface RPSGroup {
  id: string;
  rps_number: string;
  group_code: string;
  group_name: string;
  total_parts: number;
  page_start?: number;
  page_end?: number;
}

interface GroupBrowserProps {
  onGroupSelect: (groupCode: string) => void;
}

export function GroupBrowser({ onGroupSelect }: GroupBrowserProps) {
  const [groups, setGroups] = useState<RPSGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGroups() {
      const { data, error } = await supabase
        .from('rps_groups')
        .select('*')
        .order('group_code');

      if (!error && data) {
        setGroups(data);
      }

      setIsLoading(false);
    }

    loadGroups();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading groups...</p>
        </CardContent>
      </Card>
    );
  }

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No groups found</p>
          <p className="text-sm mt-2">The parts catalog is being populated</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Browse by Group</CardTitle>
          <CardDescription>
            Select a group to view all parts in that category
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Card
            key={group.id}
            className="cursor-pointer hover:shadow-md transition-shadow group"
            onClick={() => onGroupSelect(group.group_code)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="font-mono mb-2">
                  Group {group.group_code}
                </Badge>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <CardTitle className="text-lg">{group.group_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{group.total_parts} parts</span>
                {group.page_start && group.page_end && (
                  <span className="text-muted-foreground">
                    Pages {group.page_start}-{group.page_end}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
