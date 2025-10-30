import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useProductsStore } from '@/store/products';

export function ProductDetailPage() {
  const { id } = useParams();
  const pid = Number(id);
  const fetch = useProductsStore((s) => s.fetchProducts);
  const getById = useProductsStore((s) => s.getById);
  const isLoading = useProductsStore((s) => s.isLoading);

  useEffect(() => { fetch(); }, [fetch]);
  const product = useMemo(() => (Number.isFinite(pid) ? getById(pid) : undefined), [getById, pid]);

  return (
    <section>
      <div className="page-header">
        <h1>Продукт #{id}</h1>
        <Link to="/products" className="btn">Назад к списку</Link>
      </div>
      {!product && isLoading && <div className="empty">Загрузка...</div>}
      {!product && !isLoading && <div className="empty">Продукт не найден</div>}
      {product && (
        <div className="card" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
          <img className="thumb" src={product.image} alt={product.title} style={{ height: 320, objectFit: 'contain' }} />
          <div className="card-body">
            <h2 className="title" style={{ fontSize: 20 }}>{product.title}</h2>
            <div style={{ color: '#8f9bb3', marginBottom: 12 }}>{product.category}</div>
            <div style={{ margin: '12px 0 16px', lineHeight: 1.6 }}>{product.description}</div>
            <div className="price" style={{ fontSize: 20 }}>{product.price.toFixed(2)} ₽</div>
            <div style={{ marginTop: 16 }}>
              <Link to={`/products/${product.id}/edit`} className="btn secondary">Редактировать</Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


