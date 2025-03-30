
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHeader,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { ArticleEditDialog } from "@/components/admin/ArticleEditDialog";
import { ArticleData } from "@/types/article";
import { ArticleTableHeader } from "./ArticleTableHeader";
import { ArticleTableRow } from "./ArticleTableRow";
import { ArticleSearchBar } from "./ArticleSearchBar";
import { useArticles } from "@/hooks/use-articles";

const ArticlesManagement = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(null);
  
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

  return (
    <div>
      <ArticleSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />

      <Table>
        <TableCaption>A list of your recent articles.</TableCaption>
        <TableHeader>
          <ArticleTableHeader />
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
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
    </div>
  );
};

export default ArticlesManagement;
