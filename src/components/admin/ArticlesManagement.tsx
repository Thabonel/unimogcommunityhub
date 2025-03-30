import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus, Edit, Trash2, FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { ArticleEditDialog } from "@/components/admin/ArticleEditDialog";

interface ArticleData {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  category: string;
  author_id: string;
  author_name: string;
  published_at: string;
  reading_time: number;
  is_archived: boolean;
  source_url?: string | null;
  original_file_url?: string | null;
  created_at?: string;
}

type DateRange = {
  from?: Date;
  to?: Date;
};

const ArticlesManagement = () => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(null);

  // Fix the DateRange type issue - update the type definition or handle optional 'to' property
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({
    from: new Date(),
    to: undefined,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, [dateRange]);

  const fetchArticles = async () => {
    try {
      let query = supabase
        .from("community_articles")
        .select("*")
        .order("published_at", { ascending: false });

      if (dateRange.from) {
        query = query.gte("published_at", dateRange.from.toISOString());
      }
      if (dateRange.to) {
        const endOfDay = new Date(dateRange.to);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte("published_at", endOfDay.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching articles:", error);
        toast({
          title: "Error fetching articles",
          description: "Failed to load articles. Please try again.",
          variant: "destructive",
        });
      } else {
        setArticles(data || []);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast({
        title: "Error fetching articles",
        description: "Failed to load articles. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Make sure when setting dateRange that we handle the optional 'to' property
  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange({
      from: newRange.from || new Date(),
      to: newRange.to,
    });
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEditDialog = (article: ArticleData) => {
    // Fix the ArticleData issue by adding the missing properties
    const completeArticle: ArticleData = {
      ...article,
      excerpt: article.excerpt || "",
      content: article.content || "",
      // Add any other potentially missing properties that are required
    };
    
    // Now use the complete article data
    setEditingArticle(completeArticle);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingArticle(null);
  };

  const handleEditArticle = async (values: ArticleData) => {
    if (!editingArticle) return;

    try {
      const { data, error } = await supabase
        .from("community_articles")
        .update(values)
        .eq("id", editingArticle.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating article:", error);
        toast({
          title: "Error updating article",
          description: "Failed to update the article. Please try again.",
          variant: "destructive",
        });
      } else {
        setArticles((prevArticles) =>
          prevArticles.map((article) => (article.id === editingArticle.id ? data : article))
        );
        handleCloseEditDialog();
        toast({
          title: "Article updated",
          description: "Article updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error updating article:", error);
      toast({
        title: "Error updating article",
        description: "Failed to update the article. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteArticle = async () => {
    if (!deletingArticleId) return;

    try {
      // First, check if article has a PDF file to delete
      const { data: articleData } = await supabase
        .from("community_articles")
        .select("original_file_url")
        .eq("id", deletingArticleId)
        .single();
      
      // If article has a PDF file, delete it from storage
      if (articleData?.original_file_url) {
        const filePath = articleData.original_file_url.split('/').pop();
        if (filePath) {
          await supabase
            .storage
            .from('article_files')
            .remove([filePath]);
        }
      }

      // Then delete the article
      const { error } = await supabase
        .from("community_articles")
        .delete()
        .eq("id", deletingArticleId);

      if (error) {
        console.error("Error deleting article:", error);
        toast({
          title: "Error deleting article",
          description: "Failed to delete the article. Please try again.",
          variant: "destructive",
        });
      } else {
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article.id !== deletingArticleId)
        );
        handleCloseDeleteDialog();
        toast({
          title: "Article deleted",
          description: "Article deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error deleting article",
        description: "Failed to delete the article. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPdf = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleOpenDeleteDialog = (articleId: string) => {
    setDeletingArticleId(articleId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingArticleId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <DateRangePicker date={dateRange} onDateChange={handleDateRangeChange} />
      </div>

      <Table>
        <TableCaption>A list of your recent articles.</TableCaption>
        <TableHead>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Published Date</TableHead>
            <TableHead>PDF</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredArticles.map((article) => (
            <TableRow key={article.id}>
              <TableCell>{article.title}</TableCell>
              <TableCell>{article.category}</TableCell>
              <TableCell>{article.author_name}</TableCell>
              <TableCell>
                {new Date(article.published_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {article.original_file_url ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadPdf(article.original_file_url as string)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View PDF
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">No PDF</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEditDialog(article)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDeleteDialog(article.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingArticle && (
        <ArticleEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          article={editingArticle}
          onSuccess={fetchArticles}
        />
      )}

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Article"
        description="Are you sure you want to delete this article? This action cannot be undone. Any attached PDF files will also be deleted."
        onConfirm={handleDeleteArticle}
      />
    </div>
  );
};

export default ArticlesManagement;

interface DateRangePickerProps {
  date: DateRange;
  onDateChange: (date: DateRange) => void;
}

const DateRangePicker = ({ date, onDateChange }: DateRangePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={onDateChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};
