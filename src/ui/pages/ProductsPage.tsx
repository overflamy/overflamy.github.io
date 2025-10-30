import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProductsStore } from '@/store/products';
import { ProductCard } from '@/ui/components/ProductCard';
import { FiltersBar } from '@/ui/components/FiltersBar';
import { Pagination } from '@/ui/components/Pagination';

export function ProductsPage() {
  const fetch = useProductsStore((s) => s.fetchProducts);
  const isLoading = useProductsStore((s) => s.isLoading);
  const error = useProductsStore((s) => s.error);
  const list = useProductsStore((s) => s.visibleProducts());
  const page = useProductsStore((s) => s.currentPage);
  const pageSize = useProductsStore((s) => s.pageSize);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return list.slice(start, start + pageSize);
  }, [list, page, pageSize]);

  return (
    <section>
      <div className="page-header">
        <h1>Продукты</h1>
        <Link to="/create-product" className="btn">Создать продукт</Link>
      </div>
      <FiltersBar />
      {error && <div className="empty">Ошибка: {error}</div>}
      {isLoading && <div className="empty">Данные загружаются...</div>}
      {!isLoading && paged.length === 0 && <div className="empty">Ничего не найдено</div>}
      <div className="grid">
        {paged.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <Pagination />
    </section>
  );
}


