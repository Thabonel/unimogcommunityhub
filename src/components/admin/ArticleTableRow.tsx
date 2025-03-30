
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Trash2 } from "lucide-react";
import { ArticleData } from "@/types/article";

interface ArticleTableRowProps {
  article: ArticleData;
  onEdit: (article: ArticleData) => void;
  onDelete: (id: string) => void;
  onDownloadPdf: (url: string) => void;
}

export function ArticleTableRow({
  article,
  onEdit,
  onDelete,
  onDownloadPdf,
}: ArticleTableRowProps) {
  return (
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
            onClick={() => onDownloadPdf(article.original_file_url as string)}
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
          onClick={() => onEdit(article)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(article.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}
