import { useEffect, useRef, useState } from 'react';

import { searchAll } from '@/services/search_service';
import { SearchResult } from '@/types';

const DEBOUNCE_MS = 350;

/**
 * useSearch — debounced + cancellable song search.
 *
 * Waits DEBOUNCE_MS after the query stops changing before firing a
 * request, and aborts any in-flight request when a newer query comes
 * in (or the component unmounts), so a slow response for an old query
 * can never overwrite the results of a newer one.
 */
export function useSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    // Cancel whatever was in flight before starting/skipping this run.
    abortRef.current?.abort();

    if (!trimmed) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const response = await searchAll(trimmed, controller.signal);
        if (controller.signal.aborted) return;
        setResults(response.results);
      } catch (err: any) {
        if (controller.signal.aborted || err?.message === 'AbortError') return;
        console.warn('[useSearch] search failed:', err);
        setError('Search failed. Please try again.');
        setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { results, loading, error };
}
