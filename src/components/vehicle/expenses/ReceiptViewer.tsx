import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  File,
  Image,
} from 'lucide-react';
import { ExpenseReceipt } from './types';

interface ReceiptViewerProps {
  isOpen: boolean;
  receipts: ExpenseReceipt[];
  onClose: () => void;
  onDownload?: (receipt: ExpenseReceipt) => void;
  onDelete?: (receipt: ExpenseReceipt) => void;
  publicUrlGetter?: (path: string) => string;
}

export const ReceiptViewer: React.FC<ReceiptViewerProps> = ({
  isOpen,
  receipts,
  onClose,
  onDownload,
  onDelete,
  publicUrlGetter,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (receipts.length === 0) return null;

  const currentReceipt = receipts[currentIndex];
  const isImage = ['jpeg', 'jpg', 'png', 'webp', 'gif'].includes(
    currentReceipt.file_type.split('/')[1]?.toLowerCase() || ''
  );

  const getPublicUrl = publicUrlGetter
    ? (path: string) => publicUrlGetter(path)
    : (path: string) => path;

  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % receipts.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((i) => (i - 1 + receipts.length) % receipts.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Receipts & Invoices</span>
            <DialogClose />
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4 pr-4">
            {isImage && currentReceipt ? (
              <div className="space-y-4">
                <div className="relative bg-muted rounded-lg overflow-hidden flex items-center justify-center min-h-96">
                  <img
                    src={getPublicUrl(currentReceipt.storage_path)}
                    alt={currentReceipt.file_name}
                    className="max-w-full max-h-96 object-contain"
                  />
                </div>

                {receipts.length > 1 && (
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {currentIndex + 1} of {receipts.length}
                    </span>
                    <Button onClick={handleNext} variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-8 flex flex-col items-center justify-center min-h-96">
                  <File className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {currentReceipt.file_name}
                  </p>
                  {onDownload && (
                    <Button
                      onClick={() => onDownload(currentReceipt)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download File
                    </Button>
                  )}
                </div>

                {receipts.length > 1 && (
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {currentIndex + 1} of {receipts.length}
                    </span>
                    <Button onClick={handleNext} variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2 border-t pt-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">File Name</p>
                  <p className="font-medium">{currentReceipt.file_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">File Type</p>
                  <p className="font-medium">{currentReceipt.file_type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">File Size</p>
                  <p className="font-medium">
                    {(currentReceipt.file_size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uploaded</p>
                  <p className="font-medium">
                    {new Date(currentReceipt.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {receipts.length > 1 && (
              <div className="space-y-2 border-t pt-4">
                <p className="text-sm font-medium">All Receipts</p>
                <div className="grid grid-cols-2 gap-2">
                  {receipts.map((receipt, index) => (
                    <button
                      key={receipt.id}
                      onClick={() => setCurrentIndex(index)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        currentIndex === index
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {['jpeg', 'jpg', 'png', 'webp', 'gif'].includes(
                          receipt.file_type.split('/')[1]?.toLowerCase() || ''
                        ) ? (
                          <Image className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <File className="h-4 w-4 flex-shrink-0" />
                        )}
                        <span className="text-xs truncate">
                          {receipt.file_name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {onDelete && (
              <div className="border-t pt-4">
                <Button
                  onClick={() => onDelete(currentReceipt)}
                  variant="destructive"
                  size="sm"
                  className="w-full gap-2"
                >
                  <X className="h-4 w-4" />
                  Delete This Receipt
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
