import { useMemo, useState, useCallback } from 'react';

export default function useInfiniteList(items, { pageSize = 12 } = {}) {
  const [page, setPage] = useState(1);
  const loadMore = useCallback(() => setPage((p) => p + 1), []);
  const data = useMemo(() => items.slice(0, page * pageSize), [items, page, pageSize]);
  const hasMore = data.length < items.length;
  const reset = useCallback(() => setPage(1), []);
  return { data, hasMore, loadMore, reset, page, pageSize };
}

