import { useState } from 'react';
import { FileSearch, Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { StorageManual } from '@/types/manuals';
import { useManualSearch } from '@/hooks/manuals';
import type { ManualLibrarySearchResult } from '@/services/manuals/manualSearchService';

interface ManualLibrarySearchProps {
  manuals: StorageManual[];
  onOpenResult: (result: ManualLibrarySearchResult) => void;
}

export function ManualLibrarySearch({ manuals, onOpenResult }: ManualLibrarySearchProps) {
  const [query, setQuery] = useState('');
  const { results, isSearching, error } = useManualSearch(manuals, query);
  const hasQuery = query.trim().length >= 2;

  if (manuals.length === 0) return null;

  return (
    <section className="rounded-lg border bg-card p-4" aria-labelledby="manual-search-heading">
      <div className="mb-3">
        <h2 id="manual-search-heading" className="font-semibold">Search inside all manuals</h2>
        <p className="text-sm text-muted-foreground">
          Search OCR text from every indexed PDF, including scanned photocopies.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search procedures, parts, specifications, faults…"
          aria-label="Search inside all vehicle manuals"
          className="pl-9 pr-10"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
            onClick={() => setQuery('')}
            aria-label="Clear manual search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {hasQuery && (
        <div className="mt-4" aria-live="polite">
          {isSearching ? (
            <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching OCR text…
            </div>
          ) : error ? (
            <p className="py-4 text-sm text-destructive">{error}</p>
          ) : results.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">
              No indexed pages match “{query.trim()}”.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                {results.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => onOpenResult(result)}
                    className="w-full rounded-md border bg-background p-3 text-left transition-colors hover:border-primary/50 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="flex items-start gap-3">
                      <FileSearch className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-medium">{result.manualTitle}</span>
                          <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            Page {result.pageNumber}
                          </span>
                        </div>
                        {result.sectionTitle && (
                          <p className="mt-1 text-sm font-medium text-foreground/80">{result.sectionTitle}</p>
                        )}
                        <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{result.snippet}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
