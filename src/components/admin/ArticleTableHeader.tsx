
import { TableHead, TableRow } from "@/components/ui/table";

export function ArticleTableHeader() {
  return (
    <TableRow>
      <TableHead>Title</TableHead>
      <TableHead>Category</TableHead>
      <TableHead>Author</TableHead>
      <TableHead>Published Date</TableHead>
      <TableHead>PDF</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  );
}
