
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ArticleSubmissionDialog } from "@/components/knowledge/ArticleSubmissionDialog";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, Search, Plus, Edit, Trash2, Filter } from "lucide-react";
import { format } from "date-fns";

interface ArticleData {
  id: string;
  title: string;
  category: string;
  author_name: string;
  published_at: string;
  is_approved: boolean;
}

const ArticlesManagement = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Fetch articles using React Query
  const { data: articles, isLoading, error, refetch } = useQuery({
    queryKey: ["adminArticles"],
    queryFn: async () => {
      let query = supabase.from("community_articles").select("*");
      
      if (categoryFilter) {
        query = query.eq("category", categoryFilter);
      }
      
      if (dateFilter) {
        const today = new Date();
        let dateFrom = new Date();
        
        if (dateFilter === "today") {
          dateFrom.setHours(0, 0, 0, 0);
        } else if (dateFilter === "week") {
          dateFrom.setDate(today.getDate() - 7);
        } else if (dateFilter === "month") {
          dateFrom.setMonth(today.getMonth() - 1);
        }
        
        query = query.gte("published_at", dateFrom.toISOString());
      }
      
      const { data, error } = await query.order("published_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Filter articles by search term
  const filteredArticles = articles?.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('community_articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Article deleted",
        description: "The article has been removed successfully",
      });
      
      refetch();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Deletion failed",
        description: "There was a problem deleting the article",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles Management</CardTitle>
        <CardDescription>
          Manage all articles and PDFs in the knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-2/3">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select
              value={categoryFilter || ""}
              onValueChange={(value) => setCategoryFilter(value === "" ? null : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
                <SelectItem value="Adventures">Adventures</SelectItem>
                <SelectItem value="Modifications">Modifications</SelectItem>
                <SelectItem value="Tyres">Tyres</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={dateFilter || ""}
              onValueChange={(value) => setDateFilter(value === "" ? null : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => refetch()}
              title="Refresh articles"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Article
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            Error loading articles. Please try again.
          </div>
        ) : filteredArticles && filteredArticles.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {article.title}
                    </TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>{article.author_name}</TableCell>
                    <TableCell>
                      {article.published_at 
                        ? format(new Date(article.published_at), 'MMM d, yyyy') 
                        : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.is_approved 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500'
                      }`}>
                        {article.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setEditingArticleId(article.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No articles found. Try adjusting your filters or adding a new article.
          </div>
        )}
        
        {/* Add Article Dialog */}
        <ArticleSubmissionDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog}
        />
        
        {/* Edit Article Dialog - Note: In a real implementation, you would create an edit form */}
        {editingArticleId && (
          <Dialog 
            open={Boolean(editingArticleId)} 
            onOpenChange={(open) => {
              if (!open) setEditingArticleId(null);
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Article</DialogTitle>
              </DialogHeader>
              <div className="py-6">
                <p className="text-center text-muted-foreground">
                  Article editing functionality would be implemented here.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticlesManagement;
