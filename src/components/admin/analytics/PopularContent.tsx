
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PopularContentProps {
  dateRange: { from: Date; to: Date };
}

export function PopularContent({ dateRange }: PopularContentProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchPopularContent = async () => {
      setLoading(true);
      try {
        // This would be replaced with real data fetching
        // For now we'll use mock data
        const mockData = [
          { 
            title: "The Ultimate Unimog U1700L Guide", 
            views: 1245, 
            type: "article", 
            engagementScore: 8.4,
            category: "Maintenance" 
          },
          { 
            title: "Unimog Off-road Experience", 
            views: 987, 
            type: "post", 
            engagementScore: 7.9,
            category: "Adventures" 
          },
          { 
            title: "Engine Overhaul Tutorial", 
            views: 856, 
            type: "article", 
            engagementScore: 9.2,
            category: "Repair" 
          },
          { 
            title: "Best Tires for Mountain Terrain", 
            views: 743, 
            type: "article", 
            engagementScore: 6.8,
            category: "Tyres" 
          },
          { 
            title: "Custom Storage Solutions", 
            views: 651, 
            type: "post", 
            engagementScore: 7.5,
            category: "Modifications" 
          },
        ];
        
        setData(mockData);
      } catch (error) {
        console.error("Error fetching popular content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularContent();
  }, [dateRange]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Popular Content</CardTitle>
          <CardDescription>Most viewed pages and engagement metrics</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Content</CardTitle>
        <CardDescription>Most viewed pages and engagement metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" tick={false} />
                <YAxis />
                <Tooltip 
                  labelFormatter={(index) => data[index]?.title || "Unknown"} 
                  formatter={(value, name) => [value, name === "views" ? "Views" : "Engagement Score"]}
                />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" name="Views" />
                <Bar dataKey="engagementScore" fill="#82ca9d" name="Engagement Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Engagement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.type === "article" ? "Article" : "Post"}</TableCell>
                  <TableCell className="text-right">{item.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className={`font-medium ${getScoreColor(item.engagementScore)}`}>
                      {item.engagementScore.toFixed(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function getScoreColor(score: number): string {
  if (score >= 9) return "text-green-600 dark:text-green-400";
  if (score >= 7) return "text-blue-600 dark:text-blue-400";
  if (score >= 5) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}
