
interface LinkUploadProps {
  linkUrl: string;
  linkTitle: string;
  linkDescription: string;
  setLinkUrl: (url: string) => void;
  setLinkTitle: (title: string) => void;
  setLinkDescription: (description: string) => void;
}

const LinkUpload = ({ 
  linkUrl, 
  linkTitle, 
  linkDescription,
  setLinkUrl,
  setLinkTitle,
  setLinkDescription
}: LinkUploadProps) => {
  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Link URL"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
      />
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Link Title (optional)"
        value={linkTitle}
        onChange={(e) => setLinkTitle(e.target.value)}
      />
      <textarea
        className="w-full p-2 border rounded resize-none"
        placeholder="Link Description (optional)"
        value={linkDescription}
        onChange={(e) => setLinkDescription(e.target.value)}
        rows={2}
      />
    </div>
  );
};

export default LinkUpload;
