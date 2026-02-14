import { ExternalLink, Globe } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GearItem } from '@/data/gearCatalog';

interface GearItemCardProps {
  item: GearItem;
}

export function GearItemCard({ item }: GearItemCardProps) {
  const primaryHref = item.primaryUrl ?? item.amazonAuSearchUrl;
  const primaryLabel = item.primaryCtaLabel ?? 'Check on Amazon Australia';

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm sm:text-base leading-snug">
          {item.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {item.why}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-2 pt-0">
        <Button className="w-full text-xs sm:text-sm" asChild>
          <a
            href={primaryHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            {primaryLabel}
          </a>
        </Button>

        {item.localSearchUrl && (
          <a
            href={item.localSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="h-3 w-3" />
            Search locally
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
