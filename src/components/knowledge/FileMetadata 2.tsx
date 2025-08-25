
interface FileMetadataProps {
  file: File;
}

export function FileMetadata({ file }: FileMetadataProps) {
  if (!file) return null;
  
  return (
    <div className="mt-4 p-2 bg-secondary rounded-md text-sm">
      <p className="font-medium">{file.name}</p>
      <p className="text-xs text-muted-foreground">
        {(file.size / (1024 * 1024)).toFixed(2)} MB
      </p>
    </div>
  );
}
