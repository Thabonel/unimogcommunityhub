
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Trash2, Eye } from "lucide-react";
import { ArticleData } from "@/types/article";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
      <TableCell className="font-medium">{article.title}</TableCell>
      <TableCell>{article.category}</TableCell>
      <TableCell>
        <Badge variant={article.is_approved ? "default" : "outline"}>
          {article.is_approved ? "Published" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell>
        {article.published_at ? (
          format(new Date(article.published_at), "MMM d, yyyy")
        ) : (
          <span className="text-muted-foreground text-sm">Not published</span>
        )}
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
      <TableCell className="text-right space-x-1">
        <Button
          variant="ghost"
          size="sm"
          asChild
        >
          <a href={`/knowledge/${article.category.toLowerCase()}/${article.id}`} target="_blank" rel="noopener noreferrer">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </a>
        </Button>
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
