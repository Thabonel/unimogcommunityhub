
import { BlockedEmailItem } from "./BlockedEmailItem";

interface BlockedEmailsContentProps {
  blockedEmails: { email: string; reason: string | null }[];
  onUnblock: (email: string) => void;
}

export function BlockedEmailsContent({ blockedEmails, onUnblock }: BlockedEmailsContentProps) {
  if (blockedEmails.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No blocked email addresses
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blockedEmails.map((item) => (
        <BlockedEmailItem
          key={item.email}
          email={item.email}
          reason={item.reason}
          onUnblock={onUnblock}
        />
      ))}
    </div>
  );
}
