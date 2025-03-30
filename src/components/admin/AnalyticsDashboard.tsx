import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { 
  Users, BookOpen, Clock, UserPlus, Loader2 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Define the colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Category dashboard configuration
const categoryConfig = {
  Maintenance: { color: "#0088FE" },
  Repair: { color: "#00C49F" },
  Adventures: { color: "#FFBB28" },
  Modifications: { color: "#FF8042" },
  Tyres: { color: "#8884D8" }
};

export function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalArticles: 0,
    categoryBreakdown: [],
    totalUsers: 0,
    newUsersWeek: 0,
    newUsersMonth: 0
  });
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Get total articles and category breakdown
        const { data: articles, error: articlesError } = await supabase
          .from('community_articles')
          .select('category');
        
        if (articlesError) throw articlesError;
        
        // Calculate category breakdown
        const categories = articles.reduce((acc, article) => {
          acc[article.category] = (acc[article.category] || 0) + 1;
          return acc;
        }, {});
        
        const categoryData = Object.keys(categories).map(name => ({
          name,
          value: categories[name]
        }));

        // Get user stats
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('created_at');
        
        if (usersError) throw usersError;
        
        // Calculate new users in the last week and month
        const now = new Date();
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        
        const newUsersWeek = users.filter(user => 
          new Date(user.created_at) >= oneWeekAgo
        ).length;
        
        const newUsersMonth = users.filter(user => 
          new Date(user.created_at) >= oneMonthAgo
        ).length;
        
        setStats({
          totalArticles: articles.length,
          categoryBreakdown: categoryData,
          totalUsers: users.length,
          newUsersWeek,
          newUsersMonth
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Articles Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Articles
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        {/* Total Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>

        {/* New Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Users
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as 'week' | 'month')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
              <TabsContent value="week" className="pt-2">
                <div className="text-2xl font-bold">{stats.newUsersWeek}</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </TabsContent>
              <TabsContent value="month" className="pt-2">
                <div className="text-2xl font-bold">{stats.newUsersMonth}</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Average Reading Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Reading Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 min</div>
            <p className="text-xs text-muted-foreground">
              Per article
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Category Distribution Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Articles by Category</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-80">
              <ChartContainer config={categoryConfig}>
                <PieChart>
                  <Pie
                    data={stats.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Last Week', users: stats.newUsersWeek },
                    { name: 'Last Month', users: stats.newUsersMonth },
                    { name: 'Total', users: stats.totalUsers }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
