import { cn } from "@/lib/utils";

interface SkipLink {
  id: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultLinks: SkipLink[] = [
  { id: "main-content", label: "Skip to main content" },
  { id: "main-navigation", label: "Skip to navigation" },
  { id: "search", label: "Skip to search" },
];

/**
 * Accessibility skip links for keyboard navigation
 */
export function SkipLinks({ links = defaultLinks, className }: SkipLinksProps) {
  return (
    <div
      className={cn(
        "sr-only focus-within:not-sr-only",
        "focus-within:absolute focus-within:top-0 focus-within:left-0",
        "focus-within:z-[100] focus-within:w-full",
        "focus-within:bg-background focus-within:p-4",
        "focus-within:shadow-lg",
        className
      )}
    >
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className={cn(
                "inline-block px-4 py-2 rounded-md",
                "bg-primary text-primary-foreground",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                "hover:bg-primary/90 transition-colors"
              )}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}