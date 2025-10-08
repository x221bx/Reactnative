import React, { useEffect, useRef } from 'react';
import UIFiltersBottomSheet from '../ui/FiltersBottomSheet';

// Wrapper around the unified FiltersBottomSheet to maintain legacy props.
export default function FiltersBottomSheet({ visible, onDismiss, filters, onFiltersChange }) {
  const ref = useRef(null);

  useEffect(() => {
    const bs = ref.current;
    if (!bs) return;
    if (visible) bs.expand?.();
    else bs.close?.();
  }, [visible]);

  return (
    <UIFiltersBottomSheet
      bottomSheetRef={ref}
      filters={filters}
      onFiltersChange={onFiltersChange}
      onApplyFilters={onDismiss}
    />
  );
}
