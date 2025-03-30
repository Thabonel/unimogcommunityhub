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
import { CalendarIcon, Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";

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
      from: newRange.from,
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

      <ArticleEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        article={editingArticle}
        onEdit={handleEditArticle}
        onClose={handleCloseEditDialog}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Article"
        description="Are you sure you want to delete this article? This action cannot be undone."
        onConfirm={handleDeleteArticle}
      />
    </div>
  );
};

export default ArticlesManagement;

interface ArticleEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: ArticleData | null;
  onEdit: (values: ArticleData) => void;
  onClose: () => void;
}

const ArticleEditDialog = ({
  open,
  onOpenChange,
  article,
  onEdit,
  onClose,
}: ArticleEditDialogProps) => {
  const formSchema = z.object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    category: z.string().min(2, {
      message: "Category must be at least 2 characters.",
    }),
    author_name: z.string().min(2, {
      message: "Author name must be at least 2 characters.",
    }),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    source_url: z.string().optional(),
    original_file_url: z.string().optional(),
    is_archived: z.boolean().default(false),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: article?.title || "",
      category: article?.category || "",
      author_name: article?.author_name || "",
      excerpt: article?.excerpt || "",
      content: article?.content || "",
      source_url: article?.source_url || "",
      original_file_url: article?.original_file_url || "",
      is_archived: article?.is_archived || false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (article) {
      form.reset(article);
    }
  }, [article, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (article) {
      onEdit({ ...article, ...values });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Article</DialogTitle>
          <DialogDescription>
            Make changes to the article here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Article Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Author Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

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
