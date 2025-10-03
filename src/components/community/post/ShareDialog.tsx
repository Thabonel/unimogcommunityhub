import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Link2,
  Facebook,
  Twitter,
  Mail,
  MessageCircle,
  Check,
  Copy
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { shareToFacebook, shareToTwitter, shareToWhatsApp, shareToEmail, copyToClipboard } from '@/utils/shareUtils';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  postContent: string;
  postAuthor: string;
}

const ShareDialog = ({ open, onOpenChange, postId, postContent, postAuthor }: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);

  // Generate shareable URL
  const postUrl = `${window.location.origin}/community/post/${postId}`;

  // Prepare share text
  const shareText = `Check out this post from ${postAuthor} on Unimog Community Hub: "${postContent.slice(0, 100)}${postContent.length > 100 ? '...' : ''}"`;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(postUrl);

    if (success) {
      setCopied(true);
      toast({
        title: 'Link copied!',
        description: 'Post link copied to clipboard. Share it anywhere!',
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        title: 'Copy failed',
        description: 'Could not copy link. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleFacebookShare = () => {
    shareToFacebook(postUrl);
    onOpenChange(false);
    toast({
      title: 'Opening Facebook',
      description: 'Share dialog will open in a new window.',
    });
  };

  const handleTwitterShare = () => {
    shareToTwitter(postUrl, shareText);
    onOpenChange(false);
    toast({
      title: 'Opening Twitter/X',
      description: 'Share dialog will open in a new window.',
    });
  };

  const handleWhatsAppShare = () => {
    shareToWhatsApp(postUrl, shareText);
    onOpenChange(false);
    toast({
      title: 'Opening WhatsApp',
      description: 'Share dialog will open in a new window.',
    });
  };

  const handleEmailShare = () => {
    shareToEmail(
      'Check out this Unimog Community post',
      `${shareText}\n\n${postUrl}`
    );
    onOpenChange(false);
    toast({
      title: 'Opening Email',
      description: 'Your email client will open.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
          <DialogDescription>
            Share this post with your Unimog community and beyond
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Copy Link - Primary Option */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12"
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                <span className="font-medium">Copy Link</span>
              </>
            )}
          </Button>

          {/* Social Media Options */}
          <div className="grid grid-cols-2 gap-3">
            {/* Facebook */}
            <Button
              variant="outline"
              className="justify-start gap-3 h-12"
              onClick={handleFacebookShare}
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              <span>Facebook</span>
            </Button>

            {/* Twitter/X */}
            <Button
              variant="outline"
              className="justify-start gap-3 h-12"
              onClick={handleTwitterShare}
            >
              <Twitter className="h-5 w-5 text-sky-500" />
              <span>Twitter</span>
            </Button>

            {/* WhatsApp */}
            <Button
              variant="outline"
              className="justify-start gap-3 h-12"
              onClick={handleWhatsAppShare}
            >
              <MessageCircle className="h-5 w-5 text-green-600" />
              <span>WhatsApp</span>
            </Button>

            {/* Email */}
            <Button
              variant="outline"
              className="justify-start gap-3 h-12"
              onClick={handleEmailShare}
            >
              <Mail className="h-5 w-5 text-gray-600" />
              <span>Email</span>
            </Button>
          </div>

          {/* Post URL Display */}
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Post URL</p>
            <p className="text-sm font-mono break-all">{postUrl}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
