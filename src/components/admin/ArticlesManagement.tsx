
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ArticleData } from "@/types/article";
import { ArticleTableHeader } from "./ArticleTableHeader";
import { ArticleTableRow } from "./ArticleTableRow";
import { ArticleSearchBar } from "./ArticleSearchBar";
import { useArticles } from "@/hooks/use-articles";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { ArticleEditDialog } from "@/components/admin/ArticleEditDialog";
import { ArticleEditor } from "./ArticleEditor";

const ArticlesManagement = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(null);
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const {
    articles,
    searchQuery,
    setSearchQuery,
    dateRange,
    handleDateRangeChange,
    fetchArticles,
    deleteArticle
  } = useArticles();

  const handleOpenEditDialog = (article: ArticleData) => {
    setEditingArticle(article);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingArticle(null);
  };

  const handleDeleteArticle = async () => {
    if (!deletingArticleId) return;
    const success = await deleteArticle(deletingArticleId);
    if (success) {
      handleCloseDeleteDialog();
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
  
  const filteredArticles = articles.filter(article => {
    if (statusFilter === "all") return true;
    if (statusFilter === "published") return article.is_approved === true;
    if (statusFilter === "draft") return article.is_approved === false;
    return true;
  });

  return (
    <div>
      {isCreatingArticle ? (
        <ArticleEditor 
          onSave={() => {
            fetchArticles();
            setIsCreatingArticle(false);
          }}
          onCancel={() => setIsCreatingArticle(false)}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Articles Management</h2>
            <Button onClick={() => setIsCreatingArticle(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Article
            </Button>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button 
                variant={statusFilter === "published" ? "default" : "outline"}
                onClick={() => setStatusFilter("published")}
                size="sm"
              >
                Published
              </Button>
              <Button 
                variant={statusFilter === "draft" ? "default" : "outline"}
                onClick={() => setStatusFilter("draft")}
                size="sm"
              >
                Drafts
              </Button>
            </div>
          </div>
          
          <ArticleSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />

          <Table>
            <TableCaption>A list of all articles</TableCaption>
            <TableHeader>
              <ArticleTableHeader />
            </TableHeader>
            <TableBody>
              {filteredArticles.map((article) => (
                <ArticleTableRow
                  key={article.id}
                  article={article}
                  onEdit={handleOpenEditDialog}
                  onDelete={handleOpenDeleteDialog}
                  onDownloadPdf={handleDownloadPdf}
                />
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
        </>
      )}
    </div>
  );
};

export default ArticlesManagement;
