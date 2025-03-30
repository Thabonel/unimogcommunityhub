
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
import { toast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ArticleSubmissionDialog } from "@/components/knowledge/ArticleSubmissionDialog";
import { ArticleEditDialog } from "@/components/admin/ArticleEditDialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { RefreshCw, Search, Plus, Edit, Trash2, ArchiveIcon, Filter, Calendar, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { DateRangePicker } from "@/components/admin/DateRangePicker";

interface ArticleData {
  id: string;
  title: string;
  category: string;
  author_name: string;
  published_at: string;
  is_approved: boolean;
  is_archived: boolean;
}

const ITEMS_PER_PAGE = 10;

const ArticlesManagement = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleData | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<ArticleData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch articles using React Query
  const { data: articles, isLoading, error, refetch } = useQuery({
    queryKey: ["adminArticles", currentPage, searchTerm, categoryFilter, statusFilter, dateRange],
    queryFn: async () => {
      try {
        // First, get the count for pagination
        let countQuery = supabase
          .from("community_articles")
          .select("id", { count: "exact", head: true });
        
        // Apply filters to the count query
        if (searchTerm) {
          countQuery = countQuery.or(`title.ilike.%${searchTerm}%,author_name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
        }
        
        if (categoryFilter) {
          countQuery = countQuery.eq("category", categoryFilter);
        }
        
        if (statusFilter) {
          if (statusFilter === "archived") {
            countQuery = countQuery.eq("is_archived", true);
          } else if (statusFilter === "published") {
            countQuery = countQuery.eq("is_archived", false).eq("is_approved", true);
          } else if (statusFilter === "pending") {
            countQuery = countQuery.eq("is_archived", false).eq("is_approved", false);
          }
        }
        
        // Date range filter
        if (dateRange.from) {
          countQuery = countQuery.gte("published_at", dateRange.from.toISOString());
        }
        if (dateRange.to) {
          // Add one day to include the end date fully
          const endDate = new Date(dateRange.to);
          endDate.setDate(endDate.getDate() + 1);
          countQuery = countQuery.lt("published_at", endDate.toISOString());
        }
        
        const { count, error: countError } = await countQuery;
        
        if (countError) throw countError;
        
        // Calculate total pages
        const totalCount = count || 0;
        const calculatedTotalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
        setTotalPages(calculatedTotalPages);
        
        // Adjust currentPage if it exceeds the new total pages
        if (currentPage > calculatedTotalPages) {
          setCurrentPage(calculatedTotalPages);
        }
        
        // Now fetch the actual data with pagination
        let query = supabase
          .from("community_articles")
          .select("*")
          .order("published_at", { ascending: false })
          .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);
        
        // Apply the same filters to the main query
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,author_name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
        }
        
        if (categoryFilter) {
          query = query.eq("category", categoryFilter);
        }
        
        if (statusFilter) {
          if (statusFilter === "archived") {
            query = query.eq("is_archived", true);
          } else if (statusFilter === "published") {
            query = query.eq("is_archived", false).eq("is_approved", true);
          } else if (statusFilter === "pending") {
            query = query.eq("is_archived", false).eq("is_approved", false);
          }
        }
        
        // Date range filter
        if (dateRange.from) {
          query = query.gte("published_at", dateRange.from.toISOString());
        }
        if (dateRange.to) {
          // Add one day to include the end date fully
          const endDate = new Date(dateRange.to);
          endDate.setDate(endDate.getDate() + 1);
          query = query.lt("published_at", endDate.toISOString());
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        return data || [];
      } catch (error) {
        console.error("Error fetching articles:", error);
        throw error;
      }
    }
  });

  // Handle article archiving
  const handleArchiveArticle = async (article: ArticleData) => {
    try {
      const { error } = await supabase
        .from('community_articles')
        .update({ is_archived: !article.is_archived })
        .eq('id', article.id);
      
      if (error) throw error;
      
      toast({
        title: article.is_archived ? "Article restored" : "Article archived",
        description: article.is_archived 
          ? "The article has been restored successfully" 
          : "The article has been archived successfully",
      });
      
      refetch();
    } catch (error) {
      console.error("Error archiving/restoring article:", error);
      toast({
        title: "Operation failed",
        description: "There was a problem with this operation. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle permanent deletion
  const handleDeleteConfirm = async () => {
    if (!deletingArticle) return;
    
    try {
      // Delete the article from the database
      const { error } = await supabase
        .from('community_articles')
        .delete()
        .eq('id', deletingArticle.id);
      
      if (error) throw error;
      
      toast({
        title: "Article deleted",
        description: "The article has been permanently deleted",
      });
      
      setDeletingArticle(null);
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

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter(null);
    setStatusFilter(null);
    setDateRange({ from: undefined, to: undefined });
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="pl-8"
              />
            </div>
            
            <Select
              value={categoryFilter || ""}
              onValueChange={(value) => {
                setCategoryFilter(value === "" ? null : value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
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
              value={statusFilter || ""}
              onValueChange={(value) => {
                setStatusFilter(value === "" ? null : value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
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
              <Plus className="mr-2 h-4 w-4" /> Create Article
            </Button>
          </div>
        </div>
        
        {/* Date range picker */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by date:</span>
          </div>
          <DateRangePicker 
            date={dateRange} 
            onChange={(range) => {
              setDateRange(range);
              setCurrentPage(1); // Reset to first page on date change
            }} 
          />
          {(searchTerm || categoryFilter || statusFilter || dateRange.from || dateRange.to) && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            Error loading articles. Please try again.
          </div>
        ) : articles && articles.length > 0 ? (
          <>
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
                  {articles.map((article) => (
                    <TableRow key={article.id} className={article.is_archived ? "bg-muted/50" : ""}>
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
                        {article.is_archived ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-500">
                            <ArchiveIcon className="mr-1 h-3 w-3" />
                            Archived
                          </span>
                        ) : article.is_approved ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500">
                            <XCircle className="mr-1 h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setEditingArticle(article)}
                            disabled={article.is_archived}
                            title="Edit article"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleArchiveArticle(article)}
                            title={article.is_archived ? "Restore article" : "Archive article"}
                          >
                            <ArchiveIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeletingArticle(article)}
                            disabled={!article.is_archived}
                            title="Permanently delete article"
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {/* Display page numbers with ellipsis for large page counts */}
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNumber = i + 1;
                      // Show first page, last page, and pages around current page
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNumber);
                              }}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      // Show ellipsis for breaks in page numbers
                      if (
                        (pageNumber === currentPage - 2 && pageNumber > 1) ||
                        (pageNumber === currentPage + 2 && pageNumber < totalPages)
                      ) {
                        return <PaginationItem key={`ellipsis-${pageNumber}`}>...</PaginationItem>;
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No articles found. Try adjusting your filters or adding a new article.
          </div>
        )}
        
        {/* Add Article Dialog */}
        <ArticleSubmissionDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog}
          onSuccess={() => {
            refetch();
            setShowAddDialog(false);
          }}
        />
        
        {/* Edit Article Dialog */}
        {editingArticle && (
          <ArticleEditDialog
            article={editingArticle}
            open={!!editingArticle}
            onOpenChange={(open) => {
              if (!open) setEditingArticle(null);
            }}
            onSuccess={() => {
              refetch();
              setEditingArticle(null);
            }}
          />
        )}
        
        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={!!deletingArticle}
          onOpenChange={(open) => {
            if (!open) setDeletingArticle(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Article Permanently"
          description="This action cannot be undone. Are you sure you want to permanently delete this article?"
        />
      </CardContent>
    </Card>
  );
};

export default ArticlesManagement;
