import { useMemo } from 'react';
import { useProductsStore } from '@/store/products';

export function Pagination() {
  const total = useProductsStore((s) => s.totalVisible());
  const page = useProductsStore((s) => s.currentPage);
  const pageSize = useProductsStore((s) => s.pageSize);
  const setPage = useProductsStore((s) => s.setPage);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);
  if (pages <= 1) return null;

  const items = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      {items.map((p) => (
        <button key={p} className={`page ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
          {p}
        </button>
      ))}
    </div>
  );
}


